import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class CallbackRequest(Base):
    __tablename__ = "callback_requests"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
    UUID(as_uuid=True),
    ForeignKey("users.id"),
    nullable=True,
    index=True,
)

    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    preferred_time = Column(String(50), nullable=False)

    consent_given = Column(Boolean, nullable=False, default=False)

    status = Column(
        String(20),
        nullable=False,
        default="pending",
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
