import uuid
from sqlalchemy import Column, String, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    phone = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(30), nullable=True)
    nationality = Column(String(80), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )