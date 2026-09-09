from datetime import datetime

from pydantic import BaseModel


class ClinicalSummaryCreate(BaseModel):
    patient_id: int
    conversation_id: int | None = None
    summary: str


class ClinicalSummaryResponse(ClinicalSummaryCreate):
    id: int
    status: str
    physician_notes: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class ClinicalSummaryGenerate(BaseModel):
    patient_id: int
    conversation_id: int | None = None