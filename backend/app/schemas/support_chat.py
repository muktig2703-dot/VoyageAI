from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SupportChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    conversation_id: UUID | None = None


class SupportChatResponse(BaseModel):
    conversation_id: UUID
    user_message: str
    assistant_reply: str
    created_at: datetime