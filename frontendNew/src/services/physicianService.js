import { api, isMockMode, mockDelay } from './api';

const mockQueue = [
  {
    id: 'pat_001',
    name: 'Anita Sharma',
    age: 34,
    gender: 'Female',
    chiefComplaint: 'Chest discomfort for the past 3 days',
    waitingSince: '09:20 AM',
    priority: 'routine',
  },
  {
    id: 'pat_002',
    name: 'Ramesh Kumar',
    age: 58,
    gender: 'Male',
    chiefComplaint: 'Persistent cough and mild fever',
    waitingSince: '09:35 AM',
    priority: 'routine',
  },
  {
    id: 'pat_003',
    name: 'Fatima Sheikh',
    age: 27,
    gender: 'Female',
    chiefComplaint: 'Severe abdominal pain — flagged by AI assistant',
    waitingSince: '09:41 AM',
    priority: 'urgent',
  },
];

const mockPatientDetail = {
  pat_001: {
    id: 'pat_001',
    name: 'Anita Sharma',
    age: 34,
    gender: 'Female',
    abhaAddress: 'anita.sharma@abdm',
    chiefComplaint: 'Chest discomfort for the past 3 days',
  },
  pat_002: {
    id: 'pat_002',
    name: 'Ramesh Kumar',
    age: 58,
    gender: 'Male',
    abhaAddress: 'ramesh.kumar@abdm',
    chiefComplaint: 'Persistent cough and mild fever',
  },
  pat_003: {
    id: 'pat_003',
    name: 'Fatima Sheikh',
    age: 27,
    gender: 'Female',
    abhaAddress: 'fatima.sheikh@abdm',
    chiefComplaint: 'Severe abdominal pain — flagged by AI assistant',
  },
};

export async function getPatientQueue() {
  if (isMockMode) {
    await mockDelay(500);
    return mockQueue;
  }
  const { data } = await api.get('/physician/queue');
  return data;
}

export async function getPatientDetail(patientId) {
  if (isMockMode) {
    await mockDelay(450);
    return mockPatientDetail[patientId] || mockPatientDetail.pat_001;
  }
  const { data } = await api.get(`/physician/patients/${patientId}`);
  return data;
}

export async function updateSummaryField(patientId, field, value) {
  if (isMockMode) {
    await mockDelay(250);
    return { success: true, field, value, modifiedByPhysician: true };
  }
  const { data } = await api.patch(`/physician/patients/${patientId}/summary`, { field, value });
  return data;
}

export async function markSummaryVerified(patientId) {
  if (isMockMode) {
    await mockDelay(400);
    return { success: true, status: 'verified', verifiedAt: new Date().toISOString() };
  }
  const { data } = await api.post(`/physician/patients/${patientId}/summary/verify`);
  return data;
}

export async function acceptSummary(patientId) {
  if (isMockMode) {
    await mockDelay(400);
    return { success: true, status: 'accepted' };
  }
  const { data } = await api.post(`/physician/patients/${patientId}/summary/accept`);
  return data;
}

export async function rejectSummary(patientId, reason) {
  if (isMockMode) {
    await mockDelay(400);
    return { success: true, status: 'rejected', reason };
  }
  const { data } = await api.post(`/physician/patients/${patientId}/summary/reject`, { reason });
  return data;
}
