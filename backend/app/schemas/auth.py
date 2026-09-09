from datetime import date

from pydantic import BaseModel, EmailStr


class PatientRegistration(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None


class PhysicianRegistration(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    specialization: str | None = None
    registration_number: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"