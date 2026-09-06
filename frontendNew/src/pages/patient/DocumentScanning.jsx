import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine } from 'lucide-react';
import DocumentUpload from '../../components/documents/DocumentUpload';
import DocumentScanner from '../../components/documents/DocumentScanner';
import OCRResult from '../../components/documents/OCRResult';
import DocumentList from '../../components/documents/DocumentList';
import Button from '../../components/common/Button';
import { PatientContext } from '../../context/PatientContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function DocumentScanning() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { markStepStatus } = useContext(PatientContext);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const handleProcessed = (result) => {
    setOcrResult(result);
    markStepStatus('documents', 'done');
  };

  return (
    <motion.div {...pageTransition} className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('documents.heading')}</h1>
          <p className="text-ink-500">{t('documents.subheading')}</p>
        </div>
        <Button variant="secondary" icon={ScanLine} onClick={() => setIsScannerOpen(true)}>
          {t('documents.scanDocument')}
        </Button>
      </div>

      <DocumentUpload onProcessed={handleProcessed} />

      {ocrResult && <OCRResult result={ocrResult} />}

      <div>
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink-800">Previously added</h2>
        <DocumentList />
      </div>

      <Button size="lg" onClick={() => navigate(ROUTES.PATIENT_TIMELINE)}>
        {t('common.continue')}
      </Button>

      <DocumentScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCaptured={() => markStepStatus('documents', 'in_progress')}
      />
    </motion.div>
  );
}
