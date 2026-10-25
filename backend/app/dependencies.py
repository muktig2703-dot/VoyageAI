
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.login_session import LoginSession
from app.security import decode_access_token
from datetime import datetime, timezone
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(credentials.credentials)

    user_id = payload["sub"]
    session_id = payload.get("sid")

    # Reject tokens that are not linked to a login session.
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired login session. Please log in again.",
        )

    login_session = (
        db.query(LoginSession)
        .filter(
            LoginSession.id == session_id,
            LoginSession.user_id == user_id,
            LoginSession.is_revoked.is_(False),
        )
        .first()
    )

    if not login_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login session is no longer active. Please log in again.",
        )

    login_session.last_active_at = datetime.now(timezone.utc)
    db.commit()

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user