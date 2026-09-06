import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const VARIANT_STYLES = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:outline-teal-700 shadow-card',
  secondary: 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  subtle: 'bg-ink-100 text-ink-700 hover:bg-ink-200',
};

const SIZE_STYLES = {
  md: 'text-base px-5 py-3 rounded-xl',
  lg: 'text-lg px-7 py-4 rounded-2xl',
  xl: 'text-xl px-9 py-5 rounded-2xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'lg',
    icon: Icon,
    iconPosition = 'left',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled = false,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      className={classNames(
        'kiosk-touch-target inline-flex items-center justify-center gap-2 font-semibold font-heading transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="h-5 w-5" aria-hidden="true" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="h-5 w-5" aria-hidden="true" />}
    </motion.button>
  );
});

export default Button;
