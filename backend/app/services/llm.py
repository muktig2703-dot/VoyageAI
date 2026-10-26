import logging
import time
from contextvars import ContextVar
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings

logger = logging.getLogger(__name__)
gemini_call_count = 0
current_trip_calls = ContextVar(
    "current_trip_calls",
    default=None,
)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.7,
    max_retries=0,
)

def invoke_gemini(prompt):
    """Invoke Gemini and log call number, latency, and token usage."""
    global gemini_call_count
    gemini_call_count += 1
    trip_counter = current_trip_calls.get()
    if trip_counter is not None:
        trip_counter[0] += 1
    call_number = gemini_call_count
    start = time.perf_counter()

    logger.info("Gemini call #%s started", call_number)

    try:
        logger.info("Critic prompt size: %s characters", len(prompt))
        response = llm.invoke(prompt)
    except Exception:
        elapsed = time.perf_counter() - start
        logger.exception(
            "Gemini call #%s failed after %.2f seconds",
            call_number,
            elapsed,
        )
        raise

    elapsed = time.perf_counter() - start
    usage = getattr(response, "usage_metadata", None)

    if usage:
        logger.info(
            "Gemini call #%s completed in %.2fs | input_tokens=%s | "
            "output_tokens=%s | total_tokens=%s",
            call_number,
            elapsed,
            usage.get("input_tokens", "unknown"),
            usage.get("output_tokens", "unknown"),
            usage.get("total_tokens", "unknown"),
        )
    else:
        logger.info(
            "Gemini call #%s completed in %.2fs | token usage unavailable",
            call_number,
            elapsed,
        )

    return response