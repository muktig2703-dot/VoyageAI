
import re
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class CallbackRequestCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=7, max_length=25)
    preferred_time: str = Field(min_length=1, max_length=50)
    consent_given: bool

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        normalized = re.sub(r"[\s()-]", "", value)

        if not re.fullmatch(r"\+?[0-9]{7,15}", normalized):
            raise ValueError("Enter a valid phone number.")

        return normalized

    @field_validator("consent_given")
    @classmethod
    def require_consent(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Consent is required to submit a callback request.")
        return value


class CallbackRequestResponse(BaseModel):
    id: UUID
    name: str
    preferred_time: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}