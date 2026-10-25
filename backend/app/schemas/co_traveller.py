
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class CoTravellerCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    relationship: Optional[str] = Field(default=None, max_length=40)
    age: Optional[int] = Field(default=None, ge=0, le=120)
    gender: Optional[str] = Field(default=None, max_length=30)


class CoTravellerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    relationship: Optional[str] = Field(default=None, max_length=40)
    age: Optional[int] = Field(default=None, ge=0, le=120)
    gender: Optional[str] = Field(default=None, max_length=30)


class CoTravellerResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    relationship: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
