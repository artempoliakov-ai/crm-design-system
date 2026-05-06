import { type ReactNode } from 'react';

export function Section({ title, children, gap = 'gap-4' }: {
  title:    string;
  children: ReactNode;
  gap?:     string;
}) {
  return (
    <section className="pt-12">
      <p className="text-label font-semibold tracking-widest uppercase text-stroke mb-4">
        {title}
      </p>
      <div className={`flex flex-wrap items-start ${gap}`}>
        {children}
      </div>
    </section>
  );
}

export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <span className="text-label text-stroke-light">{label}</span>
      {children}
    </div>
  );
}

export function Playground({ children, controls, stateLabel }: {
  children:    ReactNode;
  controls:    ReactNode;
  stateLabel?: string;
}) {
  return (
    <div className="w-full rounded-lg border border-stroke-disabled overflow-hidden">
      <div className="relative flex items-center justify-center p-10 bg-surface min-h-[120px]">
        {children}
        {stateLabel && (
          <span className="absolute top-3 right-3 text-label font-medium text-stroke-light bg-page border border-stroke-disabled rounded px-2 py-1 pointer-events-none">
            {stateLabel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-page border-t border-stroke-disabled">
        {controls}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange }: {
  label:    string;
  checked:  boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`px-3 py-1.5 rounded-md text-label font-medium border transition-colors cursor-pointer select-none ${
        checked
          ? 'bg-brand text-text-white border-brand'
          : 'bg-surface text-text-muted border-stroke-disabled hover:border-stroke-brand hover:text-text-brand'
      }`}
    >
      {label}
    </button>
  );
}

export function Sep() {
  return <div className="w-px self-stretch bg-stroke-disabled mx-1" />;
}
