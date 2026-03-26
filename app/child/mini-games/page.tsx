'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveProfile, updateProfile } from '@/lib/storage';
import type { ChildProfile } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmotionMatch from '@/components/mini-games/EmotionMatch';
import KindnessChain from '@/components/mini-games/KindnessChain';
import FeelingsFinder from '@/components/mini-games/FeelingsFinder';
import CelebrationOverlay from '@/components/rewards/CelebrationOverlay';

type GameId = 'emotion-match' | 'kindness-chain' | 'feelings-finder' | null;

const GAMES = [
  {
    id: 'emotion-match' as const,
    name: 'Emotion Match',
    emoji: '🎭',
    description: 'Match feelings to situations',
    color: 'from-gleea-pink-light to-gleea-sky',
    casel: 'Self-Awareness',
  },
  {
    id: 'kindness-chain' as const,
    name: 'Kindness Chain',
    emoji: '🔗',
    description: 'Build a chain of kind choices',
    color: 'from-gleea-forest-light to-gleea-gold-glow',
    casel: 'Responsible Decision-Making',
  },
  {
    id: 'feelings-finder' as const,
    name: 'Feelings Finder',
    emoji: '🧠',
    description: 'Match pairs of hidden feelings',
    color: 'from-gleea-gold-glow to-gleea-pink-light',
    casel: 'Social Awareness',
  },
];

export default function MiniGamesPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  function handleGameComplete(xp: number) {
    if (!profile) return;
    updateProfile(profile.id, (p) => ({
      ...p,
      progress: {
        ...p.progress,
        totalXP: p.progress.totalXP + xp,
      },
    }));
    setProfile(getActiveProfile());
    setShowCelebration(true);
  }

  if (!profile) return null;

  return (
    <div className="px-5 pt-6">
      <CelebrationOverlay
        show={showCelebration}
        type="mission-complete"
        message="Game Complete!"
        onDone={() => {
          setShowCelebration(false);
          setActiveGame(null);
        }}
      />

      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">Mini-Games</h1>
            <p className="text-gleea-warm-gray/60 mb-6">
              Practice kindness skills and earn XP!
            </p>

            <div className="space-y-3">
              {GAMES.map((game, i) => (
                <motion.button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className="w-full text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-glow-pink transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-gleea bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl`}>
                        {game.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gleea-warm-gray">{game.name}</div>
                        <div className="text-sm text-gleea-warm-gray/60 mt-0.5">{game.description}</div>
                        <div className="text-xs text-gleea-warm-gray/40 mt-1">{game.casel}</div>
                      </div>
                      <span className="text-gleea-pink text-lg">→</span>
                    </div>
                  </Card>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setActiveGame(null)}
                className="text-gleea-warm-gray/40 text-sm"
              >
                ← Back
              </button>
              <h2 className="text-xl font-extrabold text-gleea-warm-gray">
                {GAMES.find(g => g.id === activeGame)?.name}
              </h2>
            </div>

            {activeGame === 'emotion-match' && (
              <EmotionMatch
                onComplete={(score) => handleGameComplete(score * 5)}
                ageBand={profile.ageBand as any}
              />
            )}
            {activeGame === 'kindness-chain' && (
              <KindnessChain
                onComplete={(score) => handleGameComplete(score * 5)}
                ageBand={profile.ageBand as any}
              />
            )}
            {activeGame === 'feelings-finder' && (
              <FeelingsFinder
                onComplete={(score) => handleGameComplete(score * 3)}
                ageBand={profile.ageBand as any}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
