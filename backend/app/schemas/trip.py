
from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field


class TripCreate(BaseModel):
    destination: str = Field(..., min_length=2)
    start_date: date
    end_date: date
    budget: int = Field(..., gt=0)
    travel_style: str
    interests: List[str]


class TripResponse(BaseModel):
    id: str
    status: str


class TripDetail(BaseModel):
    id: str
    destination: str
    start_date: date
    end_date: date
    budget: int
    travel_style: str
    interests: List[str]
    status: str
    itinerary: Optional[dict] = None

    class Config:
        from_attributes = True