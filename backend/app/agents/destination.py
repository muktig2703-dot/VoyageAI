from app.services.search import web_search
from app.services.weather import get_weather
from app.services.llm import llm


def destination_agent(data):
    city = data["destination"]

    weather = get_weather(city)

    events = web_search(f"{city} upcoming events travel")

    prompt = f"""
    Destination:
    {city}

    Weather:
    {weather}

    Events:
    {events}

    Create the best travel recommendations.
    """

    response = llm.invoke(prompt)

    return {
        "weather": weather,
        "events": events,
        "research": response.content
    }