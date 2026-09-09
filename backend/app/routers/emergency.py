from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.ai_service import detect_red_flags
from app.services.audit_service import create_audit_log
from app.services.conversation_service import get_conversation
from app.services.document_service import verify_patient_access


router = APIRouter(
    prefix="/api/emergency",
    tags=["Emergency"],
)


@router.get("/conversation/{conversation_id}")
def check_conversation_emergency(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(db, conversation_id)

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    verify_patient_access(
        db,
        conversation.patient_id,
        current_user.id,
    )

    messages = conversation.messages or []

    try:
        result = detect_red_flags(messages)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    has_red_flags = result["has_red_flags"]
    priority = result["priority"]
    alerts = result["red_flags"]

    if has_red_flags:
        create_audit_log(
            db=db,
            user_id=current_user.id,
            action="emergency_red_flag_detected",
            entity_type="conversation",
            entity_id=conversation.id,
            details=f"Priority: {priority}; Red flags: {', '.join(alerts)}",
        )

    return {
        "conversation_id": conversation.id,
        "patient_id": conversation.patient_id,
        "has_emergency": has_red_flags,
        "priority": priority,
        "alerts": alerts,
    }


@router.post("/conversation/{conversation_id}/alert")
def create_emergency_alert(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(db, conversation_id)

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    verify_patient_access(
        db,
        conversation.patient_id,
        current_user.id,
    )

    messages = conversation.messages or []

    try:
        result = detect_red_flags(messages)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    if not result["has_red_flags"]:
        raise HTTPException(
            status_code=400,
            detail="No emergency red flags detected",
        )

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="emergency_alert_created",
        entity_type="conversation",
        entity_id=conversation.id,
        details=f"Priority: {result['priority']}; Red flags: {', '.join(result['red_flags'])}",
    )

    return {
        "conversation_id": conversation.id,
        "patient_id": conversation.patient_id,
        "status": "emergency",
        "priority": result["priority"],
        "alerts": result["red_flags"],
        "message": "Emergency alert created",
    }