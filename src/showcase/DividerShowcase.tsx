import { Divider } from '../components';
import { Section, Labeled } from './shared';

export function DividerShowcase() {
  return (
    <>
      <Section title="Divider / Horizontal" gap="gap-6">
        <Labeled label="Default"><div style={{ width: 300 }}><Divider variant="default" /></div></Labeled>
        <Labeled label="Subtle"> <div style={{ width: 300 }}><Divider variant="subtle"  /></div></Labeled>
      </Section>

      <Section title="Divider / Vertical" gap="gap-6">
        <Labeled label="Default"><div style={{ height: 48 }}><Divider orientation="vertical" variant="default" /></div></Labeled>
        <Labeled label="Subtle"> <div style={{ height: 48 }}><Divider orientation="vertical" variant="subtle"  /></div></Labeled>
      </Section>
    </>
  );
}
