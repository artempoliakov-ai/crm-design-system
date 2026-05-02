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
  state       = 'Default',
  size        = 'M',
  label,
  icon        = false,
  placeholder = 'Placeholder',
  style,
  className,
}: InputProps) {
  const cfg = sizeConfig[size];
  const bg  = state === 'Disabled'
    ? 'var(--color-surface-disabled)'
    : 'var(--color-surface)';

  return (
    <div
      className={className}
      style={{
        position:    'relative',
        display:     'inline-block',
        paddingTop:  label ? 'var(--spacing-12)' : 0,
        ...style,
      }}
    >
      {label && (
        <div style={{
          position:   'absolute',
          top:        5,
          left:       cfg.left,
          background: 'var(--color-surface)',
          padding:    '0 var(--spacing-4)',
          zIndex:     1,
          lineHeight: 1,
        }}>
          <span style={{ fontSize: 'var(--text-label)', color: labelColor[state], fontFamily: 'inherit' }}>
            {label}
          </span>
        </div>
      )}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        height:       cfg.height,
        padding:      cfg.padding,
        border:       `1px solid ${borderColor[state]}`,
        borderRadius: 'var(--border-radius-md)',
        background:   bg,
        boxSizing:    'border-box',
        gap:          'var(--spacing-4)',
      }}>
        <span style={{
          flex:       '1 0 0',
          fontSize:   cfg.fontSize,
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
            style={{
              width:     cfg.iconSize,
              height:    cfg.iconSize,
              color:     borderColor[state],
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
