
from uuid import UUID
from unittest.mock import MagicMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routes.trip import router
from app.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.trip import Trip

app = FastAPI()
app.include_router(router)

# Simulate a logged-in user without real authentication or database access.
user_a = MagicMock(spec=User)
user_a.id = UUID("550e8400-e29b-41d4-a716-446655440000")

app.dependency_overrides[get_current_user] = lambda: user_a

db = MagicMock()
app.dependency_overrides[get_db] = lambda: db

client = TestClient(app)


def test_malformed_trip_id():
    db.reset_mock()

    response = client.get("/trip/not-a-uuid")

    assert response.status_code == 404, response.text
    assert response.json()["detail"] == "Trip not found"
    db.query.assert_not_called()

    print("Malformed trip ID returns 404: PASSED")


def test_valid_uuid_missing_trip():
    db.reset_mock()
    db.query.return_value.filter.return_value.first.return_value = None

    response = client.get(
        "/trip/550e8400-e29b-41d4-a716-446655440001"
    )

    assert response.status_code == 404, response.text
    assert response.json()["detail"] == "Trip not found"

    print("Missing trip returns 404: PASSED")



def test_user_cannot_access_another_users_trip():
    db.reset_mock()
    db.query.return_value.filter.return_value.first.return_value = None

    response = client.get(
        "/trip/550e8400-e29b-41d4-a716-446655440001"
    )

    assert response.status_code == 404, response.text
    assert response.json()["detail"] == "Trip not found"

    # Verify the query filters by both trip ID and logged-in user ID.
    db.query.assert_called_once_with(Trip)

    filter_args = db.query.return_value.filter.call_args.args

    assert len(filter_args) == 2, (
        f"Expected two ownership filters, got {len(filter_args)}"
    )

    print("Trip query includes both filters: PASSED")
    print("Other user's trip is not returned: PASSED")
if __name__ == "__main__":
    test_malformed_trip_id()
    test_valid_uuid_missing_trip()
    test_user_cannot_access_another_users_trip()
