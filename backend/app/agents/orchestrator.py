from app.agents.workflow import travel_graph


def orchestrate_trip(data):
    state = {
    "data": data,

    "itinerary": {},

    "review": {},

    "progress": {
        "destination": "pending",
        "food": "pending",
        "accommodation": "pending",
        "transport": "pending",
        "activity": "pending",
        "budget": "pending",
        "critic": "pending"
    }
}

    result = travel_graph.invoke(state)

    return {
    "itinerary": result["itinerary"],
    "review": result["review"],
    "progress": result["progress"]
}