from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.config import settings


llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.2,
)


def _build_conversation_text(
    conversation_history: list[dict[str, Any]],
) -> str:
    messages = []

    for message in conversation_history:
        role = message.get("role", "unknown")
        content = message.get("content", "")

        if content:
            messages.append(f"{role}: {content}")

    return "\n".join(messages)


def _validate_conversation(
    conversation_history: list[dict[str, Any]],
) -> None:
    if not isinstance(conversation_history, list):
        raise ValueError("Conversation history must be a list")

    if not conversation_history:
        raise ValueError("Conversation history cannot be empty")

    for message in conversation_history:
        if not isinstance(message, dict):
            raise ValueError("Invalid conversation message")

        content = message.get("content")

        if not isinstance(content, str) or not content.strip():
            raise ValueError("Conversation message content cannot be empty")


class ClinicalHistory(BaseModel):
    chief_complaint: Optional[str] = None
    history_of_present_illness: Optional[str] = None
    past_medical_history: Optional[str] = None
    past_surgical_history: Optional[str] = None
    allergies: Optional[str] = None
    family_history: Optional[str] = None
    personal_history: Optional[str] = None
    review_of_systems: Optional[str] = None

    @field_validator("*")
    @classmethod
    def clean_values(cls, value):
        if isinstance(value, str):
            value = value.strip()
            return value if value else None
        return value


class MissingInformation(BaseModel):
    missing_information: list[str] = Field(default_factory=list)


class RedFlagResult(BaseModel):
    has_red_flags: bool = False
    red_flags: list[str] = Field(default_factory=list)
    priority: str = "normal"

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value):
        allowed = {"normal", "urgent", "emergency"}

        if value not in allowed:
            raise ValueError("Invalid red flag priority")

        return value


def generate_next_question(
    conversation_history: list[dict[str, Any]],
    language: str = "en",
) -> str:
    _validate_conversation(conversation_history)

    conversation_text = _build_conversation_text(conversation_history)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """
You are Clinova, an AI clinical history intake assistant.

Your job is to ask exactly one useful follow-up question
based on the patient's conversation.

Rules:
- Ask only one question.
- Do not diagnose.
- Do not prescribe treatment.
- Do not provide medical conclusions.
- Focus on collecting clinical history.
- Ask for missing important information.
- Keep the question simple and patient-friendly.
- Respond only with the question.
- Preferred language: {language}
""",
        ),
        (
            "human",
            """
Conversation:

{conversation}
""",
        ),
    ])

    try:
        chain = prompt | llm | StrOutputParser()

        response = chain.invoke({
            "language": language,
            "conversation": conversation_text,
        })

        response = response.strip()

        if not response:
            raise ValueError("AI returned an empty question")

        return response

    except Exception as exc:
        raise RuntimeError("AI question generation failed") from exc


def extract_structured_information(
    conversation_history: list[dict[str, Any]],
) -> dict[str, Any]:
    _validate_conversation(conversation_history)

    conversation_text = _build_conversation_text(conversation_history)

    structured_llm = llm.with_structured_output(ClinicalHistory)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """
You extract structured clinical history from a patient conversation.

Rules:
- Use only information explicitly provided.
- Do not invent information.
- Use null when information is unavailable.
- Do not diagnose.
- Do not add explanations.
""",
        ),
        (
            "human",
            """
Conversation:

{conversation}
""",
        ),
    ])

    try:
        chain = prompt | structured_llm

        result = chain.invoke({
            "conversation": conversation_text,
        })

        if not isinstance(result, ClinicalHistory):
            result = ClinicalHistory.model_validate(result)

        return result.model_dump()

    except Exception as exc:
        raise RuntimeError(
            "AI structured information extraction failed"
        ) from exc


def detect_missing_information(
    conversation_history: list[dict[str, Any]],
) -> list[str]:
    _validate_conversation(conversation_history)

    conversation_text = _build_conversation_text(conversation_history)

    structured_llm = llm.with_structured_output(MissingInformation)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """
You identify important missing clinical history information
from a patient conversation.

Possible areas include:
- chief complaint
- duration
- severity
- associated symptoms
- past medical history
- past surgical history
- allergies
- medications
- family history
- personal history

Rules:
- Only include information that is genuinely missing.
- Do not invent information.
- Do not diagnose.
""",
        ),
        (
            "human",
            """
Conversation:

{conversation}
""",
        ),
    ])

    try:
        chain = prompt | structured_llm

        result = chain.invoke({
            "conversation": conversation_text,
        })

        if not isinstance(result, MissingInformation):
            result = MissingInformation.model_validate(result)

        return result.missing_information

    except Exception as exc:
        raise RuntimeError(
            "AI missing information detection failed"
        ) from exc


def detect_red_flags(
    conversation_history: list[dict[str, Any]],
) -> dict[str, Any]:
    _validate_conversation(conversation_history)

    conversation_text = _build_conversation_text(conversation_history)

    structured_llm = llm.with_structured_output(RedFlagResult)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """
You identify possible emergency clinical red flags during patient intake.

Return information according to this structure:

has_red_flags:
Whether potentially serious warning signs are present.

red_flags:
List of concerning symptoms or statements.

priority:
Must be exactly one of:
- normal
- urgent
- emergency

Rules:
- Do not diagnose.
- Identify only symptoms or statements that may require urgent medical attention.
- Do not invent information.
- If uncertain, prefer caution.
""",
        ),
        (
            "human",
            """
Conversation:

{conversation}
""",
        ),
    ])

    try:
        chain = prompt | structured_llm

        result = chain.invoke({
            "conversation": conversation_text,
        })

        if not isinstance(result, RedFlagResult):
            result = RedFlagResult.model_validate(result)

        data = result.model_dump()

        if not data["has_red_flags"]:
            data["red_flags"] = []
            data["priority"] = "normal"

        return data

    except Exception as exc:
        raise RuntimeError(
            "AI red flag detection failed"
        ) from exc


def generate_clinical_summary(
    clinical_context: dict[str, Any],
) -> str:
    if not clinical_context:
        raise ValueError("Clinical context cannot be empty")

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """
You are Clinova, an AI clinical documentation assistant.

Generate a physician-readable clinical history summary from the
provided patient data.

Rules:
- Use only information present in the provided data.
- Do not invent facts.
- Do not diagnose.
- Do not prescribe treatment.
- Clearly distinguish reported symptoms from clinical interpretation.
- Include important medical history, medications, allergies, investigations,
  documents, and red flags when available.
- Mention unavailable information only when clinically relevant.
- Keep the summary concise and clinically useful.
- The summary is a draft for physician review.
- Do not claim that the summary is a final diagnosis.

Use this structure:

Chief Complaint:
History of Present Illness:
Past Medical History:
Past Surgical History:
Allergies:
Medications:
Investigations:
Relevant Documents:
Red Flags:
Clinical Summary:
""",
        ),
        (
            "human",
            """
Patient clinical data:

{clinical_context}
""",
        ),
    ])

    try:
        chain = prompt | llm | StrOutputParser()

        response = chain.invoke({
            "clinical_context": str(clinical_context),
        })

        response = response.strip()

        if not response:
            raise ValueError("AI returned an empty clinical summary")

        return response

    except Exception as exc:
        raise RuntimeError(
            "AI clinical summary generation failed"
        ) from exc