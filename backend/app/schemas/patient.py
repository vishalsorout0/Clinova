from datetime import date
from pydantic import BaseModel


class PatientCreate(BaseModel):
    full_name: str
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None


class PatientResponse(PatientCreate):
    id: int
    user_id: int

    model_config = {"from_attributes": True}