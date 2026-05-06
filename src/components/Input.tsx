import { useState, type ReactNode, type CSSProperties, type FocusEvent, type ChangeEvent, type MouseEvent } from 'react';

type InputDocState = 'Default' | 'Hover' | 'Focus' | 'Disabled' | 'Error' | 'Success';
type InputSize     = 'M' | 'S';

interface InputProps {
  size?:         InputSize;
  type?:         string;
  label?:        string;
  placeholder?:  string;
  disabled?:     boolean;
  error?:        boolean;
  success?:      boolean;
  icon?:         ReactNode;
  value?:        string;
  onChange?:     (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?:      (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?:       (e: FocusEvent<HTMLInputElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
  /** docs-only: force a specific visual state */
  state?:        InputDocState;
  style?:        CSSProperties;
  className?:    string;
}

const borderClass: Record<InputDocState, string> = {
  Default:  'border-stroke',
  Hover:    'border-stroke-hover',
  Focus:    'border-stroke-focus',
  Disabled: 'border-stroke-disabled',
  Error:    'border-stroke-error',
  Success:  'border-stroke-success',
};

const inputTextClass: Record<InputDocState, string> = {
  Default:  'text-text-muted',
  Hover:    'text-text-muted',
  Focus:    'text-text-primary',
  Disabled: 'text-stroke-light',
  Error:    'text-text-error',
  Success:  'text-text-success',
};

const labelTextClass: Record<InputDocState, string> = {
  Default:  'text-text-muted',
  Hover:    'text-text-muted',
  Focus:    'text-text-muted',
  Disabled: 'text-text-muted',
  Error:    'text-text-error',
  Success:  'text-text-success',
};

const iconColorClass: Record<InputDocState, string> = {
  Default:  'text-stroke',
  Hover:    'text-stroke-hover',
  Focus:    'text-stroke-focus',
  Disabled: 'text-stroke-disabled',
  Error:    'text-stroke-error',
  Success:  'text-stroke-success',
};

const sizeClass: Record<InputSize, {
  wrapPt:    string;
  height:    string;
  px:        string;
  text:      string;
  labelLeft: string;
  iconSize:  string;
}> = {
  M: {
    wrapPt:    'pt-(--spacing-12)',
    height:    'h-(--height-input-md)',
    px:        'px-(--spacing-12)',
    text:      'text-body-md',
    labelLeft: 'left-(--spacing-12)',
    iconSize:  'size-(--spacing-20)',
  },
  S: {
    wrapPt:    'pt-(--spacing-12)',
    height:    'h-(--height-input-sm)',
    px:        'px-(--spacing-8)',
    text:      'text-body-sm',
    labelLeft: 'left-(--spacing-8)',
    iconSize:  'size-(--spacing-16)',
  },
};

export function Input({
  size         = 'M',
  type         = 'text',
  label,
  placeholder  = 'Placeholder',
  disabled     = false,
  error        = false,
  success      = false,
  icon,
  value,
  onChange,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  state,
  style,
  className,
}: InputProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const visualState: InputDocState = (() => {
    if (state && state !== 'Default') return state;
    if (disabled) return 'Disabled';
    if (error)    return 'Error';
    if (success)  return 'Success';
    if (focused)  return 'Focus';
    if (hovered)  return 'Hover';
    return 'Default';
  })();

  const cfg     = sizeClass[size];
  const bgClass = visualState === 'Disabled' ? 'bg-surface-disabled' : 'bg-surface';

  return (
    <div
      className={`relative inline-block ${label ? cfg.wrapPt : ''} ${className ?? ''}`}
      style={style}
      onMouseEnter={e => { setHovered(true);  onMouseEnter?.(e); }}
      onMouseLeave={e => { setHovered(false); onMouseLeave?.(e); }}
    >
      {label && (
        <div className={`absolute top-(--input-label-offset) ${cfg.labelLeft} ${bgClass} px-(--spacing-4) z-[1] leading-none`}>
          <span className={`text-label ${labelTextClass[visualState]}`}>{label}</span>
        </div>
      )}

      <div className={`flex items-center ${cfg.height} ${cfg.px} border ${borderClass[visualState]} rounded-md ${bgClass} gap-(--spacing-4) transition-colors`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`flex-1 min-w-0 border-0 outline-none bg-transparent p-0 leading-none ${cfg.text} ${inputTextClass[visualState]} ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
          onFocus={e => { setFocused(true);  onFocus?.(e); }}
          onBlur={e  => { setFocused(false); onBlur?.(e);  }}
        />
        {icon && (
          <span className={`shrink-0 flex items-center justify-center ${cfg.iconSize} ${iconColorClass[visualState]}`}>
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
