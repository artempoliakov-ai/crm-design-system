import { useState, useEffect } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon    from '@mui/icons-material/VisibilityOutlined';
import { Input }  from '../components/Input';
import { Button } from '../components/Button';

function BlobBackground() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calc = () =>
      setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1158));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true" style={{ background: '#f5f5f5' }}>
      <div
        className="si-canvas"
        style={{ transform: `translate(-50%, -50%) rotate(180deg) scale(${String(scale)})` }}
      >
        <div className="si-blob-blue"  />
        <div className="si-blob-glow"  />
        <div className="si-blob-white" />
        <div className="si-fade"       />
      </div>
    </div>
  );
}

export function SignIn() {
  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <BlobBackground />

      <form
        className="relative z-10 flex flex-col gap-(--spacing-24) p-(--spacing-32) rounded-(--border-radius-lg) bg-surface w-[492px]"
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
