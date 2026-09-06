import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { classNames } from '../../utils/helpers';
import { ABNORMAL_STATUS } from '../../utils/constants';

const STATUS_META = {
  [ABNORMAL_STATUS.NORMAL]: { icon: CheckCircle2, className: 'text-green-700 bg-green-50 border-green-200' },
  [ABNORMAL_STATUS.ABNORMAL]: { icon: AlertTriangle, className: 'text-amber-800 bg-amber-50 border-amber-200' },
  [ABNORMAL_STATUS.UNDETERMINED]: { icon: HelpCircle, className: 'text-ink-500 bg-ink-100 border-ink-200' },
};

export default function AbnormalValues({ values = [] }) {
  const { t } = useLanguage();
  const abnormal = values.filter((value) => value.status === ABNORMAL_STATUS.ABNORMAL);

  return (
    <div className="flex flex-col gap-3">
      <ul className="divide-y divide-ink-100 rounded-xl border border-ink-100">
        {values.map((value) => {
          const meta = STATUS_META[value.status] || STATUS_META[ABNORMAL_STATUS.UNDETERMINED];
          const Icon = meta.icon;
          const labelKey = { normal: 'ocr.normal', abnormal: 'ocr.abnormal', undetermined: 'ocr.undetermined' }[
            value.status
          ];
          return (
            <li key={value.name} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-ink-800">{value.name}</p>
                <p className="text-xs text-ink-400">
                  {value.value} {value.unit} · Range {value.range}
                </p>
              </div>
              <span className={classNames('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', meta.className)}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(labelKey)}
              </span>
            </li>
          );
        })}
      </ul>
      {abnormal.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {abnormal.length} {t('ocr.abnormal').toLowerCase()} value{abnormal.length > 1 ? 's' : ''} found. This is not a diagnosis — your physician will review these results.
        </div>
      )}
    </div>
  );
}
