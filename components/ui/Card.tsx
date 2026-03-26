'use client';

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ title, children, className = '', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-gleea shadow-paper p-5
        ${onClick ? 'cursor-pointer hover:shadow-paper-hover active:scale-[0.98] transition-all duration-200' : ''}
        ${className}
      `.trim()}
    >
      {title && (
        <h3 className="text-lg font-bold text-gleea-charcoal mb-3">{title}</h3>
      )}
      {children}
    </Component>
  );
}
