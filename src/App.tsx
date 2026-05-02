import { type ReactNode, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Badge } from './components/Badge';
import { Tag } from './components/Tag';
import { Avatar } from './components/Avatar';
import { Divider } from './components/Divider';

// ── Layout ────────────────────────────────────────────────────────────────────

function Section({ title, children, gap = 'gap-4' }: { title: string; children: ReactNode; gap?: string }) {
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

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <span className="text-label text-stroke-light">{label}</span>
      {children}
    </div>
  );
}

// ── Playground ────────────────────────────────────────────────────────────────

function Playground({ children, controls, stateLabel }: {
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

function Toggle({ label, checked, onChange }: {
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

function Sep() {
  return <div className="w-px self-stretch bg-stroke-disabled mx-1" />;
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  return (
    <div className="min-h-screen bg-page font-sans">
      <div className="max-w-[1200px] mx-auto px-12 pt-12 pb-20">

        <h1 className="text-2xl font-bold text-text-primary m-0">
          CRM Design System
        </h1>

        {/* ── Button ───────────────────────────────────────────────────────────── */}
        <Section title="Button — Live">
          <ButtonPlayground />
        </Section>

        <Section title="Button / Primary — States">
          <Labeled label="Default">  <Button variant="primary">Sign In</Button></Labeled>
          <Labeled label="Hover">    <Button variant="primary" state="hover">Sign In</Button></Labeled>
          <Labeled label="Pressed">  <Button variant="primary" state="pressed">Sign In</Button></Labeled>
          <Labeled label="Disabled"> <Button variant="primary" disabled>Sign In</Button></Labeled>
        </Section>

        <Section title="Button / Outline — States">
          <Labeled label="Default">  <Button variant="outline">Export</Button></Labeled>
          <Labeled label="Hover">    <Button variant="outline" state="hover">Export</Button></Labeled>
          <Labeled label="Pressed">  <Button variant="outline" state="pressed">Export</Button></Labeled>
          <Labeled label="Disabled"> <Button variant="outline" disabled>Export</Button></Labeled>
        </Section>

        <Section title="Button / Size">
          <Labeled label="Medium — 40px"><Button size="medium">Sign In</Button></Labeled>
          <Labeled label="Large — 48px"> <Button size="large">Sign In</Button></Labeled>
        </Section>

        {/* ── Input ────────────────────────────────────────────────────────────── */}
        <Section title="Input — Live">
          <InputPlayground />
        </Section>

        <Section title="Input / States — Size M" gap="gap-6">
          <Labeled label="Default">  <Input state="Default"  size="M" label="Label" style={{ width: 300 }} /></Labeled>
          <Labeled label="Hover">    <Input state="Hover"    size="M" label="Label" style={{ width: 300 }} /></Labeled>
          <Labeled label="Focus">    <Input state="Focus"    size="M" label="Label" placeholder="Input" style={{ width: 300 }} /></Labeled>
          <Labeled label="Disabled"> <Input state="Disabled" size="M" style={{ width: 300 }} /></Labeled>
          <Labeled label="Error">    <Input state="Error"    size="M" label="Label" placeholder="Input" style={{ width: 300 }} /></Labeled>
          <Labeled label="Success">  <Input state="Success"  size="M" label="Label" placeholder="Input" style={{ width: 300 }} /></Labeled>
        </Section>

        <Section title="Input / States — Size S" gap="gap-6">
          <Labeled label="Default">  <Input state="Default"  size="S" label="Label" style={{ width: 300 }} /></Labeled>
          <Labeled label="Hover">    <Input state="Hover"    size="S" label="Label" style={{ width: 300 }} /></Labeled>
          <Labeled label="Focus">    <Input state="Focus"    size="S" label="Label" placeholder="Input" style={{ width: 300 }} /></Labeled>
          <Labeled label="Disabled"> <Input state="Disabled" size="S" style={{ width: 300 }} /></Labeled>
          <Labeled label="Error">    <Input state="Error"    size="S" label="Label" placeholder="Input" style={{ width: 300 }} /></Labeled>
          <Labeled label="Success">  <Input state="Success"  size="S" label="Label" placeholder="Input" style={{ width: 300 }} /></Labeled>
        </Section>

        {/* ── Badge ────────────────────────────────────────────────────────────── */}
        <Section title="Badge / Variants" gap="gap-3">
          <Labeled label="Default"> <Badge variant="default">12</Badge></Labeled>
          <Labeled label="Primary"> <Badge variant="primary">New</Badge></Labeled>
          <Labeled label="Success"> <Badge variant="success">Done</Badge></Labeled>
          <Labeled label="Error">   <Badge variant="error">Alert</Badge></Labeled>
        </Section>

        {/* ── Tag ──────────────────────────────────────────────────────────────── */}
        <Section title="Tag — Live">
          <TagPlayground />
        </Section>

        <Section title="Tag / Variants" gap="gap-3">
          <TagVariants />
        </Section>

        {/* ── Avatar ───────────────────────────────────────────────────────────── */}
        <Section title="Avatar — Live">
          <AvatarPlayground />
        </Section>

        <Section title="Avatar / Type" gap="gap-4">
          <Labeled label="Initials">     <Avatar type="initials" size="M" initials="A" /></Labeled>
          <Labeled label="Icon">         <Avatar type="icon"     size="M" /></Labeled>
          <Labeled label="Image (no src)"><Avatar type="image"   size="M" /></Labeled>
        </Section>

        <Section title="Avatar / Size" gap="gap-3">
          {(['XS', 'S', 'M', 'L', 'XL'] as const).map(s => (
            <Labeled key={s} label={s}>
              <Avatar type="initials" size={s} initials="A" />
            </Labeled>
          ))}
        </Section>

        {/* ── Divider ──────────────────────────────────────────────────────────── */}
        <Section title="Divider / Horizontal" gap="gap-6">
          <Labeled label="Default"><div style={{ width: 300 }}><Divider variant="default" /></div></Labeled>
          <Labeled label="Subtle"> <div style={{ width: 300 }}><Divider variant="subtle"  /></div></Labeled>
        </Section>

        <Section title="Divider / Vertical" gap="gap-6">
          <Labeled label="Default"><div style={{ height: 48 }}><Divider orientation="vertical" variant="default" /></div></Labeled>
          <Labeled label="Subtle"> <div style={{ height: 48 }}><Divider orientation="vertical" variant="subtle"  /></div></Labeled>
        </Section>

      </div>
    </div>
  );
}

// ── Playground components ─────────────────────────────────────────────────────

function ButtonPlayground() {
  const [variant,  setVariant]  = useState<'primary' | 'outline'>('primary');
  const [size,     setSize]     = useState<'medium' | 'large'>('medium');
  const [disabled, setDisabled] = useState(false);
  const [icon,     setIcon]     = useState(false);
  const [mouseState, setMouseState] = useState<'default' | 'hover' | 'pressed'>('default');

  const stateLabel = disabled ? 'disabled' : mouseState;

  return (
    <Playground
      stateLabel={stateLabel}
      controls={<>
        <Toggle label="Outline"  checked={variant === 'outline'} onChange={() => setVariant(v => v === 'primary' ? 'outline' : 'primary')} />
        <Toggle label="Large"    checked={size === 'large'}      onChange={() => setSize(s => s === 'medium' ? 'large' : 'medium')} />
        <Sep />
        <Toggle label="Icon"     checked={icon}     onChange={() => setIcon(v => !v)} />
        <Toggle label="Disabled" checked={disabled} onChange={() => { setDisabled(v => !v); setMouseState('default'); }} />
      </>}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        icon={icon ? <ChevronRightIcon style={{ fontSize: 18 }} /> : undefined}
        onMouseEnter={() => !disabled && setMouseState('hover')}
        onMouseLeave={() => !disabled && setMouseState('default')}
        onMouseDown={()  => !disabled && setMouseState('pressed')}
        onMouseUp={()    => !disabled && setMouseState('hover')}
      >
        Sign In
      </Button>
    </Playground>
  );
}

function InputPlayground() {
  const [size,     setSize]     = useState<'M' | 'S'>('M');
  const [label,    setLabel]    = useState(true);
  const [icon,     setIcon]     = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error,    setError]    = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [value,    setValue]    = useState('');
  const [focused,  setFocused]  = useState(false);
  const [hovered,  setHovered]  = useState(false);

  const stateLabel = disabled ? 'disabled'
    : error    ? 'error'
    : success  ? 'success'
    : focused  ? 'focus'
    : hovered  ? 'hover'
    : 'default';

  const toggleError   = () => { setError(v => !v);   setSuccess(false); };
  const toggleSuccess = () => { setSuccess(v => !v); setError(false); };
  const toggleDisabled = () => {
    setDisabled(v => !v);
    setError(false); setSuccess(false);
    setFocused(false); setHovered(false);
  };

  return (
    <Playground
      stateLabel={stateLabel}
      controls={<>
        <Toggle label="Small"    checked={size === 'S'} onChange={() => setSize(s => s === 'M' ? 'S' : 'M')} />
        <Toggle label="Label"    checked={label}        onChange={() => setLabel(v => !v)} />
        <Toggle label="Icon"     checked={icon}         onChange={() => setIcon(v => !v)} />
        <Sep />
        <Toggle label="Disabled" checked={disabled}     onChange={toggleDisabled} />
        <Toggle label="Error"    checked={error}        onChange={toggleError} />
        <Toggle label="Success"  checked={success}      onChange={toggleSuccess} />
      </>}
    >
      <Input
        size={size}
        label={label ? 'Email' : undefined}
        placeholder="Enter value"
        disabled={disabled}
        error={error}
        success={success}
        icon={icon}
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: 280 }}
      />
    </Playground>
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

export default App;
