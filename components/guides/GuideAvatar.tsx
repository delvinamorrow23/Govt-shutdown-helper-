'use client';

import { GUIDES } from '@/lib/constants';

interface GuideAvatarProps {
  guideId: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-10 h-10', text: 'text-lg', wing: 'text-[8px] -top-1 -right-0.5' },
  md: { container: 'w-14 h-14', text: 'text-2xl', wing: 'text-[10px] -top-1 -right-0.5' },
  lg: { container: 'w-20 h-20', text: 'text-3xl', wing: 'text-xs -top-1.5 -right-1' },
};

export default function GuideAvatar({
  guideId,
  size = 'md',
  animated = false,
}: GuideAvatarProps) {
  const guide = GUIDES.find((g) => g.id === guideId);
  if (!guide) return null;

  const config = sizeConfig[size];
  const initial = guide.name.charAt(0).toUpperCase();

  return (
    <div
      className={`
        relative ${config.container} rounded-full
        flex items-center justify-center
        shadow-md border-2 border-white/60
        ${animated ? 'animate-float' : ''}
      `.trim()}
      style={{ backgroundColor: guide.color }}
    >
      <span className={`${config.text} font-bold text-white drop-shadow-sm`}>
        {initial}
      </span>
      {/* Small wing decoration */}
      <span
        className={`absolute ${config.wing} text-white/80 pointer-events-none`}
        aria-hidden="true"
      >
        ✦
      </span>
    </div>
  );
}
