
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import EmailStr

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import ProfileResponse, ProfileUpdate


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return ProfileResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        date_of_birth=current_user.date_of_birth,
        gender=current_user.gender,
        nationality=current_user.nationality,
        city=current_user.city,
        state=current_user.state
    )


@router.patch("/me", response_model=ProfileResponse)
def update_my_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updates = data.model_dump(exclude_unset=True)

    if "name" in updates:
        name = updates["name"]

        if name is None or not name.strip():
            raise HTTPException(
                status_code=400,
                detail="Name cannot be empty"
            )

        updates["name"] = name.strip()

    for field, value in updates.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return ProfileResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        date_of_birth=current_user.date_of_birth,
        gender=current_user.gender,
        nationality=current_user.nationality,
        city=current_user.city,
        state=current_user.state
    )
