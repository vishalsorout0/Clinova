from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Consent(Base):
    __tablename__ = "consents"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
        index=True
    )

    physician_id: Mapped[int | None] = mapped_column(
        ForeignKey("physicians.id"),
        nullable=True,
        index=True
    )

    consent_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    granted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )