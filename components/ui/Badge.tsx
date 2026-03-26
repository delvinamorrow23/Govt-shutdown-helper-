'use client';

import React from 'react';

interface BadgeProps {
  name: string;
  icon: string;
  earned: boolean;
  size?: 'sm' | 'lg';
}

const sizeConfig = {
  sm: {
    container: 'w-16 h-16',
    icon: 'text-2xl',
    label: 'text-[10px] mt-1',
  },
  lg: {
    container: 'w-24 h-24',
    icon: 'text-4xl',
    label: 'text-xs mt-2',
  },
};

export default function Badge({ name, icon, earned, size = 'sm' }: BadgeProps) {
  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          ${config.container}
          rounded-full flex items-center justify-center
          transition-all duration-300
          ${
            earned
              ? 'bg-gradient-to-br from-amber-100 to-amber-200 shadow-[0_0_16px_rgba(212,168,67,0.5)] border-2 border-amber-300'
              : 'bg-gray-100 border-2 border-gray-200 grayscale opacity-50'
          }
        `.trim()}
      >
        <span className={config.icon} role="img" aria-label={name}>
          {earned ? icon : '🔒'}
        </span>
      </div>
      <span
        className={`
          ${config.label} font-semibold text-center leading-tight max-w-[80px]
          ${earned ? 'text-gleea-charcoal' : 'text-gray-400'}
        `.trim()}
      >
        {name}
      </span>
    </div>
  );
}
