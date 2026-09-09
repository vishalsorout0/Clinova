from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.auth import (
    PatientRegistration,
    PhysicianRegistration,
    Token,
)

from app.services.auth_service import (
    register_patient,
    register_physician,
    authenticate_user,
    create_user_token,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register/patient",
    status_code=status.HTTP_201_CREATED,
)
def register_patient_account(
    data: PatientRegistration,
    db: Session = Depends(get_db),
):
    try:
        user = register_patient(db, data)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return {
        "message": "Patient registered successfully",
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
    }


@router.post(
    "/register/physician",
    status_code=status.HTTP_201_CREATED,
)
def register_physician_account(
    data: PhysicianRegistration,
    db: Session = Depends(get_db),
):
    try:
        user = register_physician(db, data)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return {
        "message": "Physician registered successfully",
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
    }


@router.post(
    "/login",
    response_model=Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db,
        form_data.username,
        form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_user_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
    }