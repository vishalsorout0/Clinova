import { ClipboardList, Sparkles, ScanText } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function ConsentDetails() {
  const { t } = useLanguage();

  const points = [
    { icon: ClipboardList, text: 'Your symptoms and health history, gathered through guided questions.' },
    { icon: ScanText, text: 'Documents you choose to upload, such as prescriptions and lab reports.' },
    { icon: Sparkles, text: 'An AI-organized summary prepared for your physician to review.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-ink-800">{t('consent.pointsHeading')}</h3>
        <ul className="flex flex-col gap-3">
          {points.map((point) => (
            <li key={point.text} className="flex items-start gap-3 rounded-xl bg-ink-50 px-4 py-3">
              <point.icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
              <span className="text-sm text-ink-600">{point.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 font-heading text-base font-semibold text-ink-800">{t('consent.aiHeading')}</h3>
        <p className="text-sm text-ink-600">{t('consent.aiBody')}</p>
      </div>
    </div>
  );
}
