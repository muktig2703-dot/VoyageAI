from app.services.llm import llm

def accommodation_agent(data):
    prompt = f"""
    You are an accommodation planning expert.

    Destination: {data['destination']}
    Budget: ₹{data['budget']}
    Travel Style: {data['travel_style']}
    Trip Dates: {data['start_date']} to {data['end_date']}
    Interests: {", ".join(data['interests'])}

    Recommend:
    - Best accommodation type
    - 3 suggested areas to stay
    - Estimated nightly cost
    - Why it suits this traveler

    Return the response in a structured format.
    """

    response = llm.invoke(prompt)

    return {
        "accommodation_plan": response.content
    }