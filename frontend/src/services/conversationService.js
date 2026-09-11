import { apiRequest } from "./api";

/* ---------------- SESSION ---------------- */

export async function createSession(patientId) {
  return apiRequest(
    `/conversations/session?patient_id=${patientId}`,
    {
      method: "POST",
    }
  );
}

export async function getSession(sessionId) {
  return apiRequest(
    `/conversations/session/${sessionId}`
  );
}

export async function endSession(sessionId) {
  return apiRequest(
    `/conversations/session/${sessionId}/end`,
    {
      method: "POST",
    }
  );
}

/* ---------------- CONVERSATION ---------------- */

export async function createConversation(data) {
  return apiRequest("/conversations/", {
    method: "POST",
    body: data,
  });
}

export async function getPatientConversations(
  patientId
) {
  return apiRequest(
    `/conversations/patient/${patientId}`
  );
}

export async function getConversation(
  conversationId
) {
  return apiRequest(
    `/conversations/${conversationId}`
  );
}

/* ---------------- MESSAGES ---------------- */

export async function sendMessage(
  conversationId,
  data
) {
  return apiRequest(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: data,
    }
  );
}

export async function completeConversation(
  conversationId
) {
  return apiRequest(
    `/conversations/${conversationId}/complete`,
    {
      method: "POST",
    }
  );
}

/* ---------------- AI ---------------- */

export async function getNextQuestion(
  conversationId
) {
  return apiRequest(
    `/conversations/${conversationId}/ai/next-question`
  );
}

export async function getAIExtract(
  conversationId
) {
  return apiRequest(
    `/conversations/${conversationId}/ai/extract`
  );
}

export async function getMissingInformation(
  conversationId
) {
  return apiRequest(
    `/conversations/${conversationId}/ai/missing-information`
  );
}

export async function getRedFlags(
  conversationId
) {
  return apiRequest(
    `/conversations/${conversationId}/ai/red-flags`
  );
}