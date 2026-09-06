import { createContext, useCallback, useMemo, useState } from 'react';
import { CONSULTATION_STEPS } from '../utils/constants';

export const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({
    patientInfo: 'pending',
    consent: 'pending',
    healthHistory: 'pending',
    documents: 'pending',
    clinicalSummary: 'pending',
  });
  const [structuredHistory, setStructuredHistory] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const markStepStatus = useCallback((step, status) => {
    if (!CONSULTATION_STEPS.includes(step)) return;
    setProgress((prev) => ({ ...prev, [step]: status }));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      progress,
      setProgress,
      markStepStatus,
      structuredHistory,
      setStructuredHistory,
      consentGiven,
      setConsentGiven,
    }),
    [profile, progress, markStepStatus, structuredHistory, consentGiven]
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}
