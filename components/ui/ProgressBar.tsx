'use client';

import { motion } from 'framer-motion';

type ProgressHeight = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: ProgressHeight;
  showLabel?: boolean;
}

const heightStyles: Record<ProgressHeight, string> = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-5',
};

export default function ProgressBar({
  progress,
  color = 'bg-gleea-pink',
  height = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clampedProgress * 100);

  // Determine if color is a Tailwind class or a hex value
  const isHex = color.startsWith('#');
  const barBg = isHex ? undefined : color;
  const barStyle = isHex ? { backgroundColor: color } : {};

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-semibold text-gleea-charcoal/60">
            {percentage}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${heightStyles[height]} bg-gleea-cream rounded-full overflow-hidden`}
      >
        <motion.div
          className={`h-full rounded-full ${isHex ? '' : barBg}`}
          style={barStyle}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
