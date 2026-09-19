from datetime import datetime

from pydantic import BaseModel

from app.schemas.patient import PatientResponse
from app.schemas.medical_history import (
    MedicalHistoryResponse,
    TimelineItem,
)
from app.schemas.document import (
    DocumentResponse,
    LabReportResponse,
    MedicationResponse,
)
from app.schemas.conversation import ConversationResponse


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


class PhysicianPatientRecordsResponse(BaseModel):
    patient: PatientResponse

    medical_history: list[
        MedicalHistoryResponse
    ]

    documents: list[
        DocumentResponse
    ]

    lab_reports: list[
        LabReportResponse
    ]

    medications: list[
        MedicationResponse
    ]

    conversations: list[
        ConversationResponse
    ]

    summaries: list[
        PhysicianSummaryResponse
    ]

    timeline: list[
        TimelineItem
    ]