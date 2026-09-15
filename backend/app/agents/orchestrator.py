from app.agents.destination import destination_agent
from app.agents.accommodation import accommodation_agent
from app.agents.transport import transport_agent


def orchestrate_trip(data):
    destination = destination_agent(data)

    stay = accommodation_agent(data)

    transport = transport_agent(data)

    itinerary = {
        "destination": destination,
        "accommodation": stay,
        "transport": transport
    }

    return itinerary