import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { classNames } from '../../utils/helpers';
import { ABNORMAL_STATUS } from '../../utils/constants';

const STATUS_META = {
  [ABNORMAL_STATUS.NORMAL]: { icon: CheckCircle2, className: 'bg-green-50 text-green-700 border-green-200' },
  [ABNORMAL_STATUS.ABNORMAL]: { icon: AlertTriangle, className: 'bg-amber-50 text-amber-800 border-amber-200' },
  [ABNORMAL_STATUS.UNDETERMINED]: { icon: HelpCircle, className: 'bg-ink-100 text-ink-500 border-ink-200' },
};

function StatusBadge({ status }) {
  const { t } = useLanguage();
  const meta = STATUS_META[status] || STATUS_META[ABNORMAL_STATUS.UNDETERMINED];
  const Icon = meta.icon;
  const labelKey = { normal: 'ocr.normal', abnormal: 'ocr.abnormal', undetermined: 'ocr.undetermined' }[status];

  return (
    <span className={classNames('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', meta.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {t(labelKey)}
    </span>
  );
}

export default function OCRResult({ result }) {
  const { t } = useLanguage();
  if (!result) return null;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 font-heading text-lg font-semibold text-ink-800">{t('ocr.heading')}</h3>

      {result.patientInfo && (
        <div className="mb-5 grid grid-cols-3 gap-3 rounded-xl bg-ink-50 p-4 text-sm">
          <div>
            <p className="text-ink-400">Name</p>
            <p className="font-medium text-ink-800">{result.patientInfo.name}</p>
          </div>
          <div>
            <p className="text-ink-400">Age</p>
            <p className="font-medium text-ink-800">{result.patientInfo.age}</p>
          </div>
          <div>
            <p className="text-ink-400">Report date</p>
            <p className="font-medium text-ink-800">{result.patientInfo.reportDate}</p>
          </div>
        </div>
      )}

      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-400">{t('ocr.labValues')}</h4>
      <div className="overflow-hidden rounded-xl border border-ink-100">
        <table className="w-full text-sm">
          <tbody>
            {result.labValues?.map((row, index) => (
              <tr key={row.name} className={index % 2 === 0 ? 'bg-white' : 'bg-ink-50/60'}>
                <td className="px-4 py-3 font-medium text-ink-700">{row.name}</td>
                <td className="px-4 py-3 text-ink-600">
                  {row.value} {row.unit}
                </td>
                <td className="px-4 py-3 text-ink-400">{row.range}</td>
                <td className="px-4 py-3 text-right">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
