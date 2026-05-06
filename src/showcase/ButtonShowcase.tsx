import { useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '../components';
import { Section, Labeled, Playground, Toggle, Sep } from './shared';

export function ButtonShowcase() {
  return (
    <>
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

      <Section title="Button / Icon Position">
        <Labeled label="Icon Right (default)"><Button icon={<ChevronRightIcon style={{ fontSize: 18 }} />}>Continue</Button></Labeled>
        <Labeled label="Icon Left">           <Button icon={<AddIcon         style={{ fontSize: 18 }} />} iconPosition="left">Add Client</Button></Labeled>
      </Section>

      <Section title="Button / Icon Only" gap="gap-3">
        <Labeled label="Primary M"><Button variant="primary" size="medium" icon={<AddIcon style={{ fontSize: 18 }} />} aria-label="Add" /></Labeled>
        <Labeled label="Primary L"><Button variant="primary" size="large"  icon={<AddIcon style={{ fontSize: 20 }} />} aria-label="Add" /></Labeled>
        <Labeled label="Outline M"><Button variant="outline" size="medium" icon={<AddIcon style={{ fontSize: 18 }} />} aria-label="Add" /></Labeled>
        <Labeled label="Outline L"><Button variant="outline" size="large"  icon={<AddIcon style={{ fontSize: 20 }} />} aria-label="Add" /></Labeled>
        <Labeled label="Disabled"> <Button variant="primary" size="medium" icon={<AddIcon style={{ fontSize: 18 }} />} aria-label="Add" disabled /></Labeled>
      </Section>
    </>
  );
}

function ButtonPlayground() {
  const [variant,    setVariant]    = useState<'primary' | 'outline'>('primary');
  const [size,       setSize]       = useState<'medium' | 'large'>('medium');
  const [disabled,   setDisabled]   = useState(false);
  const [withIcon,   setWithIcon]   = useState(false);
  const [iconPos,    setIconPos]    = useState<'left' | 'right'>('right');
  const [iconOnly,   setIconOnly]   = useState(false);
  const [mouseState, setMouseState] = useState<'default' | 'hover' | 'pressed'>('default');

  const stateLabel = disabled ? 'disabled' : mouseState;

  const icon = (withIcon || iconOnly)
    ? <ChevronRightIcon style={{ fontSize: 18 }} />
    : undefined;

  return (
    <Playground
      stateLabel={stateLabel}
      controls={<>
        <Toggle label="Outline"   checked={variant === 'outline'} onChange={() => setVariant(v => v === 'primary' ? 'outline' : 'primary')} />
        <Toggle label="Large"     checked={size === 'large'}      onChange={() => setSize(s => s === 'medium' ? 'large' : 'medium')} />
        <Sep />
        <Toggle label="Icon"      checked={withIcon}  onChange={() => { setWithIcon(v => !v); setIconOnly(false); }} />
        <Toggle label="Icon only" checked={iconOnly}  onChange={() => { setIconOnly(v => !v); setWithIcon(false); }} />
        {withIcon && !iconOnly && (
          <Toggle label="Left"    checked={iconPos === 'left'} onChange={() => setIconPos(p => p === 'right' ? 'left' : 'right')} />
        )}
        <Sep />
        <Toggle label="Disabled"  checked={disabled}  onChange={() => { setDisabled(v => !v); setMouseState('default'); }} />
      </>}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        icon={icon}
        iconPosition={iconPos}
        onMouseEnter={() => !disabled && setMouseState('hover')}
        onMouseLeave={() => !disabled && setMouseState('default')}
        onMouseDown={()  => !disabled && setMouseState('pressed')}
        onMouseUp={()    => !disabled && setMouseState('hover')}
      >
        {iconOnly ? undefined : 'Sign In'}
      </Button>
    </Playground>
  );
}
