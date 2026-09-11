import { apiRequest } from "./api";

export async function getMyProfile() {
  return apiRequest("/patients/me");
}

export async function updateMyProfile(data) {
  return apiRequest("/patients/me", {
    method: "PUT",
    body: data,
  });
}