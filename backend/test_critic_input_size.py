
import json

from app.agents.critic import _compact_critic_input


def measure_critic_input(agent_results, final_itinerary):
    critic_input = {
        "agent_results": agent_results,
        "final_itinerary": final_itinerary,
    }

    compacted = _compact_critic_input(critic_input)

    original_size = len(
        json.dumps(critic_input, ensure_ascii=False, default=str)
    )
    compacted_size = len(
        json.dumps(compacted, ensure_ascii=False, default=str)
    )

    print(f"Original input: {original_size:,} characters")
    print(f"Compacted input: {compacted_size:,} characters")
    print(f"Characters saved: {original_size - compacted_size:,}")


if __name__ == "__main__":
    print(
        "This helper is ready. Call measure_critic_input() "
        "with actual agent results and the final itinerary."
    )
