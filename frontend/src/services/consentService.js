import { apiRequest } from "./api";

export async function createConsent(data) {
  return apiRequest("/consent/", {
    method: "POST",
    body: data,
  });
}

export async function getPatientConsents(patientId) {
  return apiRequest(
    `/consent/patient/${patientId}`
  );
}

export async function revokeConsent(consentId) {
  return apiRequest(
    `/consent/${consentId}`,
    {
      method: "DELETE",
    }
  );
}