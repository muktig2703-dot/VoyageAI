from app.services.llm import invoke_gemini

def accommodation_agent(data):
    prompt = f"""
You are an accommodation planning expert for VoyageAI.

Destination: {data['destination']}
Budget: ₹{data['budget']}
Travel Style: {data['travel_style']}
Trip Dates: {data['start_date']} to {data['end_date']}
Interests: {", ".join(data['interests'])}

Recommend accommodation options suitable for this traveler.

You MUST return ONLY valid JSON.

Use exactly this structure:

{{
    "accommodation_type": "string",
    "recommended_areas": [
        {{
            "area": "string",
            "estimated_nightly_cost": 0,
            "reason": "string"
        }}
    ],
    "recommended_nightly_budget": 0,
    "total_estimated_cost": 0,
    "recommendation": "string"
}}

Rules:
- recommended_areas must contain exactly 3 areas.
- estimated_nightly_cost must be a number.
- recommended_nightly_budget must be a number.
- total_estimated_cost must be a number.
- Do not include currency symbols inside numeric fields.
- The user's budget is the TOTAL trip budget across accommodation, transportation, food, activities, and emergency expenses.
Do NOT assume the entire budget is available for accommodation.
Keep the accommodation estimate appropriate for the traveler's total budget and trip duration.
- Consider the travel style.
- Consider the trip duration.
- Do not add markdown.
- Do not add explanations outside the JSON.
- total_estimated_cost is the estimated accommodation cost for the
  entire trip duration, not the entire travel budget.
"""

    response = invoke_gemini(prompt)

    try:
        import json

        result = json.loads(response.content)

    except Exception:
        result = {
            "accommodation_type": "Not available",
            "recommended_areas": [],
            "recommended_nightly_budget": 0,
            "total_estimated_cost": 0,
            "recommendation": response.content,
        }

    
    if not isinstance(result, dict):
        raise ValueError("Accommodation response must be a dictionary.")

    if result.get("parse_error"):
        raise ValueError("Accommodation response could not be parsed.")

    from datetime import date
    import math

    start_date = date.fromisoformat(str(data["start_date"]))
    end_date = date.fromisoformat(str(data["end_date"]))

    if end_date < start_date:
        raise ValueError("End date cannot be earlier than start date.")

    trip_nights = (end_date - start_date).days
    nightly_budget = result.get("recommended_nightly_budget")
    total_cost = result.get("total_estimated_cost")

    for field, amount in (
        ("recommended_nightly_budget", nightly_budget),
        ("total_estimated_cost", total_cost),
    ):
        if (
            isinstance(amount, bool)
            or not isinstance(amount, (int, float))
            or not math.isfinite(amount)
            or amount < 0
        ):
            raise ValueError(f"Invalid accommodation field: {field}")

    # Recalculate the accommodation total for the actual nights.
    result["total_estimated_cost"] = nightly_budget * trip_nights

    return result