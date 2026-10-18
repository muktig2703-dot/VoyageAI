
import uuid

from fastapi.testclient import TestClient

from app.main import app
from app.database import get_db
from app.models.user import User

client = TestClient(app)

# Generate a unique email for this test run.
test_email = f"voyageai.test.{uuid.uuid4().hex[:12]}@example.com"
test_password = "VoyageAI-Test-Password-2026!"
test_name = "VoyageAI Test User"

created_account = False

try:
    # 1. SIGNUP
    signup_response = client.post(
        "/auth/signup",
        json={
            "name": test_name,
            "email": test_email,
            "password": test_password,
        },
    )

    print("\n1. SIGNUP")
    print("Status:", signup_response.status_code)
    print("Response:", signup_response.text)

    assert signup_response.status_code == 201, "Signup failed"
    created_account = True

    signup_data = signup_response.json()
    assert signup_data["email"] == test_email
    assert "password" not in signup_data
    assert "password_hash" not in signup_data

    print("PASS: Account created without exposing password data.")

    # 2. LOGIN
    login_response = client.post(
        "/auth/login",
        json={
            "email": test_email,
            "password": test_password,
        },
    )

    print("\n2. LOGIN")
    print("Status:", login_response.status_code)

    assert login_response.status_code == 200, "Login failed"

    login_data = login_response.json()
    token = login_data["access_token"]

    assert token
    assert login_data["token_type"].lower() == "bearer"
    assert login_data["user"]["email"] == test_email

    print("PASS: Login succeeded and an access token was returned.")

    # 3. ACCESS /auth/me WITH THE TOKEN
    me_response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    print("\n3. AUTH/ME")
    print("Status:", me_response.status_code)
    print("Response:", me_response.text)

    assert me_response.status_code == 200, "/auth/me failed"
    assert me_response.json()["email"] == test_email
    assert me_response.json()["name"] == test_name

    print("PASS: The token authenticated the correct user.")

    # 4. WRONG PASSWORD MUST BE REJECTED
    bad_login_response = client.post(
        "/auth/login",
        json={
            "email": test_email,
            "password": "Definitely-Wrong-Password!",
        },
    )

    print("\n4. WRONG PASSWORD")
    print("Status:", bad_login_response.status_code)

    assert bad_login_response.status_code == 401
    print("PASS: Incorrect password was rejected.")

except Exception as exc:
    print("\nTEST FAILED:", repr(exc))
    raise

finally:
    # Remove only the uniquely generated account from this test.
    if created_account:
        db_generator = get_db()
        db = next(db_generator)

        try:
            test_user = (
                db.query(User)
                .filter(User.email == test_email)
                .first()
            )

            if test_user:
                db.delete(test_user)
                db.commit()
                print("\nCLEANUP: Temporary test account deleted.")
        except Exception:
            db.rollback()
            print("\nCLEANUP FAILED: Check the database manually.")
            raise
        finally:
            db_generator.close()
