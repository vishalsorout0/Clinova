import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import PatientDetails from '../../components/physician/PatientDetails';
import PatientSummary from '../../components/physician/PatientSummary';
import ClinicalHistory from '../../components/history/ClinicalHistory';
import DocumentList from '../../components/documents/DocumentList';
import MedicalTimeline from '../../components/history/MedicalTimeline';
import MedicationList from '../../components/reports/MedicationList';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as physicianService from '../../services/physicianService';
import { getClinicalSummary } from '../../services/summaryService';
import { getStructuredHistory } from '../../services/conversationService';
import { ROUTES } from '../../utils/constants';
import { classNames, pageTransition } from '../../utils/helpers';

const TABS = [
  { key: 'summary', label: 'Summary' },
  { key: 'history', label: 'Clinical history' },
  { key: 'documents', label: 'Documents' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'medications', label: 'Medications' },
];

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [patient, setPatient] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const [patientData, summaryData, historyData] = await Promise.all([
        physicianService.getPatientDetail(id),
        getClinicalSummary(id),
        getStructuredHistory(id),
      ]);
      setPatient(patientData);
      setSummary(summaryData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!patient) return <Loader fullScreen label="Loading patient…" />;

  return (
    <motion.div {...pageTransition} className="flex flex-col gap-6">
      <PatientDetails patient={patient} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-ink-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={classNames(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.key ? 'bg-white text-teal-700 shadow-card' : 'text-ink-500'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button icon={ShieldCheck} onClick={() => navigate(ROUTES.PHYSICIAN_PATIENT_VERIFY.replace(':id', id))}>
          Verify summary
        </Button>
      </div>

      {activeTab === 'summary' && <PatientSummary summary={summary} />}
      {activeTab === 'history' && <ClinicalHistory history={history} onUpdate={setHistory} />}
      {activeTab === 'documents' && <DocumentList patientId={id} />}
      {activeTab === 'timeline' && <MedicalTimeline patientId={id} />}
      {activeTab === 'medications' && <MedicationList patientId={id} />}
    </motion.div>
  );
}
