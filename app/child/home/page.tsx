'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getActiveProfile } from '@/lib/storage';
import { getHeartLevel, getXPToNextLevel } from '@/lib/progress';
import { GUIDES, WORLDS } from '@/lib/constants';
import type { ChildProfile } from '@/lib/types';
import type { Mission } from '@/lib/types';
import Card from '@/components/ui/Card';
import StreakCounter from '@/components/rewards/StreakCounter';
import XPBar from '@/components/rewards/XPBar';
import GuideAvatar from '@/components/guides/GuideAvatar';
import GuideSpeechBubble from '@/components/guides/GuideSpeechBubble';

// Load first available mission from first world
import kindnessGardenMissions from '@/data/missions/kindness-garden.json';

function getNextMission(profile: ChildProfile): Mission | null {
  const missions = kindnessGardenMissions as Mission[];
  const ageBand = profile.ageBand;
  const available = missions.filter(
    m => m.ageBands.includes(ageBand as any) && !profile.progress.completedMissions.includes(m.id)
  );
  return available[0] ?? null;
}

const GREETINGS = [
  "Ready to spread some kindness?",
  "Your kindness makes the world brighter!",
  "Every kind act matters!",
  "Your heart is growing stronger!",
  "The world needs your kindness today!",
];

export default function HomePage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const p = getActiveProfile();
    setProfile(p);
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  if (!profile) return null;

  const guide = GUIDES.find(g => g.id === profile.avatarGuide);
  const heartLevel = getHeartLevel(profile.progress.totalXP);
  const nextMission = getNextMission(profile);

  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gleea-warm-gray">
            Hi, {profile.name}! 💛
          </h1>
          <p className="text-gleea-warm-gray/60 text-sm">{heartLevel.name}</p>
        </div>
        <Link href="/" className="text-gleea-warm-gray/40 text-sm">
          Switch
        </Link>
      </div>

      {/* XP and Streak row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <XPBar totalXP={profile.progress.totalXP} />
        <StreakCounter streak={profile.streaks.currentStreak} />
      </div>

      {/* Guide greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-start gap-3">
          <GuideAvatar guideId={profile.avatarGuide} size="md" animated />
          <GuideSpeechBubble
            message={greeting}
            guideId={profile.avatarGuide}
            visible
          />
        </div>
      </motion.div>

      {/* Today's Mission */}
      {nextMission ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-gleea-warm-gray mb-3">Today&apos;s Mission</h2>
          <Link href={`/child/journey?world=${nextMission.worldId}&mission=${nextMission.id}`}>
            <Card className="border-2 border-gleea-pink/20 hover:border-gleea-pink/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {nextMission.kindPrinciple === 'eyes' ? '👁️' : nextMission.kindPrinciple === 'heart' ? '💖' : '🤲'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gleea-warm-gray">{nextMission.title}</div>
                  <div className="text-sm text-gleea-warm-gray/60 mt-0.5">
                    with {GUIDES.find(g => g.id === nextMission.guideId)?.name} · {nextMission.xpReward} XP
                  </div>
                </div>
                <div className="text-gleea-pink text-xl font-bold">→</div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ) : (
        <Card className="text-center py-8">
          <div className="text-4xl mb-3">🌟</div>
          <p className="font-bold text-gleea-warm-gray">Amazing work!</p>
          <p className="text-gleea-warm-gray/60 text-sm mt-1">You&apos;ve completed all available missions. More coming soon!</p>
        </Card>
      )}

      {/* World Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        <h2 className="text-lg font-bold text-gleea-warm-gray mb-3">Your Worlds</h2>
        <div className="grid grid-cols-2 gap-3">
          {WORLDS.slice(0, 4).map((world, i) => {
            const isActive = world.id === profile.progress.currentWorldId;
            const completedInWorld = profile.progress.completedMissions.filter(
              id => id.startsWith(world.id.split('-').map(w => w[0]).join(''))
            ).length;

            return (
              <Link key={world.id} href={`/child/journey?world=${world.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className={`rounded-gleea p-4 text-center transition-all ${
                    isActive
                      ? 'bg-white shadow-soft ring-2 ring-gleea-pink/30'
                      : 'bg-white/60 shadow-soft'
                  }`}
                >
                  <div className="text-2xl mb-1">{world.emoji}</div>
                  <div className="font-bold text-sm text-gleea-warm-gray">{world.name}</div>
                  <div className="text-xs text-gleea-warm-gray/50 mt-1">
                    {completedInWorld} done
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 mb-4 flex items-center justify-center gap-6 text-center"
      >
        <div>
          <div className="text-2xl font-extrabold text-gleea-pink">
            {profile.progress.completedMissions.length}
          </div>
          <div className="text-xs text-gleea-warm-gray/50">Missions</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-gleea-gold">
            {profile.badges.length}
          </div>
          <div className="text-xs text-gleea-warm-gray/50">Badges</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-gleea-forest">
            {profile.streaks.longestStreak}
          </div>
          <div className="text-xs text-gleea-warm-gray/50">Best Streak</div>
        </div>
      </motion.div>
    </div>
  );
}
