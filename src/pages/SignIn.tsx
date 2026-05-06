import { useState } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon    from '@mui/icons-material/VisibilityOutlined';
import { Input }  from '../components/Input';
import { Button } from '../components/Button';

export function SignIn() {
  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-brand">
      <form
        className="flex flex-col gap-(--spacing-24) p-(--spacing-32) rounded-(--border-radius-lg) bg-surface w-[492px]"
        style={{ boxShadow: 'var(--shadow-card-small)' }}
        onSubmit={e => e.preventDefault()}
        noValidate
      >
        <h1
          className="m-0 text-center font-bold text-text-primary"
          style={{ fontSize: 'var(--text-heading-md)' }}
        >
          Sign In
        </h1>

        <Input
          label="Username"
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full"
        />

        <Input
          label="Password"
          placeholder="Enter password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="w-full h-full flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer text-inherit"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword
                ? <VisibilityOutlinedIcon    style={{ fontSize: 'var(--spacing-20)' }} />
                : <VisibilityOffOutlinedIcon style={{ fontSize: 'var(--spacing-20)' }} />
              }
            </button>
          }
          className="w-full"
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={!canSubmit}
          className="w-full"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
