from typing import TypedDict
import json

from langgraph.graph import StateGraph, END

from app.agents.destination import destination_agent
from app.agents.accommodation import accommodation_agent
from app.agents.transport import transport_agent
from app.agents.food import food_agent
from app.agents.activity import activity_agent
from app.agents.budget import budget_agent
from app.agents.critic import critic_agent
from app.services.progress import update_progress


class TravelState(TypedDict):
    data: dict
    itinerary: dict
    progress: dict
    review: dict


# ---------------------------
# Agent Nodes
# ---------------------------

def destination_node(state: TravelState):
    update_progress(state, "destination", "running")

    state["itinerary"]["destination"] = destination_agent(state["data"])

    update_progress(state, "destination", "completed")
    return state


def accommodation_node(state: TravelState):
    update_progress(state, "accommodation", "running")

    state["itinerary"]["accommodation"] = accommodation_agent(state["data"])

    update_progress(state, "accommodation", "completed")
    return state


def transport_node(state: TravelState):
    update_progress(state, "transport", "running")

    state["itinerary"]["transport"] = transport_agent(state["data"])

    update_progress(state, "transport", "completed")
    return state


def food_node(state: TravelState):
    update_progress(state, "food", "running")

    state["itinerary"]["food"] = food_agent(state["data"])

    update_progress(state, "food", "completed")
    return state


def activity_node(state: TravelState):
    update_progress(state, "activity", "running")

    state["itinerary"]["activities"] = activity_agent(state["data"])

    update_progress(state, "activity", "completed")
    return state


def budget_node(state: TravelState):
    update_progress(state, "budget", "running")

    state["itinerary"]["budget"] = budget_agent(state["data"])

    update_progress(state, "budget", "completed")
    return state


def critic_node(state: TravelState):
    update_progress(state, "critic", "running")

    review = critic_agent(
        state["itinerary"],
        state["data"]
    )

    try:
        parsed = json.loads(review)
    except Exception:
        parsed = {
            "approved": True,
            "issues": [],
            "suggestions": []
        }

    state["review"] = parsed

    update_progress(state, "critic", "completed")
    return state


# ---------------------------
# Routing Logic
# ---------------------------

def review_router(state: TravelState):
    if state["review"].get("approved", True):
        return END

    # Re-plan activities if the critic finds issues
    return "activity"


# ---------------------------
# Build LangGraph
# ---------------------------

graph = StateGraph(TravelState)

graph.add_node("destination", destination_node)
graph.add_node("accommodation", accommodation_node)
graph.add_node("transport", transport_node)
graph.add_node("food", food_node)
graph.add_node("activity", activity_node)
graph.add_node("budget", budget_node)
graph.add_node("critic", critic_node)

# Entry point
graph.set_entry_point("destination")

# Workflow
graph.add_edge("destination", "accommodation")
graph.add_edge("accommodation", "transport")
graph.add_edge("transport", "food")
graph.add_edge("food", "activity")
graph.add_edge("activity", "budget")
graph.add_edge("budget", "critic")

# Critic decides whether to finish or replan
graph.add_conditional_edges(
    "critic",
    review_router,
    {
        "activity": "activity",
        END: END
    }
)

# Compile graph
travel_graph = graph.compile()