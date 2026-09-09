from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    id: int
    patient_id: int
    file_name: str
    file_type: str
    file_path: str
    ocr_text: str | None = None
    status: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# LAB REPORT

class LabReportCreate(BaseModel):
    patient_id: int
    document_id: int | None = None

    test_name: str
    result: str
    unit: str | None = None
    reference_range: str | None = None

    report_date: date | None = None

    status: str = "unknown"

    report_text: str | None = None


class LabReportResponse(BaseModel):
    id: int
    patient_id: int
    document_id: int | None = None

    test_name: str
    result: str
    unit: str | None = None
    reference_range: str | None = None

    report_date: date | None = None

    status: str

    report_text: str | None = None

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



# MEDICATION


class MedicationCreate(BaseModel):
    patient_id: int

    name: str
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    instructions: str | None = None

    route: str | None = None

    start_date: date | None = None
    end_date: date | None = None

    status: str = "active"


class MedicationResponse(BaseModel):
    id: int
    patient_id: int

    name: str
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    instructions: str | None = None

    route: str | None = None

    start_date: date | None = None
    end_date: date | None = None

    status: str

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)