import { apiRequest } from "./api";

export async function createHistory(data) {
  return apiRequest("/history/", {
    method: "POST",
    body: data,
  });
}

export async function getPatientHistory(patientId) {
  return apiRequest(`/history/patient/${patientId}`);
}

export async function getHistory(historyId) {
  return apiRequest(`/history/${historyId}`);
}

export async function updateHistory(historyId, data) {
  return apiRequest(`/history/${historyId}`, {
    method: "PUT",
    body: data,
  });
}

export async function getTimeline(patientId) {
  return apiRequest(`/history/timeline/${patientId}`);
}