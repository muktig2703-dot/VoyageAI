
import json
import logging
from app.services.llm import invoke_gemini

logger = logging.getLogger(__name__)


def _compact_critic_input(itinerary):
    """Remove bulky raw data while preserving useful planning details."""
    if not isinstance(itinerary, dict):
        return itinerary

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

    return clean(itinerary)


def critic_agent(itinerary, user_data):
    prompt = f"""
You are VoyageAI's senior travel itinerary validator.

Your job is to critically evaluate the proposed travel itinerary.
Do not approve it merely because it looks complete.

USER DETAILS
Destination: {user_data["destination"]}
Start date: {user_data["start_date"]}
End date: {user_data["end_date"]}
Total trip budget: INR {user_data["budget"]}
Travel style: {user_data["travel_style"]}
Interests: {json.dumps(user_data.get("interests", []), ensure_ascii=False)}

ITINERARY AND AGENT RESEARCH
{json.dumps(_compact_critic_input(itinerary), ensure_ascii=False, default=str)}

VALIDATION CHECKLIST

1. Budget consistency
   - Check whether estimated expenses are consistent across the agents.
   - Check whether the estimated total trip cost exceeds the user's budget.
   - Look for missing categories or obvious double-counting.
   - Do not approve an unrealistic budget simply because allocations add up.

2. Activity schedule
   - Check that itinerary dates fall within the requested trip dates.
   - Identify duplicate activities and significant scheduling conflicts.
   - Check whether travel time, rest, and meals have been reasonably considered.
   - Flag a schedule that is implausibly crowded.

3. Food and meals
   - Check whether the itinerary includes reasonable meal arrangements.
   - Flag missing meal planning where relevant.
   - Do not require every meal to have a named restaurant.

4. Weather and safety
   - Check whether outdoor plans account for available weather information.
   - Current weather is not a forecast for all future trip dates.
   - Flag plans that rely on unsupported weather assumptions.
   - Recommend alternatives when weather-sensitive activities lack them.

5. Research reliability
   - Flag missing, malformed, or failed agent results.
   - Do not treat unknown prices, opening hours, or event details as verified.
   - Flag invented-looking specifics that are unsupported by the supplied data.
   - Do not claim external facts have been independently verified.

6. Trip suitability
   - Check that recommendations fit the destination, travel style,
     interests, and duration.
   - Identify major omissions that make the itinerary impractical.

APPROVAL RULES
- approved must be false if critical information is missing,
  the itinerary is malformed, or there are major unresolved issues.
- approved must be false if the estimated total cost exceeds the
  user's budget without a clearly addressed, feasible alternative.
- Minor optional improvements may be included as suggestions without
  necessarily blocking approval.
- Do not invent facts to justify approval or rejection.
- If information is insufficient to validate an important claim,
  identify that uncertainty in issues.
- Be fair: do not reject an otherwise practical itinerary over
  minor preferences.

Return ONLY valid JSON using exactly this structure:

{{
    "approved": true,
    "issues": [
        {{
            "severity": "critical",
            "category": "budget",
            "description": "string",
            "suggested_fix": "string"
        }}
    ],
    "suggestions": ["string"],
    "budget_check": {{
        "within_budget": true,
        "estimated_total_cost": 0,
        "user_budget": 0,
        "explanation": "string"
    }},
    "schedule_check": {{
        "valid": true,
        "issues_found": []
    }},
    "research_limitations": ["string"],
    "summary": "string"
}}

OUTPUT RULES
- approved, within_budget, and valid must be JSON booleans.
- estimated_total_cost and user_budget must be numbers.
- Use 0 for estimated_total_cost if no reliable total is available,
  and explain that uncertainty.
- Use severity values: "critical", "major", or "minor".
- Every issue must include severity, category, description,
  and suggested_fix.
- Use empty lists when there are no findings.
- Do not include markdown, code fences, or text outside JSON.
"""

    logger.info(
    "Critic prompt size: %s characters",
    len(prompt),
)

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

        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3].strip()

        result = json.loads(content)

        if not isinstance(result, dict):
            raise ValueError("Critic response must be a JSON object.")

        required_keys = {
            "approved",
            "issues",
            "suggestions",
            "budget_check",
            "schedule_check",
            "research_limitations",
            "summary",
        }

        if not required_keys.issubset(result):
            raise ValueError("Critic response is missing required fields.")

        if not isinstance(result["approved"], bool):
            raise ValueError("Approval must be a boolean.")

        if not isinstance(result["issues"], list):
            raise ValueError("Issues must be a list.")

        if not isinstance(result["suggestions"], list):
            raise ValueError("Suggestions must be a list.")

        if not isinstance(result["research_limitations"], list):
            raise ValueError("Research limitations must be a list.")

        budget_check = result["budget_check"]
        schedule_check = result["schedule_check"]

        if not isinstance(budget_check, dict):
            raise ValueError("Budget check must be an object.")

        if not isinstance(schedule_check, dict):
            raise ValueError("Schedule check must be an object.")

        if not isinstance(budget_check.get("within_budget"), bool):
            raise ValueError("Budget status must be a boolean.")

        if not isinstance(schedule_check.get("valid"), bool):
            raise ValueError("Schedule status must be a boolean.")

        # Apply deterministic checks that should not depend on
        # the LLM's interpretation of its own response.
        if budget_check["within_budget"] is False:
            result["approved"] = False

        if schedule_check["valid"] is False:
            result["approved"] = False

        if any(
            isinstance(issue, dict)
            and issue.get("severity") == "critical"
            for issue in result["issues"]
        ):
            result["approved"] = False

        return result

    except (json.JSONDecodeError, ValueError, TypeError):
        # Return an explicit failed review instead of approving
        # an unparseable or malformed response.
        return {
            "approved": False,
            "issues": [
                {
                    "severity": "critical",
                    "category": "validation",
                    "description": (
                        "The critic response could not be parsed "
                        "or did not match the required structure."
                    ),
                    "suggested_fix": (
                        "Regenerate or manually review the itinerary."
                    ),
                }
            ],
            "suggestions": [],
            "budget_check": {
                "within_budget": False,
                "estimated_total_cost": 0,
                "user_budget": user_data["budget"],
                "explanation": (
                    "Budget validation could not be completed."
                ),
            },
            "schedule_check": {
                "valid": False,
                "issues_found": [
                    "Schedule validation could not be completed."
                ],
            },
            "research_limitations": [
                "The critic response was invalid or incomplete."
            ],
            "summary": "The itinerary could not be approved.",
            "validation_error": True,
        }
