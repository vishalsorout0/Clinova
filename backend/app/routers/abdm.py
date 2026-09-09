from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.abdm_service import (
    create_abha_profile,
    exchange_health_record,
    get_abha_profile,
)
from app.services.patient_service import get_patient

router = APIRouter(prefix="/api/abdm", tags=["ABDM"])


@router.post("/patients/{patient_id}/abha")
def create_patient_abha(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = get_patient(db, patient_id)

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return create_abha_profile(
        patient_id=patient.id,
        patient_name=patient.full_name,
    )


@router.get("/patients/{patient_id}/abha")
def read_patient_abha(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = get_patient(db, patient_id)

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return get_abha_profile(
        patient_id=patient.id,
        patient_name=patient.full_name,
    )


@router.post("/patients/{patient_id}/fhir")
def exchange_patient_health_record(
    patient_id: int,
    clinical_data: dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = get_patient(db, patient_id)

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return exchange_health_record(
        patient_id=patient.id,
        patient_name=patient.full_name,
        clinical_data=clinical_data,
    )