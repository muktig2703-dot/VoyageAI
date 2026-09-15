import uuid

from sqlalchemy import Column, Date, Integer, String, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    destination = Column(String, nullable=False)

    start_date = Column(Date)

    end_date = Column(Date)

    budget = Column(Integer)

    travel_style = Column(String)

    interests = Column(JSON)

    status = Column(String, default="planning")

    itinerary = Column(JSON, nullable=True)