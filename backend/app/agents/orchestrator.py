import logging
from app.agents.workflow import travel_graph
from app.services.llm import current_trip_calls
logger = logging.getLogger(__name__)

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

    trip_counter = [0]
    counter_token = current_trip_calls.set(trip_counter)

    try:
        result = travel_graph.invoke(state)
    finally:
        current_trip_calls.reset(counter_token)

    logger.info(
        "Gemini calls used for this trip: %s",
        trip_counter[0],
    )


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
