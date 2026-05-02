import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonState   = 'default' | 'hover' | 'pressed' | 'disabled';
type ButtonVariant = 'primary' | 'outline';
type ButtonSize    = 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  state?:   ButtonState;
  size?:    ButtonSize;
  icon?:    ReactNode;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-[5px] rounded-md font-bold text-sm leading-none whitespace-nowrap transition-opacity cursor-pointer border-0 outline-none select-none';

const variants: Record<ButtonVariant, Record<ButtonState, string>> = {
  primary: {
    default:  'bg-brand        text-text-white    px-4 py-3',
    hover:    'bg-brand        text-text-white    px-4 py-3 opacity-85',
    pressed:  'bg-brand        text-text-white    px-4 py-3 opacity-75',
    disabled: 'bg-brand-disabled text-text-disabled px-4 py-3 cursor-not-allowed',
  },
  outline: {
    default:  'border-2 border-stroke-brand   text-text-brand    bg-transparent px-4 py-3',
    hover:    'border-2 border-stroke-brand   text-text-brand    bg-transparent px-4 py-3 opacity-85',
    pressed:  'border-2 border-stroke-brand   text-text-brand    bg-transparent px-4 py-3 opacity-75',
    disabled: 'border-2 border-stroke-disabled text-text-disabled bg-transparent px-4 py-3 cursor-not-allowed',
  },
};

const sizes: Record<ButtonSize, string> = {
  medium: 'h-[40px]',
  large:  'h-[48px]',
};

export function Button({
  variant  = 'primary',
  state    = 'default',
  size     = 'medium',
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const resolved: ButtonState = disabled ? 'disabled' : state;

  return (
    <button
      className={[base, variants[variant][resolved], sizes[size], className].join(' ')}
      disabled={resolved === 'disabled'}
      {...props}
    >
      {children}
      {icon && (
        <span className="inline-flex items-center justify-center size-4 shrink-0">
          {icon}
        </span>
      )}
    </button>
  );
}
