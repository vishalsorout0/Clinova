from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.summary import (
    ClinicalSummaryCreate,
    ClinicalSummaryGenerate,
    ClinicalSummaryResponse,
)
from app.services.document_service import verify_patient_access
from app.services.summary_service import (
    create_clinical_summary,
    generate_patient_clinical_summary,
    get_clinical_summary,
    get_patient_summaries,
    update_clinical_summary,
)


router = APIRouter(
    prefix="/api/summaries",
    tags=["Clinical Summaries"],
)


@router.post(
    "/",
    response_model=ClinicalSummaryResponse,
)
def create_summary(
    data: ClinicalSummaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        data.patient_id,
        current_user.id,
    )

    return create_clinical_summary(db, data)


@router.post(
    "/generate",
    response_model=ClinicalSummaryResponse,
)
def generate_summary(
    data: ClinicalSummaryGenerate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        data.patient_id,
        current_user.id,
    )

    try:
        return generate_patient_clinical_summary(
            db,
            data.patient_id,
            data.conversation_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        )


@router.get(
    "/patient/{patient_id}",
    response_model=list[ClinicalSummaryResponse],
)
def list_patient_summaries(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user.id,
    )

    return get_patient_summaries(
        db,
        patient_id,
    )


@router.get(
    "/{summary_id}",
    response_model=ClinicalSummaryResponse,
)
def get_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    summary = get_clinical_summary(
        db,
        summary_id,
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Clinical summary not found",
        )

    verify_patient_access(
        db,
        summary.patient_id,
        current_user.id,
    )

    return summary


@router.put(
    "/{summary_id}",
    response_model=ClinicalSummaryResponse,
)
def update_summary(
    summary_id: int,
    data: ClinicalSummaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    summary = get_clinical_summary(
        db,
        summary_id,
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Clinical summary not found",
        )

    verify_patient_access(
        db,
        summary.patient_id,
        current_user.id,
    )

    if data.patient_id != summary.patient_id:
        raise HTTPException(
            status_code=400,
            detail="Patient ID cannot be changed",
        )

    return update_clinical_summary(
        db,
        summary,
        data.summary,
    )