
import json

from app.services.places import search_places
from app.services.llm import llm


def food_agent(data):
    city = data["destination"]
    interests = data.get("interests", [])
    budget = data["budget"]
    travel_style = data["travel_style"]

    # Find real restaurant/place data before asking the LLM to plan meals.
    restaurants = search_places(f"best restaurants in {city}")

    prompt = f"""
You are VoyageAI's food and local dining expert.

TRIP DETAILS
Destination: {city}
Total trip budget: ₹{budget}
Travel style: {travel_style}
Interests: {", ".join(interests)}

AVAILABLE RESTAURANTS
{json.dumps(restaurants, ensure_ascii=False, default=str)}

Create practical food recommendations for this trip.

IMPORTANT RULES:
- The provided budget covers the entire trip, not just food.
- Do not allocate the entire budget to restaurants or meals.
- Recommend food options appropriate for the travel style and budget.
- Use the supplied restaurant data when recommending specific places.
- Do not invent restaurant names, addresses, ratings, or prices.
- If restaurant data is incomplete, acknowledge the uncertainty.
- Include a mix of local cuisine and practical meal options.
- Avoid repeating the same restaurant for every meal.
- Meal costs should be estimates, not guaranteed prices.
- Keep the recommendations relevant to the user's interests.

Return ONLY valid JSON using exactly this structure:

{{
    "meal_recommendations": [
        {{
            "meal": "breakfast",
            "suggestion": "string",
            "restaurant_name": "string",
            "estimated_cost": 0,
            "reason": "string"
        }},
        {{
            "meal": "lunch",
            "suggestion": "string",
            "restaurant_name": "string",
            "estimated_cost": 0,
            "reason": "string"
        }},
        {{
            "meal": "dinner",
            "suggestion": "string",
            "restaurant_name": "string",
            "estimated_cost": 0,
            "reason": "string"
        }}
    ],
    "local_specialties": [
        "string"
    ],
    "estimated_daily_food_cost": 0,
    "estimated_total_food_cost": 0,
    "budget_notes": "string"
}}

FIELD RULES:
- Provide one recommendation for each meal: breakfast, lunch, and dinner.
- restaurant_name must refer to a supplied restaurant when naming a specific place.
- If no suitable restaurant is available, use "Not specified".
- All cost fields must be numbers without currency symbols.
- estimated_daily_food_cost is the estimated food cost per day.
- Calculate trip duration using the supplied start and end dates.
- estimated_total_food_cost should cover the complete trip duration.
- Include 3 to 5 local specialties when reliable recommendations are possible.
- If the number of travelers is unknown, state that costs are estimates
  and do not claim they are exact group totals.
- Do not include markdown, code fences, or text outside the JSON.
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

        food_plan = json.loads(content)

        required_keys = {
            "meal_recommendations",
            "local_specialties",
            "estimated_daily_food_cost",
            "estimated_total_food_cost",
            "budget_notes",
        }

        if not isinstance(food_plan, dict) or not required_keys.issubset(food_plan):
            raise ValueError("Food response has an invalid structure.")

    except (json.JSONDecodeError, ValueError, TypeError):
        food_plan = {
            "meal_recommendations": [],
            "local_specialties": [],
            "estimated_daily_food_cost": 0,
            "estimated_total_food_cost": 0,
            "budget_notes": (
                "Food recommendations could not be parsed. "
                "Please try generating the trip again."
            ),
            "parse_error": True,
        }

    return {
        "restaurants": restaurants,
        "food_plan": food_plan,
    }
