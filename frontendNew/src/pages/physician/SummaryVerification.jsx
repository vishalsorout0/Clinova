import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PatientDetails from '../../components/physician/PatientDetails';
import VerificationPanel from '../../components/physician/VerificationPanel';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as physicianService from '../../services/physicianService';
import { getClinicalSummary } from '../../services/summaryService';
import { pageTransition } from '../../utils/helpers';

export default function SummaryVerification() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const [patientData, summaryData] = await Promise.all([
        physicianService.getPatientDetail(id),
        getClinicalSummary(id),
      ]);
      setPatient(patientData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!patient || !summary) return <Loader fullScreen label="Loading summary…" />;

  return (
    <motion.div {...pageTransition} className="flex flex-col gap-6">
      <PatientDetails patient={patient} />
      <VerificationPanel patientId={id} summary={summary} />
    </motion.div>
  );
}
