from datetime import datetime

from pydantic import BaseModel


class PhysicianCreate(BaseModel):
    full_name: str
    specialization: str | None = None
    registration_number: str | None = None


class PhysicianResponse(PhysicianCreate):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }


class PhysicianPatientResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    dob: datetime | None = None
    gender: str | None = None
    phone: str | None = None

    model_config = {
        "from_attributes": True
    }


class PhysicianSummaryUpdate(BaseModel):
    summary: str
    physician_notes: str | None = None


class PhysicianSummaryAction(BaseModel):
    physician_notes: str | None = None


class PhysicianSummaryResponse(BaseModel):
    id: int
    patient_id: int
    conversation_id: int | None
    summary: str
    status: str
    physician_notes: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }