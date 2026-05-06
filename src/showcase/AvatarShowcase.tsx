import { useState } from 'react';
import { Avatar } from '../components';
import { Section, Labeled, Playground, Toggle, Sep } from './shared';

export function AvatarShowcase() {
  return (
    <>
      <Section title="Avatar — Live">
        <AvatarPlayground />
      </Section>

      <Section title="Avatar / Type" gap="gap-4">
        <Labeled label="Initials">      <Avatar type="initials" size="M" initials="A" /></Labeled>
        <Labeled label="Icon">          <Avatar type="icon"     size="M" /></Labeled>
        <Labeled label="Image (no src)"><Avatar type="image"    size="M" /></Labeled>
      </Section>

      <Section title="Avatar / Size" gap="gap-3">
        {(['XS', 'S', 'M', 'L', 'XL'] as const).map(s => (
          <Labeled key={s} label={s}>
            <Avatar type="initials" size={s} initials="A" />
          </Labeled>
        ))}
      </Section>
    </>
  );
}

function AvatarPlayground() {
  const [type,     setType]     = useState<'initials' | 'icon' | 'image'>('initials');
  const [size,     setSize]     = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [initials, setInitials] = useState('AP');

  return (
    <Playground
      controls={<>
        {(['initials', 'icon', 'image'] as const).map(t => (
          <Toggle key={t} label={t} checked={type === t} onChange={() => setType(t)} />
        ))}
        <Sep />
        {(['XS', 'S', 'M', 'L', 'XL'] as const).map(s => (
          <Toggle key={s} label={s} checked={size === s} onChange={() => setSize(s)} />
        ))}
        {type === 'initials' && <>
          <Sep />
          <input
            value={initials}
            onChange={e => setInitials(e.target.value.toUpperCase().slice(0, 2))}
            maxLength={2}
            placeholder="AB"
            className="w-14 text-center text-body-sm font-medium px-2 py-1.5 border border-stroke-disabled rounded-md bg-surface text-text-primary outline-none focus:border-stroke-brand transition-colors"
            aria-label="Initials"
          />
        </>}
      </>}
    >
      <Avatar type={type} size={size} initials={initials || 'A'} alt="Preview avatar" />
    </Playground>
  );
}
