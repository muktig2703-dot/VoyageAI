
import json

from app.services.search import web_search
from app.services.weather import get_weather
from app.services.llm import llm


def destination_agent(data):
    city = data["destination"]
    start_date = str(data["start_date"])
    end_date = str(data["end_date"])
    budget = data["budget"]
    travel_style = data["travel_style"]
    interests = data.get("interests", [])

    # Gather destination information using the existing services.
    weather = get_weather(city)
    events = web_search(f"{city} upcoming events travel")

    # Limit prompt size while preserving the information returned
    # by the existing search service.
    weather_text = json.dumps(
        weather,
        ensure_ascii=False,
        default=str
    )[:4000]

    events_text = json.dumps(
        events,
        ensure_ascii=False,
        default=str
    )[:8000]

    prompt = f"""
You are VoyageAI's destination research expert.

TRIP DETAILS
Destination: {city}
Start date: {start_date}
End date: {end_date}
Total trip budget: INR {budget}
Travel style: {travel_style}
Interests: {json.dumps(interests, ensure_ascii=False)}

CURRENT WEATHER INFORMATION
{weather_text}

DESTINATION AND EVENT SEARCH RESULTS
{events_text}

Your task is to prepare reliable destination research for the
other VoyageAI travel-planning agents.

RULES
- Use the supplied weather and search results as evidence.
- Do not invent events, dates, locations, prices, or opening hours.
- Do not claim an event is confirmed unless the search results support it.
- Current weather is not necessarily a forecast for the trip dates.
- If information is unavailable, explicitly state that it is unknown.
- Consider the travel dates, interests, travel style, and total budget.
- The total budget covers the entire trip, not destination research alone.
- Suggest practical destination highlights and planning considerations.
- Keep the output concise and useful to the other agents.

Return ONLY valid JSON in this structure:

{{
    "destination": "{city}",
    "trip_dates": {{
        "start_date": "{start_date}",
        "end_date": "{end_date}"
    }},
    "destination_overview": "string",
    "recommended_highlights": [
        {{
            "name": "string",
            "reason": "string",
            "estimated_cost": 0
        }}
    ],
    "events": [
        {{
            "name": "string",
            "date": "string",
            "location": "string",
            "details": "string"
        }}
    ],
    "weather_summary": "string",
    "weather_caveat": "string",
    "planning_tips": ["string"],
    "budget_considerations": "string",
    "information_gaps": ["string"]
}}

FIELD RULES
- Include 3 to 6 recommended highlights when sufficient evidence exists.
- Only include events supported by the supplied search results.
- Use an empty events list when no relevant events can be verified.
- estimated_cost must be a number without a currency symbol.
- Use 0 when a cost cannot be reasonably estimated; explain the uncertainty.
- Do not invent specific prices to fill missing information.
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

        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3].strip()

        result = json.loads(content)

        required_keys = {
            "destination",
            "trip_dates",
            "destination_overview",
            "recommended_highlights",
            "events",
            "weather_summary",
            "weather_caveat",
            "planning_tips",
            "budget_considerations",
            "information_gaps",
        }

        if not isinstance(result, dict):
            raise ValueError("Destination response must be a JSON object.")

        if not required_keys.issubset(result):
            raise ValueError("Destination response is missing required fields.")

        if not isinstance(result["recommended_highlights"], list):
            raise ValueError("Recommended highlights must be a list.")

        if not isinstance(result["events"], list):
            raise ValueError("Events must be a list.")

        if not isinstance(result["planning_tips"], list):
            raise ValueError("Planning tips must be a list.")

        if not isinstance(result["information_gaps"], list):
            raise ValueError("Information gaps must be a list.")

        return {
            **result,
            # Preserve the original service data for transparency
            # and potential use by downstream agents.
            "source_weather": weather,
            "source_events": events,
        }

    except (json.JSONDecodeError, ValueError, TypeError):
        # Do not silently present an unstructured LLM response
        # as a successfully validated destination plan.
        return {
            "destination": city,
            "trip_dates": {
                "start_date": start_date,
                "end_date": end_date,
            },
            "destination_overview": "",
            "recommended_highlights": [],
            "events": [],
            "weather_summary": "",
            "weather_caveat": (
                "Weather information was retrieved, but the destination "
                "research response could not be validated."
            ),
            "planning_tips": [],
            "budget_considerations": (
                "Destination recommendations could not be validated."
            ),
            "information_gaps": [
                "The destination research response was invalid or incomplete."
            ],
            "source_weather": weather,
            "source_events": events,
            "parse_error": True,
        }
