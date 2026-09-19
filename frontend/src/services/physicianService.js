import { apiRequest } from "./api";

/* ---------------- PHYSICIAN PROFILE ---------------- */

export async function getMyPhysicianProfile() {
  return apiRequest("/physicians/me");
}


/* ---------------- AUTHORIZED PATIENTS ---------------- */

export async function getAuthorizedPatients() {
  return apiRequest("/physicians/patients");
}


/* ---------------- EMERGENCY PATIENTS ---------------- */

export async function getEmergencyPatients() {
  return apiRequest(
    "/physicians/emergency-patients"
  );
}

/* ---------------- COMPLETE PATIENT RECORD ---------------- */

export async function getPhysicianPatientRecords(
  patientId
) {
  return apiRequest(
    `/physicians/patients/${patientId}/records`
  );
}


/* ---------------- PATIENT SUMMARIES ---------------- */

export async function getPatientSummaries(
  patientId
) {
  return apiRequest(
    `/physicians/patients/${patientId}/summaries`
  );
}


/* ---------------- SINGLE SUMMARY ---------------- */

export async function getPhysicianSummary(
  summaryId
) {
  return apiRequest(
    `/physicians/summaries/${summaryId}`
  );
}


/* ---------------- UPDATE SUMMARY ---------------- */

export async function updatePhysicianSummary(
  summaryId,
  data
) {
  return apiRequest(
    `/physicians/summaries/${summaryId}`,
    {
      method: "PUT",
      body: data,
    }
  );
}


/* ---------------- VERIFY ---------------- */

export async function verifySummary(
  summaryId,
  physicianNotes
) {
  return apiRequest(
    `/physicians/summaries/${summaryId}/verify`,
    {
      method: "POST",
      body: {
        physician_notes:
          physicianNotes || null,
      },
    }
  );
}


/* ---------------- REJECT ---------------- */

export async function rejectSummary(
  summaryId,
  physicianNotes
) {
  return apiRequest(
    `/physicians/summaries/${summaryId}/reject`,
    {
      method: "POST",
      body: {
        physician_notes:
          physicianNotes || null,
      },
    }
  );
}


/* ---------------- AVAILABLE PHYSICIANS ---------------- */

export async function getAvailablePhysicians(
  search = ""
) {
  const query = search.trim()
    ? `?search=${encodeURIComponent(
        search.trim()
      )}`
    : "";

  return apiRequest(
    `/physicians/available${query}`
  );
}



export function getPhysicianDocumentUrl(documentId) {
  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";

  return `${baseUrl}/physicians/documents/${documentId}/file`;
}