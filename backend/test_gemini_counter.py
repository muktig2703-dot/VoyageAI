
import logging
from io import StringIO
from unittest.mock import patch, MagicMock

from app.services import llm as llm_service
from app.agents.orchestrator import orchestrate_trip


def test_trip_gemini_call_count():
    fake_result = {
        "final_itinerary": {"days": []},
        "itinerary": {},
        "review": {},
        "progress": {},
    }

    fake_response = MagicMock()
    fake_response.usage_metadata = None

    log_stream = StringIO()
    handler = logging.StreamHandler(log_stream)
    logger = logging.getLogger("app.agents.orchestrator")
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

    try:
        with patch(
            "app.agents.orchestrator.travel_graph.invoke"
        ) as mock_graph:
            def fake_workflow(state):
                llm_service.invoke_gemini("test prompt 1")
                llm_service.invoke_gemini("test prompt 2")
                return fake_result

            mock_graph.side_effect = fake_workflow

            with patch(
                "app.services.llm.ChatGoogleGenerativeAI.invoke",
                return_value=fake_response,
            ):
                orchestrate_trip({"destination": "Test"})

        log_output = log_stream.getvalue()

        assert mock_graph.call_count == 1
        assert "Gemini calls used for this trip: 2" in log_output

        print("Per-trip counter test passed!")
        print("Simulated Gemini calls: 2")
        print("Real API calls: 0")

    finally:
        logger.removeHandler(handler)
        handler.close()


if __name__ == "__main__":
    test_trip_gemini_call_count()
