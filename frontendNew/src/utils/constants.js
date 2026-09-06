// Central place for fixed values used across the app.
// Keep UI copy out of here — that belongs in /src/i18n.

export const APP_NAME = 'Sahayak';

export const ROLES = {
  PATIENT: 'patient',
  PHYSICIAN: 'physician',
  ADMIN: 'admin',
};

export const ROUTES = {
  WELCOME: '/',
  PATIENT_LANGUAGE: '/patient/language',
  PATIENT_CONSENT: '/patient/consent',
  PATIENT_LOGIN: '/patient/login',
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_HISTORY: '/patient/history',
  PATIENT_DOCUMENTS: '/patient/documents',
  PATIENT_TIMELINE: '/patient/timeline',
  PATIENT_SUMMARY: '/patient/summary',
  PATIENT_CONFIRMATION: '/patient/confirmation',

  PHYSICIAN_LOGIN: '/physician/login',
  PHYSICIAN_DASHBOARD: '/physician/dashboard',
  PHYSICIAN_PATIENT: '/physician/patient/:id',
  PHYSICIAN_PATIENT_VERIFY: '/physician/patient/:id/verify',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SESSIONS: '/admin/sessions',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',

  AYUSH: '/ayush',
  LOGIN: '/login',
};

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export const SUPPORTED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export const MAX_DOCUMENT_SIZE_MB = 15;

export const CONSULTATION_STEPS = [
  'patientInfo',
  'consent',
  'healthHistory',
  'documents',
  'clinicalSummary',
];

export const SESSION_TIMEOUT_WARNING_SECONDS = 45;
export const SESSION_TIMEOUT_SECONDS = 15 * 60; // 15 minutes of inactivity

export const SEVERITY_MAX = 10;

export const ABNORMAL_STATUS = {
  NORMAL: 'normal',
  ABNORMAL: 'abnormal',
  UNDETERMINED: 'undetermined',
};

export const MOCK_MODE = !import.meta.env.VITE_API_BASE_URL;
