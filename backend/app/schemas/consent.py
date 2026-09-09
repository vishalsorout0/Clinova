from datetime import datetime

from pydantic import BaseModel


class ConsentCreate(BaseModel):
    patient_id: int
    physician_id: int
    consent_type: str
    granted: bool


class ConsentResponse(BaseModel):
    id: int
    patient_id: int
    physician_id: int | None
    consent_type: str
    granted: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }