import { useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Input } from '../components';
import { Section, Labeled, Playground, Toggle, Sep } from './shared';

export function InputShowcase() {
  return (
    <>
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
    </>
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
    : error   ? 'error'
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
        icon={icon ? <InfoOutlinedIcon style={{ fontSize: size === 'M' ? 20 : 16 }} /> : undefined}
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
