
from datetime import date, timedelta

from pydantic import ValidationError
from app.schemas.trip import TripCreate


base = {
    "destination": "Goa",
    "start_date": date.today() + timedelta(days=2),
    "end_date": date.today() + timedelta(days=5),
    "budget": 20000,
    "travel_style": "relaxed",
    "interests": ["beaches"],
}

# A valid request should be accepted.
trip = TripCreate(**base)
print("Valid input: PASSED")

tests = [
    (
        "Past start date",
        {**base, "start_date": date.today() - timedelta(days=1)},
    ),
    (
        "End date before start date",
        {
            **base,
            "start_date": date.today() + timedelta(days=5),
            "end_date": date.today() + timedelta(days=2),
        },
    ),
    ("Zero budget", {**base, "budget": 0}),
    ("Empty interests", {**base, "interests": []}),
]

for name, data in tests:
    try:
        TripCreate(**data)
        print(f"{name}: FAILED (input was accepted)")
    except ValidationError:
        print(f"{name}: PASSED (input was rejected)")
