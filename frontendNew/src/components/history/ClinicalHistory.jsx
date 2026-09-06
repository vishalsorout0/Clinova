import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import HistorySection from './HistorySection';
import { useLanguage } from '../../hooks/useLanguage';
import { SEVERITY_MAX } from '../../utils/constants';

function EditableLine({ value, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="flex-1 rounded-lg border border-teal-300 px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-teal-600"
        />
        <button
          type="button"
          aria-label="Save"
          onClick={() => {
            onChange(draft);
            setIsEditing(false);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white"
        >
          <Check className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span>{value}</span>
      <button
        type="button"
        aria-label="Edit"
        onClick={() => setIsEditing(true)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function ClinicalHistory({ history, onUpdate }) {
  const { t } = useLanguage();
  if (!history) return null;

  const update = (field) => (value) => onUpdate?.({ ...history, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-500">{t('history.reviewNote')}</p>

      <HistorySection title={t('history.chiefComplaint')}>
        <EditableLine value={history.chiefComplaint} onChange={update('chiefComplaint')} />
      </HistorySection>

      <HistorySection title={t('history.duration')}>
        <EditableLine value={history.duration} onChange={update('duration')} />
      </HistorySection>

      <HistorySection title={t('history.severity')}>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${(history.severity / SEVERITY_MAX) * 100}%` }}
            />
          </div>
          <span className="font-heading font-semibold text-ink-800">
            {history.severity} / {SEVERITY_MAX}
          </span>
        </div>
      </HistorySection>

      <HistorySection title={t('history.associatedSymptoms')}>
        <ul className="list-inside list-disc space-y-1">
          {(history.associatedSymptoms || []).map((symptom) => (
            <li key={symptom}>{symptom}</li>
          ))}
        </ul>
      </HistorySection>

      <HistorySection title={t('history.medicalHistory')} defaultOpen={false}>
        <ul className="list-inside list-disc space-y-1">
          {(history.pastMedicalHistory || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </HistorySection>
    </div>
  );
}
