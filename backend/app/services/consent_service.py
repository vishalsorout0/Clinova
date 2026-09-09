from sqlalchemy.orm import Session

from app.models.consent import Consent
from app.schemas.consent import ConsentCreate


def create_consent(
    db: Session,
    data: ConsentCreate,
) -> Consent:

    consent = Consent(
        patient_id=data.patient_id,
        physician_id=data.physician_id,
        consent_type=data.consent_type,
        granted=data.granted,
    )

    db.add(consent)
    db.commit()
    db.refresh(consent)

    return consent


def get_patient_consents(
    db: Session,
    patient_id: int,
) -> list[Consent]:

    return (
        db.query(Consent)
        .filter(Consent.patient_id == patient_id)
        .order_by(Consent.created_at.desc())
        .all()
    )


def get_consent(
    db: Session,
    consent_id: int,
) -> Consent | None:

    return (
        db.query(Consent)
        .filter(Consent.id == consent_id)
        .first()
    )