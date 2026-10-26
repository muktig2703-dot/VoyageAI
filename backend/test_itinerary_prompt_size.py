
import json

from app.agents.itinerary import _compact_agent_results


def test_compaction_size():
    sample_results = {
        "destination": {
            "highlights": ["Beach", "Museum"],
            "source_weather": {"raw": "x" * 10000},
            "source_events": {"raw": "y" * 10000},
        },
        "food": {
            "recommendations": ["Local restaurant", "Street food"],
        },
    }

    original_size = len(
        json.dumps(sample_results, ensure_ascii=False, default=str)
    )

    compacted = _compact_agent_results(sample_results)

    compacted_size = len(
        json.dumps(compacted, ensure_ascii=False, default=str)
    )

    print(f"Original sample size: {original_size} characters")
    print(f"Compacted sample size: {compacted_size} characters")
    print(f"Characters removed: {original_size - compacted_size}")

    assert "source_weather" not in compacted["destination"]
    assert "source_events" not in compacted["destination"]
    assert compacted["destination"]["highlights"] == ["Beach", "Museum"]
    assert compacted["food"]["recommendations"] == [
        "Local restaurant",
        "Street food",
    ]

    print("Itinerary compaction test passed!")
    print("Real Gemini API calls: 0")


if __name__ == "__main__":
    test_compaction_size()
