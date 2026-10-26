
import json
from app.services.llm import invoke_gemini


def transport_agent(data):
    prompt = f"""
You are VoyageAI's transportation planning expert.

TRIP DETAILS
Destination: {data['destination']}
TOTAL TRIP BUDGET: ₹{data['budget']}
Travel Style: {data['travel_style']}
Start Date: {data['start_date']}
End Date: {data['end_date']}
Interests: {", ".join(data.get('interests', []))}

Your task is to create a realistic transportation plan.

IMPORTANT BUDGET RULES:
- The given budget is for the ENTIRE trip.
- It must cover accommodation, transportation, food, activities,
  and emergency expenses.
- Do not assume the entire budget is available for transportation.
- Recommend transport options that suit the travel style
  while considering the total trip budget.
- If the budget is insufficient for the preferred travel style,
  explain the limitation and suggest practical alternatives.
- Estimate costs for the complete trip, not per person unless stated.
- Do not assume the traveler's starting city is known.
- If the starting city is unknown, explain that the cost of
  reaching the destination cannot be estimated precisely.
- Do not invent exact ticket prices or claim availability.

Return ONLY valid JSON using exactly this structure:

{{
    "arrival": {{
        "recommended_mode": "string",
        "estimated_cost": 0,
        "reason": "string"
    }},
    "local_transport": [
        {{
            "mode": "string",
            "estimated_total_cost": 0,
            "reason": "string"
        }}
    ],
    "estimated_total_cost": 0,
    "budget_fit": "string",
    "tips": [
        "string"
    ]
}}

FIELD RULES:
- estimated_cost is the estimated cost of reaching the destination.
- estimated_total_cost is the combined estimated cost of arrival
  and local transportation for the entire trip.
- All cost fields must be numbers, without currency symbols.
- Use 0 when a cost cannot be reasonably estimated, and explain why
  in the relevant reason or budget_fit field.
- Include 2 to 4 practical local transportation options.
- Local transport entries are ALTERNATIVE options, not separate expenses.
- Do not add the costs of all alternative options together.
- estimated_total_cost must represent one recommended transport plan:
  arrival cost plus the expected cost of the chosen local transport mode(s).
- Clearly identify the recommended local transport option.
- Do not count the same journey more than once.
- Include 3 to 5 useful travel tips.
- Keep recommendations specific to the destination.
- Do not include markdown, code fences, or explanations outside JSON.
"""

    response = invoke_gemini(prompt)
    content = response.content

    try:
        if isinstance(content, list):
            content = "".join(
                item.get("text", "")
                for item in content
                if isinstance(item, dict)
            )

        content = content.strip()

        # Handle accidental Markdown code fences.
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3].strip()

        result = json.loads(content)

        # Basic validation of the expected structure.
        required_keys = {
            "arrival",
            "local_transport",
            "estimated_total_cost",
            "budget_fit",
            "tips",
        }

        if not isinstance(result, dict) or not required_keys.issubset(result):
            raise ValueError("Transport response has an invalid structure.")

       
        arrival = result.get("arrival")
        local_transport = result.get("local_transport")

        if not isinstance(arrival, dict):
            raise ValueError("Arrival estimate is invalid.")

        if not isinstance(local_transport, list):
            raise ValueError("Local transport estimates are invalid.")

        import math

        arrival_cost = arrival.get("estimated_cost")
        reported_total = result.get("estimated_total_cost")

        def valid_cost(value):
            return (
                not isinstance(value, bool)
                and isinstance(value, (int, float))
                and math.isfinite(value)
                and value >= 0
            )

        if not valid_cost(arrival_cost):
            raise ValueError("Arrival cost is invalid.")

        if not valid_cost(reported_total):
            raise ValueError("Total transport cost is invalid.")

        for option in local_transport:
            if not isinstance(option, dict):
                raise ValueError("A local transport option is invalid.")

            cost = option.get("estimated_total_cost")

            if not valid_cost(cost):
                raise ValueError("A local transport cost is invalid.")

        # Reconcile the total from arrival and local transport estimates.
        result["estimated_total_cost"] = reported_total

        return result 

    except (json.JSONDecodeError, ValueError, TypeError):
        return {
            "arrival": {
                "recommended_mode": "Unable to determine",
                "estimated_cost": 0,
                "reason": "The transportation estimate could not be parsed."
            },
            "local_transport": [],
            "estimated_total_cost": 0,
            "budget_fit": (
                "Transportation estimates are temporarily unavailable. "
                "Please try generating the trip again."
            ),
            "tips": [],
            "parse_error": True
        }
