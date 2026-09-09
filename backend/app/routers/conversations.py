from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.patient import Patient
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
)
from app.services.conversation_service import (
    add_message,
    complete_conversation,
    create_conversation,
    create_patient_session,
    end_patient_session,
    get_conversation,
    get_patient_conversations,
    get_patient_session,
)
from app.services.ai_service import (
    generate_next_question,
    extract_structured_information,
    detect_missing_information,
    detect_red_flags,
)

from app.services.document_service import verify_patient_access










router = APIRouter(
    prefix="/api/conversations",
    tags=["Conversations"],
)



# SESSION ENDPOINTS


@router.post(
    "/session",
    status_code=status.HTTP_201_CREATED,
)
def start_session(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    session = create_patient_session(
        db,
        patient_id,
    )

    return {
        "message": "Session started successfully",
        "session_id": session.id,
        "session_token": session.session_token,
        "status": session.status,
        "created_at": session.created_at,
        "expires_at": session.expires_at,
    }


@router.get(
    "/session/{session_id}",
)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_patient_session(
        db,
        session_id,
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == session.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    return {
        "session_id": session.id,
        "patient_id": session.patient_id,
        "session_token": session.session_token,
        "status": session.status,
        "created_at": session.created_at,
        "expires_at": session.expires_at,
    }


@router.post(
    "/session/{session_id}/end",
)
def end_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_patient_session(
        db,
        session_id,
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == session.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    if session.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Session is already completed",
        )

    session = end_patient_session(
        db,
        session,
    )

    return {
        "message": "Session ended successfully",
        "session_id": session.id,
        "status": session.status,
    }



# CONVERSATION ENDPOINTS


@router.post(
    "/",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == data.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    if data.session_id is not None:
        session = get_patient_session(
            db,
            data.session_id,
        )

        if not session or session.patient_id != data.patient_id:
            raise HTTPException(
                status_code=404,
                detail="Session not found",
            )

        if session.status != "active":
            raise HTTPException(
                status_code=400,
                detail="Session is not active",
            )

    return create_conversation(
        db=db,
        patient_id=data.patient_id,
        language=data.language,
        session_id=data.session_id,
    )


@router.get(
    "/patient/{patient_id}",
    response_model=list[ConversationResponse],
)
def list_patient_conversations(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    return get_patient_conversations(
        db,
        patient_id,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def get_single_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == conversation.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return conversation


@router.post(
    "/{conversation_id}/messages",
    response_model=ConversationResponse,
)
def add_patient_message(
    conversation_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == conversation.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if conversation.status != "active":
        raise HTTPException(
            status_code=400,
            detail="Conversation is not active",
        )

    try:
        return add_message(
            db=db,
            conversation=conversation,
            role="patient",
            content=data.content,
            input_type=data.input_type,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.post(
    "/{conversation_id}/complete",
    response_model=ConversationResponse,
)
def complete_current_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == conversation.patient_id,
            Patient.user_id == current_user.id,
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if conversation.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Conversation is already completed",
        )

    return complete_conversation(
        db,
        conversation,
    )

@router.get("/{conversation_id}/ai/next-question")
def get_next_ai_question(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    verify_patient_access(
        db,
        conversation.patient_id,
        current_user.id,
    )

    question = generate_next_question(
        conversation.messages,
        conversation.language,
    )

    return {
        "conversation_id": conversation.id,
        "question": question,
        "language": conversation.language,
    }


@router.get("/{conversation_id}/ai/extract")
def extract_conversation_information(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    verify_patient_access(
        db,
        conversation.patient_id,
        current_user.id,
    )

    return {
        "conversation_id": conversation.id,
        "data": extract_structured_information(
            conversation.messages
        ),
    }


@router.get("/{conversation_id}/ai/missing-information")
def get_missing_information(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    verify_patient_access(
        db,
        conversation.patient_id,
        current_user.id,
    )

    return {
        "conversation_id": conversation.id,
        "missing_information": detect_missing_information(
            conversation.messages
        ),
    }


@router.get("/{conversation_id}/ai/red-flags")
def get_conversation_red_flags(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    verify_patient_access(
        db,
        conversation.patient_id,
        current_user.id,
    )

    return {
        "conversation_id": conversation.id,
        "result": detect_red_flags(
            conversation.messages
        ),
    }


