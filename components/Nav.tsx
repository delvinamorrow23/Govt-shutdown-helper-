'use client';

import React from 'react';

export type View = 'welcome' | 'setup' | 'loop' | 'garden' | 'parentgate' | 'parent';

// Slim top bar shown once a child profile exists. Mobile-first with large tap
// targets.
export function Nav({
  current,
  onNavigate,
}: {
  current: View;
  onNavigate: (view: View) => void;
}) {
  const tabs: { view: View; label: string; emoji: string }[] = [
    { view: 'loop', label: 'Story', emoji: '📖' },
    { view: 'garden', label: 'Garden', emoji: '🌷' },
    { view: 'parentgate', label: 'Grown-ups', emoji: '👪' },
  ];
  const isActive = (v: View) =>
    current === v || (v === 'parentgate' && current === 'parent');

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-night-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <button
          onClick={() => onNavigate('loop')}
          className="flex items-center gap-2 font-rounded text-2xl font-extrabold text-white"
        >
          <span>✨</span> Gleea
        </button>
        <nav className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.view}
              onClick={() => onNavigate(t.view)}
              className={
                'flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition ' +
                (isActive(t.view)
                  ? 'bg-gleea-pink text-white shadow-glow'
                  : 'text-white/70 hover:bg-white/10')
              }
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
