
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.co_traveller import CoTraveller
from app.schemas.co_traveller import (
    CoTravellerCreate,
    CoTravellerUpdate,
    CoTravellerResponse,
)

router = APIRouter(prefix="/co-travellers", tags=["Co-Travellers"])


@router.get("", response_model=list[CoTravellerResponse])
def list_co_travellers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(CoTraveller)
        .filter(CoTraveller.user_id == current_user.id)
        .order_by(CoTraveller.created_at.desc())
        .all()
    )


@router.post(
    "",
    response_model=CoTravellerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_co_traveller(
    data: CoTravellerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    name = data.name.strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Name cannot be empty.",
        )

    companion = CoTraveller(
        user_id=current_user.id,
        name=name,
        relationship=data.relationship,
        age=data.age,
        gender=data.gender,
    )

    db.add(companion)
    db.commit()
    db.refresh(companion)
    return companion


@router.patch("/{companion_id}", response_model=CoTravellerResponse)
def update_co_traveller(
    companion_id: UUID,
    data: CoTravellerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    companion = (
        db.query(CoTraveller)
        .filter(
            CoTraveller.id == companion_id,
            CoTraveller.user_id == current_user.id,
        )
        .first()
    )

    if companion is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Co-traveller not found.",
        )

    updates = data.model_dump(exclude_unset=True)

    if "name" in updates:
        name = updates["name"]
        if name is None or not name.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Name cannot be empty.",
            )
        updates["name"] = name.strip()

    for field, value in updates.items():
        setattr(companion, field, value)

    db.commit()
    db.refresh(companion)
    return companion


@router.delete("/{companion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_co_traveller(
    companion_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    companion = (
        db.query(CoTraveller)
        .filter(
            CoTraveller.id == companion_id,
            CoTraveller.user_id == current_user.id,
        )
        .first()
    )

    if companion is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Co-traveller not found.",
        )

    db.delete(companion)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
