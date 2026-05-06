import { useState } from 'react';
import { SignIn }          from './pages/SignIn';
import { ButtonShowcase }  from './showcase/ButtonShowcase';
import { InputShowcase }   from './showcase/InputShowcase';
import { BadgeShowcase }   from './showcase/BadgeShowcase';
import { TagShowcase }     from './showcase/TagShowcase';
import { AvatarShowcase }  from './showcase/AvatarShowcase';
import { DividerShowcase } from './showcase/DividerShowcase';
import { SpinnerShowcase } from './showcase/SpinnerShowcase';

export default function App() {
  const [view, setView] = useState<'signin' | 'ds'>('signin');

  if (view === 'signin') {
    return (
      <div>
        <SignIn />
        <button
          onClick={() => setView('ds')}
          className="fixed bottom-5 right-5 px-(--spacing-16) h-(--height-button-md) rounded-(--border-radius-full) bg-brand text-text-white text-body-md font-bold border-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          Design System →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page font-sans">
      <div className="max-w-[1200px] mx-auto px-12 pt-12 pb-20">

        <div className="flex items-center gap-(--spacing-16) mb-2">
          <button
            onClick={() => setView('signin')}
            className="px-(--spacing-12) h-(--height-button-md) rounded-(--border-radius-md) border border-stroke-brand text-text-brand text-body-md font-bold bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            ← Sign In
          </button>
          <h1 className="text-2xl font-bold text-text-primary m-0">
            CRM Design System
          </h1>
        </div>

        <ButtonShowcase />
        <InputShowcase />
        <BadgeShowcase />
        <TagShowcase />
        <AvatarShowcase />
        <DividerShowcase />
        <SpinnerShowcase />

      </div>
    </div>
  );
}
