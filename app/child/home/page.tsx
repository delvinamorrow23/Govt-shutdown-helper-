'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getActiveProfile } from '@/lib/storage';
import { getHeartLevel } from '@/lib/progress';
import { GUIDES, WORLDS } from '@/lib/constants';
import type { ChildProfile, Mission } from '@/lib/types';
import Card from '@/components/ui/Card';
import StreakCounter from '@/components/rewards/StreakCounter';
import XPBar from '@/components/rewards/XPBar';
import GuideAvatar from '@/components/guides/GuideAvatar';
import GuideNarrator from '@/components/guides/GuideNarrator';
import DailyReward from '@/components/rewards/DailyReward';

import kindnessGardenMissions from '@/data/missions/kindness-garden.json';
import friendshipForestMissions from '@/data/missions/friendship-forest.json';
import familyCoveMissions from '@/data/missions/family-cove.json';
import helpingHillsMissions from '@/data/missions/helping-hills.json';
import wonderWorldMissions from '@/data/missions/wonder-world.json';

const ALL_MISSIONS: Mission[] = [
  ...(kindnessGardenMissions as Mission[]),
  ...(friendshipForestMissions as Mission[]),
  ...(familyCoveMissions as Mission[]),
  ...(helpingHillsMissions as Mission[]),
  ...(wonderWorldMissions as Mission[]),
];

function getNextMission(profile: ChildProfile): Mission | null {
  const ageBand = profile.ageBand;
  const available = ALL_MISSIONS.filter(
    m => m.ageBands.includes(ageBand as any) && !profile.progress.completedMissions.includes(m.id)
  );
  return available[0] ?? null;
}

const GREETINGS: Record<string, string[]> = {
  'brave-bear': [
    "Ready for a brave new adventure?",
    "Today's a great day to try something new!",
    "Courage starts with showing up — and here you are!",
  ],
  'loyal-dog': [
    "I've been waiting for you, friend!",
    "Let's make someone's day brighter together!",
    "A good friend like you makes the world better!",
  ],
  'gentle-deer': [
    "I see kindness in your eyes today.",
    "The world needs your gentle heart.",
    "Who can we help today with Kind Eyes?",
  ],
  'joyful-otter': [
    "Yay! You're here! Let's have fun being kind!",
    "Ready to splash some joy around?",
    "Happiness is even better when shared!",
  ],
  'sweet-skunk': [
    "Everyone belongs, and you make sure of it!",
    "Let's make sure no one feels left out today!",
    "Your kindness includes everyone!",
  ],
  'sharing-squirrel': [
    "I saved the best acorn for you!",
    "Ready to share some kindness?",
    "Sharing makes everything grow!",
  ],
};

export default function HomePage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const p = getActiveProfile();
    setProfile(p);
    if (p) {
      const lines = GREETINGS[p.avatarGuide] || GREETINGS['brave-bear'];
      setGreeting(lines[Math.floor(Math.random() * lines.length)]);
    }
  }, []);

  function refreshProfile() {
    setProfile(getActiveProfile());
  }

  if (!profile) return null;

  const heartLevel = getHeartLevel(profile.progress.totalXP);
  const nextMission = getNextMission(profile);

  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
      <div className="grid grid-cols-2 gap-3 mb-4">
        <XPBar totalXP={profile.progress.totalXP} />
        <StreakCounter streak={profile.streaks.currentStreak} />
      </div>

      {/* Daily Reward */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <DailyReward onClaim={refreshProfile} />
      </motion.div>

      {/* Guide greeting with narrator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <GuideNarrator
          guideId={profile.avatarGuide}
          messages={[greeting]}
          phase="idle"
        />
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
          <p className="text-gleea-warm-gray/60 text-sm mt-1">You&apos;ve completed all available missions!</p>
        </Card>
      )}

      {/* Mini-games shortcut */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <Link href="/child/mini-games">
          <Card className="bg-gradient-to-r from-gleea-pink-light/50 to-gleea-gold-glow/50 hover:shadow-glow-pink transition-shadow">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🎮</div>
              <div className="flex-1">
                <div className="font-bold text-gleea-warm-gray">Mini-Games</div>
                <div className="text-xs text-gleea-warm-gray/60">Practice kindness skills & earn XP</div>
              </div>
              <span className="text-gleea-pink">→</span>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* World Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <h2 className="text-lg font-bold text-gleea-warm-gray mb-3">Your Worlds</h2>
        <div className="grid grid-cols-3 gap-2">
          {WORLDS.map((world, i) => {
            const isActive = world.id === profile.progress.currentWorldId;
            const prefix = world.id.split('-').map(w => w[0]).join('');
            const completedInWorld = profile.progress.completedMissions.filter(
              id => id.startsWith(prefix)
            ).length;

            return (
              <Link key={world.id} href={`/child/journey?world=${world.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className={`rounded-gleea p-3 text-center transition-all ${
                    isActive
                      ? 'bg-white shadow-soft ring-2 ring-gleea-pink/30'
                      : 'bg-white/60 shadow-soft'
                  }`}
                >
                  <div className="text-xl mb-0.5">{world.emoji}</div>
                  <div className="font-bold text-xs text-gleea-warm-gray">{world.name}</div>
                  <div className="text-[10px] text-gleea-warm-gray/50 mt-0.5">
                    {completedInWorld}/5
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
          <div className="text-2xl font-extrabold text-gleea-pink">{profile.progress.completedMissions.length}</div>
          <div className="text-xs text-gleea-warm-gray/50">Missions</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-gleea-gold">{profile.badges.length}</div>
          <div className="text-xs text-gleea-warm-gray/50">Badges</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-gleea-forest">{profile.streaks.longestStreak}</div>
          <div className="text-xs text-gleea-warm-gray/50">Best Streak</div>
        </div>
      </motion.div>
    </div>
  );
}
