import PersonIcon from '@mui/icons-material/Person';

type AvatarSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
type AvatarType = 'initials' | 'icon' | 'image';

interface AvatarProps {
  type?:      AvatarType;
  size?:      AvatarSize;
  initials?:  string;
  src?:       string;
  alt?:       string;
  className?: string;
}

const sizes: Record<AvatarSize, { dim: string; text: string; icon: number }> = {
  XS: { dim: 'size-6',  text: 'text-avatar-xs font-medium',   icon: 12 },
  S:  { dim: 'size-8',  text: 'text-avatar-s  font-medium',   icon: 16 },
  M:  { dim: 'size-10', text: 'text-avatar-m  font-medium',   icon: 20 },
  L:  { dim: 'size-12', text: 'text-avatar-l  font-semibold', icon: 24 },
  XL: { dim: 'size-14', text: 'text-avatar-xl font-semibold', icon: 28 },
};

export function Avatar({
  type      = 'icon',
  size      = 'M',
  initials  = 'A',
  src,
  alt,
  className = '',
}: AvatarProps) {
  const cfg = sizes[size];
  const bg  = type === 'initials' ? 'bg-brand' : 'bg-surface-disabled';

  const ariaLabel =
    alt ??
    (type === 'initials' ? initials.charAt(0).toUpperCase() : 'Avatar');

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${cfg.dim} ${bg} ${className}`}
    >
      {type === 'initials' && (
        <span aria-hidden="true" className={`${cfg.text} text-text-white leading-none`}>
          {initials.charAt(0).toUpperCase()}
        </span>
      )}
      {type === 'icon' && (
        <PersonIcon aria-hidden="true" sx={{ fontSize: cfg.icon, color: 'var(--color-stroke)' }} />
      )}
      {type === 'image' && src && (
        <img src={src} alt={ariaLabel} className="w-full h-full object-cover" />
      )}
      {type === 'image' && !src && (
        <PersonIcon aria-hidden="true" sx={{ fontSize: cfg.icon, color: 'var(--color-stroke)' }} />
      )}
    </div>
  );
}
