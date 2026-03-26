'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getActiveProfile } from '@/lib/storage';
import { CASEL_COMPETENCIES } from '@/lib/constants';
import type { ChildProfile } from '@/lib/types';
import KindnessFlower from '@/components/garden/KindnessFlower';
import Card from '@/components/ui/Card';

export default function GardenPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  if (!profile) return null;

  const totalGrowth = Object.values(profile.progress.flowerPetals).reduce((a, b) => a + b, 0);

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">Your Kindness Garden</h1>
      <p className="text-gleea-warm-gray/60 mb-6">Watch your kindness grow!</p>

      {/* Kindness Flower */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-white rounded-gleea p-8 shadow-soft">
          <KindnessFlower petals={profile.progress.flowerPetals} />
        </div>
      </motion.div>

      {/* Growth summary */}
      <Card className="mb-4">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-gleea-gold">{totalGrowth}</div>
          <div className="text-sm text-gleea-warm-gray/60">Total kindness points grown</div>
        </div>
      </Card>

      {/* CASEL breakdown */}
      <h2 className="text-lg font-bold text-gleea-warm-gray mb-3">Your Growth Areas</h2>
      <div className="space-y-2">
        {CASEL_COMPETENCIES.map(comp => {
          const value = profile.progress.flowerPetals[comp.id as keyof typeof profile.progress.flowerPetals] || 0;
          const maxValue = 10;
          const progress = Math.min(value / maxValue, 1);

          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gleea-warm-gray">{comp.name}</span>
                  <span className="text-xs text-gleea-warm-gray/50">{value}/{maxValue}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: comp.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
