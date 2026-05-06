import { useState } from 'react';
import { Tag } from '../components';
import { Section, Playground, Toggle, Sep } from './shared';

export function TagShowcase() {
  return (
    <>
      <Section title="Tag — Live">
        <TagPlayground />
      </Section>

      <Section title="Tag / Variants" gap="gap-3">
        <TagVariants />
      </Section>
    </>
  );
}

function TagPlayground() {
  const [variant,   setVariant]   = useState<'default' | 'primary' | 'outline'>('default');
  const [closeable, setCloseable] = useState(true);
  const [visible,   setVisible]   = useState(true);

  return (
    <Playground
      controls={<>
        {(['default', 'primary', 'outline'] as const).map(v => (
          <Toggle key={v} label={v} checked={variant === v} onChange={() => setVariant(v)} />
        ))}
        <Sep />
        <Toggle label="Closeable" checked={closeable} onChange={() => { setCloseable(v => !v); setVisible(true); }} />
      </>}
    >
      {visible
        ? <Tag variant={variant} onClose={closeable ? () => setVisible(false) : undefined}>
            Design System
          </Tag>
        : <button
            type="button"
            onClick={() => setVisible(true)}
            className="text-label text-text-muted border border-dashed border-stroke-disabled rounded-md px-3 py-1.5 hover:border-stroke-brand hover:text-text-brand transition-colors"
          >
            + restore
          </button>
      }
    </Playground>
  );
}

function TagVariants() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design System']);

  return (
    <div className="flex gap-3 flex-wrap">
      {tags.map(tag => (
        <div key={tag} className="flex flex-col gap-1.5 items-start">
          <span className="text-label text-stroke-light">{tag}</span>
          <div className="flex gap-2">
            <Tag variant="default" onClose={() => setTags(tags.filter(t => t !== tag))}>{tag}</Tag>
            <Tag variant="primary">{tag}</Tag>
            <Tag variant="outline">{tag}</Tag>
          </div>
        </div>
      ))}
    </div>
  );
}
