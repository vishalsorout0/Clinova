from sqlalchemy.orm import Session

from app.models.medical_history import MedicalHistory
from app.schemas.medical_history import (
    MedicalHistoryCreate,
    MedicalHistoryUpdate,
)
from datetime import datetime, time

from sqlalchemy.orm import Session

from app.models.medical_history import MedicalHistory
from app.models.conversation import Conversation
from app.models.document import Document
from app.models.lab_report import LabReport
from app.models.medication import Medication
from app.models.clinical_summary import ClinicalSummary
from app.schemas.medical_history import (
    MedicalHistoryCreate,
    MedicalHistoryUpdate,
)











def create_medical_history(
    db: Session,
    data: MedicalHistoryCreate,
) -> MedicalHistory:
    history = MedicalHistory(
        patient_id=data.patient_id,
        conversation_id=data.conversation_id,
        chief_complaint=data.chief_complaint,
        history_of_present_illness=data.history_of_present_illness,
        past_medical_history=data.past_medical_history,
        past_surgical_history=data.past_surgical_history,
        allergies=data.allergies,
        family_history=data.family_history,
        personal_history=data.personal_history,
        review_of_systems=data.review_of_systems,
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_medical_history(
    db: Session,
    history_id: int,
) -> MedicalHistory | None:
    return (
        db.query(MedicalHistory)
        .filter(MedicalHistory.id == history_id)
        .first()
    )


def get_patient_medical_histories(
    db: Session,
    patient_id: int,
) -> list[MedicalHistory]:
    return (
        db.query(MedicalHistory)
        .filter(MedicalHistory.patient_id == patient_id)
        .order_by(MedicalHistory.created_at.desc())
        .all()
    )


def update_medical_history(
    db: Session,
    history: MedicalHistory,
    data: MedicalHistoryUpdate,
) -> MedicalHistory:
    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(history, field, value)

    db.commit()
    db.refresh(history)

    return history


def get_patient_timeline(
    db: Session,
    patient_id: int,
) -> list[dict]:
    timeline = []

    histories = (
        db.query(MedicalHistory)
        .filter(MedicalHistory.patient_id == patient_id)
        .all()
    )

    for history in histories:
        timeline.append(
            {
                "type": "medical_history",
                "date": history.created_at,
                "title": "Medical History",
                "data": {
                    "id": history.id,
                    "conversation_id": history.conversation_id,
                    "chief_complaint": history.chief_complaint,
                    "history_of_present_illness": history.history_of_present_illness,
                    "past_medical_history": history.past_medical_history,
                    "past_surgical_history": history.past_surgical_history,
                    "allergies": history.allergies,
                    "family_history": history.family_history,
                    "personal_history": history.personal_history,
                    "review_of_systems": history.review_of_systems,
                },
            }
        )

    conversations = (
        db.query(Conversation)
        .filter(Conversation.patient_id == patient_id)
        .all()
    )

    for conversation in conversations:
        timeline.append(
            {
                "type": "conversation",
                "date": conversation.started_at,
                "title": "Clinical Conversation",
                "data": {
                    "id": conversation.id,
                    "language": conversation.language,
                    "status": conversation.status,
                    "session_id": conversation.session_id,
                    "completed_at": conversation.completed_at,
                },
            }
        )

    documents = (
        db.query(Document)
        .filter(Document.patient_id == patient_id)
        .all()
    )

    for document in documents:
        timeline.append(
            {
                "type": "document",
                "date": document.uploaded_at,
                "title": "Medical Document",
                "data": {
                    "id": document.id,
                    "file_name": document.file_name,
                    "file_type": document.file_type,
                    "status": document.status,
                },
            }
        )

    lab_reports = (
        db.query(LabReport)
        .filter(LabReport.patient_id == patient_id)
        .all()
    )

    for report in lab_reports:
        report_date = (
            datetime.combine(report.report_date, time.min)
            if report.report_date
            else report.created_at
        )

        timeline.append(
            {
                "type": "lab_report",
                "date": report_date,
                "title": report.test_name,
                "data": {
                    "id": report.id,
                    "document_id": report.document_id,
                    "test_name": report.test_name,
                    "result": report.result,
                    "unit": report.unit,
                    "reference_range": report.reference_range,
                    "report_date": report.report_date,
                    "status": report.status,
                    "report_text": report.report_text,
                },
            }
        )

    medications = (
        db.query(Medication)
        .filter(Medication.patient_id == patient_id)
        .all()
    )

    for medication in medications:
        medication_date = (
            datetime.combine(medication.start_date, time.min)
            if medication.start_date
            else medication.created_at
        )

        timeline.append(
            {
                "type": "medication",
                "date": medication_date,
                "title": medication.name,
                "data": {
                    "id": medication.id,
                    "name": medication.name,
                    "dosage": medication.dosage,
                    "frequency": medication.frequency,
                    "duration": medication.duration,
                    "instructions": medication.instructions,
                    "route": medication.route,
                    "start_date": medication.start_date,
                    "end_date": medication.end_date,
                    "status": medication.status,
                },
            }
        )

    summaries = (
        db.query(ClinicalSummary)
        .filter(ClinicalSummary.patient_id == patient_id)
        .all()
    )

    for summary in summaries:
        timeline.append(
            {
                "type": "clinical_summary",
                "date": summary.created_at,
                "title": "Clinical Summary",
                "data": {
                    "id": summary.id,
                    "conversation_id": summary.conversation_id,
                    "summary": summary.summary,
                    "status": summary.status,
                    "physician_notes": summary.physician_notes,
                },
            }
        )

    timeline.sort(
        key=lambda item: item["date"],
        reverse=True,
    )

    return timeline