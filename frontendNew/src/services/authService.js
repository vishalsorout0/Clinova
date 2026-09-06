import { api, isMockMode, mockDelay } from './api';
import { generateId } from '../utils/helpers';

const TOKEN_KEY = 'sahayak_token';
const SESSION_KEY = 'sahayak_session';

const MOCK_OTP = '123456';

function persistSession(session) {
  sessionStorage.setItem(TOKEN_KEY, session.token);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getStoredSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/** Step 1 of ABHA login: request an OTP for the given ABHA identifier. */
export async function requestAbhaOtp(identifier) {
  if (isMockMode) {
    await mockDelay(700);
    if (!identifier || identifier.trim().length < 4) {
      throw new Error('Please enter a valid ABHA number or address.');
    }
    return { requestId: generateId('otp'), maskedMobile: '+91 XXXXX XX321' };
  }
  const { data } = await api.post('/auth/abha/request-otp', { identifier });
  return data;
}

/** Step 2 of ABHA login: verify OTP and establish a patient session. */
export async function verifyAbhaOtp({ requestId, otp, identifier }) {
  if (isMockMode) {
    await mockDelay(900);
    if (otp !== MOCK_OTP) {
      throw new Error('Incorrect OTP. Please try again.');
    }
    return persistSession({
      token: generateId('tok'),
      role: 'patient',
      user: {
        id: 'pat_001',
        name: 'Anita Sharma',
        abhaAddress: identifier?.includes('@') ? identifier : 'anita.sharma@abdm',
        age: 34,
        gender: 'Female',
      },
      requestId,
      loggedInAt: new Date().toISOString(),
    });
  }
  const { data } = await api.post('/auth/abha/verify-otp', { requestId, otp, identifier });
  return persistSession(data);
}

export async function continueAsGuest() {
  if (isMockMode) {
    await mockDelay(400);
    return persistSession({
      token: generateId('tok'),
      role: 'patient',
      user: { id: 'guest_001', name: 'Guest Patient', abhaAddress: null, age: null, gender: null },
      loggedInAt: new Date().toISOString(),
    });
  }
  const { data } = await api.post('/auth/guest');
  return persistSession(data);
}

export async function loginPhysician({ employeeId, password }) {
  if (isMockMode) {
    await mockDelay(700);
    if (!employeeId || !password) {
      throw new Error('Please enter your employee ID and password.');
    }
    return persistSession({
      token: generateId('tok'),
      role: 'physician',
      user: { id: 'doc_001', name: 'Dr. Rohan Verma', department: 'General Medicine', employeeId },
      loggedInAt: new Date().toISOString(),
    });
  }
  const { data } = await api.post('/auth/physician/login', { employeeId, password });
  return persistSession(data);
}

export async function loginAdmin({ username, password }) {
  if (isMockMode) {
    await mockDelay(700);
    if (!username || !password) {
      throw new Error('Please enter your username and password.');
    }
    return persistSession({
      token: generateId('tok'),
      role: 'admin',
      user: { id: 'admin_001', name: 'System Administrator', username },
      loggedInAt: new Date().toISOString(),
    });
  }
  const { data } = await api.post('/auth/admin/login', { username, password });
  return persistSession(data);
}

export async function logout() {
  if (isMockMode) {
    await mockDelay(200);
    clearSession();
    return true;
  }
  await api.post('/auth/logout');
  clearSession();
  return true;
}
