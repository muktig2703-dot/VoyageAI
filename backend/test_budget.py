import json
from types import SimpleNamespace

import app.agents.budget as budget_module


sample_data = {
    "destination": "Goa",
    "budget": 17000,
    "start_date": "2026-10-27",
    "end_date": "2026-10-31",
    "travel_style": "Balanced",
    "interests": ["Adventure"],
}

fake_response = {
    "currency": "INR",
    "total_budget": 17000,
    "allocation": {
        "accommodation": 6000,
        "transportation": 2600,
        "food": 4000,
        "activities": 2000,
        "emergency_buffer": 2400,
    },
    "allocated_total": 17000,
    "remaining_budget": 0,
    "estimated_actual_cost": 14600,
    "estimated_shortfall": 0,
    "budget_feasible": True,
    "cost_assumptions": ["Mock estimate for testing"],
    "saving_suggestions": ["Compare prices before booking"],
    "summary": "Mock budget response",
}

captured_prompts = []


def fake_gemini(prompt):
    captured_prompts.append(prompt)
    return SimpleNamespace(content=json.dumps(fake_response))


# Replace the real Gemini function with our mock.
budget_module.invoke_gemini = fake_gemini


# TEST 1: Specialist estimate extraction.
result = budget_module.budget_agent(
    sample_data,
    agent_results={
        "accommodation": {
            "total_estimated_cost": 6000,
            "recommended_nightly_budget": 1500,
        },
        "transport": {
            "estimated_total_cost": 2600,
        },
        "food": {
            "food_plan": {
                "estimated_total_food_cost": 4000,
            }
        },
        "activities": {
            "plan": {
                "estimated_total_activity_cost": 2000,
            }
        },
    },
)

prompt = captured_prompts[-1]

start_marker = (
    "Specialist research estimates "
    "(use these to reconcile costs):\n"
)
end_marker = "\n\nKnown specialist cost total:"

estimates_text = prompt.split(start_marker, 1)[1].split(
    end_marker, 1
)[0]

estimates = json.loads(estimates_text)

assert estimates["accommodation"]["estimated_total_cost"] == 6000
assert estimates["transport"]["estimated_total_cost"] == 2600
assert estimates["food"]["estimated_total_food_cost"] == 4000
assert estimates["activities"]["estimated_total_activity_cost"] == 2000

print("Specialist estimate extraction test passed!")


# TEST 2: Valid budget arithmetic.
assert result["allocated_total"] == 17000
assert result["remaining_budget"] == 0
assert result["estimated_shortfall"] == 0
assert result["budget_feasible"] is True

print("Valid budget test passed!")
print("Allocated total:", result["allocated_total"])
print("Remaining budget:", result["remaining_budget"])
print("Estimated actual cost:", result["estimated_actual_cost"])


# TEST 3: Reject an allocation that exceeds the budget.
fake_response["allocation"]["emergency_buffer"] = 5000

result = budget_module.budget_agent(
    sample_data,
    agent_results={},
)

assert result.get("parse_error") is True
assert result["estimated_actual_cost"] is None
assert result["estimated_shortfall"] is None

print("Invalid allocation test passed!")


# TEST 4: Missing specialist estimates are handled correctly.
fake_response["allocation"]["emergency_buffer"] = 2400

result = budget_module.budget_agent(
    sample_data,
    agent_results={},
)

assert result.get("parse_error") is not True

missing_prompt = captured_prompts[-1]

missing_estimates_text = missing_prompt.split(
    start_marker, 1
)[1].split(end_marker, 1)[0]

missing_estimates = json.loads(missing_estimates_text)

assert missing_estimates["accommodation"]["estimated_total_cost"] is None
assert missing_estimates["transport"]["estimated_total_cost"] is None
assert missing_estimates["food"]["estimated_total_food_cost"] is None
assert missing_estimates["activities"]["estimated_total_activity_cost"] is None

print("Missing specialist estimates test passed!")
print("Gemini API calls: 0 real calls (mocked)")


# TEST 5: Specialist costs exceed the user's budget.
fake_response["allocation"]["emergency_buffer"] = 2400
fake_response["estimated_actual_cost"] = 24750
fake_response["estimated_shortfall"] = 7750
fake_response["budget_feasible"] = False
fake_response["summary"] = "The trip exceeds the available budget."

result = budget_module.budget_agent(
    sample_data,
    agent_results={
        "accommodation": {
            "total_estimated_cost": 6000,
        },
        "transport": {
            "estimated_total_cost": 3700,
        },
        "food": {
            "food_plan": {
                "estimated_total_food_cost": 5250,
            }
        },
        "activities": {
            "plan": {
                "estimated_total_activity_cost": 9800,
            }
        },
    },
)

assert result["estimated_actual_cost"] == 24750
assert result["estimated_shortfall"] == 7750
assert result["budget_feasible"] is False

print("Budget overrun test passed!")