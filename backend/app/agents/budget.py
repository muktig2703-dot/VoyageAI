from app.services.llm import llm

def budget_agent(data):
    prompt = f"""
    You are a travel budgeting expert.

    Destination: {data['destination']}
    Total Budget: ₹{data['budget']}
    Trip Dates: {data['start_date']} to {data['end_date']}
    Travel Style: {data['travel_style']}
    Interests: {", ".join(data['interests'])}

    Allocate the budget into:
    - Accommodation
    - Transportation
    - Food
    - Activities
    - Emergency Buffer

    Ensure the total stays within budget.
    Return a clear breakdown.
    """

    response = llm.invoke(prompt)

    return {
        "budget_plan": response.content
    }