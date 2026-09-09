from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.permissions import require_admin
from app.models.user import User
from app.models.patient import Patient
from app.models.physician import Physician
from app.models.session import Session as PatientSession
from app.services.audit_service import create_audit_log, get_audit_logs

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/users")
def read_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    users = db.query(User).order_by(User.id).all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
        for user in users
    ]


@router.get("/users/{user_id}")
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    allowed_roles = {"patient", "physician", "admin"}

    if role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == current_user.id and role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot remove their own admin role",
        )

    old_role = user.role
    user.role = role

    db.commit()
    db.refresh(user)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="user_role_updated",
        entity_type="user",
        entity_id=user.id,
        details=f"Role changed from {old_role} to {role}",
    )

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == current_user.id and not is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot deactivate their own account",
        )

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="user_status_updated",
        entity_type="user",
        entity_id=user.id,
        details=f"User active status changed to {is_active}",
    )

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }


@router.get("/patients")
def read_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    patients = db.query(Patient).order_by(Patient.id).all()

    return [
        {
            "id": patient.id,
            "user_id": patient.user_id,
            "full_name": patient.full_name,
            "date_of_birth": patient.date_of_birth,
            "gender": patient.gender,
            "phone": patient.phone,
            "created_at": patient.created_at,
        }
        for patient in patients
    ]


@router.get("/patients/{patient_id}")
def read_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return {
        "id": patient.id,
        "user_id": patient.user_id,
        "full_name": patient.full_name,
        "date_of_birth": patient.date_of_birth,
        "gender": patient.gender,
        "phone": patient.phone,
        "created_at": patient.created_at,
    }


@router.get("/physicians")
def read_physicians(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    physicians = db.query(Physician).order_by(Physician.id).all()

    return [
        {
            "id": physician.id,
            "user_id": physician.user_id,
            "full_name": physician.full_name,
            "specialization": physician.specialization,
            "registration_number": physician.registration_number,
            "created_at": physician.created_at,
        }
        for physician in physicians
    ]


@router.get("/physicians/{physician_id}")
def read_physician(
    physician_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    physician = db.query(Physician).filter(Physician.id == physician_id).first()

    if not physician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physician not found",
        )

    return {
        "id": physician.id,
        "user_id": physician.user_id,
        "full_name": physician.full_name,
        "specialization": physician.specialization,
        "registration_number": physician.registration_number,
        "created_at": physician.created_at,
    }


@router.get("/sessions")
def read_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    sessions = db.query(PatientSession).order_by(PatientSession.id).all()

    return [
        {
            "id": session.id,
            "patient_id": session.patient_id,
            "session_token": session.session_token,
            "status": session.status,
            "created_at": session.created_at,
            "expires_at": session.expires_at,
        }
        for session in sessions
    ]


@router.get("/sessions/{session_id}")
def read_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    session = (
        db.query(PatientSession)
        .filter(PatientSession.id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    return {
        "id": session.id,
        "patient_id": session.patient_id,
        "session_token": session.session_token,
        "status": session.status,
        "created_at": session.created_at,
        "expires_at": session.expires_at,
    }


@router.get("/audit-logs")
def read_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    logs = get_audit_logs(db)

    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "details": log.details,
            "created_at": log.created_at,
        }
        for log in logs
    ]