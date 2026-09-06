import { useState } from 'react';
import { ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import SummaryEditor from './SummaryEditor';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import * as physicianService from '../../services/physicianService';
import { useLanguage } from '../../hooks/useLanguage';

const EDITABLE_FIELDS = [
  { key: 'chiefComplaint', label: 'summary.chiefComplaint' },
  { key: 'historyOfPresentIllness', label: 'summary.hpi' },
  { key: 'notes', label: 'summary.notes' },
];

export default function VerificationPanel({ patientId, summary, onStatusChange }) {
  const { t } = useLanguage();
  const [fields, setFields] = useState(summary || {});
  const [modified, setModified] = useState({});
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState('pending');
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const handleSaveField = async (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setModified((prev) => ({ ...prev, [key]: true }));
    await physicianService.updateSummaryField(patientId, key, value);
  };

  const handleMarkVerified = async () => {
    setIsBusy(true);
    try {
      await physicianService.markSummaryVerified(patientId);
      setStatus('verified');
      onStatusChange?.('verified');
    } finally {
      setIsBusy(false);
    }
  };

  const handleAccept = async () => {
    setIsBusy(true);
    try {
      await physicianService.acceptSummary(patientId);
      setStatus('accepted');
      onStatusChange?.('accepted');
    } finally {
      setIsBusy(false);
    }
  };

  const handleReject = async () => {
    setIsBusy(true);
    try {
      await physicianService.rejectSummary(patientId, 'Requires further in-person evaluation');
      setStatus('rejected');
      onStatusChange?.('rejected');
    } finally {
      setIsBusy(false);
      setShowRejectConfirm(false);
    }
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 font-heading text-lg font-semibold text-ink-800">{t('physician.verification.heading')}</h3>

      <div className="flex flex-col gap-3">
        {EDITABLE_FIELDS.map((field) => (
          <SummaryEditor
            key={field.key}
            label={t(field.label)}
            value={fields[field.key] || ''}
            wasModified={Boolean(modified[field.key])}
            onSave={(value) => handleSaveField(field.key, value)}
          />
        ))}
      </div>

      {status !== 'pending' && (
        <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
          Status: {status}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" icon={ShieldCheck} onClick={handleMarkVerified} isLoading={isBusy}>
          {t('physician.verification.markVerified')}
        </Button>
        <Button variant="primary" icon={ThumbsUp} onClick={handleAccept} isLoading={isBusy}>
          {t('physician.verification.acceptSummary')}
        </Button>
        <Button variant="danger" icon={ThumbsDown} onClick={() => setShowRejectConfirm(true)} isLoading={isBusy}>
          {t('physician.verification.rejectSummary')}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showRejectConfirm}
        title={t('physician.verification.rejectSummary')}
        message="This will flag the AI summary as rejected and request a manual re-assessment. Continue?"
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        isLoading={isBusy}
        onConfirm={handleReject}
        onCancel={() => setShowRejectConfirm(false)}
      />
    </div>
  );
}
