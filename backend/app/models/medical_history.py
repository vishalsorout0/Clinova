from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MedicalHistory(Base):
    __tablename__ = "medical_histories"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
        index=True
    )

    conversation_id: Mapped[int | None] = mapped_column(
        ForeignKey("conversations.id"),
        nullable=True,
        index=True
    )

    chief_complaint: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    history_of_present_illness: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    past_medical_history: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    past_surgical_history: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    allergies: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    family_history: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    personal_history: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    review_of_systems: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )