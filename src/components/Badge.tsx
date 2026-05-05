import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'error';

interface BadgeProps {
  variant?:   BadgeVariant;
  children:   ReactNode;
  ariaLabel?: string;
}

const variants: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'var(--color-stroke-light)',   text: 'var(--color-text-white)' },
  primary: { bg: 'var(--color-brand)',           text: 'var(--color-text-white)' },
  success: { bg: 'var(--color-stroke-success)',  text: 'var(--color-text-white)' },
  error:   { bg: 'var(--color-stroke-error)',    text: 'var(--color-text-white)' },
};

export function Badge({ variant = 'default', children, ariaLabel }: BadgeProps) {
  const { bg, text } = variants[variant];

  return (
    <span
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center px-(--spacing-8) py-(--spacing-4) rounded-(--border-radius-full) text-body-sm font-semibold"
      style={{ background: bg, color: text }}
    >
      {children}
    </span>
  );
}
