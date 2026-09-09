from datetime import datetime, timedelta
from uuid import uuid4

from sqlalchemy.orm import Session as DBSession

from app.models.conversation import Conversation
from app.models.session import Session as PatientSession



# SESSION FUNCTIONS


def create_patient_session(
    db: DBSession,
    patient_id: int
) -> PatientSession:
    session = PatientSession(
        patient_id=patient_id,
        session_token=str(uuid4()),
        status="active",
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def get_patient_session(
    db: DBSession,
    session_id: int
) -> PatientSession | None:
    return (
        db.query(PatientSession)
        .filter(PatientSession.id == session_id)
        .first()
    )


def end_patient_session(
    db: DBSession,
    session: PatientSession
) -> PatientSession:
    session.status = "completed"

    db.commit()
    db.refresh(session)

    return session



# CONVERSATION FUNCTIONS


def create_conversation(
    db: DBSession,
    patient_id: int,
    language: str,
    session_id: int | None = None
) -> Conversation:
    conversation = Conversation(
        patient_id=patient_id,
        session_id=session_id,
        language=language,
        status="active",
        messages=[]
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


def get_conversation(
    db: DBSession,
    conversation_id: int
) -> Conversation | None:
    return (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )


def get_patient_conversations(
    db: DBSession,
    patient_id: int
) -> list[Conversation]:
    return (
        db.query(Conversation)
        .filter(Conversation.patient_id == patient_id)
        .order_by(Conversation.started_at.desc())
        .all()
    )


def add_message(
    db: DBSession,
    conversation: Conversation,
    role: str,
    content: str,
    input_type: str
) -> Conversation:

    if conversation.status != "active":
        raise ValueError("Conversation is not active")

    message = {
        "role": role,
        "content": content,
        "input_type": input_type,
        "timestamp": datetime.utcnow().isoformat()
    }

    current_messages = list(conversation.messages or [])
    current_messages.append(message)

    conversation.messages = current_messages

    db.commit()
    db.refresh(conversation)

    return conversation


def complete_conversation(
    db: DBSession,
    conversation: Conversation
) -> Conversation:

    conversation.status = "completed"
    conversation.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(conversation)

    return conversation