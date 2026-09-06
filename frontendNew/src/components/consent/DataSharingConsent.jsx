import { Stethoscope, Link2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function DataSharingConsent() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-teal-700" aria-hidden="true" />
        <h3 className="font-heading text-base font-semibold text-teal-800">{t('consent.sharingHeading')}</h3>
      </div>
      <p className="text-sm text-teal-900/80">{t('consent.sharingBody')}</p>
      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-teal-700">
        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
        Ready for future ABDM-linked health record integration
      </div>
    </div>
  );
}
