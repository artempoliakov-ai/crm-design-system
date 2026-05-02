import { useState, type CSSProperties, type FocusEvent, type ChangeEvent, type MouseEvent } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type InputDocState = 'Default' | 'Hover' | 'Focus' | 'Disabled' | 'Error' | 'Success';
type InputSize     = 'M' | 'S';

interface InputProps {
  size?:          InputSize;
  label?:         string;
  placeholder?:   string;
  disabled?:      boolean;
  error?:         boolean;
  success?:       boolean;
  icon?:          boolean;
  value?:         string;
  onChange?:      (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?:       (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?:        (e: FocusEvent<HTMLInputElement>) => void;
  onMouseEnter?:  (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?:  (e: MouseEvent<HTMLDivElement>) => void;
  /** docs-only: force a specific visual state */
  state?:         InputDocState;
  style?:         CSSProperties;
  className?:     string;
}

const borderColor: Record<InputDocState, string> = {
  Default:  'var(--color-stroke)',
  Hover:    'var(--color-stroke-hover)',
  Focus:    'var(--color-stroke-focus)',
  Disabled: 'var(--color-stroke-disabled)',
  Error:    'var(--color-stroke-error)',
  Success:  'var(--color-stroke-success)',
};

const textColor: Record<InputDocState, string> = {
  Default:  'var(--color-text-muted)',
  Hover:    'var(--color-text-muted)',
  Focus:    'var(--color-text-primary)',
  Disabled: 'var(--color-stroke-light)',
  Error:    'var(--color-text-error)',
  Success:  'var(--color-text-success)',
};

const labelColor: Record<InputDocState, string> = {
  Default:  'var(--color-text-muted)',
  Hover:    'var(--color-text-muted)',
  Focus:    'var(--color-text-muted)',
  Disabled: 'var(--color-text-muted)',
  Error:    'var(--color-text-error)',
  Success:  'var(--color-text-success)',
};

const sizeConfig: Record<InputSize, {
  height:   string;
  padding:  string;
  left:     string;
  fontSize: string;
  iconSize: string;
}> = {
  M: {
    height:   'var(--height-input-md)',
    padding:  'var(--spacing-8) var(--spacing-12)',
    left:     'var(--spacing-12)',
    fontSize: 'var(--text-body-md)',
    iconSize: 'var(--spacing-20)',
  },
  S: {
    height:   'var(--height-input-sm)',
    padding:  'var(--spacing-4) var(--spacing-8)',
    left:     'var(--spacing-8)',
    fontSize: 'var(--text-body-sm)',
    iconSize: 'var(--spacing-16)',
  },
};

export function Input({
  size         = 'M',
  label,
  placeholder  = 'Placeholder',
  disabled     = false,
  error        = false,
  success      = false,
  icon         = false,
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

  const cfg = sizeConfig[size];
  const bg  = visualState === 'Disabled'
    ? 'var(--color-surface-disabled)'
    : 'var(--color-surface)';

  return (
    <div
      className={className}
      style={{
        position:   'relative',
        display:    'inline-block',
        paddingTop: label ? 'var(--spacing-12)' : 0,
        ...style,
      }}
      onMouseEnter={e => { setHovered(true);  onMouseEnter?.(e); }}
      onMouseLeave={e => { setHovered(false); onMouseLeave?.(e); }}
    >
      {label && (
        <div style={{
          position:   'absolute',
          top:        5,
          left:       cfg.left,
          background: bg,
          padding:    '0 var(--spacing-4)',
          zIndex:     1,
          lineHeight: 1,
        }}>
          <span style={{ fontSize: 'var(--text-label)', color: labelColor[visualState], fontFamily: 'inherit' }}>
            {label}
          </span>
        </div>
      )}

      <div style={{
        display:      'flex',
        alignItems:   'center',
        height:       cfg.height,
        padding:      cfg.padding,
        border:       `1px solid ${borderColor[visualState]}`,
        borderRadius: 'var(--border-radius-md)',
        background:   bg,
        boxSizing:    'border-box',
        gap:          'var(--spacing-4)',
        transition:   'border-color 0.15s',
      }}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            flex:       '1 0 0',
            fontSize:   cfg.fontSize,
            color:      textColor[visualState],
            fontFamily: 'inherit',
            fontWeight: 400,
            lineHeight: 1,
            border:     'none',
            outline:    'none',
            background: 'transparent',
            cursor:     disabled ? 'not-allowed' : 'text',
            padding:    0,
            minWidth:   0,
          }}
          onFocus={e => { setFocused(true);  onFocus?.(e); }}
          onBlur={e  => { setFocused(false); onBlur?.(e);  }}
        />
        {icon && (
          <InfoOutlinedIcon
            style={{
              width:      cfg.iconSize,
              height:     cfg.iconSize,
              color:      borderColor[visualState],
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
