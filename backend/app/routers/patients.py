from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.permissions import require_patient
from app.models.user import User
from app.schemas.patient import PatientCreate, PatientResponse
from app.services.patient_service import (
    get_patient_by_user_id,
    update_patient,
)


router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"],
)


@router.get(
    "/me",
    response_model=PatientResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_patient),
):
    patient = get_patient_by_user_id(
        db,
        current_user.id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found",
        )

    return patient


@router.put(
    "/me",
    response_model=PatientResponse,
)
def update_my_profile(
    data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_patient),
):
    patient = get_patient_by_user_id(
        db,
        current_user.id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found",
        )

    return update_patient(
        db,
        patient,
        data,
    )