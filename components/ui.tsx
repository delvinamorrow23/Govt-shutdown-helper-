'use client';

import React from 'react';

// Small shared primitives in the Gleea storybook style. Kept lightweight and
// in-house (rather than a full shadcn/ui install) to keep the demo dependency-
// light; they can be swapped for shadcn later without changing call sites much.

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'soft' | 'ghost';
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-lg ' +
    'font-rounded font-bold transition active:scale-95 focus:outline-none ' +
    'focus-visible:ring-4 focus-visible:ring-gleea-rose/60 disabled:opacity-50 ' +
    'disabled:active:scale-100 min-h-[52px]';
  const variants: Record<string, string> = {
    primary: 'bg-gleea-pink text-white shadow-glow hover:brightness-105',
    soft: 'bg-white/10 text-white hover:bg-white/20 border border-white/15',
    ghost: 'bg-transparent text-gleea-rose hover:bg-white/10',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        'rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm ' +
        'shadow-[0_8px_40px_rgba(0,0,0,0.25)] ' +
        className
      }
    >
      {children}
    </div>
  );
}

export function Pill({
  active,
  children,
  onClick,
  emoji,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  emoji?: string;
}) {
  const Comp: any = onClick ? 'button' : 'span';
  return (
    <Comp
      onClick={onClick}
      className={
        'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-base font-semibold ' +
        'transition border min-h-[44px] ' +
        (active
          ? 'bg-gleea-pink text-white border-gleea-pink shadow-glow'
          : 'bg-white/5 text-white/90 border-white/15 hover:bg-white/10')
      }
    >
      {emoji ? <span className="text-xl">{emoji}</span> : null}
      {children}
    </Comp>
  );
}

// Three-step loop progress indicator (READ · DO · SHINE).
export function StepDots({ current }: { current: 0 | 1 | 2 }) {
  const labels = ['Read', 'Do', 'Shine'];
  return (
    <div className="flex items-center justify-center gap-3" aria-label="Gleea Loop progress">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <span
              className={
                'h-3 w-3 rounded-full transition ' +
                (i <= current ? 'bg-gleea-pink shadow-glow' : 'bg-white/25')
              }
            />
            <span
              className={
                'text-xs font-rounded font-bold uppercase tracking-wide ' +
                (i === current ? 'text-gleea-rose' : 'text-white/40')
              }
            >
              {label}
            </span>
          </div>
          {i < 2 ? <span className="mb-4 h-px w-6 bg-white/20" /> : null}
        </div>
      ))}
    </div>
  );
}
