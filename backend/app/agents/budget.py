
import json
from datetime import date

from app.services.llm import llm


def budget_agent(data):
    start_date = date.fromisoformat(str(data["start_date"]))
    end_date = date.fromisoformat(str(data["end_date"]))

    if end_date < start_date:
        raise ValueError("End date cannot be earlier than start date.")

    trip_days = (end_date - start_date).days + 1
    trip_nights = max((end_date - start_date).days, 0)

    prompt = f"""
You are VoyageAI's travel budgeting expert.

TRIP DETAILS
Destination: {data['destination']}
Total trip budget: ₹{data['budget']}
Start date: {start_date.isoformat()}
End date: {end_date.isoformat()}
Trip days: {trip_days}
Trip nights: {trip_nights}
Travel style: {data['travel_style']}
Interests: {", ".join(data.get('interests', []))}

Create a realistic budget allocation for this trip.

IMPORTANT RULES:
- The total budget is shared across all trip expenses.
- Include accommodation, transportation, food, activities,
  and an emergency buffer.
- Do not assume the entire budget is available for any one category.
- Consider the destination, travel style, duration, and interests.
- Do not claim that an unrealistic budget is sufficient just to make
  the numbers add up.
- If the budget is insufficient, explain the shortfall and suggest
  practical adjustments.
- Treat all amounts as estimates, not confirmed prices.
- Do not assume the starting city or number of travelers is known.
- Avoid double-counting expenses between categories.
- The allocated amounts must sum to the user's total budget.
- Keep all numeric fields as numbers without currency symbols.

Return ONLY valid JSON using exactly this structure:

{{
    "currency": "INR",
    "total_budget": 0,
    "allocation": {{
        "accommodation": 0,
        "transportation": 0,
        "food": 0,
        "activities": 0,
        "emergency_buffer": 0
    }},
    "allocated_total": 0,
    "remaining_budget": 0,
    "estimated_actual_cost": 0,
    "estimated_shortfall": 0,
    "budget_feasible": true,
    "cost_assumptions": [
        "string"
    ],
    "saving_suggestions": [
        "string"
    ],
    "summary": "string"
}}

FIELD RULES:
- total_budget must equal {data['budget']}.
- allocated_total must equal the sum of all allocation categories.
- allocated_total must not exceed total_budget.
- remaining_budget equals total_budget minus allocated_total.
- estimated_actual_cost is your estimate of the likely total trip cost.
- estimated_shortfall is max(estimated_actual_cost - total_budget, 0).
- budget_feasible should be false when the estimated trip cost exceeds
  the total budget.
- Do not confuse allocated_total with estimated_actual_cost.
- Include 2 to 5 cost assumptions and 2 to 5 saving suggestions.
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

        required_keys = {
            "currency",
            "total_budget",
            "allocation",
            "allocated_total",
            "remaining_budget",
            "estimated_actual_cost",
            "estimated_shortfall",
            "budget_feasible",
            "cost_assumptions",
            "saving_suggestions",
            "summary",
        }

        if not isinstance(result, dict) or not required_keys.issubset(result):
            raise ValueError("Budget response has an invalid structure.")

        allocation_keys = {
            "accommodation",
            "transportation",
            "food",
            "activities",
            "emergency_buffer",
        }

        allocation = result["allocation"]

        if not isinstance(allocation, dict) or not allocation_keys.issubset(allocation):
            raise ValueError("Budget allocation is incomplete.")

        # Recalculate arithmetic locally rather than trusting the LLM.
        amounts = [allocation[key] for key in allocation_keys]

        if any(
            isinstance(amount, bool)
            or not isinstance(amount, (int, float))
            or amount < 0
            for amount in amounts
        ):
            raise ValueError("Budget allocation contains invalid amounts.")

        allocated_total = sum(amounts)
        total_budget = data["budget"]

        if allocated_total > total_budget:
            raise ValueError("Budget allocation exceeds the total budget.")

        estimated_actual_cost = result["estimated_actual_cost"]

        if (
            isinstance(estimated_actual_cost, bool)
            or not isinstance(estimated_actual_cost, (int, float))
            or estimated_actual_cost < 0
        ):
            raise ValueError("Estimated actual cost is invalid.")

        # Trust local arithmetic, not the model's calculated totals.
        result["currency"] = "INR"
        result["total_budget"] = total_budget
        result["allocated_total"] = allocated_total
        result["remaining_budget"] = total_budget - allocated_total
        result["estimated_shortfall"] = max(
            estimated_actual_cost - total_budget, 0
        )
        result["budget_feasible"] = estimated_actual_cost <= total_budget

        return result

    except (json.JSONDecodeError, ValueError, TypeError):
        return {
            "currency": "INR",
            "total_budget": data["budget"],
            "allocation": {
                "accommodation": 0,
                "transportation": 0,
                "food": 0,
                "activities": 0,
                "emergency_buffer": 0,
            },
            "allocated_total": 0,
            "remaining_budget": data["budget"],
            "estimated_actual_cost": 0,
            "estimated_shortfall": 0,
            "budget_feasible": False,
            "cost_assumptions": [],
            "saving_suggestions": [],
            "summary": (
                "A reliable budget breakdown could not be generated. "
                "The trip budget has not been validated."
            ),
            "parse_error": True,
        }
