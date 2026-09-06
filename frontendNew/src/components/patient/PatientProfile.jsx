import { User, Droplet, AlertCircle } from 'lucide-react';
import { initialsFromName } from '../../utils/formatters';
import { useLanguage } from '../../hooks/useLanguage';

export default function PatientProfile({ profile, compact = false }) {
  const { t } = useLanguage();
  if (!profile) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-heading font-semibold text-teal-700">
          {initialsFromName(profile.name) || <User className="h-5 w-5" />}
        </span>
        <div>
          <p className="font-medium text-ink-800">{profile.name}</p>
          <p className="text-xs text-ink-500">
            {profile.age ? `${profile.age} yrs` : ''} {profile.gender ? `· ${profile.gender}` : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="a11y-surface rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 font-heading text-xl font-semibold text-teal-700">
          {initialsFromName(profile.name)}
        </span>
        <div>
          <h3 className="font-heading text-lg font-semibold text-ink-800">{profile.name}</h3>
          <p className="text-sm text-ink-500">
            {profile.age ? `${profile.age} yrs` : ''} {profile.gender ? `· ${profile.gender}` : ''}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        {profile.abhaAddress && (
          <div>
            <dt className="text-ink-400">ABHA</dt>
            <dd className="font-medium text-ink-700">{profile.abhaAddress}</dd>
          </div>
        )}
        {profile.bloodGroup && (
          <div>
            <dt className="flex items-center gap-1 text-ink-400">
              <Droplet className="h-3.5 w-3.5" /> Blood group
            </dt>
            <dd className="font-medium text-ink-700">{profile.bloodGroup}</dd>
          </div>
        )}
        {profile.knownAllergies?.length > 0 && (
          <div className="col-span-2">
            <dt className="flex items-center gap-1 text-ink-400">
              <AlertCircle className="h-3.5 w-3.5" /> {t('summary.allergies')}
            </dt>
            <dd className="font-medium text-ink-700">{profile.knownAllergies.join(', ')}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
