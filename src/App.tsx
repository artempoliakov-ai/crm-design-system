import { type ReactNode, useState } from 'react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Badge } from './components/Badge';
import { Tag } from './components/Tag';

function Section({ title, children, gap = 'gap-4' }: { title: string; children: ReactNode; gap?: string }) {
  return (
    <section className="pt-12">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-stroke mb-4 font-sans">
        {title}
      </p>
      <div className={`flex flex-wrap items-start ${gap}`}>
        {children}
      </div>
    </section>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <span className="text-[11px] text-stroke-light font-sans">{label}</span>
      {children}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-page font-sans">
      <div className="max-w-[1200px] mx-auto px-12 pt-12 pb-20">

        <h1 className="text-2xl font-bold text-text-primary m-0">
          CRM Design System
        </h1>

        {/* ── Button / Primary ─────────────────────────────────────────────────── */}
        <Section title="Button / Primary">
          <Labeled label="Default">
            <Button variant="primary">Sign In</Button>
          </Labeled>
          <Labeled label="Hover">
            <Button variant="primary" state="hover">Sign In</Button>
          </Labeled>
          <Labeled label="Pressed">
            <Button variant="primary" state="pressed">Sign In</Button>
          </Labeled>
          <Labeled label="Disabled">
            <Button variant="primary" disabled>Sign In</Button>
          </Labeled>
        </Section>

        {/* ── Button / Outline ─────────────────────────────────────────────────── */}
        <Section title="Button / Outline">
          <Labeled label="Default">
            <Button variant="outline">Export</Button>
          </Labeled>
          <Labeled label="Hover">
            <Button variant="outline" state="hover">Export</Button>
          </Labeled>
          <Labeled label="Pressed">
            <Button variant="outline" state="pressed">Export</Button>
          </Labeled>
          <Labeled label="Disabled">
            <Button variant="outline" disabled>Export</Button>
          </Labeled>
        </Section>

        {/* ── Button / Size ────────────────────────────────────────────────────── */}
        <Section title="Button / Size">
          <Labeled label="Medium — 40px">
            <Button size="medium">Sign In</Button>
          </Labeled>
          <Labeled label="Large — 48px">
            <Button size="large">Sign In</Button>
          </Labeled>
        </Section>

        {/* ── Input / States M ─────────────────────────────────────────────────── */}
        <Section title="Input / States — Size M" gap="gap-6">
          <Labeled label="Default">
            <Input state="Default" size="M" label="Label" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Hover">
            <Input state="Hover" size="M" label="Label" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Focus">
            <Input state="Focus" size="M" label="Label" placeholder="Input" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Disabled">
            <Input state="Disabled" size="M" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Error">
            <Input state="Error" size="M" label="Label" placeholder="Input" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Success">
            <Input state="Success" size="M" label="Label" placeholder="Input" style={{ width: 300 }} />
          </Labeled>
        </Section>

        {/* ── Input / States S ─────────────────────────────────────────────────── */}
        <Section title="Input / States — Size S" gap="gap-6">
          <Labeled label="Default">
            <Input state="Default" size="S" label="Label" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Hover">
            <Input state="Hover" size="S" label="Label" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Focus">
            <Input state="Focus" size="S" label="Label" placeholder="Input" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Disabled">
            <Input state="Disabled" size="S" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Error">
            <Input state="Error" size="S" label="Label" placeholder="Input" style={{ width: 300 }} />
          </Labeled>
          <Labeled label="Success">
            <Input state="Success" size="S" label="Label" placeholder="Input" style={{ width: 300 }} />
          </Labeled>
        </Section>

        {/* ── Badge / Variants ─────────────────────────────────────────────────── */}
        <Section title="Badge / Variants" gap="gap-3">
          <Labeled label="Default">
            <Badge variant="default">12</Badge>
          </Labeled>
          <Labeled label="Primary">
            <Badge variant="primary">New</Badge>
          </Labeled>
          <Labeled label="Success">
            <Badge variant="success">Done</Badge>
          </Labeled>
          <Labeled label="Error">
            <Badge variant="error">Alert</Badge>
          </Labeled>
        </Section>

        {/* ── Tag / Variants ───────────────────────────────────────────────────── */}
        <Section title="Tag / Variants" gap="gap-3">
          <TagDemo />
        </Section>

      </div>
    </div>
  );
}

function TagDemo() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design System']);

  return (
    <div className="flex gap-3 flex-wrap">
      {tags.map(tag => (
        <div key={tag} className="flex flex-col gap-1.5 items-start">
          <span className="text-[11px] text-stroke-light font-sans">{tag}</span>
          <div className="flex gap-2">
            <Tag variant="default" onClose={() => setTags(tags.filter(t => t !== tag))}>
              {tag}
            </Tag>
            <Tag variant="primary">{tag}</Tag>
            <Tag variant="outline">{tag}</Tag>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
