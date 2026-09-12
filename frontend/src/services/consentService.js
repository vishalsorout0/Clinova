import { apiRequest } from "./api";

/*
 * Create / update consent.
 *
 * Backend schema:
 *
 * {
 *   patient_id: number,
 *   physician_id: number,
 *   consent_type: string,
 *   granted: boolean
 * }
 */

export async function createConsent(data) {
  return apiRequest("/consent/", {
    method: "POST",
    body: data,
  });
}

/*
 * Get consent records for patient.
 */
export async function getPatientConsents(
  patientId
) {
  return apiRequest(
    `/consent/patient/${patientId}`
  );
}