'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gleea-pink text-white shadow-md hover:brightness-105 active:scale-95',
  secondary: 'bg-white text-gleea-pink border-2 border-gleea-pink hover:bg-gleea-pink/5 active:scale-95',
  ghost: 'bg-transparent text-gleea-pink hover:bg-gleea-pink/10 active:scale-95',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-5 py-2.5 text-base min-h-[44px]',
  lg: 'px-7 py-4 text-lg min-h-[56px] min-w-[56px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon = false,
  onClick,
  disabled = false,
  className = '',
  children,
}: ButtonProps) {
  const roundedClass = icon ? 'rounded-full' : 'rounded-gleea';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-gleea-pink/50 focus:ring-offset-2
        disabled:opacity-40 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedClass}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
}
