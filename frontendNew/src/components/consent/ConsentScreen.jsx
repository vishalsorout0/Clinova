import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import ConsentDetails from './ConsentDetails';
import DataSharingConsent from './DataSharingConsent';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

export default function ConsentScreen({ onAgree, onDecline }) {
  const { t } = useLanguage();
  const [hasScrolledOrRead, setHasScrolledOrRead] = useState(true);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('consent.heading')}</h1>
          <p className="text-sm text-ink-500">{t('consent.intro')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <ConsentDetails />
        <DataSharingConsent />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" size="lg" onClick={onDecline}>
          {t('consent.decline')}
        </Button>
        <Button
          size="lg"
          onClick={onAgree}
          disabled={!hasScrolledOrRead}
        >
          {t('consent.agreeContinue')}
        </Button>
      </div>
    </div>
  );
}
