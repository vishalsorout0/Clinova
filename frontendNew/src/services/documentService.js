import { api, isMockMode, mockDelay } from './api';
import { generateId } from '../utils/helpers';

const mockDocuments = [
  {
    id: 'doc_001',
    name: 'Blood_Test_Report_March.pdf',
    type: 'Lab Report',
    date: '2026-03-12',
    status: 'processed',
  },
  {
    id: 'doc_002',
    name: 'Prescription_April.jpg',
    type: 'Prescription',
    date: '2026-04-02',
    status: 'processed',
  },
  {
    id: 'doc_003',
    name: 'MRI_Report_June.pdf',
    type: 'Imaging',
    date: '2026-06-18',
    status: 'processed',
  },
];

const mockOcrResults = {
  doc_001: {
    documentName: 'Blood_Test_Report_March.pdf',
    patientInfo: { name: 'Anita Sharma', age: 34, reportDate: '2026-03-12' },
    labValues: [
      { name: 'Hemoglobin', value: '12.4', unit: 'g/dL', range: '12.0 - 15.5', status: 'normal' },
      { name: 'Glucose (Fasting)', value: '142', unit: 'mg/dL', range: '70 - 100', status: 'abnormal' },
      { name: 'WBC Count', value: '8.2', unit: 'x10^3/uL', range: '4.0 - 11.0', status: 'normal' },
      { name: 'Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6 - 1.3', status: 'normal' },
      { name: 'TSH', value: '—', unit: 'uIU/mL', range: '0.4 - 4.0', status: 'undetermined' },
    ],
  },
};

export async function uploadDocument(file, onProgress) {
  if (isMockMode) {
    for (let progress = 0; progress <= 100; progress += 20) {
      // eslint-disable-next-line no-await-in-loop
      await mockDelay(180);
      onProgress?.(progress);
    }
    return { id: generateId('doc'), name: file.name, status: 'uploaded' };
  }

  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return data;
}

export async function processDocumentOcr(documentId, onStage) {
  if (isMockMode) {
    const stages = ['reading', 'extracting', 'checking', 'completed'];
    // eslint-disable-next-line no-restricted-syntax
    for (const stage of stages) {
      // eslint-disable-next-line no-await-in-loop
      await mockDelay(500);
      onStage?.(stage);
    }
    return mockOcrResults.doc_001;
  }
  const { data } = await api.post(`/documents/${documentId}/ocr`);
  return data;
}

export async function getDocumentList(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(400);
    return mockDocuments;
  }
  const { data } = await api.get(`/patients/${patientId}/documents`);
  return data;
}

export async function getOcrResult(documentId) {
  if (isMockMode) {
    await mockDelay(300);
    return mockOcrResults[documentId] || mockOcrResults.doc_001;
  }
  const { data } = await api.get(`/documents/${documentId}/ocr-result`);
  return data;
}

const mockTimeline = [
  { id: 'tl_001', date: '2026-03-12', title: 'Blood Test Report', type: 'Lab Report', documentId: 'doc_001' },
  { id: 'tl_002', date: '2026-04-02', title: 'Prescription Issued', type: 'Prescription', documentId: 'doc_002' },
  { id: 'tl_003', date: '2026-06-18', title: 'MRI Report', type: 'Imaging', documentId: 'doc_003' },
];

const mockMedications = [
  {
    id: 'med_001',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily, after meals',
    source: 'Prescription_April.jpg',
  },
  {
    id: 'med_002',
    name: 'Paracetamol',
    dosage: '500 mg',
    frequency: 'As needed for pain, max 3x/day',
    source: 'Prescription_April.jpg',
  },
];

export async function getMedicalTimeline(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(400);
    return mockTimeline;
  }
  const { data } = await api.get(`/patients/${patientId}/timeline`);
  return data;
}

export async function getMedications(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(350);
    return mockMedications;
  }
  const { data } = await api.get(`/patients/${patientId}/medications`);
  return data;
}
