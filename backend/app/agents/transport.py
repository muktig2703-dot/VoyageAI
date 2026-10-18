
import json

from app.services.llm import llm


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
- Include 3 to 5 useful travel tips.
- Keep recommendations specific to the destination.
- Do not include markdown, code fences, or explanations outside JSON.
"""

    response = llm.invoke(prompt)
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
