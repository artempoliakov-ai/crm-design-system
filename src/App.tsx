import { type ReactNode } from 'react';
import { Button } from './components/Button';
import { Input } from './components/Input';

function Section({
  title,
  children,
  gap = 16,
}: {
  title: string;
  children: ReactNode;
  gap?: number;
}) {
  return (
    <section style={{ paddingTop: 48 }}>
      <p style={{
        fontSize:      11,
        fontWeight:    600,
        color:         'var(--foreground-stroke-and-icons-default)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        margin:        '0 0 16px',
        fontFamily:    'inherit',
      }}>
        {title}
      </p>
      <div style={{ display: 'flex', gap, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 11, color: 'var(--foreground-stroke-and-icons-default-light)', fontFamily: 'inherit' }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function App() {
  return (
    <div style={{
      minHeight:  '100vh',
      background: '#f5f5f5',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        maxWidth: 1200,
        margin:   '0 auto',
        padding:  '48px 48px 80px',
      }}>

        <h1 style={{
          fontSize:   24,
          fontWeight: 700,
          color:      'var(--text-text-primary)',
          margin:     0,
          fontFamily: 'inherit',
        }}>
          CRM Design System
        </h1>

        {/* ── Button / Primary ─────────────────────────────────────────────────── */}
        <Section title="Button / Primary" gap={16}>
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
        <Section title="Button / Outline" gap={16}>
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
        <Section title="Button / Size" gap={16}>
          <Labeled label="Medium — 40px">
            <Button size="medium">Sign In</Button>
          </Labeled>
          <Labeled label="Large — 48px">
            <Button size="large">Sign In</Button>
          </Labeled>
        </Section>

        {/* ── Input / States M ─────────────────────────────────────────────────── */}
        <Section title="Input / States — Size M" gap={24}>
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
        <Section title="Input / States — Size S" gap={24}>
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

      </div>
    </div>
  );
}

export default App;
