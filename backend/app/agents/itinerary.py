import json
from datetime import date, timedelta
from app.services.llm import invoke_gemini
import logging
logger = logging.getLogger(__name__)
def _parse_json_response(content):
    """Parse JSON returned by the LLM, including fenced responses."""
    if isinstance(content, list):
        content = "".join(
            item.get("text", "")
            for item in content
            if isinstance(item, dict)
        )
    if not isinstance(content, str):
        raise ValueError("The itinerary response is not text.")
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[1]
        if content.endswith("```"):
            content = content[:-3].strip()
        if content.lower().startswith("json"):
            content = content[4:].strip()
    result = json.loads(content)
    if not isinstance(result, dict):
        raise ValueError("The itinerary must be a JSON object.")
    return result

def _get_trip_dates(data):
    """Return all requested trip dates, inclusive."""
    start_date = date.fromisoformat(str(data["start_date"]))
    end_date = date.fromisoformat(str(data["end_date"]))
    if end_date < start_date:
        raise ValueError("End date cannot be earlier than start date.")
    number_of_days = (end_date - start_date).days + 1
    return [
        (start_date + timedelta(days=offset)).isoformat()
        for offset in range(number_of_days)
    ]



def _compact_agent_results(agent_results):
    """Remove bulky raw research fields while preserving planning data."""
    excluded_keys = {
        "source_weather",
        "source_events",
        "raw_response",
        "raw_data",
        "raw_html",
        "debug",
        "trace",
    }

    def clean(value):
        if isinstance(value, dict):
            return {
                key: clean(item)
                for key, item in value.items()
                if key not in excluded_keys
            }

        if isinstance(value, list):
            return [clean(item) for item in value]

        return value

    compacted = clean(agent_results)

    original_size = len(
    json.dumps(agent_results, ensure_ascii=False, default=str)
)
    compacted_size = len(
    json.dumps(compacted, ensure_ascii=False, default=str)
)

    logger.info(
    "Specialist results compaction: %s -> %s characters "
    "(removed %s)",
    original_size,
    compacted_size,
    original_size - compacted_size,
)

    return compacted

