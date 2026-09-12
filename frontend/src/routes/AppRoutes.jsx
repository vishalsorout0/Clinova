import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import PatientRegister from "../pages/auth/PatientRegister";
import PhysicianRegister from "../pages/auth/PhysicianRegister";

import ProtectedRoute from "../components/common/ProtectedRoute";

import PatientDashboard from "../pages/patient/PatientDashboard";
import Profile from "../pages/patient/Profile";
import MedicalHistory from "../pages/patient/MedicalHistory";
import Documents from "../pages/patient/Documents";
import LabReports from "../pages/patient/LabReports";
import Medications from "../pages/patient/Medications";
import Timeline from "../pages/patient/Timeline";
import Summaries from "../pages/patient/Summaries";
import Consultation from "../pages/patient/Consultation";
import PhysicianDashboard from "../pages/physician/PhysicianDashboard";
import Patients from "../pages/physician/Patients";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Emergency from "../pages/patient/Emergency";











function Placeholder({ title }) {
  return (
    <div className="placeholder-page">
      <h1>{title}</h1>
      <p>
        This module will be added in the next batch.
      </p>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="placeholder-page">
      <h1>Unauthorized</h1>

      <p>
        You do not have permission to access this page.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register/patient"
        element={<PatientRegister />}
      />

      <Route
        path="/register/physician"
        element={<PhysicianRegister />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* PATIENT ROUTES */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["patient"]}
          />
        }
      >
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient/profile"
          element={<Profile />}
        />

        <Route
          path="/patient/history"
          element={<MedicalHistory />}
        />

        <Route
          path="/patient/documents"
          element={<Documents />}
        />

        <Route
          path="/patient/labs"
          element={<LabReports />}
        />

        <Route
          path="/patient/medications"
          element={<Medications />}
        />

        <Route
          path="/patient/timeline"
          element={<Timeline />}
        />

        <Route
          path="/patient/summaries"
          element={<Summaries />}
        />

          <Route
          path="/patient/consultation"
          element={<Consultation />}
        />
      </Route>

       <Route
        path="/patient/emergency"
        element={<Emergency />}
      />

      {/* PHYSICIAN */}

            <Route
        element={
          <ProtectedRoute
            allowedRoles={["physician"]}
          />
        }
      >
        <Route
          path="/physician/dashboard"
          element={
            <PhysicianDashboard />
          }
        />

        <Route
          path="/physician/patients"
          element={
            <Patients />
          }
        />
      </Route>

      {/* ADMIN */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          />
        }
      >
      <Route
        path="/admin/dashboard"
        element={
          <AdminDashboard />
        }
      />
    </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
}