from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ConversationCreate(BaseModel):
    patient_id: int
    language: str = Field(min_length=1, max_length=50)
    session_id: int | None = None


class MessageCreate(BaseModel):
    content: str = Field(min_length=1)
    input_type: Literal["text", "voice", "touch"] = "text"


class MessageResponse(BaseModel):
    role: Literal["patient", "assistant"]
    content: str
    input_type: Literal["text", "voice", "touch"]
    timestamp: str


class ConversationResponse(BaseModel):
    id: int
    patient_id: int
    session_id: int | None
    language: str
    status: str
    messages: list[MessageResponse]
    started_at: datetime
    completed_at: datetime | None

    model_config = {
        "from_attributes": True
    }