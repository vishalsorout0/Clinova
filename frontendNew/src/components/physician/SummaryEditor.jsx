import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { useLanguage } from '../../hooks/useLanguage';

export default function SummaryEditor({ label, value, onSave, wasModified = false }) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave?.(draft);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-ink-100 px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</span>
        {wasModified && (
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
            {t('physician.verification.modifiedByPhysician')}
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            className="flex-1 resize-none rounded-lg border border-teal-300 px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-teal-600"
          />
          <button
            type="button"
            aria-label="Save"
            onClick={handleSave}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => {
              setDraft(value);
              setIsEditing(false);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className={classNames('flex items-center justify-between gap-3')}>
          <p className="text-sm text-ink-700">{value}</p>
          <button
            type="button"
            aria-label={`Edit ${label}`}
            onClick={() => setIsEditing(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
