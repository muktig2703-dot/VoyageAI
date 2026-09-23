from app.services.weather import get_weather
from app.services.llm import llm


def activity_agent(data):
    city = data["destination"]
    weather = get_weather(city)

    prompt = f"""
    You are an expert travel activity planner.

    Destination: {city}

    Budget: ₹{data["budget"]}

    User interests:
    {", ".join(data["interests"])}

    Current weather:
    {weather["condition"]}, {weather["temperature"]}°C

    Rules:
    - If weather is Rain or Thunderstorm, prioritize indoor activities.
    - If weather is Clear or Clouds, prioritize outdoor experiences.
    - Keep activities within the user's budget.

    Return JSON-like output with:
    - morning
    - afternoon
    - evening
    """

    response = llm.invoke(prompt)

    return {
        "weather": weather,
        "plan": response.content
    }