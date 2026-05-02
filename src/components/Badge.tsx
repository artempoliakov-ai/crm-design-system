import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-stroke-light text-text-white',
  primary: 'bg-brand text-text-white',
  success: 'bg-system-success-500 text-text-white',
  error: 'bg-system-error-500 text-text-white',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
