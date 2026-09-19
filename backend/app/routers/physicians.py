from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.models.physician import Physician
from app.models.user import User

from app.database import get_db

from app.dependencies.permissions import (
    require_physician,
    require_patient,
)

from app.schemas.physician import (
    PhysicianPatientResponse,
    PhysicianResponse,
    PhysicianSummaryAction,
    PhysicianSummaryResponse,
    PhysicianSummaryUpdate,
    PhysicianPatientRecordsResponse,
)

from app.services.physician_service import (
    get_authorized_patients,
    get_physician_by_user_id,
    get_summary_for_physician,
    get_patient_summaries,
    get_patient_records_for_physician,
    reject_summary,
    update_summary_for_physician,
    verify_summary,
)

from fastapi.responses import FileResponse
from pathlib import Path
import mimetypes
from app.models.document import Document
from app.services.physician_service import has_physician_access

from app.models.conversation import Conversation
from app.services.ai_service import detect_red_flags























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
    "/available",
    response_model=list[PhysicianResponse],
)
def list_available_physicians(
    search: str | None = Query(
        default=None,
        max_length=100,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_patient),
):
    query = db.query(Physician)

    if search and search.strip():
        search_term = f"%{search.strip()}%"

        query = query.filter(
            (Physician.full_name.ilike(search_term))
            | (
                Physician.specialization.ilike(
                    search_term
                )
            )
            | (
                Physician.registration_number.ilike(
                    search_term
                )
            )
        )

    return (
        query
        .order_by(
            Physician.full_name.asc()
        )
        .all()
    )


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
    "/patients/{patient_id}/records",
    response_model=PhysicianPatientRecordsResponse,
)
def get_patient_records(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    records = get_patient_records_for_physician(
        db,
        physician.id,
        patient_id,
    )

    if not records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Patient not found or physician "
                "access has not been granted"
            ),
        )

    return records


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


@router.get("/emergency-patients")
def get_emergency_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_current_physician(
        db,
        current_user,
    )

    authorized_patients = get_authorized_patients(
        db,
        physician.id,
    )

    emergency_patients = []

    for patient in authorized_patients:

        conversations = (
            db.query(Conversation)
            .filter(
                Conversation.patient_id == patient.id
            )
            .order_by(
                Conversation.started_at.desc()
            )
            .all()
        )

        for conversation in conversations:

            messages = conversation.messages or []

            if not messages:
                continue

            try:
                result = detect_red_flags(messages)
            except (ValueError, RuntimeError):
                continue

            if result["has_red_flags"]:

                emergency_patients.append({
                    "patient_id": patient.id,
                    "patient_name": patient.full_name,
                    "conversation_id": conversation.id,
                    "priority": result["priority"],
                    "alerts": result["red_flags"],
                    "conversation_status": conversation.status,
                    "started_at": conversation.started_at,
                })

                # Latest emergency conversation only
                break

    return {
        "emergency_patients": emergency_patients,
        "count": len(emergency_patients),
    }

@router.get("/documents/{document_id}/file")
def view_patient_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_physician),
):
    physician = get_physician_by_user_id(
        db,
        current_user.id,
    )

    if not physician:
        raise HTTPException(
            status_code=404,
            detail="Physician profile not found",
        )

    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    # Patient-specific consent check
    if not has_physician_access(
        db,
        physician.id,
        document.patient_id,
    ):
        raise HTTPException(
            status_code=403,
            detail="Patient consent is required",
        )

    # Get stored file path
    file_path = Path(document.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found on server",
        )

    # Detect MIME type
    media_type = mimetypes.guess_type(
        file_path.name
    )[0]

    if not media_type:
        media_type = "application/octet-stream"

    return FileResponse(
        path=str(file_path),
        media_type=media_type,
        filename=document.file_name,
        content_disposition_type="inline",
    )