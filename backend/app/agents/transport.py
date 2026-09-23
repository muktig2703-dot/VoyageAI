from app.services.llm import llm

def transport_agent(data):
    prompt = f"""
    You are a transportation planning expert.

    Destination: {data['destination']}
    Budget: ₹{data['budget']}
    Travel Style: {data['travel_style']}
    Trip Dates: {data['start_date']} to {data['end_date']}

    Recommend:
    - Best way to reach the destination
    - Best local transport options
    - Estimated transport costs
    - Travel tips

    Return a practical transportation plan.
    """

    response = llm.invoke(prompt)

    return {
        "transport_plan": response.content
    }