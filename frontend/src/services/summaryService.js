import { apiRequest } from "./api";

export async function createSummary(data) {
  return apiRequest("/summaries/", {
    method: "POST",
    body: data,
  });
}

export async function generateSummary(data) {
  return apiRequest("/summaries/generate", {
    method: "POST",
    body: data,
  });
}

export async function getPatientSummaries(patientId) {
  return apiRequest(
    `/summaries/patient/${patientId}`
  );
}

export async function getSummary(summaryId) {
  return apiRequest(`/summaries/${summaryId}`);
}

export async function updateSummary(summaryId, data) {
  return apiRequest(`/summaries/${summaryId}`, {
    method: "PUT",
    body: data,
  });
}