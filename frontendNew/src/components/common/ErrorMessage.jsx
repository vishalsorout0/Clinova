import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorMessage({
  message = 'Something went wrong.',
  onRetry,
  retryLabel = 'Try again',
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center ${className}`}
    >
      <AlertTriangle className="h-10 w-10 text-amber-600" aria-hidden="true" />
      <p className="text-base font-medium text-ink-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" icon={RotateCcw} onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
