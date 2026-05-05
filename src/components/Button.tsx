import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonState    = 'default' | 'hover' | 'pressed' | 'disabled';
type ButtonVariant  = 'primary' | 'outline';
type ButtonSize     = 'medium' | 'large';
type IconPosition   = 'left' | 'right';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      ButtonVariant;
  state?:        ButtonState;
  size?:         ButtonSize;
  icon?:         ReactNode;
  iconPosition?: IconPosition;
  children?:     ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-(--spacing-4) rounded-md font-bold text-sm leading-none whitespace-nowrap transition-opacity cursor-pointer border-0 outline-none select-none';

const variantColors: Record<ButtonVariant, Record<ButtonState, string>> = {
  primary: {
    default:  'bg-brand          text-text-white    hover:opacity-85 active:opacity-75',
    hover:    'bg-brand          text-text-white    opacity-85',
    pressed:  'bg-brand          text-text-white    opacity-75',
    disabled: 'bg-brand-disabled text-text-disabled cursor-not-allowed',
  },
  outline: {
    default:  'border-2 border-stroke-brand    text-text-brand    bg-transparent hover:opacity-85 active:opacity-75',
    hover:    'border-2 border-stroke-brand    text-text-brand    bg-transparent opacity-85',
    pressed:  'border-2 border-stroke-brand    text-text-brand    bg-transparent opacity-75',
    disabled: 'border-2 border-stroke-disabled text-text-disabled bg-transparent cursor-not-allowed',
  },
};

const sizes: Record<ButtonSize, string> = {
  medium: 'h-(--height-button-md)',
  large:  'h-(--height-button-lg)',
};

const iconOnlySizes: Record<ButtonSize, string> = {
  medium: 'h-(--height-button-md) w-(--height-button-md)',
  large:  'h-(--height-button-lg) w-(--height-button-lg)',
};

export function Button({
  variant      = 'primary',
  state        = 'default',
  size         = 'medium',
  icon,
  iconPosition = 'right',
  children,
  className    = '',
  disabled,
  ...props
}: ButtonProps) {
  const resolved: ButtonState = disabled ? 'disabled' : state;
  const iconOnly = Boolean(icon && !children);

  const iconEl = icon ? (
    <span className="inline-flex items-center justify-center size-4 shrink-0">
      {icon}
    </span>
  ) : null;

  return (
    <button
      type="button"
      className={[
        base,
        variantColors[variant][resolved],
        iconOnly ? iconOnlySizes[size] : `${sizes[size]} px-4`,
        className,
      ].join(' ')}
      disabled={resolved === 'disabled'}
      aria-disabled={resolved === 'disabled'}
      {...props}
    >
      {iconPosition === 'left'  && iconEl}
      {children}
      {iconPosition === 'right' && iconEl}
    </button>
  );
}
