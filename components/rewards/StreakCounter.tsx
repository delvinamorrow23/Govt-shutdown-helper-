'use client';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  if (streak <= 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-gleea bg-gray-50">
        <span className="text-lg">✨</span>
        <span className="text-sm text-gleea-charcoal/50 font-medium">
          Start your streak today!
        </span>
      </div>
    );
  }

  const isWeekStreak = streak >= 7;

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-gleea
        transition-all duration-300
        ${
          isWeekStreak
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 shadow-[0_0_20px_rgba(251,146,60,0.3)] border border-orange-200'
            : 'bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-100'
        }
      `.trim()}
    >
      <span className={`text-2xl ${isWeekStreak ? 'animate-pulse' : ''}`}>
        🔥
      </span>
      <div className="flex flex-col">
        <span
          className={`
            text-base font-bold leading-tight
            ${isWeekStreak ? 'text-orange-600' : 'text-amber-700'}
          `.trim()}
        >
          {streak} day streak!
        </span>
        {isWeekStreak && (
          <span className="text-[10px] text-orange-500 font-semibold">
            Amazing dedication! ✨
          </span>
        )}
      </div>
    </div>
  );
}
