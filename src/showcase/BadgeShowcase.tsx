import { Badge } from '../components';
import { Section, Labeled } from './shared';

export function BadgeShowcase() {
  return (
    <Section title="Badge / Variants" gap="gap-3">
      <Labeled label="Default"> <Badge variant="default">12</Badge></Labeled>
      <Labeled label="Primary"> <Badge variant="primary">New</Badge></Labeled>
      <Labeled label="Success"> <Badge variant="success">Done</Badge></Labeled>
      <Labeled label="Error">   <Badge variant="error">Alert</Badge></Labeled>
    </Section>
  );
}
