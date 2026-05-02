type DividerOrientation = 'horizontal' | 'vertical';
type DividerVariant     = 'default' | 'subtle';

interface DividerProps {
  orientation?: DividerOrientation;
  variant?:     DividerVariant;
  className?:   string;
}

const colors: Record<DividerVariant, string> = {
  default: 'bg-(--color-stroke)',
  subtle:  'bg-(--color-stroke-disabled)',
};

export function Divider({
  orientation = 'horizontal',
  variant     = 'default',
  className   = '',
}: DividerProps) {
  const isH = orientation === 'horizontal';
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`shrink-0 ${isH ? 'w-full h-px' : 'h-full w-px'} ${colors[variant]} ${className}`}
    />
  );
}
