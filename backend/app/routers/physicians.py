from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.permissions import require_physician
from app.models.user import User
from app.schemas.physician import (
    PhysicianPatientResponse,
    PhysicianResponse,
    PhysicianSummaryAction,
    PhysicianSummaryResponse,
    PhysicianSummaryUpdate,
)
from app.services.physician_service import (
    get_authorized_patients,
    get_physician_by_user_id,
    get_summary_for_physician,
    get_patient_summaries,
    reject_summary,
    update_summary_for_physician,
    verify_summary,
)


router = APIRouter(
    prefix="/api/physicians",
    tags=["Physicians"],
)


def get_current_physician(
    db: Session,
    current_user: User,
):
    physician = get_physician_by_user_id(
        db,
        current_user.id,
    )

    if not physician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physician profile not found",
        )

    return physician


@router.get(
    "/me",
    response_model=PhysicianResponse,
)
def get_my_physician_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    return get_current_physician(
        db,
        current_user,
    )


@router.get(
    "/patients",
    response_model=list[PhysicianPatientResponse],
)
def list_authorized_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    return get_authorized_patients(
        db,
        physician.id,
    )


@router.get(
    "/patients/{patient_id}/summaries",
    response_model=list[PhysicianSummaryResponse],
)
def list_patient_summaries(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    summaries = get_patient_summaries(
        db,
        physician.id,
        patient_id,
    )

    if not summaries:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient summaries not found",
        )

    return summaries


@router.get(
    "/summaries/{summary_id}",
    response_model=PhysicianSummaryResponse,
)
def get_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    summary = get_summary_for_physician(
        db,
        physician.id,
        summary_id,
    )

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical summary not found",
        )

    return summary


@router.put(
    "/summaries/{summary_id}",
    response_model=PhysicianSummaryResponse,
)
def edit_summary(
    summary_id: int,
    data: PhysicianSummaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    summary = get_summary_for_physician(
        db,
        physician.id,
        summary_id,
    )

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical summary not found",
        )

    return update_summary_for_physician(
        db,
        summary,
        data.summary,
        data.physician_notes,
    )


@router.post(
    "/summaries/{summary_id}/verify",
    response_model=PhysicianSummaryResponse,
)
def verify_clinical_summary(
    summary_id: int,
    data: PhysicianSummaryAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    summary = get_summary_for_physician(
        db,
        physician.id,
        summary_id,
    )

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical summary not found",
        )

    return verify_summary(
        db,
        summary,
        data.physician_notes,
    )


@router.post(
    "/summaries/{summary_id}/reject",
    response_model=PhysicianSummaryResponse,
)
def reject_clinical_summary(
    summary_id: int,
    data: PhysicianSummaryAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    summary = get_summary_for_physician(
        db,
        physician.id,
        summary_id,
    )

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical summary not found",
        )

    return reject_summary(
        db,
        summary,
        data.physician_notes,
    )