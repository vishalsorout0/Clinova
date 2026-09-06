import { forwardRef, useId } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(function Input(
  { label, error, helperText, icon: Icon, className = '', containerClassName = '', ...props },
  ref
) {
  const generatedId = useId();
  const inputId = props.id || generatedId;

  return (
    <div className={classNames('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-base font-medium text-ink-700 font-heading">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          className={classNames(
            'kiosk-touch-target w-full rounded-xl border bg-white px-4 py-3 text-lg text-ink-800 placeholder:text-ink-400',
            'focus:outline-none focus-visible:outline-3 focus-visible:outline-teal-600',
            Icon && 'pl-12',
            error ? 'border-red-400' : 'border-ink-200',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-help`} className="text-sm text-ink-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
