import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMyProfile,
} from "../services/patientService";

import {
  getPatientHistory,
} from "../services/historyService";

import {
  getPatientDocuments,
  getPatientLabReports,
  getPatientMedications,
} from "../services/documentService";

import {
  getPatientSummaries,
} from "../services/summaryService";

import { useAuth } from "../hooks/useAuth";

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const { user, isPatient } = useAuth();

  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [medications, setMedications] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadPatientData() {
    if (!isPatient || !user?.id) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const patientProfile =
        await getMyProfile();

      setProfile(patientProfile);

      const patientId = patientProfile.id;

      const [
        historyData,
        documentData,
        labData,
        medicationData,
        summaryData,
      ] = await Promise.all([
        getPatientHistory(patientId),
        getPatientDocuments(patientId),
        getPatientLabReports(patientId),
        getPatientMedications(patientId),
        getPatientSummaries(patientId),
      ]);

      setHistory(historyData || []);
      setDocuments(documentData || []);
      setLabReports(labData || []);
      setMedications(medicationData || []);
      setSummaries(summaryData || []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load patient data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isPatient && user?.id) {
      loadPatientData();
    }
  }, [isPatient, user?.id]);

  const value = {
    profile,
    setProfile,

    history,
    setHistory,

    documents,
    setDocuments,

    labReports,
    setLabReports,

    medications,
    setMedications,

    summaries,
    setSummaries,

    loading,
    error,

    refreshPatientData: loadPatientData,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientContext() {
  const context = useContext(PatientContext);

  if (!context) {
    throw new Error(
      "usePatientContext must be used inside PatientProvider"
    );
  }

  return context;
}

export default usePatientContext;