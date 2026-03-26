'use client';

import { CASEL_COMPETENCIES } from '@/lib/constants';

interface KindnessFlowerProps {
  petals: Record<string, number>;
}

// Position petals evenly around a center point (5 petals = 72 degrees apart)
const PETAL_POSITIONS = [
  { angle: -90 },   // top
  { angle: -18 },   // top-right
  { angle: 54 },    // bottom-right
  { angle: 126 },   // bottom-left
  { angle: 198 },   // top-left
];

function petalSize(growth: number): number {
  // Scale from 20px (min) to 60px (max), capping at ~20 growth points
  const clamped = Math.min(growth, 20);
  return 20 + (clamped / 20) * 40;
}

export default function KindnessFlower({ petals }: KindnessFlowerProps) {
  const centerX = 120;
  const centerY = 120;
  const orbitRadius = 50;

  return (
    <div className="relative w-[240px] h-[240px] mx-auto">
      {CASEL_COMPETENCIES.map((competency, index) => {
        const growth = petals[competency.id] || 0;
        const size = petalSize(growth);
        const position = PETAL_POSITIONS[index];
        const radians = (position.angle * Math.PI) / 180;
        const x = centerX + orbitRadius * Math.cos(radians) - size / 2;
        const y = centerY + orbitRadius * Math.sin(radians) - size / 2;

        return (
          <div
            key={competency.id}
            className="absolute rounded-full transition-all duration-500 ease-out flex items-center justify-center"
            style={{
              width: size,
              height: size,
              left: x,
              top: y,
              backgroundColor: competency.color,
              opacity: growth > 0 ? 0.7 + Math.min(growth / 20, 1) * 0.3 : 0.25,
            }}
            title={`${competency.name}: ${growth}`}
          />
        );
      })}
      {/* Center golden heart */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          left: centerX - 22,
          top: centerY - 22,
        }}
      >
        <span className="text-3xl drop-shadow-sm" role="img" aria-label="Heart center">
          💛
        </span>
      </div>
    </div>
  );
}
