import { api, isMockMode, mockDelay } from './api';

const mockStats = {
  totalPatients: 1284,
  activeConsultations: 17,
  doctors: 22,
  documentsProcessed: 3921,
  systemStatus: 'operational',
};

const mockUsers = [
  { id: 'u_001', name: 'Dr. Rohan Verma', role: 'physician', department: 'General Medicine', status: 'active' },
  { id: 'u_002', name: 'Dr. Priya Nair', role: 'physician', department: 'Ayurveda OPD', status: 'active' },
  { id: 'u_003', name: 'System Administrator', role: 'admin', department: 'IT', status: 'active' },
  { id: 'u_004', name: 'Anita Sharma', role: 'patient', department: '—', status: 'active' },
  { id: 'u_005', name: 'Kiosk Terminal 3', role: 'kiosk', department: 'OPD Block A', status: 'inactive' },
];

const mockSessions = [
  { id: 's_001', user: 'Anita Sharma', role: 'patient', startedAt: '09:20 AM', device: 'Kiosk 1', status: 'active' },
  { id: 's_002', user: 'Dr. Rohan Verma', role: 'physician', startedAt: '08:55 AM', device: 'Desk 2', status: 'active' },
  { id: 's_003', user: 'Ramesh Kumar', role: 'patient', startedAt: '09:35 AM', device: 'Kiosk 2', status: 'idle' },
];

const mockAuditLogs = [
  { id: 'a_001', actor: 'Dr. Rohan Verma', action: 'Verified AI clinical summary', target: 'Anita Sharma', time: '10:02 AM' },
  { id: 'a_002', actor: 'System', action: 'Red-flag alert raised', target: 'Fatima Sheikh', time: '09:44 AM' },
  { id: 'a_003', actor: 'Anita Sharma', action: 'Uploaded document', target: 'Blood_Test_Report_March.pdf', time: '09:26 AM' },
  { id: 'a_004', actor: 'System Administrator', action: 'Deactivated kiosk terminal', target: 'Kiosk Terminal 3', time: '08:40 AM' },
];

export async function getAdminStats() {
  if (isMockMode) {
    await mockDelay(500);
    return mockStats;
  }
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function getUsers() {
  if (isMockMode) {
    await mockDelay(450);
    return mockUsers;
  }
  const { data } = await api.get('/admin/users');
  return data;
}

export async function getSessions() {
  if (isMockMode) {
    await mockDelay(450);
    return mockSessions;
  }
  const { data } = await api.get('/admin/sessions');
  return data;
}

export async function getAuditLogs() {
  if (isMockMode) {
    await mockDelay(450);
    return mockAuditLogs;
  }
  const { data } = await api.get('/admin/audit-logs');
  return data;
}
