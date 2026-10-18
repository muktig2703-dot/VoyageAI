
from app.agents.workflow import travel_graph


def orchestrate_trip(data):
    state = {
        "data": data,
        "itinerary": {},
        "final_itinerary": {},
        "review": {},
        "review_attempts": 0,
        "progress": {
            "destination": "pending",
            "accommodation": "pending",
            "transport": "pending",
            "food": "pending",
            "activity": "pending",
            "budget": "pending",
            "itinerary": "pending",
            "critic": "pending",
        },
    }

    result = travel_graph.invoke(state)

    return {
        # The assembled, user-facing itinerary.
        "itinerary": result.get("final_itinerary", {}),

        # Keep specialist-agent research separate.
        "agent_results": result.get("itinerary", {}),

        # Include validation findings and approval status.
        "review": result.get("review", {}),

        # Expose the progress of the workflow.
        "progress": result.get("progress", {}),
    }
