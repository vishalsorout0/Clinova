import { api, isMockMode, mockDelay } from './api';

const mockSummary = {
  aiGenerated: true,
  verified: false,
  patientInfo: { name: 'Anita Sharma', age: 34, gender: 'Female' },
  chiefComplaint: 'Chest discomfort for the past 3 days',
  historyOfPresentIllness:
    'Patient reports intermittent chest discomfort over 3 days, moderate severity, associated with mild breathlessness on exertion. No radiation reported. Symptoms partially relieved by rest.',
  pastMedicalHistory: ['Type 2 diabetes (2019)', 'Seasonal allergic rhinitis'],
  currentMedications: ['Metformin 500mg twice daily', 'Paracetamol 500mg as needed'],
  allergies: ['Penicillin'],
  investigations: ['Blood Test Report (March 2026)', 'MRI Report (June 2026)'],
  abnormalFindings: ['Fasting glucose elevated at 142 mg/dL'],
  notes: 'Patient appears anxious about symptoms; would benefit from reassurance and timely evaluation.',
};

export async function getClinicalSummary(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(700);
    return { ...mockSummary, patientId };
  }
  const { data } = await api.get(`/patients/${patientId}/summary`);
  return data;
}

export async function confirmSummary(patientId, summary) {
  if (isMockMode) {
    await mockDelay(600);
    return { success: true, confirmedAt: new Date().toISOString(), summary };
  }
  const { data } = await api.post(`/patients/${patientId}/summary/confirm`, { summary });
  return data;
}
