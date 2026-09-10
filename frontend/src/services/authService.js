import { apiRequest } from "./api";

export async function login(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: formData.toString(),
    formData: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response;
}

export async function registerPatient(patientData) {
  return apiRequest("/auth/register/patient", {
    method: "POST",
    body: patientData,
  });
}

export async function registerPhysician(physicianData) {
  return apiRequest("/auth/register/physician", {
    method: "POST",
    body: physicianData,
  });
}

export function logout() {
  localStorage.removeItem("clinova_token");
  localStorage.removeItem("clinova_user");
}

export function saveAuth(token, user) {
  localStorage.setItem("clinova_token", token);
  localStorage.setItem("clinova_user", JSON.stringify(user));
}

export function getStoredUser() {
  const user = localStorage.getItem("clinova_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("clinova_token");
}