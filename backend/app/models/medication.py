# from sqlalchemy import String, Text, DateTime, ForeignKey
# from sqlalchemy.orm import Mapped, mapped_column
# from datetime import datetime

# from app.database import Base


# class Medication(Base):
#     __tablename__ = "medications"

#     id: Mapped[int] = mapped_column(primary_key=True, index=True)
#     patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)

#     name: Mapped[str] = mapped_column(String(255), nullable=False)
#     dosage: Mapped[str | None] = mapped_column(String(100), nullable=True)
#     frequency: Mapped[str | None] = mapped_column(String(100), nullable=True)
#     duration: Mapped[str | None] = mapped_column(String(100), nullable=True)
#     instructions: Mapped[str | None] = mapped_column(Text, nullable=True)

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime,
#         default=datetime.utcnow,
#         nullable=False
#     )


from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    dosage: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    frequency: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    duration: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    instructions: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    route: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="active",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )