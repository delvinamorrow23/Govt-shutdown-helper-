'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface EmotionMatchProps {
  onComplete: (score: number) => void;
  ageBand: 'seedling' | 'sprout' | 'bloomer';
}

interface Round {
  scenario: string;
  correctEmoji: string;
  correctLabel: string;
  options: { emoji: string; label: string }[];
}

const ROUNDS_POOL: Round[] = [
  {
    scenario: 'Your friend shares their favorite toy with you.',
    correctEmoji: '🥰', correctLabel: 'Grateful',
    options: [{ emoji: '🥰', label: 'Grateful' }, { emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' }],
  },
  {
    scenario: 'You see a new kid sitting alone at lunch.',
    correctEmoji: '😟', correctLabel: 'Concerned',
    options: [{ emoji: '😟', label: 'Concerned' }, { emoji: '😂', label: 'Amused' }, { emoji: '😠', label: 'Angry' }],
  },
  {
    scenario: 'You tried really hard and finished a puzzle!',
    correctEmoji: '🌟', correctLabel: 'Proud',
    options: [{ emoji: '🌟', label: 'Proud' }, { emoji: '😰', label: 'Worried' }, { emoji: '😢', label: 'Sad' }],
  },
  {
    scenario: 'Someone took your crayon without asking.',
    correctEmoji: '😤', correctLabel: 'Frustrated',
    options: [{ emoji: '😤', label: 'Frustrated' }, { emoji: '😊', label: 'Happy' }, { emoji: '😴', label: 'Sleepy' }],
  },
  {
    scenario: 'You\'re about to perform in the school show.',
    correctEmoji: '😰', correctLabel: 'Nervous',
    options: [{ emoji: '😰', label: 'Nervous' }, { emoji: '😠', label: 'Angry' }, { emoji: '😴', label: 'Bored' }],
  },
  {
    scenario: 'Your grandma gives you a big warm hug.',
    correctEmoji: '🤗', correctLabel: 'Loved',
    options: [{ emoji: '🤗', label: 'Loved' }, { emoji: '😤', label: 'Frustrated' }, { emoji: '😰', label: 'Nervous' }],
  },
  {
    scenario: 'You see someone drop their books in the hallway.',
    correctEmoji: '💝', correctLabel: 'Caring',
    options: [{ emoji: '💝', label: 'Caring' }, { emoji: '😂', label: 'Amused' }, { emoji: '😴', label: 'Bored' }],
  },
  {
    scenario: 'Your friend is moving to a new city.',
    correctEmoji: '😢', correctLabel: 'Sad',
    options: [{ emoji: '😢', label: 'Sad' }, { emoji: '😊', label: 'Happy' }, { emoji: '😠', label: 'Angry' }],
  },
];

export default function EmotionMatch({ onComplete, ageBand }: EmotionMatchProps) {
  const totalRounds = ageBand === 'seedling' ? 3 : ageBand === 'sprout' ? 4 : 5;
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffled = [...ROUNDS_POOL].sort(() => Math.random() - 0.5).slice(0, totalRounds);
    setRounds(shuffled);
  }, [totalRounds]);

  function handleSelect(emoji: string) {
    if (selected) return;
    setSelected(emoji);
    const correct = emoji === rounds[currentRound].correctEmoji;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentRound + 1 >= totalRounds) {
        setGameOver(true);
      } else {
        setCurrentRound(r => r + 1);
        setSelected(null);
        setIsCorrect(null);
      }
    }, 1200);
  }

  if (rounds.length === 0) return null;

  if (gameOver) {
    const perfect = score === totalRounds;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8 }}
        >
          {perfect ? '🏆' : score >= totalRounds / 2 ? '⭐' : '💛'}
        </motion.div>
        <h3 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">
          {perfect ? 'Perfect!' : score >= totalRounds / 2 ? 'Great job!' : 'Good try!'}
        </h3>
        <p className="text-gleea-warm-gray/60 mb-2">
          You matched {score} of {totalRounds} emotions correctly!
        </p>
        <p className="text-sm text-gleea-warm-gray/40 mb-6">
          Understanding feelings helps us be kinder to everyone.
        </p>
        <Button variant="primary" size="lg" onClick={() => onComplete(score)}>
          Collect {score * 5} XP →
        </Button>
      </motion.div>
    );
  }

  const round = rounds[currentRound];

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < currentRound
                ? 'bg-gleea-pink'
                : i === currentRound
                  ? 'bg-gleea-pink/50'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Scenario */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="bg-white rounded-gleea p-5 shadow-soft mb-6">
            <p className="text-lg text-gleea-warm-gray leading-relaxed text-center">
              {round.scenario}
            </p>
          </div>

          <p className="text-center text-gleea-warm-gray/60 text-sm mb-4">
            What feeling matches this?
          </p>

          {/* Options */}
          <div className="grid grid-cols-3 gap-3">
            {round.options.map(opt => {
              let bg = 'bg-white shadow-soft';
              if (selected === opt.emoji) {
                bg = isCorrect ? 'bg-gleea-forest-light shadow-glow' : 'bg-red-100 border-red-300';
              } else if (selected && opt.emoji === round.correctEmoji) {
                bg = 'bg-gleea-forest-light shadow-glow';
              }

              return (
                <motion.button
                  key={opt.emoji}
                  onClick={() => handleSelect(opt.emoji)}
                  disabled={!!selected}
                  className={`tap-target-large rounded-gleea p-4 flex flex-col items-center gap-2 transition-all ${bg}`}
                  whileTap={!selected ? { scale: 0.9 } : {}}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-xs font-bold text-gleea-warm-gray">{opt.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className={`font-bold ${isCorrect ? 'text-gleea-forest' : 'text-gleea-pink'}`}>
                  {isCorrect ? 'That\'s right! Great empathy!' : `The answer was ${round.correctLabel}. You'll get it next time!`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
