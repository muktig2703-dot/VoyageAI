from app.services.places import search_places
from app.services.llm import llm


def food_agent(data):
    city = data["destination"]

    restaurants = search_places(f"best restaurants in {city}")

    prompt = f"""
    Destination:
    {city}

    User Interests:
    {data['interests']}

    Available Restaurants:
    {restaurants}

    Create a breakfast,
    lunch,
    dinner plan.
    """

    response = llm.invoke(prompt)

    return {
        "restaurants": restaurants,
        "food_plan": response.content
    }