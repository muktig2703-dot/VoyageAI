
import json
from datetime import date
import math
from app.services.weather import get_weather
from app.services.llm import invoke_gemini


def activity_agent(data):
    city = data["destination"]
    interests = data.get("interests", [])
    budget = data["budget"]
    travel_style = data["travel_style"]

    start_date = date.fromisoformat(str(data["start_date"]))
    end_date = date.fromisoformat(str(data["end_date"]))

    if end_date < start_date:
        raise ValueError("End date cannot be earlier than start date.")

    # Include both the arrival date and departure date.
    trip_dates = [
        (start_date.fromordinal(start_date.toordinal() + offset)).isoformat()
        for offset in range((end_date - start_date).days + 1)
    ]

    weather = get_weather(city)

    prompt = f"""
You are VoyageAI's expert travel activity planner.

TRIP DETAILS
Destination: {city}
Start date: {start_date.isoformat()}
End date: {end_date.isoformat()}
Trip dates: {json.dumps(trip_dates)}
Total trip budget: ₹{budget}
Travel style: {travel_style}
Interests: {", ".join(interests)}

WEATHER INFORMATION
{json.dumps(weather, ensure_ascii=False, default=str)}

Create a practical, day-by-day activity itinerary for these exact dates.

IMPORTANT RULES:
- Include every date supplied in Trip dates, exactly once.
- The total trip budget includes accommodation, transportation,
  food, activities, and emergency expenses.
- Do not treat the entire trip budget as an activity budget.
- Keep activity costs realistic for the destination and travel style.
- Prioritize the user's stated interests.
- Avoid repeating the same activities across different days.
- Group nearby activities together where practical.
- Leave reasonable time for travel, rest, and meals.
- Do not invent confirmed opening hours, ticket prices, or availability.
- The provided weather is current weather, not a forecast for every trip date.
- Do not claim that current conditions will persist throughout the trip.
- If rain or thunderstorms are forecast for a particular day,
  prioritize suitable indoor activities for that day.
- If a forecast is unavailable, provide a mix of indoor and outdoor
  options rather than assuming the weather will remain unchanged.
- For outdoor activities, include a practical alternative where useful.
- If the budget is too restrictive, suggest free or low-cost activities
  and explain the limitation.
- Do not invent specific events or claim an event is happening
  unless supporting information is available.

Return ONLY valid JSON using exactly this structure:

{{
    "days": [
        {{
            "date": "YYYY-MM-DD",
            "title": "string",
            "morning": [
                {{
                    "activity": "string",
                    "location": "string",
                    "estimated_cost": 0,
                    "duration": "string",
                    "reason": "string"
                }}
            ],
            "afternoon": [
                {{
                    "activity": "string",
                    "location": "string",
                    "estimated_cost": 0,
                    "duration": "string",
                    "reason": "string"
                }}
            ],
            "evening": [
                {{
                    "activity": "string",
                    "location": "string",
                    "estimated_cost": 0,
                    "duration": "string",
                    "reason": "string"
                }}
            ],
            "weather_alternative": "string",
            "estimated_daily_cost": 0
        }}
    ],
    "estimated_total_activity_cost": 0,
    "budget_notes": "string"
}}

FIELD RULES:
- Each activity cost must be a numeric estimate without currency symbols.
- estimated_daily_cost is the sum of the activity costs for that day.
- estimated_total_activity_cost is the sum of all daily activity costs.
- Activity names should be short and descriptive, ideally 3–8 words.
- Each activity's reason must be one concise sentence of 10–15 words maximum.
- Describe only the planned experience; avoid historical essays and generic explanations.
- Keep weather_alternative to one short sentence.
- Keep budget_notes to two short sentences maximum.
- Prefer 2–3 meaningful activities per day, adjusted for travel time and trip length.
- Keep arrival and departure days light.
- Do not add separate meal suggestions or long travel advice to activity descriptions.
- Use practical, specific information instead of repetitive filler.

- Use 0 for genuinely free activities.
- Include sensible activities for arrival and departure days.
- Do not force a full schedule onto a day when travel may take up most of it.
- Keep descriptions concise and useful.
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

        plan = json.loads(content)

        if not isinstance(plan, dict) or not isinstance(plan.get("days"), list):
            raise ValueError("Activity response has an invalid structure.")

        returned_dates = [
            day.get("date")
            for day in plan["days"]
            if isinstance(day, dict)
        ]

        if returned_dates != trip_dates:
            raise ValueError("Activity dates do not match the requested trip dates.")

        required_keys = {
            "estimated_total_activity_cost",
            "budget_notes",
        }

        if not required_keys.issubset(plan):
            raise ValueError("Activity response is missing required fields.")

        
        # Validate and reconcile activity cost totals.
        daily_total = 0

        for day in plan["days"]:
            if not isinstance(day, dict):
                raise ValueError("An activity day has an invalid structure.")

            day_cost = day.get("estimated_daily_cost")

            if (
                isinstance(day_cost, bool)
                or not isinstance(day_cost, (int, float))
                or not math.isfinite(day_cost)
                or day_cost < 0
            ):
                raise ValueError("A daily activity cost is invalid.")

            calculated_day_total = 0

            for period in ("morning", "afternoon", "evening"):
                activities = day.get(period, [])

                if not isinstance(activities, list):
                    raise ValueError("An activity period must be a list.")

                for activity in activities:
                    if not isinstance(activity, dict):
                        raise ValueError("An activity entry is invalid.")

                    cost = activity.get("estimated_cost")

                    if (
                        isinstance(cost, bool)
                        or not isinstance(cost, (int, float))
                        or not math.isfinite(cost)
                        or cost < 0
                    ):
                        raise ValueError("An activity cost is invalid.")

                    calculated_day_total += cost

            if not math.isclose(
                day_cost,
                calculated_day_total,
                rel_tol=0,
                abs_tol=0.01,
            ):
                raise ValueError(
                    "Daily activity cost does not match activity entries."
                )

            daily_total += calculated_day_total

        plan["estimated_total_activity_cost"] = daily_total

    except (json.JSONDecodeError, ValueError, TypeError):
        plan = {
            "days": [],
            "estimated_total_activity_cost": 0,
            "budget_notes": (
                "The activity itinerary could not be parsed or validated. "
                "Please try generating the trip again."
            ),
            "parse_error": True,
        }

    return {
        "weather": weather,
        "plan": plan,
    }
