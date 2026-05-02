import { type ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';

type TagVariant = 'default' | 'primary' | 'outline';

interface TagProps {
  variant?: TagVariant;
  onClose?: () => void;
  children: ReactNode;
}

const variants: Record<TagVariant, string> = {
  default: 'bg-surface-brand text-text-brand border border-stroke-brand',
  primary: 'bg-brand text-text-white border border-brand',
  outline: 'bg-transparent text-text-brand border border-stroke-brand',
};

export function Tag({ variant = 'default', onClose, children }: TagProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium ${variants[variant]}`}>
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="flex items-center justify-center w-4 h-4 hover:opacity-70 transition-opacity"
          aria-label="Remove tag"
        >
          <CloseIcon style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
}
