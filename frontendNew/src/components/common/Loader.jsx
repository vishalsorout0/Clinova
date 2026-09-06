import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function Loader({ label = 'Loading…', size = 'md', fullScreen = false, className = '' }) {
  const iconSize = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }[size] || 'h-8 w-8';

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={classNames('flex flex-col items-center justify-center gap-3 text-teal-700', className)}
    >
      <Loader2 className={classNames(iconSize, 'animate-spin')} aria-hidden="true" />
      <span className="text-base font-medium text-ink-500">{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[50vh] w-full items-center justify-center">{content}</div>;
  }
  return content;
}
