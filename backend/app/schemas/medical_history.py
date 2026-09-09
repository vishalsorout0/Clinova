from datetime import datetime

from pydantic import BaseModel


class MedicalHistoryCreate(BaseModel):
    patient_id: int
    conversation_id: int | None = None
    chief_complaint: str | None = None
    history_of_present_illness: str | None = None
    past_medical_history: str | None = None
    past_surgical_history: str | None = None
    allergies: str | None = None
    family_history: str | None = None
    personal_history: str | None = None
    review_of_systems: str | None = None


class MedicalHistoryUpdate(BaseModel):
    chief_complaint: str | None = None
    history_of_present_illness: str | None = None
    past_medical_history: str | None = None
    past_surgical_history: str | None = None
    allergies: str | None = None
    family_history: str | None = None
    personal_history: str | None = None
    review_of_systems: str | None = None


class MedicalHistoryResponse(BaseModel):
    id: int
    patient_id: int
    conversation_id: int | None
    chief_complaint: str | None
    history_of_present_illness: str | None
    past_medical_history: str | None
    past_surgical_history: str | None
    allergies: str | None
    family_history: str | None
    personal_history: str | None
    review_of_systems: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class TimelineItem(BaseModel):
    type: str
    date: datetime
    title: str
    data: dict


class MedicalTimelineResponse(BaseModel):
    patient_id: int
    items: list[TimelineItem]