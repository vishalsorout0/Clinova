import { createContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  registerPatient,
  registerPhysician,
  logout as logoutRequest,
  saveAuth,
  getStoredToken,
  getStoredUser,
} from "../services/authService";

export const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = atob(normalized);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await loginRequest(email, password);

    const decoded = decodeJwtPayload(response.access_token);

    const loggedInUser = {
      id: decoded?.sub ? Number(decoded.sub) : null,
      role: decoded?.role || null,
      email,
    };

    saveAuth(response.access_token, loggedInUser);

    setToken(response.access_token);
    setUser(loggedInUser);

    return {
      ...response,
      user: loggedInUser,
    };
  }

  async function patientRegister(data) {
    return registerPatient(data);
  }

  async function physicianRegister(data) {
    return registerPhysician(data);
  }

  function logout() {
    logoutRequest();

    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    isPatient: user?.role === "patient",
    isPhysician: user?.role === "physician",
    isAdmin: user?.role === "admin",
    login,
    patientRegister,
    physicianRegister,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}