'use client';

import { HEART_LEVELS } from '@/lib/constants';
import { getHeartLevel, getXPToNextLevel } from '@/lib/progress';
import ProgressBar from '@/components/ui/ProgressBar';

interface XPBarProps {
  totalXP: number;
}

export default function XPBar({ totalXP }: XPBarProps) {
  const level = getHeartLevel(totalXP);
  const { current, required, progress } = getXPToNextLevel(totalXP);
  const isMaxLevel = level.level === HEART_LEVELS[HEART_LEVELS.length - 1].level;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-2xl" role="img" aria-label="Heart level">
        💖
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-bold text-gleea-charcoal truncate">
            {level.name}
          </span>
          <span className="text-[11px] text-gleea-charcoal/50 font-medium ml-2 shrink-0">
            {isMaxLevel ? 'MAX' : `${current}/${required} XP`}
          </span>
        </div>
        <ProgressBar
          progress={progress}
          color="bg-gleea-pink"
          height="sm"
        />
      </div>
    </div>
  );
}
