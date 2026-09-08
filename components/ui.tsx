'use client';

import React from 'react';

// Shared storybook primitives in the canonical Gleea style: parchment cards on
// a twilight ground, gold accent. Lightweight and in-house (swappable for
// shadcn later).

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
    'focus-visible:ring-4 focus-visible:ring-gold-soft/60 disabled:opacity-50 ' +
    'disabled:active:scale-100 min-h-[52px]';
  const variants: Record<string, string> = {
    primary: 'bg-gold text-twilight-900 shadow-glow hover:bg-gold-soft',
    soft: 'bg-white/10 text-parchment hover:bg-white/20 border border-white/15',
    ghost: 'bg-transparent text-gold-soft hover:bg-white/10',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

// Parchment card: warm paper with dark ink, for readable storybook content.
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
        'rounded-3xl border border-parchment-shade bg-parchment text-parchment-ink ' +
        'p-6 shadow-card ' +
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
          ? 'bg-gold text-twilight-900 border-gold shadow-glow'
          : 'bg-parchment-shade/60 text-parchment-ink border-parchment-shade hover:bg-parchment-shade')
      }
    >
      {emoji ? <span className="text-xl">{emoji}</span> : null}
      {children}
    </Comp>
  );
}

// Three-step loop progress indicator (READ · DO · SHINE). Rendered on twilight.
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
                (i <= current ? 'bg-gold shadow-glow' : 'bg-white/25')
              }
            />
            <span
              className={
                'text-xs font-rounded font-bold uppercase tracking-wide ' +
                (i === current ? 'text-gold-soft' : 'text-white/40')
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
