'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getActiveProfile } from '@/lib/storage';
import { ALL_BADGES } from '@/lib/badges';
import type { ChildProfile } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const CATEGORIES = [
  { id: 'special', name: 'Special', emoji: '✨' },
  { id: 'streak', name: 'Streaks', emoji: '🔥' },
  { id: 'heart-level', name: 'Heart Levels', emoji: '💛' },
  { id: 'world', name: 'Worlds', emoji: '🗺️' },
  { id: 'casel', name: 'SEL Growth', emoji: '🌱' },
  { id: 'guide-bond', name: 'Guide Bonds', emoji: '🤝' },
];

export default function BadgesPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  if (!profile) return null;

  const earned = new Set(profile.badges);
  const earnedCount = earned.size;
  const totalCount = ALL_BADGES.length;

  const displayBadges = selectedCategory
    ? ALL_BADGES.filter(b => b.category === selectedCategory)
    : ALL_BADGES;

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-1">Your Badges</h1>
      <p className="text-gleea-warm-gray/60 mb-4">
        {earnedCount} of {totalCount} earned
      </p>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gleea-pink to-gleea-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
            !selectedCategory
              ? 'bg-gleea-pink text-white'
              : 'bg-white text-gleea-warm-gray shadow-soft'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => {
          const catEarned = ALL_BADGES.filter(b => b.category === cat.id && earned.has(b.id)).length;
          const catTotal = ALL_BADGES.filter(b => b.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gleea-pink text-white'
                  : 'bg-white text-gleea-warm-gray shadow-soft'
              }`}
            >
              {cat.emoji} {cat.name} ({catEarned}/{catTotal})
            </button>
          );
        })}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-3 gap-3">
        {displayBadges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex flex-col items-center"
          >
            <Badge
              name={badge.name}
              icon={badge.icon}
              earned={earned.has(badge.id)}
              size="lg"
            />
            <p className="text-[9px] text-gleea-warm-gray/40 text-center mt-1 leading-tight max-w-[80px]">
              {badge.description}
            </p>
          </motion.div>
        ))}
      </div>

      {earnedCount === 0 && (
        <Card className="mt-6 text-center">
          <div className="text-3xl mb-2">✨</div>
          <p className="font-bold text-gleea-warm-gray">Your badge wall awaits!</p>
          <p className="text-gleea-warm-gray/60 text-sm mt-1">
            Complete missions to earn your first badge.
          </p>
        </Card>
      )}
    </div>
  );
}
