from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.patient import Patient
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.document_service import (
    get_document,
    get_patient_documents,
    save_document,
    delete_document,
)
from app.services.ocr_service import process_document_ocr
from app.schemas.document import (
    LabReportCreate,
    LabReportResponse,
    MedicationCreate,
    MedicationResponse,
)

from app.services.document_service import (
    create_lab_report,
    create_medication,
    get_lab_report,
    get_medication,
    get_patient_lab_reports,
    get_patient_medications,
)












router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)


def verify_patient_access(
    db: Session,
    patient_id: int,
    user: User,
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.user_id == user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    return patient


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    patient_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user,
    )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required",
        )

    content = await file.read()

    try:
        document = save_document(
            db=db,
            patient_id=patient_id,
            original_filename=file.filename,
            content_type=file.content_type or "",
            content=content,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    return document


@router.get(
    "/patient/{patient_id}",
    response_model=list[DocumentResponse],
)
def list_patient_documents(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user,
    )

    return get_patient_documents(
        db,
        patient_id,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
def get_document_by_id(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = get_document(
        db,
        document_id,
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    verify_patient_access(
        db,
        document.patient_id,
        current_user,
    )

    return document


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = get_document(
        db,
        document_id,
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    verify_patient_access(
        db,
        document.patient_id,
        current_user,
    )

    delete_document(
        db,
        document,
    )


@router.post(
    "/{document_id}/ocr",
    response_model=DocumentResponse,
)
def run_document_ocr(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = get_document(
        db,
        document_id,
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    verify_patient_access(
        db,
        document.patient_id,
        current_user,
    )

    try:
        return process_document_ocr(
            db,
            document,
        )

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(e)}",
        )

# LAB REPORTS

@router.post(
    "/lab-reports",
    response_model=LabReportResponse,
    status_code=201,
)
def create_lab_report_endpoint(
    data: LabReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        data.patient_id,
        current_user,
    )

    if data.document_id is not None:
        document = get_document(db, data.document_id)

        if document is None:
            raise HTTPException(
                status_code=404,
                detail="Document not found",
            )

        if document.patient_id != data.patient_id:
            raise HTTPException(
                status_code=403,
                detail="Document does not belong to this patient",
            )

    return create_lab_report(db, data)


@router.get(
    "/lab-reports/patient/{patient_id}",
    response_model=list[LabReportResponse],
)
def list_patient_lab_reports(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user,
    )

    return get_patient_lab_reports(db, patient_id)


@router.get(
    "/lab-reports/{lab_report_id}",
    response_model=LabReportResponse,
)
def get_lab_report_endpoint(
    lab_report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lab_report = get_lab_report(db, lab_report_id)

    if lab_report is None:
        raise HTTPException(
            status_code=404,
            detail="Lab report not found",
        )

    verify_patient_access(
        db,
        lab_report.patient_id,
        current_user,
    )

    return lab_report


# MEDICATIONS


@router.post(
    "/medications",
    response_model=MedicationResponse,
    status_code=201,
)
def create_medication_endpoint(
    data: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        data.patient_id,
        current_user,
    )

    return create_medication(db, data)


@router.get(
    "/medications/patient/{patient_id}",
    response_model=list[MedicationResponse],
)
def list_patient_medications(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_patient_access(
        db,
        patient_id,
        current_user,
    )

    return get_patient_medications(db, patient_id)


@router.get(
    "/medications/{medication_id}",
    response_model=MedicationResponse,
)
def get_medication_endpoint(
    medication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medication = get_medication(db, medication_id)

    if medication is None:
        raise HTTPException(
            status_code=404,
            detail="Medication not found",
        )

    verify_patient_access(
        db,
        medication.patient_id,
        current_user,
    )

    return medication



    