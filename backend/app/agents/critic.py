from app.services.llm import llm


def critic_agent(itinerary, user_data):
    prompt = f"""
    You are VoyageAI's senior travel validator.

    Review this itinerary carefully.

    USER DETAILS
    Destination: {user_data["destination"]}
    Budget: ₹{user_data["budget"]}
    Travel Style: {user_data["travel_style"]}

    ITINERARY:
    {itinerary}

    Validate these:

    1. Is the weather compatible?
    2. Does the budget seem realistic?
    3. Are activities repeated?
    4. Are there scheduling conflicts?
    5. Are there missing meals?
    6. Are there impossible outdoor activities during rain?

    Respond ONLY in this format:

    {{
      "approved": true/false,
      "issues": [],
      "suggestions": []
    }}
    """

    response = llm.invoke(prompt)

    return response.content