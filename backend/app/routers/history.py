from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.patient import Patient
from app.models.user import User
from app.schemas.medical_history import (
    MedicalHistoryCreate,
    MedicalHistoryResponse,
    MedicalHistoryUpdate,
)
from app.services.history_service import (
    create_medical_history,
    get_medical_history,
    get_patient_medical_histories,
    update_medical_history,
    get_patient_timeline,
)
from app.schemas.medical_history import (
    MedicalHistoryCreate,
    MedicalHistoryResponse,
    MedicalHistoryUpdate,
    MedicalTimelineResponse,
)










router = APIRouter(
    prefix="/api/history",
    tags=["Medical History"],
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


@router.post(
    "/",
    response_model=MedicalHistoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_history(
    data: MedicalHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        data.patient_id,
        current_user.id,
    )

    return create_medical_history(
        db,
        data,
    )


@router.get(
    "/patient/{patient_id}",
    response_model=list[MedicalHistoryResponse],
)
def list_patient_history(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user.id,
    )

    return get_patient_medical_histories(
        db,
        patient_id,
    )


@router.get(
    "/{history_id}",
    response_model=MedicalHistoryResponse,
)
def get_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = get_medical_history(
        db,
        history_id,
    )

    if not history:
        raise HTTPException(
            status_code=404,
            detail="Medical history not found",
        )

    verify_patient_access(
        db,
        history.patient_id,
        current_user.id,
    )

    return history


@router.put(
    "/{history_id}",
    response_model=MedicalHistoryResponse,
)
def update_history(
    history_id: int,
    data: MedicalHistoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = get_medical_history(
        db,
        history_id,
    )

    if not history:
        raise HTTPException(
            status_code=404,
            detail="Medical history not found",
        )

    verify_patient_access(
        db,
        history.patient_id,
        current_user.id,
    )

    return update_medical_history(
        db,
        history,
        data,
    )



@router.get(
    "/timeline/{patient_id}",
    response_model=MedicalTimelineResponse,
)
def get_timeline(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user.id,
    )

    return {
        "patient_id": patient_id,
        "items": get_patient_timeline(
            db,
            patient_id,
        ),
    }