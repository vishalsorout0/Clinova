from sqlalchemy.orm import Session

from app.models.clinical_summary import ClinicalSummary
from app.models.conversation import Conversation
from app.models.document import Document
from app.models.lab_report import LabReport
from app.models.medical_history import MedicalHistory
from app.models.medication import Medication
from app.schemas.summary import ClinicalSummaryCreate
from app.services.ai_service import (
    detect_red_flags,
    extract_structured_information,
    generate_clinical_summary,
)


def create_clinical_summary(
    db: Session,
    data: ClinicalSummaryCreate,
) -> ClinicalSummary:
    summary = ClinicalSummary(
        patient_id=data.patient_id,
        conversation_id=data.conversation_id,
        summary=data.summary,
        status="draft",
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    return summary


def get_clinical_summary(
    db: Session,
    summary_id: int,
) -> ClinicalSummary | None:
    return db.query(ClinicalSummary).filter(
        ClinicalSummary.id == summary_id
    ).first()


def get_patient_summaries(
    db: Session,
    patient_id: int,
) -> list[ClinicalSummary]:
    return db.query(ClinicalSummary).filter(
        ClinicalSummary.patient_id == patient_id
    ).order_by(
        ClinicalSummary.created_at.desc()
    ).all()


def update_clinical_summary(
    db: Session,
    summary: ClinicalSummary,
    summary_text: str,
) -> ClinicalSummary:
    summary.summary = summary_text

    db.commit()
    db.refresh(summary)

    return summary


def generate_patient_clinical_summary(
    db: Session,
    patient_id: int,
    conversation_id: int | None = None,
) -> ClinicalSummary:
    conversation_query = db.query(Conversation).filter(
        Conversation.patient_id == patient_id
    )

    if conversation_id is not None:
        conversation_query = conversation_query.filter(
            Conversation.id == conversation_id
        )

    conversation = conversation_query.order_by(
        Conversation.started_at.desc()
    ).first()

    medical_history = db.query(MedicalHistory).filter(
        MedicalHistory.patient_id == patient_id
    ).order_by(
        MedicalHistory.created_at.desc()
    ).first()

    documents = db.query(Document).filter(
        Document.patient_id == patient_id
    ).order_by(
        Document.uploaded_at.desc()
    ).all()

    lab_reports = db.query(LabReport).filter(
        LabReport.patient_id == patient_id
    ).order_by(
        LabReport.created_at.desc()
    ).all()

    medications = db.query(Medication).filter(
        Medication.patient_id == patient_id
    ).order_by(
        Medication.created_at.desc()
    ).all()

    conversation_history = conversation.messages if conversation else []

    extracted_information = {}

    if conversation_history:
        extracted_information = extract_structured_information(
            conversation_history
        )

    red_flags = {
        "has_red_flags": False,
        "red_flags": [],
        "priority": "normal",
    }

    if conversation_history:
        red_flags = detect_red_flags(conversation_history)

    clinical_context = {
        "medical_history": {
            "chief_complaint": medical_history.chief_complaint if medical_history else None,
            "history_of_present_illness": medical_history.history_of_present_illness if medical_history else None,
            "past_medical_history": medical_history.past_medical_history if medical_history else None,
            "past_surgical_history": medical_history.past_surgical_history if medical_history else None,
            "allergies": medical_history.allergies if medical_history else None,
            "family_history": medical_history.family_history if medical_history else None,
            "personal_history": medical_history.personal_history if medical_history else None,
            "review_of_systems": medical_history.review_of_systems if medical_history else None,
        },
        "ai_extracted_information": extracted_information,
        "conversation": conversation_history,
        "documents": [
            {
                "id": document.id,
                "file_name": document.file_name,
                "file_type": document.file_type,
                "ocr_text": document.ocr_text,
                "status": document.status,
            }
            for document in documents
        ],
        "lab_reports": [
            {
                "test_name": report.test_name,
                "result": report.result,
                "unit": report.unit,
                "reference_range": report.reference_range,
                "report_date": report.report_date.isoformat()
                if report.report_date
                else None,
                "status": report.status,
                "report_text": report.report_text,
            }
            for report in lab_reports
        ],
        "medications": [
            {
                "name": medication.name,
                "dosage": medication.dosage,
                "frequency": medication.frequency,
                "duration": medication.duration,
                "instructions": medication.instructions,
                "route": medication.route,
                "start_date": medication.start_date.isoformat()
                if medication.start_date
                else None,
                "end_date": medication.end_date.isoformat()
                if medication.end_date
                else None,
                "status": medication.status,
            }
            for medication in medications
        ],
        "red_flags": red_flags,
    }

    summary_text = generate_clinical_summary(
        clinical_context
    )

    summary = ClinicalSummary(
        patient_id=patient_id,
        conversation_id=conversation.id if conversation else conversation_id,
        summary=summary_text,
        status="draft",
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    return summary