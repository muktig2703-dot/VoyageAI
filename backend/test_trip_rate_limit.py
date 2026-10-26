
from unittest.mock import patch, MagicMock

from fastapi import HTTPException
from langchain_google_genai.chat_models import GoogleRateLimitError

from app.routes.trip import create_trip


def test_gemini_rate_limit_returns_429():
    # Simulate the Gemini rate-limit exception.
    fake_error = GoogleRateLimitError("Simulated quota exceeded")

    fake_data = MagicMock()
    fake_data.model_dump.return_value = {
        "destination": "Goa",
        "start_date": "2026-12-01",
        "end_date": "2026-12-05",
        "budget": 20000,
        "travel_style": "relaxed",
        "interests": ["beaches"],
    }

    try:
        with patch(
            "app.routes.trip.orchestrate_trip",
            side_effect=fake_error,
        ):
            create_trip(
                data=fake_data,
                db=MagicMock(),
                current_user=MagicMock(),
            )

    except HTTPException as exc:
        assert exc.status_code == 429, (
            f"Expected 429, got {exc.status_code}"
        )
        assert "usage limit" in exc.detail.lower()
        print("Rate-limit handler test passed!")
        print("HTTP status: 429")
        print("Real Gemini API calls: 0")
        return

    raise AssertionError("Expected HTTPException was not raised")


if __name__ == "__main__":
    test_gemini_rate_limit_returns_429()
