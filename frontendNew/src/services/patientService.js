import { api, isMockMode, mockDelay } from './api';

const mockProfile = {
  id: 'pat_001',
  name: 'Anita Sharma',
  age: 34,
  gender: 'Female',
  abhaAddress: 'anita.sharma@abdm',
  phone: '+91 98XXX XX321',
  bloodGroup: 'B+',
  knownAllergies: ['Penicillin'],
};

const mockProgress = {
  patientInfo: 'done',
  consent: 'done',
  healthHistory: 'in_progress',
  documents: 'pending',
  clinicalSummary: 'pending',
};

export async function getPatientProfile(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(400);
    return { ...mockProfile, id: patientId };
  }
  const { data } = await api.get(`/patients/${patientId}`);
  return data;
}

export async function updatePatientProfile(patientId, updates) {
  if (isMockMode) {
    await mockDelay(400);
    return { ...mockProfile, ...updates, id: patientId };
  }
  const { data } = await api.patch(`/patients/${patientId}`, updates);
  return data;
}

export async function getConsultationProgress(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(300);
    return { ...mockProgress };
  }
  const { data } = await api.get(`/patients/${patientId}/progress`);
  return data;
}
