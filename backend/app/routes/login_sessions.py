
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.login_session import LoginSession
from app.models.user import User
from app.security import decode_access_token

router = APIRouter(
    prefix="/auth/sessions",
    tags=["Login Sessions"],
)

security = HTTPBearer()


@router.get("")
def list_sessions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(credentials.credentials)
    current_session_id = payload.get("sid")

    sessions = (
        db.query(LoginSession)
        .filter(
            LoginSession.user_id == current_user.id,
            LoginSession.is_revoked.is_(False),
        )
        .order_by(LoginSession.last_active_at.desc())
        .all()
    )

    return [
        {
            "id": str(session.id),
            "device_name": session.device_name,
            "created_at": session.created_at,
            "last_active_at": session.last_active_at,
            "is_current": str(session.id) == current_session_id,
        }
        for session in sessions
    ]


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_session(
    session_id: UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(credentials.credentials)

    if str(session_id) == payload.get("sid"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot revoke your current session here.",
        )

    session = (
        db.query(LoginSession)
        .filter(
            LoginSession.id == session_id,
            LoginSession.user_id == current_user.id,
            LoginSession.is_revoked.is_(False),
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active session not found.",
        )

    session.is_revoked = True
    db.commit()

    return None