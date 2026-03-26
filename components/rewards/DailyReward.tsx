'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveProfile, updateProfile } from '@/lib/storage';
import type { ChildProfile } from '@/lib/types';
import Button from '@/components/ui/Button';

interface DailyRewardProps {
  onClaim?: () => void;
}

const SPARK_REWARDS = [
  { day: 1, sparks: 1, emoji: '✨', label: 'Kindness Spark' },
  { day: 2, sparks: 1, emoji: '✨', label: 'Kindness Spark' },
  { day: 3, sparks: 1, emoji: '✨', label: 'Kindness Spark' },
  { day: 4, sparks: 2, emoji: '⭐', label: 'Double Spark' },
  { day: 5, sparks: 1, emoji: '✨', label: 'Kindness Spark' },
  { day: 6, sparks: 1, emoji: '✨', label: 'Kindness Spark' },
  { day: 7, sparks: 5, emoji: '🌟', label: 'Weekly Glow!', bonus: true },
];

export default function DailyReward({ onClaim }: DailyRewardProps) {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimedSparks, setClaimedSparks] = useState(0);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  const canClaim = useCallback(() => {
    if (!profile) return false;
    const today = new Date().toISOString().split('T')[0];
    const lastClaim = profile.streaks.lastCompletionDate;
    return lastClaim !== today && !profile.streaks.dailyRewardClaimed;
  }, [profile]);

  function handleClaim() {
    if (!profile || !canClaim()) return;

    const streakDay = ((profile.streaks.currentStreak) % 7) + 1;
    const reward = SPARK_REWARDS[streakDay - 1] || SPARK_REWARDS[0];

    updateProfile(profile.id, (p) => ({
      ...p,
      progress: {
        ...p.progress,
        totalXP: p.progress.totalXP + (reward.sparks * 5),
      },
      streaks: {
        ...p.streaks,
        dailyRewardClaimed: true,
      },
    }));

    setClaimedSparks(reward.sparks);
    setClaimed(true);
    setProfile(getActiveProfile());
    onClaim?.();
  }

  if (!profile) return null;

  const streakDay = ((profile.streaks.currentStreak) % 7) + 1;
  const canClaimNow = canClaim();

  return (
    <>
      {/* Daily reward button */}
      <motion.button
        onClick={() => canClaimNow && setShowModal(true)}
        className={`relative rounded-gleea p-3 flex items-center gap-3 w-full transition-all ${
          canClaimNow
            ? 'bg-gradient-to-r from-gleea-gold-glow to-gleea-pink-light shadow-glow border-2 border-gleea-gold/30'
            : 'bg-white/60 shadow-soft opacity-70'
        }`}
        whileTap={canClaimNow ? { scale: 0.97 } : {}}
      >
        <motion.div
          className="text-2xl"
          animate={canClaimNow ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {canClaimNow ? '🎁' : '✅'}
        </motion.div>
        <div className="text-left flex-1">
          <div className="font-bold text-gleea-warm-gray text-sm">
            {canClaimNow ? 'Daily Kindness Spark!' : 'Spark Collected!'}
          </div>
          <div className="text-xs text-gleea-warm-gray/50">
            {canClaimNow ? 'Tap to claim today\'s spark' : 'Come back tomorrow!'}
          </div>
        </div>

        {/* Week progress dots */}
        <div className="flex gap-1">
          {SPARK_REWARDS.map((r, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < streakDay
                  ? r.bonus
                    ? 'bg-gleea-gold shadow-glow'
                    : 'bg-gleea-pink'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </motion.button>

      {/* Claim modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-gleea p-8 max-w-xs w-full text-center shadow-glow"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {!claimed ? (
                <>
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🎁
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-gleea-warm-gray mb-2">
                    Day {streakDay} Spark!
                  </h3>
                  <p className="text-gleea-warm-gray/60 text-sm mb-6">
                    Your kindness sparkle is waiting!
                  </p>

                  <Button variant="primary" size="lg" className="w-full" onClick={handleClaim}>
                    Claim {SPARK_REWARDS[streakDay - 1]?.emoji} Spark!
                  </Button>
                </>
              ) : (
                <>
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ scale: [0.5, 1.3, 1], rotate: [0, 360] }}
                    transition={{ duration: 0.8 }}
                  >
                    {SPARK_REWARDS[streakDay - 1]?.emoji || '✨'}
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-gleea-warm-gray mb-2">
                    +{claimedSparks * 5} XP!
                  </h3>
                  <p className="text-gleea-warm-gray/60 text-sm mb-2">
                    {claimedSparks > 2 ? 'Weekly Bonus! Your dedication is amazing!' : 'Your garden is glowing brighter!'}
                  </p>
                  {streakDay === 7 && (
                    <motion.p
                      className="text-gleea-gold font-bold text-sm mb-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Weekly Glow Bonus Unlocked!
                    </motion.p>
                  )}
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => setShowModal(false)}
                  >
                    Continue →
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
