
from langgraph.graph import END

from app.agents.workflow import review_router, MAX_REVIEW_ATTEMPTS


def test_review_router():
    # Case 1: An approved itinerary should finish.
    approved_state = {
        "review": {"approved": True},
        "review_attempts": 0,
    }
    assert review_router(approved_state) == END

    # Case 2: A rejected itinerary should allow one revision.
    rejected_state = {
        "review": {"approved": False},
        "review_attempts": 0,
    }
    assert review_router(rejected_state) == "revise_itinerary"
    assert rejected_state["review_attempts"] == 1

    # Case 3: A second rejection should finish.
    rejected_again_state = {
        "review": {"approved": False},
        "review_attempts": MAX_REVIEW_ATTEMPTS,
    }
    assert review_router(rejected_again_state) == END

    # Case 4: Invalid critic output should finish immediately.
    invalid_state = {
        "review": {
            "approved": False,
            "validation_error": True,
        },
        "review_attempts": 0,
    }
    assert review_router(invalid_state) == END

    print("Review router tests passed!")
    print("Approved itinerary: finish")
    print("Rejected itinerary: one revision allowed")
    print("Second rejection: finish")
    print("Invalid critic response: finish")


if __name__ == "__main__":
    test_review_router()
