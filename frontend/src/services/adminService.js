import { apiRequest } from "./api";


/*  
   USERS
  */

export async function getUsers() {
  return apiRequest(
    "/admin/users"
  );
}


export async function getUser(
  userId
) {
  return apiRequest(
    `/admin/users/${userId}`
  );
}


export async function updateUserRole(
  userId,
  role
) {
  return apiRequest(
    `/admin/users/${userId}/role?role=${encodeURIComponent(
      role
    )}`,
    {
      method: "PATCH",
    }
  );
}


export async function updateUserStatus(
  userId,
  isActive
) {
  return apiRequest(
    `/admin/users/${userId}/status?is_active=${isActive}`,
    {
      method: "PATCH",
    }
  );
}


/*  
   PATIENTS
  */

export async function getAdminPatients() {
  return apiRequest(
    "/admin/patients"
  );
}


export async function getAdminPatient(
  patientId
) {
  return apiRequest(
    `/admin/patients/${patientId}`
  );
}


/*  
   PHYSICIANS
  */

export async function getAdminPhysicians() {
  return apiRequest(
    "/admin/physicians"
  );
}


export async function getAdminPhysician(
  physicianId
) {
  return apiRequest(
    `/admin/physicians/${physicianId}`
  );
}


/*  
   SESSIONS
  */

export async function getAdminSessions() {
  return apiRequest(
    "/admin/sessions"
  );
}


export async function getAdminSession(
  sessionId
) {
  return apiRequest(
    `/admin/sessions/${sessionId}`
  );
}


/*  
   AUDIT LOGS
  */

export async function getAuditLogs() {
  return apiRequest(
    "/admin/audit-logs"
  );
}