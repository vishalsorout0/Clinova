from sqlalchemy.orm import Session

from app.models.clinical_summary import ClinicalSummary
from app.models.consent import Consent
from app.models.patient import Patient
from app.models.physician import Physician


def create_physician(
    db: Session,
    user_id: int,
    full_name: str,
    specialization: str | None = None,
    registration_number: str | None = None,
) -> Physician:
    physician = Physician(
        user_id=user_id,
        full_name=full_name,
        specialization=specialization,
        registration_number=registration_number,
    )

    db.add(physician)
    db.commit()
    db.refresh(physician)

    return physician


def get_physician(
    db: Session,
    physician_id: int,
) -> Physician | None:
    return (
        db.query(Physician)
        .filter(Physician.id == physician_id)
        .first()
    )


def get_physician_by_user_id(
    db: Session,
    user_id: int,
) -> Physician | None:
    return (
        db.query(Physician)
        .filter(Physician.user_id == user_id)
        .first()
    )


def has_physician_access(
    db: Session,
    physician_id: int,
    patient_id: int,
) -> bool:
    consent = (
        db.query(Consent)
        .filter(
            Consent.patient_id == patient_id,
            Consent.physician_id == physician_id,
            Consent.consent_type == "physician_access",
        )
        .order_by(
            Consent.created_at.desc(),
            Consent.id.desc(),
        )
        .first()
    )

    return consent is not None and consent.granted is True


def get_authorized_patients(
    db: Session,
    physician_id: int,
) -> list[Patient]:
    physician = get_physician(db, physician_id)

    if not physician:
        return []

    return (
        db.query(Patient)
        .join(
            Consent,
            Consent.patient_id == Patient.id,
        )
        .filter(
            Consent.physician_id == physician_id,
            Consent.consent_type == "physician_access",
            Consent.granted.is_(True),
        )
        .distinct()
        .all()
    )


def get_patient_summaries(
    db: Session,
    physician_id: int,
    patient_id: int,
) -> list[ClinicalSummary]:
    physician = get_physician(db, physician_id)

    if not physician:
        return []

    patient_exists = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient_exists:
        return []

    if not has_physician_access(
        db,
        physician_id,
        patient_id,
    ):
        return []

    return (
        db.query(ClinicalSummary)
        .filter(
            ClinicalSummary.patient_id == patient_id
        )
        .order_by(
            ClinicalSummary.created_at.desc()
        )
        .all()
    )


def get_summary_for_physician(
    db: Session,
    physician_id: int,
    summary_id: int,
) -> ClinicalSummary | None:
    physician = get_physician(db, physician_id)

    if not physician:
        return None

    summary = (
        db.query(ClinicalSummary)
        .filter(
            ClinicalSummary.id == summary_id
        )
        .first()
    )

    if not summary:
        return None

    if not has_physician_access(
        db,
        physician_id,
        summary.patient_id,
    ):
        return None

    return summary


def verify_summary(
    db: Session,
    summary: ClinicalSummary,
    physician_notes: str | None = None,
) -> ClinicalSummary:
    summary.status = "verified"

    if physician_notes is not None:
        summary.physician_notes = physician_notes

    db.commit()
    db.refresh(summary)

    return summary


def reject_summary(
    db: Session,
    summary: ClinicalSummary,
    physician_notes: str | None = None,
) -> ClinicalSummary:
    summary.status = "rejected"

    if physician_notes is not None:
        summary.physician_notes = physician_notes

    db.commit()
    db.refresh(summary)

    return summary


def update_summary_for_physician(
    db: Session,
    summary: ClinicalSummary,
    summary_text: str,
    physician_notes: str | None = None,
) -> ClinicalSummary:
    summary.summary = summary_text
    summary.status = "draft"

    if physician_notes is not None:
        summary.physician_notes = physician_notes

    db.commit()
    db.refresh(summary)

    return summary