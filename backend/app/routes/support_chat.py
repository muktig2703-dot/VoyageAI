import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.support_chat import SupportConversation, SupportMessage
from app.models.user import User
from app.schemas.support_chat import (
    SupportChatRequest,
    SupportChatResponse,
)
from app.services.support_chat import get_support_reply

router = APIRouter(prefix="/support-chat", tags=["Support Chat"])
logger = logging.getLogger(__name__)


@router.post("/messages", response_model=SupportChatResponse)
def send_support_message(
    data: SupportChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = data.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Message cannot be empty.",
        )

    conversation = None

    if data.conversation_id:
        conversation = (
            db.query(SupportConversation)
            .filter(
                SupportConversation.id == data.conversation_id,
                SupportConversation.user_id == current_user.id,
            )
            .first()
        )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found.",
            )
    else:
        conversation = SupportConversation(user_id=current_user.id)
        db.add(conversation)

    try:
        # Obtain the new conversation ID before saving messages.
        db.flush()

        # Generate the answer using the existing Gemini service.
        reply = get_support_reply(message)

        user_message = SupportMessage(
            conversation_id=conversation.id,
            role="user",
            content=message,
        )

        assistant_message = SupportMessage(
            conversation_id=conversation.id,
            role="assistant",
            content=reply,
        )

        db.add_all([user_message, assistant_message])
        db.commit()
        db.refresh(user_message)

        return SupportChatResponse(
            conversation_id=conversation.id,
            user_message=user_message.content,
            assistant_reply=assistant_message.content,
            created_at=user_message.created_at,
        )

    except HTTPException:
        db.rollback()
        raise

    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("Failed to save support chat")
        raise HTTPException(
            status_code=500,
            detail="Could not save the chat. Please try again.",
        ) from exc

    except Exception as exc:
        db.rollback()
        logger.exception("Support AI request failed")
        raise HTTPException(
            status_code=503,
            detail="The support assistant is temporarily unavailable. Please try again.",
        ) from exc