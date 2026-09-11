import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";

import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PatientProvider>
          <AppRoutes />
        </PatientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}