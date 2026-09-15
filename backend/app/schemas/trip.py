from datetime import date
from typing import List

from pydantic import BaseModel


class TripCreate(BaseModel):
    destination: str
    start_date: date
    end_date: date
    budget: int
    travel_style: str
    interests: List[str]


class TripResponse(BaseModel):
    id: str
    status: str