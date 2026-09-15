from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.patient import Patient
from app.models.physician import Physician
from app.models.user import User

from app.schemas.consent import ConsentCreate, ConsentResponse
from app.services.consent_service import (
    create_consent,
    get_patient_consents,
    get_consent,
)



router = APIRouter(
    prefix="/api/consent",
    tags=["Consent"],
)


@router.post(
    "/",
    response_model=ConsentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient_consent(
    data: ConsentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only the patient who owns the profile can give consent.
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == data.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    # Physician must exist.
    physician = (
        db.query(Physician)
        .filter(
            Physician.id == data.physician_id
        )
        .first()
    )

    if not physician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physician not found",
        )

    return create_consent(db, data)


@router.get(
    "/patient/{patient_id}",
    response_model=list[ConsentResponse],
)
def list_patient_consents(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return get_patient_consents(
        db,
        patient_id,
    )


@router.delete(
    "/{consent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def revoke_patient_consent(
    consent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    consent = get_consent(
        db,
        consent_id,
    )

    if not consent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consent not found",
        )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == consent.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage your own consent",
        )

    if consent.granted is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent is already revoked",
        )

    # Keep the record for history/audit purposes.
    # Only revoke access.
    consent.granted = False

    db.commit()

    return None