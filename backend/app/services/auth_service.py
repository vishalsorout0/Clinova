from sqlalchemy.orm import Session

from app.models.user import User
from app.models.patient import Patient
from app.models.physician import Physician

from app.schemas.auth import (
    PatientRegistration,
    PhysicianRegistration,
)

from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token


def register_patient(
    db: Session,
    data: PatientRegistration,
) -> User:

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        role="patient",
    )

    db.add(user)
    db.flush()

    try:
        patient = Patient(
            user_id=user.id,
            full_name=data.full_name,
            date_of_birth=data.date_of_birth,
            gender=data.gender,
            phone=data.phone,
        )

        db.add(patient)

        db.commit()
        db.refresh(user)

        return user

    except Exception:
        db.rollback()
        raise ValueError("Could not create patient profile")


def register_physician(
    db: Session,
    data: PhysicianRegistration,
) -> User:

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        role="physician",
    )

    db.add(user)
    db.flush()

    try:
        physician = Physician(
            user_id=user.id,
            full_name=data.full_name,
            specialization=data.specialization,
            registration_number=data.registration_number,
        )

        db.add(physician)

        db.commit()
        db.refresh(user)

        return user

    except Exception:
        db.rollback()
        raise ValueError("Could not create physician profile")


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    if not user.is_active:
        return None

    return user


def create_user_token(user: User) -> str:
    return create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
        }
    )