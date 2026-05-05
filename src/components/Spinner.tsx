import { type SVGAttributes } from 'react';

export type SpinnerSize = 'S' | 'M' | 'L';

interface SpinnerProps extends SVGAttributes<SVGSVGElement> {
  size?: SpinnerSize;
}

const SIZE_MAP: Record<SpinnerSize, { px: number; sw: number }> = {
  S: { px: 16, sw: 2   },
  M: { px: 24, sw: 2.5 },
  L: { px: 32, sw: 3   },
};

export function Spinner({ size = 'M', className = '', ...props }: SpinnerProps) {
  const { px, sw } = SIZE_MAP[size];
  const r    = (px - sw) / 2;
  const cx   = px / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${String(px)} ${String(px)}`}
      className={`animate-spin ${className}`}
      aria-label="Loading"
      role="status"
      fill="none"
      {...props}
    >
      {/* track: full ring at low opacity */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke="var(--foreground-stroke-and-icons-brand)"
        strokeWidth={sw}
        strokeOpacity={0.15}
      />
      {/* arc: 270° active indicator */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke="var(--foreground-stroke-and-icons-brand)"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${String(circ * 0.75)} ${String(circ * 0.25)}`}
        strokeDashoffset={circ * 0.25}
      />
    </svg>
  );
}
