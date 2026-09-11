import { apiRequest } from "./api";


export async function uploadDocument(formData) {
  const patientId = formData.get("patient_id");

  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  formData.delete("patient_id");

  return apiRequest(
    `/documents/upload?patient_id=${patientId}`,
    {
      method: "POST",
      body: formData,
      formData: true,
    }
  );
}

export async function getPatientDocuments(patientId) {
  return apiRequest(`/documents/patient/${patientId}`);
}

export async function getDocument(documentId) {
  return apiRequest(`/documents/${documentId}`);
}

export async function deleteDocument(documentId) {
  return apiRequest(`/documents/${documentId}`, {
    method: "DELETE",
  });
}

export async function runOCR(documentId) {
  return apiRequest(`/documents/${documentId}/ocr`, {
    method: "POST",
  });
}

export async function createLabReport(data) {
  return apiRequest("/documents/lab-reports", {
    method: "POST",
    body: data,
  });
}

export async function getPatientLabReports(patientId) {
  return apiRequest(
    `/documents/lab-reports/patient/${patientId}`
  );
}

export async function getLabReport(labReportId) {
  return apiRequest(
    `/documents/lab-reports/${labReportId}`
  );
}

export async function createMedication(data) {
  return apiRequest("/documents/medications", {
    method: "POST",
    body: data,
  });
}

export async function getPatientMedications(patientId) {
  return apiRequest(
    `/documents/medications/patient/${patientId}`
  );
}

export async function getMedication(medicationId) {
  return apiRequest(
    `/documents/medications/${medicationId}`
  );
}