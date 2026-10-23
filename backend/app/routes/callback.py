
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.callback_request import CallbackRequest
from app.models.user import User
from app.schemas.callback_request import (
    CallbackRequestCreate,
    CallbackRequestResponse,
)

router = APIRouter(prefix="/callback", tags=["Callback"])
logger = logging.getLogger(__name__)


@router.post("", response_model=CallbackRequestResponse, status_code=201)
def create_callback_request(
    data: CallbackRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    callback = CallbackRequest(
    user_id=current_user.id,
    name=data.name.strip(),
    phone=data.phone,
    preferred_time=data.preferred_time,
    consent_given=data.consent_given,
    status="pending",
)

    if not callback.name:
        raise HTTPException(
            status_code=422,
            detail="Name cannot be empty.",
        )

    try:
        db.add(callback)
        db.commit()
        db.refresh(callback)

    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("Failed to save callback request")
        raise HTTPException(
            status_code=500,
            detail="Could not save your callback request. Please try again.",
        ) from exc

    return callback
