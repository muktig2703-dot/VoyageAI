
from app.agents.destination import destination_agent
from app.agents.accommodation import accommodation_agent
from app.agents.transport import transport_agent
from app.agents.food import food_agent
from app.agents.activity import activity_agent
from app.agents.budget import budget_agent


def orchestrate_trip(data):
    destination = destination_agent(data)

    stay = accommodation_agent(data)

    transport = transport_agent(data)

    food = food_agent(data)

    activity = activity_agent(data)

    budget = budget_agent(data)

    itinerary = {
        "destination": destination,
        "accommodation": stay,
        "transport": transport,
        "food": food,
        "activities": activity,
        "budget": budget
    }

    return itinerary