def itinerary_agent(data, agent_results, review=None):
    """
    Combine specialist-agent outputs into a single travel itinerary.
    Args:
        data: Original trip preferences.
        agent_results: Results from destination, accommodation,
            transport, food, activity, and budget agents.
        review: Optional critic feedback from a previous draft.
    Returns:
        A validated itinerary dictionary.
    """
    trip_dates = _get_trip_dates(data)
    review = review or {}
    required_agents = [
        "destination",
        "accommodation",
        "transport",
        "food",
        "activities",
        "budget",
    ]
    missing_agents = [
        name
        for name in required_agents
        if name not in agent_results
        or not isinstance(agent_results[name], dict)
        or agent_results[name].get("error")
        or agent_results[name].get("parse_error")
    ]
    if missing_agents:
        # Don't ask the LLM to disguise missing or failed research.
        return {
            "destination": data["destination"],
            "start_date": trip_dates[0],
            "end_date": trip_dates[-1],
            "trip_summary": "",
            "days": [],
            "cost_summary": {},
            "practical_notes": [],
            "assumptions": [],
            "warnings": [
                "Some specialist-agent results are missing or invalid."
            ],
            "missing_agent_results": missing_agents,
            "parse_error": True,
        }

    prompt = f"""
You are VoyageAI's final itinerary-generation agent.
Your job is to combine specialist research into one coherent,
practical itinerary that a traveler can actually use.
USER PREFERENCES
Destination: {data["destination"]}
Start date: {trip_dates[0]}
End date: {trip_dates[-1]}
Required dates: {json.dumps(trip_dates)}
Total trip budget: INR {data["budget"]}
Travel style: {data["travel_style"]}
Interests: {json.dumps(data.get("interests", []), ensure_ascii=False)}
SPECIALIST AGENT RESULTS
{json.dumps(_compact_agent_results(agent_results), ensure_ascii=False, default=str)}
CRITIC FEEDBACK FROM A PREVIOUS DRAFT, IF ANY
{json.dumps(review, ensure_ascii=False, default=str)}
ITINERARY REQUIREMENTS
1. Dates and structure
- Include every required date exactly once, in chronological order.
- Do not add dates outside the requested trip.
- Provide a day title and morning, afternoon, and evening sections.
- Each section must be a list of activities.
- Keep arrival and departure days realistic.
- Do not force a packed schedule onto a travel day.
2. Use of specialist results
- Use the destination research for highlights and planning context.
- Use accommodation recommendations to describe suitable areas
  and accommodation considerations.
- Use transport research to explain arrival and local transport.
- Use food research to suggest meals and local specialties.
- Use activity research as the primary basis for daily activities.
- Use the budget agent's allocation and estimates in the cost summary.
- Do not invent specific businesses, event details, prices, or
  opening hours unsupported by the supplied information.
- Distinguish estimated information from confirmed information.
3. Budget
- The user's budget is for the entire trip.
- Consider accommodation, transportation, food, activities,
  and emergency expenses together.
- Do not treat the budget allocation as proof that the trip is affordable.
- Avoid double-counting costs across categories.
- Use the specialist agents' estimates consistently.
- If costs are unknown, mark them as estimates or unknown rather
  than inventing precise prices.
- Clearly warn the user if the estimated total cost exceeds the budget.
4. Practicality
- Group nearby activities together when the supplied information
  supports doing so.
- Leave time for meals, rest, and transportation.
- Consider the traveler's interests and style.
- Use weather information cautiously; current weather is not a
  forecast for every trip date.
- Provide alternatives for weather-sensitive outdoor plans where useful.
- Do not claim that events, tickets, or reservations are confirmed.
5. Critic revisions
- Determine whether critic feedback is present and contains unresolved issues.
- For a revision, treat the critic's issues and suggestions as the
  primary change requests.
- Preserve existing valid activities, dates, meal suggestions,
  accommodation choices, and recommendations wherever possible.
- Change only the parts necessary to resolve the critic's issues;
  avoid redesigning the entire itinerary without a clear reason.
- If a budget issue is identified, update affected costs and reconcile
  the overall cost summary.
- If a schedule or travel-time issue is identified, adjust affected
  activities and durations to make the schedule practical.
- Recheck all dates, budget totals, and schedule constraints after
  making revisions.
- Do not claim an issue has been fixed if it remains unresolved.
- Record unresolved concerns in warnings.
- If no critic feedback exists, generate the initial itinerary.
Return ONLY valid JSON with this exact structure:
{{
    "destination": "{data["destination"]}",
    "start_date": "{trip_dates[0]}",
    "end_date": "{trip_dates[-1]}",
    "trip_summary": "string",
    "arrival_and_transport": "string",
    "accommodation": {{
        "recommended_type": "string",
        "recommended_areas": [],
        "estimated_total_cost": 0,
        "notes": "string"
    }},
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
                    "notes": "string"
                }}
            ],
            "afternoon": [],
            "evening": [],
            "meal_suggestions": {{
                "breakfast": "string",
                "lunch": "string",
                "dinner": "string"
            }},
            "weather_alternative": "string",
            "estimated_daily_cost": 0
        }}
    ],
    "food_summary": "string",
    "cost_summary": {{
        "currency": "INR",
        "user_budget": 0,
        "accommodation": 0,
        "transportation": 0,
        "food": 0,
        "activities": 0,
        "emergency_buffer": 0,
        "estimated_total_cost": 0,
        "estimated_shortfall": 0,
        "budget_feasible": true,
        "notes": "string"
    }},
    "practical_notes": ["string"],
    "assumptions": ["string"],
    "warnings": ["string"]
}}
OUTPUT RULES
- Include exactly one day object for every required date.
- Every day must contain morning, afternoon, and evening lists.
- All cost fields must be numeric and must not contain currency symbols.
- Use 0 when a cost is unknown, and explain the uncertainty in notes.
- Do not interpret an unknown cost as a confirmed free activity.
- estimated_daily_cost should represent that day's planned expenses
  without counting the same expense twice.
- estimated_total_cost should reconcile with the category estimates.
- estimated_shortfall should be max(estimated_total_cost - user_budget, 0).
- budget_feasible must reflect whether the estimated total fits the budget.
- Do not silently change the user's budget or travel dates.
- Use empty lists when there are no supported recommendations.

- Keep the trip_summary to 2–3 short sentences maximum.
- Each activity description must be one short sentence, ideally under 15 words.
- Each activity note must be one short actionable tip, ideally under 10 words.
- Keep day titles short, ideally 3–6 words.
- Keep arrival_and_transport to 2–3 concise sentences.
- Keep accommodation notes to 2 short sentences maximum.
- Keep food_summary to 2 short sentences maximum.
- Keep cost_summary notes concise and focused on budget risks.
- Keep practical_notes and assumptions to only essential bullet-style items.
- Meal suggestions must be short phrases, not paragraphs.
- Weather alternatives must be one short sentence describing a practical backup.
- Do not repeat an activity description in its notes or meal suggestions.
- Do not explain why an attraction is famous or provide general travel essays.
- Prioritize actionable information: what to do, where to go, duration, and estimated cost.
- Preserve the existing JSON structure and every required field.
- Keep the required JSON structure and all required fields unchanged.
- Do not include markdown or explanations outside the JSON.
"""
    logger.info("Itinerary prompt size: %s characters", len(prompt))
    response = invoke_gemini(prompt)
    result = _parse_json_response(response.content)
    required_keys = {
        "destination",
        "start_date",
        "end_date",
        "trip_summary",
        "arrival_and_transport",
        "accommodation",
        "days",
        "food_summary",
        "cost_summary",
        "practical_notes",
        "assumptions",
        "warnings",
    }
    if not required_keys.issubset(result):
        raise ValueError("The itinerary is missing required fields.")
    if result["destination"] != data["destination"]:
        raise ValueError("The itinerary destination does not match the request.")
    if (
        result["start_date"] != trip_dates[0]
        or result["end_date"] != trip_dates[-1]
    ):
        raise ValueError("The itinerary dates do not match the request.")
    if not isinstance(result["days"], list):
        raise ValueError("The itinerary days must be a list.")
    returned_dates = [
        day.get("date")
        for day in result["days"]
        if isinstance(day, dict)
    ]
    if returned_dates != trip_dates:
        raise ValueError(
            "The itinerary must include every requested date exactly once."
        )
    for day in result["days"]:
        for section in ("morning", "afternoon", "evening"):
            if not isinstance(day.get(section), list):
                raise ValueError(
                    f"Invalid {section} activities for {day['date']}."
                )
        if not isinstance(day.get("meal_suggestions"), dict):
            raise ValueError(
                f"Meal suggestions are missing for {day['date']}."
            )
    if not isinstance(result["accommodation"], dict):
        raise ValueError("Accommodation details must be an object.")
    if not isinstance(result["cost_summary"], dict):
        raise ValueError("The cost summary must be an object.")
    result["generated_with_agent_results"] = True
    return result
