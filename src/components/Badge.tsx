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
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        'var(--spacing-4) var(--spacing-8)',
        borderRadius:   'var(--border-radius-full)',
        fontSize:       'var(--text-body-sm)',
        fontWeight:     600,
        background:     bg,
        color:          text,
      }}
    >
      {children}
    </span>
  );
}
