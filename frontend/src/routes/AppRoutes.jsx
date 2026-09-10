import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import PatientRegister from "../pages/auth/PatientRegister";
import PhysicianRegister from "../pages/auth/PhysicianRegister";

import ProtectedRoute from "../components/common/ProtectedRoute";

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
        element={<Navigate to="/login" replace />}
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

      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route
          path="/patient/dashboard"
          element={
            <Placeholder title="Patient Dashboard" />
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["physician"]} />
        }
      >
        <Route
          path="/physician/dashboard"
          element={
            <Placeholder title="Physician Dashboard" />
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]} />
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <Placeholder title="Admin Dashboard" />
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}