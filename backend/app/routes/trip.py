
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from google.genai.errors import APIError
from app.database import get_db
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import TripCreate
from app.agents.orchestrator import orchestrate_trip
from app.dependencies import get_current_user


router = APIRouter(prefix="/trip", tags=["Trip"])


@router.post("")
def create_trip(
    data: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Generate the itinerary before attempting persistence.
    try:
        result = orchestrate_trip(data.model_dump())

    except APIError as exc:
        # The SDK exposes the HTTP status code directly.
        if exc.code == 429:
            raise HTTPException(
                status_code=429,
                detail=(
                    "The AI service has reached its usage limit. "
                    "Please try again later."
                ),
            ) from exc

        # Avoid exposing provider details to the client.
        raise HTTPException(
            status_code=503,
            detail=(
                "VoyageAI could not generate the trip right now. "
                "Please try again later."
            ),
        ) from exc

    except Exception as exc:
        # Handle unexpected workflow or application errors.
        raise HTTPException(
            status_code=503,
            detail=(
                "VoyageAI could not generate the trip right now. "
                "Please try again later."
            ),
        ) from exc

    if not isinstance(result, dict):
        raise HTTPException(
            status_code=503,
            detail="VoyageAI returned an invalid generation result.",
        )

    final_itinerary = result.get("itinerary")
    review = result.get("review")

    # Do not save an absent or explicitly invalid itinerary.
    if (
        not isinstance(final_itinerary, dict)
        or final_itinerary.get("parse_error")
        or final_itinerary.get("error")
        or not isinstance(review, dict)
    ):
        raise HTTPException(
            status_code=503,
            detail=(
                "VoyageAI could not produce a valid itinerary. "
                "Please try again later."
            ),
        )

    approved = review.get("approved") is True
    trip_status = "completed" if approved else "needs_review"
    review_status = "approved" if approved else "needs_review"

    # Normalize the review status in the saved result.
    result["review"] = {
        **review,
        "status": review_status,
    }

    trip = Trip(
        user_id=current_user.id,
        destination=data.destination,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=data.budget,
        travel_style=data.travel_style,
        interests=data.interests,
        status=trip_status,
        itinerary=result,
    )

    try:
        db.add(trip)
        db.commit()
        db.refresh(trip)

    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="The trip was generated but could not be saved.",
        ) from exc

    return {
        "id": str(trip.id),
        "status": trip.status,
        "review_status": review_status,
    }


@router.get("/{trip_id}")
def get_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == current_user.id,
        )
        .first()
    )

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    return {
        "id": str(trip.id),
        "destination": trip.destination,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "budget": trip.budget,
        "travel_style": trip.travel_style,
        "interests": trip.interests,
        "status": trip.status,
        "itinerary": trip.itinerary,
    }
