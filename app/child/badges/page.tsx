'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getActiveProfile } from '@/lib/storage';
import type { ChildProfile } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

// Sample badges (will be moved to data/badges.json later)
const ALL_BADGES = [
  { id: 'first-mission', name: 'First Step', icon: '🌱', category: 'special', description: 'Complete your first mission' },
  { id: 'streak-7', name: '7-Day Spark', icon: '🔥', category: 'streak', description: 'Complete missions 7 days in a row' },
  { id: 'streak-30', name: '30-Day Flame', icon: '🔥', category: 'streak', description: 'Complete missions 30 days in a row' },
  { id: 'heart-5', name: 'Shining Star', icon: '⭐', category: 'heart-level', description: 'Reach Heart Level 5' },
  { id: 'kg-complete', name: 'Garden Guardian', icon: '🌻', category: 'world', description: 'Complete all Kindness Garden missions' },
  { id: 'ff-complete', name: 'Forest Friend', icon: '🌳', category: 'world', description: 'Complete all Friendship Forest missions' },
  { id: 'empathy-10', name: 'Empathy Explorer', icon: '💝', category: 'casel', description: '10 social awareness missions' },
  { id: 'courage-10', name: 'Courage Builder', icon: '💪', category: 'casel', description: '10 self-management missions' },
  { id: 'bear-bond', name: "Bear's Best Friend", icon: '🐻', category: 'guide-bond', description: 'Max bond with Brave Bear' },
  { id: 'squirrel-bond', name: "Squirrel's Pal", icon: '🐿️', category: 'guide-bond', description: 'Max bond with Sharing Squirrel' },
  { id: 'kind-eyes', name: 'Kind Eyes Master', icon: '👁️', category: 'special', description: 'Complete 10 Kind Eyes missions' },
  { id: 'kind-heart', name: 'Kind Heart Master', icon: '💖', category: 'special', description: 'Complete 10 Kind Heart missions' },
];

export default function BadgesPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  if (!profile) return null;

  const earned = new Set(profile.badges);

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">Your Badges</h1>
      <p className="text-gleea-warm-gray/60 mb-6">
        {earned.size} of {ALL_BADGES.length} earned
      </p>

      <div className="grid grid-cols-3 gap-3">
        {ALL_BADGES.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Badge
              name={badge.name}
              icon={badge.icon}
              earned={earned.has(badge.id)}
              size="lg"
            />
          </motion.div>
        ))}
      </div>

      {earned.size === 0 && (
        <Card className="mt-6 text-center">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-gleea-warm-gray/60">
            Complete missions to earn your first badge!
          </p>
        </Card>
      )}
    </div>
  );
}
