import AbnormalValues from './AbnormalValues';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDate } from '../../utils/formatters';

export default function LabReport({ report }) {
  const { t } = useLanguage();
  if (!report) return null;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-ink-800">{report.documentName}</h3>
        {report.patientInfo?.reportDate && (
          <span className="text-xs text-ink-400">{formatDate(report.patientInfo.reportDate)}</span>
        )}
      </div>
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-400">{t('ocr.labValues')}</h4>
      <AbnormalValues values={report.labValues} />
    </div>
  );
}
