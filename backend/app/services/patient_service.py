from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate


def get_patient_by_user_id(
    db: Session,
    user_id: int,
) -> Patient | None:
    return (
        db.query(Patient)
        .filter(Patient.user_id == user_id)
        .first()
    )


def get_patient(
    db: Session,
    patient_id: int,
) -> Patient | None:
    return (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )


def update_patient(
    db: Session,
    patient: Patient,
    data: PatientCreate,
) -> Patient:
    patient.full_name = data.full_name
    patient.date_of_birth = data.date_of_birth
    patient.gender = data.gender
    patient.phone = data.phone

    db.commit()
    db.refresh(patient)

    return patient