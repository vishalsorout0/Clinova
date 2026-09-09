from pathlib import Path
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.lab_report import LabReport
from app.models.medication import Medication
from app.schemas.document import LabReportCreate, MedicationCreate
from fastapi import HTTPException
from app.models.patient import Patient






UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024

ALLOWED_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


def save_document(
    db: Session,
    patient_id: int,
    original_filename: str,
    content_type: str,
    content: bytes,
) -> Document:
    if content_type not in ALLOWED_TYPES:
        raise ValueError("Unsupported file type")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError("File size exceeds 10 MB limit")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    extension = ALLOWED_TYPES[content_type]
    unique_filename = f"{uuid4().hex}{extension}"

    file_path = UPLOAD_DIR / unique_filename
    file_path.write_bytes(content)

    document = Document(
        patient_id=patient_id,
        file_name=original_filename,
        file_type=content_type,
        file_path=str(file_path),
        status="uploaded",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_document(
    db: Session,
    document_id: int,
) -> Document | None:
    return db.query(Document).filter(
        Document.id == document_id
    ).first()


def get_patient_documents(
    db: Session,
    patient_id: int,
) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.patient_id == patient_id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )


def delete_document(
    db: Session,
    document: Document,
):
    path = Path(document.file_path)

    if path.exists():
        path.unlink()

    db.delete(document)
    db.commit()


def create_lab_report(
    db: Session,
    data: LabReportCreate,
) -> LabReport:
    lab_report = LabReport(
        patient_id=data.patient_id,
        document_id=data.document_id,
        test_name=data.test_name,
        result=data.result,
        unit=data.unit,
        reference_range=data.reference_range,
        report_date=data.report_date,
        status=data.status,
        report_text=data.report_text,
    )

    db.add(lab_report)
    db.commit()
    db.refresh(lab_report)

    return lab_report


def get_patient_lab_reports(
    db: Session,
    patient_id: int,
) -> list[LabReport]:
    return db.scalars(
        select(LabReport)
        .where(LabReport.patient_id == patient_id)
        .order_by(LabReport.created_at.desc())
    ).all()


def get_lab_report(
    db: Session,
    lab_report_id: int,
) -> LabReport | None:
    return db.scalar(
        select(LabReport).where(
            LabReport.id == lab_report_id
        )
    )


def create_medication(
    db: Session,
    data: MedicationCreate,
) -> Medication:
    medication = Medication(
        patient_id=data.patient_id,
        name=data.name,
        dosage=data.dosage,
        frequency=data.frequency,
        duration=data.duration,
        instructions=data.instructions,
        route=data.route,
        start_date=data.start_date,
        end_date=data.end_date,
        status=data.status,
    )

    db.add(medication)
    db.commit()
    db.refresh(medication)

    return medication


def get_patient_medications(
    db: Session,
    patient_id: int,
) -> list[Medication]:
    return db.scalars(
        select(Medication)
        .where(Medication.patient_id == patient_id)
        .order_by(Medication.created_at.desc())
    ).all()


def get_medication(
    db: Session,
    medication_id: int,
) -> Medication | None:
    return db.scalar(
        select(Medication).where(
            Medication.id == medication_id
        )
    )













def verify_patient_access(
    db: Session,
    patient_id: int,
    user_id: int,
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.user_id == user_id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    return patient