import { Routes, Route } from 'react-router-dom';

import Login from '../pages/auth/Login';
import NotFound from '../pages/auth/NotFound';
import AyurvedaMode from '../pages/ayush/AyurvedaMode';

import PatientLogin from '../pages/patient/PatientLogin';
import LanguageSelection from '../pages/patient/LanguageSelection';
import Consent from '../pages/patient/Consent';
import PatientDashboard from '../pages/patient/PatientDashboard';
import HistoryTaking from '../pages/patient/HistoryTaking';
import DocumentScanning from '../pages/patient/DocumentScanning';
import MedicalTimelinePage from '../pages/patient/MedicalTimeline';
import ClinicalSummary from '../pages/patient/ClinicalSummary';
import PatientConfirmationPage from '../pages/patient/PatientConfirmation';

import PhysicianLogin from '../pages/physician/PhysicianLogin';
import PhysicianDashboard from '../pages/physician/PhysicianDashboard';
import PatientHistory from '../pages/physician/PatientHistory';
import SummaryVerification from '../pages/physician/SummaryVerification';

import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';

import PatientLayout from '../layouts/PatientLayout';
import PhysicianLayout from '../layouts/PhysicianLayout';
import AdminLayout from '../layouts/AdminLayout';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { ROUTES, ROLES } from '../utils/constants';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public entry points */}
      <Route path={ROUTES.WELCOME} element={<Login />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.AYUSH} element={<AyurvedaMode />} />
      <Route path={ROUTES.PHYSICIAN_LOGIN} element={<PhysicianLogin />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

      {/* Patient experience */}
      <Route element={<PatientLayout />}>
        <Route path={ROUTES.PATIENT_LANGUAGE} element={<LanguageSelection />} />
        <Route path={ROUTES.PATIENT_LOGIN} element={<PatientLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.PATIENT]} />}>
            <Route path={ROUTES.PATIENT_CONSENT} element={<Consent />} />
            <Route path={ROUTES.PATIENT_DASHBOARD} element={<PatientDashboard />} />
            <Route path={ROUTES.PATIENT_HISTORY} element={<HistoryTaking />} />
            <Route path={ROUTES.PATIENT_DOCUMENTS} element={<DocumentScanning />} />
            <Route path={ROUTES.PATIENT_TIMELINE} element={<MedicalTimelinePage />} />
            <Route path={ROUTES.PATIENT_SUMMARY} element={<ClinicalSummary />} />
            <Route path={ROUTES.PATIENT_CONFIRMATION} element={<PatientConfirmationPage />} />
          </Route>
        </Route>
      </Route>

      {/* Physician experience */}
      <Route element={<PhysicianLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.PHYSICIAN]} />}>
            <Route path={ROUTES.PHYSICIAN_DASHBOARD} element={<PhysicianDashboard />} />
            <Route path={ROUTES.PHYSICIAN_PATIENT} element={<PatientHistory />} />
            <Route path={ROUTES.PHYSICIAN_PATIENT_VERIFY} element={<SummaryVerification />} />
          </Route>
        </Route>
      </Route>

      {/* Admin experience */}
      <Route element={<AdminLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_SESSIONS} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
