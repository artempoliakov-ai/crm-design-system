import { Spinner } from '../components';
import { Section, Labeled } from './shared';

export function SpinnerShowcase() {
  return (
    <Section title="Spinner / Size" gap="gap-6">
      <Labeled label="S — 16px"><Spinner size="S" /></Labeled>
      <Labeled label="M — 24px"><Spinner size="M" /></Labeled>
      <Labeled label="L — 32px"><Spinner size="L" /></Labeled>
    </Section>
  );
}
