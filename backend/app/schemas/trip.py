
from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class TripCreate(BaseModel):
    destination: str = Field(..., min_length=2, max_length=150)
    start_date: date
    end_date: date
    budget: int = Field(..., gt=0)
    travel_style: str = Field(..., min_length=2, max_length=50)
    interests: List[str] = Field(..., min_length=1, max_length=20)

    @model_validator(mode="after")
    def validate_trip_dates(self):
        today = date.today()

        if self.start_date < today:
            raise ValueError("Trip start date must be today or in the future.")

        if self.end_date < self.start_date:
            raise ValueError("Trip end date cannot be before the start date.")

        return self


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
