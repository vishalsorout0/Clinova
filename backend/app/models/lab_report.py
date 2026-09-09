# from sqlalchemy import String, Text, DateTime, ForeignKey
# from sqlalchemy.orm import Mapped, mapped_column
# from datetime import datetime

# from app.database import Base


# class LabReport(Base):
#     __tablename__ = "lab_reports"

#     id: Mapped[int] = mapped_column(primary_key=True, index=True)
#     patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)
#     document_id: Mapped[int | None] = mapped_column(ForeignKey("documents.id"), nullable=True)

#     test_name: Mapped[str] = mapped_column(String(255), nullable=False)
#     result: Mapped[str | None] = mapped_column(String(255), nullable=True)
#     unit: Mapped[str | None] = mapped_column(String(100), nullable=True)
#     reference_range: Mapped[str | None] = mapped_column(String(255), nullable=True)
#     report_text: Mapped[str | None] = mapped_column(Text, nullable=True)

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime,
#         default=datetime.utcnow,
#         nullable=False
#     )


from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class LabReport(Base):
    __tablename__ = "lab_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
        index=True,
    )

    document_id: Mapped[int | None] = mapped_column(
        ForeignKey("documents.id"),
        nullable=True,
        index=True,
    )

    test_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    result: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    unit: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    reference_range: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    report_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="unknown",
    )

    report_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )