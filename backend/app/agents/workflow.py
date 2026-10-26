import json
from typing import TypedDict

from langgraph.graph import StateGraph, END

from app.agents.destination import destination_agent
from app.agents.accommodation import accommodation_agent
from app.agents.transport import transport_agent
from app.agents.food import food_agent
from app.agents.activity import activity_agent
from app.agents.budget import budget_agent
from app.agents.itinerary import itinerary_agent
from app.agents.critic import critic_agent
from app.services.progress import update_progress


MAX_REVIEW_ATTEMPTS = 1


class TravelState(TypedDict):
    data: dict
    itinerary: dict
    progress: dict
    review: dict
    review_attempts: int
    final_itinerary: dict


def run_agent(state: TravelState, name: str, agent):
    update_progress(state, name, "running")

    try:
        result = agent(state["data"])

        if not isinstance(result, dict):
            raise ValueError(
                f"{name} agent must return a dictionary."
            )

        if result.get("error") or result.get("parse_error"):
            raise ValueError(
                f"{name} agent returned an error or invalid output."
            )

        state["itinerary"][name] = result
        update_progress(state, name, "completed")
        return state

    except Exception:
        update_progress(state, name, "failed")
        raise


# Specialist research nodes

def destination_node(state: TravelState):
    return run_agent(state, "destination", destination_agent)


def accommodation_node(state: TravelState):
    return run_agent(state, "accommodation", accommodation_agent)


def transport_node(state: TravelState):
    return run_agent(state, "transport", transport_agent)


def food_node(state: TravelState):
    return run_agent(state, "food", food_agent)


def activity_node(state: TravelState):
    return run_agent(state, "activities", activity_agent)


def budget_node(state: TravelState):
    update_progress(state, "budget", "running")

    try:
        result = budget_agent(
            data=state["data"],
            agent_results=state["itinerary"],
        )

        if not isinstance(result, dict):
            raise ValueError(
                "Budget agent must return a dictionary."
            )

        if result.get("error") or result.get("parse_error"):
            raise ValueError(
                "Budget agent returned an error or invalid output."
            )

        state["itinerary"]["budget"] = result
        update_progress(state, "budget", "completed")
        return state

    except Exception:
        update_progress(state, "budget", "failed")
        raise


# Assemble or revise the final itinerary

def itinerary_node(state: TravelState):
    update_progress(state, "itinerary", "running")

    try:
        result = itinerary_agent(
            data=state["data"],
            agent_results=state["itinerary"],
            review=state.get("review", {}),
        )

        if not isinstance(result, dict):
            raise ValueError(
                "Itinerary agent must return a dictionary."
            )

        if result.get("error") or result.get("parse_error"):
            raise ValueError(
                "Itinerary generation returned invalid output."
            )

        state["final_itinerary"] = result
        update_progress(state, "itinerary", "completed")
        return state

    except Exception:
        update_progress(state, "itinerary", "failed")
        raise


# Validate the generated itinerary

def critic_node(state: TravelState):
    update_progress(state, "critic", "running")

    # Provider errors intentionally propagate to the API route.
    review = critic_agent(
        {
            "agent_results": state["itinerary"],
            "final_itinerary": state["final_itinerary"],
        },
        state["data"],
    )

    try:
        if isinstance(review, str):
            content = review.strip()

            if content.startswith("```"):
                content = content.split("\n", 1)[1]

                if content.endswith("```"):
                    content = content[:-3].strip()

                if content.lower().startswith("json"):
                    content = content[4:].strip()

            review = json.loads(content)

        if not isinstance(review, dict):
            raise ValueError("Critic response must be an object.")

        required_keys = {
            "approved",
            "issues",
            "suggestions",
        }

        if not required_keys.issubset(review):
            raise ValueError(
                "Critic response is missing required fields."
            )

        if not isinstance(review["approved"], bool):
            raise ValueError("Approval must be a boolean.")

        if not isinstance(review["issues"], list):
            raise ValueError("Issues must be a list.")

        if not isinstance(review["suggestions"], list):
            raise ValueError("Suggestions must be a list.")

        # A malformed critic response is not a normal rejection
        # that can be fixed by regenerating the itinerary.
        if review.get("validation_error"):
            state["review"] = {
                **review,
                "approved": False,
            }
            update_progress(state, "critic", "failed")
            return state

        if any(
            not isinstance(issue, dict)
            or issue.get("severity") not in {
                "critical", "major", "minor"
            }
            or not all(
                isinstance(issue.get(key), str)
                for key in (
                    "category",
                    "description",
                    "suggested_fix",
                )
            )
            for issue in review["issues"]
        ):
            raise ValueError("Critic issues have an invalid structure.")

        if any(
            issue["severity"] == "critical"
            for issue in review["issues"]
        ):
            review["approved"] = False

        budget_check = review.get("budget_check", {})
        schedule_check = review.get("schedule_check", {})

        if not isinstance(budget_check, dict):
            raise ValueError("Budget check must be an object.")

        if not isinstance(schedule_check, dict):
            raise ValueError("Schedule check must be an object.")

        if budget_check.get("within_budget") is False:
            review["approved"] = False

        if schedule_check.get("valid") is False:
            review["approved"] = False

        state["review"] = review
        update_progress(state, "critic", "completed")

    except (json.JSONDecodeError, ValueError, TypeError):
        state["review"] = {
            "approved": False,
            "issues": [
                {
                    "severity": "critical",
                    "category": "validation",
                    "description": (
                        "The critic response was invalid or incomplete."
                    ),
                    "suggested_fix": (
                        "Review the itinerary and validation output."
                    ),
                }
            ],
            "suggestions": [],
            "validation_error": True,
        }
        update_progress(state, "critic", "failed")

    return state

# Decide whether to finish or revise
def review_router(state: TravelState):
    review = state.get("review", {})

    if review.get("approved") is True:
        return END

    # Do not retry malformed critic output.
    if review.get("validation_error"):
        return END

    # Allow at most MAX_REVIEW_ATTEMPTS itinerary revisions.
    attempts = state.get("review_attempts", 0)

    if attempts < MAX_REVIEW_ATTEMPTS:
        state["review_attempts"] = attempts + 1
        return "revise_itinerary"

    return END

# Construct the graph

graph = StateGraph(TravelState)

graph.add_node("destination", destination_node)
graph.add_node("accommodation", accommodation_node)
graph.add_node("transport", transport_node)
graph.add_node("food", food_node)
graph.add_node("activity", activity_node)
graph.add_node("budget", budget_node)
graph.add_node("itinerary", itinerary_node)
graph.add_node("critic", critic_node)

graph.set_entry_point("destination")

graph.add_edge("destination", "accommodation")
graph.add_edge("accommodation", "transport")
graph.add_edge("transport", "food")
graph.add_edge("food", "activity")
graph.add_edge("activity", "budget")
graph.add_edge("budget", "itinerary")
graph.add_edge("itinerary", "critic")

graph.add_conditional_edges(
    "critic",
    review_router,
    {
        "revise_itinerary": "itinerary",
        END: END,
    },
)

travel_graph = graph.compile()