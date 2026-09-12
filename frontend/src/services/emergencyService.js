import { apiRequest } from "./api";

export async function getEmergencyStatus(
  conversationId
) {
  return apiRequest(
    `/emergency/conversation/${conversationId}`
  );
}

export async function triggerEmergencyAlert(
  conversationId
) {
  return apiRequest(
    `/emergency/conversation/${conversationId}/alert`,
    {
      method: "POST",
    }
  );
}