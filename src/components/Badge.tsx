import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variants: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'var(--color-stroke-light)', text: 'var(--color-text-white)' },
  primary: { bg: 'var(--color-brand)', text: 'var(--color-text-white)' },
  success: { bg: 'var(--color-stroke-success)', text: 'var(--color-text-white)' },
  error: { bg: 'var(--color-stroke-error)', text: 'var(--color-text-white)' },
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  const { bg, text } = variants[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        background: bg,
        color: text,
      }}
    >
      {children}
    </span>
  );
}
