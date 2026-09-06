import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

function Field({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-1 text-sm text-ink-700">
        {Array.isArray(value) ? (
          <ul className="list-inside list-disc space-y-0.5">
            {value.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default function PatientSummary({ summary }) {
  const { t } = useLanguage();
  if (!summary) return null;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 w-fit">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {t('summary.aiGenerated')}
      </div>
      <dl className="grid gap-5 sm:grid-cols-2">
        <Field label={t('summary.chiefComplaint')} value={summary.chiefComplaint} />
        <Field label={t('summary.hpi')} value={summary.historyOfPresentIllness} />
        <Field label={t('summary.pastMedicalHistory')} value={summary.pastMedicalHistory} />
        <Field label={t('summary.currentMedications')} value={summary.currentMedications} />
        <Field label={t('summary.allergies')} value={summary.allergies} />
        <Field label={t('summary.investigations')} value={summary.investigations} />
        <Field label={t('summary.abnormalFindings')} value={summary.abnormalFindings} />
        <Field label={t('summary.notes')} value={summary.notes} />
      </dl>
    </div>
  );
}
