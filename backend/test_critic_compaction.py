
from app.agents.critic import _compact_critic_input


def test_critic_compaction():
    sample = {
        "agent_results": {
            "destination": {
                "highlights": ["Beach", "Museum"],
                "source_weather": {"raw": "large payload"},
            },
            "food": {
                "recommendations": ["Local food"],
                "raw_response": "large payload",
            },
        },
        "final_itinerary": {
            "days": [{"date": "2026-12-01"}],
            "notes": {"debug": "internal data"},
        },
    }

    compacted = _compact_critic_input(sample)

    assert "source_weather" not in compacted["agent_results"]["destination"]
    assert "raw_response" not in compacted["agent_results"]["food"]
    assert "debug" not in compacted["final_itinerary"]["notes"]

    assert compacted["agent_results"]["destination"]["highlights"] == [
        "Beach", "Museum"
    ]
    assert compacted["agent_results"]["food"]["recommendations"] == [
        "Local food"
    ]
    assert compacted["final_itinerary"]["days"] == [
        {"date": "2026-12-01"}
    ]

    # Ensure the original input was not mutated.
    assert "source_weather" in sample["agent_results"]["destination"]

    print("Critic compaction test passed!")
    print("Useful planning fields preserved.")
    print("Real Gemini API calls: 0")


if __name__ == "__main__":
    test_critic_compaction()
