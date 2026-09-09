from typing import Any


def generate_mock_abha_id(patient_id: int) -> str:
    return f"91-ABHA-{patient_id:06d}"


def create_abha_profile(
    patient_id: int,
    patient_name: str,
) -> dict[str, Any]:
    return {
        "patient_id": patient_id,
        "abha_id": generate_mock_abha_id(patient_id),
        "patient_name": patient_name,
        "status": "mock_linked",
        "source": "mock_abdm",
    }


def get_abha_profile(
    patient_id: int,
    patient_name: str,
) -> dict[str, Any]:
    return create_abha_profile(
        patient_id=patient_id,
        patient_name=patient_name,
    )


def create_mock_fhir_bundle(
    patient_id: int,
    patient_name: str,
    clinical_data: dict[str, Any],
) -> dict[str, Any]:
    return {
        "resourceType": "Bundle",
        "type": "collection",
        "subject": {
            "patient_id": patient_id,
            "name": patient_name,
        },
        "entry": [
            {
                "resourceType": "Patient",
                "id": str(patient_id),
                "name": patient_name,
            },
            {
                "resourceType": "ClinicalData",
                "patient_id": patient_id,
                "data": clinical_data,
            },
        ],
        "source": "mock_abdm",
    }


def exchange_health_record(
    patient_id: int,
    patient_name: str,
    clinical_data: dict[str, Any],
) -> dict[str, Any]:
    bundle = create_mock_fhir_bundle(
        patient_id=patient_id,
        patient_name=patient_name,
        clinical_data=clinical_data,
    )

    return {
        "status": "success",
        "exchange_type": "mock_fhir",
        "patient_id": patient_id,
        "abha_id": generate_mock_abha_id(patient_id),
        "bundle": bundle,
    }