import { type CSSProperties } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type InputState = 'Default' | 'Hover' | 'Focus' | 'Disabled' | 'Error' | 'Success';
type InputSize  = 'M' | 'S';

interface InputProps {
  state?:       InputState;
  size?:        InputSize;
  label?:       string;
  icon?:        boolean;
  placeholder?: string;
  style?:       CSSProperties;
  className?:   string;
}

// Border color per state — references @theme utilities via inline vars
const borderColor: Record<InputState, string> = {
  Default:  'var(--color-stroke)',
  Hover:    'var(--color-stroke-hover)',
  Focus:    'var(--color-stroke-focus)',
  Disabled: 'var(--color-stroke-disabled)',
  Error:    'var(--color-stroke-error)',
  Success:  'var(--color-stroke-success)',
};

const textColor: Record<InputState, string> = {
  Default:  'var(--color-text-muted)',
  Hover:    'var(--color-text-muted)',
  Focus:    'var(--color-text-primary)',
  Disabled: 'var(--color-stroke-light)',
  Error:    'var(--color-text-error)',
  Success:  'var(--color-text-success)',
};

const labelColor: Record<InputState, string> = {
  Default:  'var(--color-text-muted)',
  Hover:    'var(--color-text-muted)',
  Focus:    'var(--color-text-muted)',
  Disabled: 'var(--color-text-muted)',
  Error:    'var(--color-text-error)',
  Success:  'var(--color-text-success)',
};

export function Input({
  state       = 'Default',
  size        = 'M',
  label,
  icon        = false,
  placeholder = 'Placeholder',
  style,
  className,
}: InputProps) {
  const isM      = size === 'M';
  const height   = isM ? 36 : 32;
  const px       = isM ? 12 : 8;
  const py       = isM ? 8 : 4;
  const fontSize = isM ? 14 : 12;
  const iconSize = isM ? 20 : 16;
  const bg       = state === 'Disabled'
    ? 'var(--color-surface-disabled)'
    : 'var(--color-surface)';

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'inline-block', paddingTop: label ? 12 : 0, ...style }}
    >
      {label && (
        <div style={{
          position:   'absolute',
          top:        5,
          left:       px,
          background: 'var(--color-surface)',
          padding:    '0 4px',
          zIndex:     1,
          lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, color: labelColor[state], fontFamily: 'inherit' }}>
            {label}
          </span>
        </div>
      )}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        height,
        padding:      `${py}px ${px}px`,
        border:       `1px solid ${borderColor[state]}`,
        borderRadius: 6,
        background:   bg,
        boxSizing:    'border-box',
        gap:          4,
      }}>
        <span style={{
          flex:       '1 0 0',
          fontSize,
          color:      textColor[state],
          fontFamily: 'inherit',
          fontWeight: 400,
          lineHeight: 1,
          overflow:   'hidden',
          whiteSpace: 'nowrap',
        }}>
          {placeholder}
        </span>
        {icon && (
          <InfoOutlinedIcon
            style={{ width: iconSize, height: iconSize, color: borderColor[state], flexShrink: 0 }}
          />
        )}
      </div>
    </div>
  );
}
