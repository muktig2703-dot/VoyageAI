
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.trip import Trip
from app.schemas.trip import TripCreate
from app.agents.orchestrator import orchestrate_trip

router = APIRouter(prefix="/trip", tags=["Trip"])


@router.post("")
def create_trip(data: TripCreate, db: Session = Depends(get_db)):
    itinerary = orchestrate_trip(data.model_dump())

    trip = Trip(
        destination=data.destination,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=data.budget,
        travel_style=data.travel_style,
        interests=data.interests,
        status="completed",
        itinerary=itinerary
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)

    return {
        "id": str(trip.id),
        "status": trip.status
    }


@router.get("/{trip_id}")
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.get(Trip, trip_id)

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    return trip