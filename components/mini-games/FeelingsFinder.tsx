'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface FeelingsFinderProps {
  onComplete: (score: number) => void;
  ageBand: 'seedling' | 'sprout' | 'bloomer';
}

interface Feeling {
  emoji: string;
  name: string;
  description: string;
  color: string;
}

const FEELINGS: Feeling[] = [
  { emoji: '😊', name: 'Happy', description: 'Feeling good and cheerful', color: '#F5E6A3' },
  { emoji: '😢', name: 'Sad', description: 'Feeling down or unhappy', color: '#B8D4E8' },
  { emoji: '😠', name: 'Angry', description: 'Feeling mad or frustrated', color: '#F5C6D8' },
  { emoji: '😰', name: 'Worried', description: 'Feeling scared something bad might happen', color: '#9B8EC4' },
  { emoji: '🥰', name: 'Loved', description: 'Feeling warm and cared for', color: '#E8739A' },
  { emoji: '🌟', name: 'Proud', description: 'Feeling good about something you did', color: '#D4A843' },
  { emoji: '😤', name: 'Frustrated', description: 'Feeling stuck or annoyed', color: '#C4956A' },
  { emoji: '😌', name: 'Calm', description: 'Feeling peaceful and relaxed', color: '#A8D5B0' },
  { emoji: '🤗', name: 'Grateful', description: 'Feeling thankful for something', color: '#F5E6A3' },
];

interface FeelingCard {
  id: number;
  feeling: Feeling;
  flipped: boolean;
  matched: boolean;
}

export default function FeelingsFinder({ onComplete, ageBand }: FeelingsFinderProps) {
  const pairsCount = ageBand === 'seedling' ? 3 : ageBand === 'sprout' ? 4 : 6;
  const [cards, setCards] = useState<FeelingCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const selected = [...FEELINGS].sort(() => Math.random() - 0.5).slice(0, pairsCount);
    const pairs = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((feeling, i) => ({
        id: i,
        feeling,
        flipped: false,
        matched: false,
      }));
    setCards(pairs);
  }, [pairsCount]);

  function handleFlip(id: number) {
    const card = cards.find(c => c.id === id);
    if (!card || card.matched || flippedIds.includes(id) || flippedIds.length >= 2) return;

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped.map(fid => cards.find(c => c.id === fid)!);

      if (first.feeling.name === second.feeling.name) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
          ));
          setFlippedIds([]);
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);
          if (newMatched === pairsCount) {
            setTimeout(() => setGameOver(true), 500);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => setFlippedIds([]), 800);
      }
    }
  }

  if (cards.length === 0) return null;

  if (gameOver) {
    const efficiency = Math.max(0, pairsCount * 3 - moves);
    const score = pairsCount + efficiency;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8 }}
        >
          🧠
        </motion.div>
        <h3 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">
          All Feelings Found!
        </h3>
        <p className="text-gleea-warm-gray/60 mb-2">
          You matched all {pairsCount} feelings in {moves} moves!
        </p>
        <p className="text-sm text-gleea-warm-gray/40 mb-6">
          Knowing our feelings helps us understand others too.
        </p>
        <Button variant="primary" size="lg" onClick={() => onComplete(score)}>
          Collect {score * 3} XP →
        </Button>
      </motion.div>
    );
  }

  const cols = pairsCount <= 3 ? 3 : pairsCount <= 4 ? 4 : 4;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gleea-warm-gray">
          Matched: {matchedCount}/{pairsCount}
        </span>
        <span className="text-sm text-gleea-warm-gray/50">
          Moves: {moves}
        </span>
      </div>

      <p className="text-center text-gleea-warm-gray/60 text-sm mb-4">
        Find matching feelings! Tap two cards to flip them.
      </p>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map(card => {
          const isFlipped = flippedIds.includes(card.id) || card.matched;

          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={card.matched}
              className="aspect-square tap-target rounded-gleea transition-all"
              whileTap={!isFlipped ? { scale: 0.9 } : {}}
              animate={card.matched ? { opacity: 0.5, scale: 0.9 } : {}}
            >
              <AnimatePresence mode="wait">
                {isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full rounded-gleea flex flex-col items-center justify-center"
                    style={{ backgroundColor: card.feeling.color + '40' }}
                  >
                    <span className="text-2xl">{card.feeling.emoji}</span>
                    <span className="text-[10px] font-bold text-gleea-warm-gray mt-1">
                      {card.feeling.name}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full rounded-gleea bg-gleea-pink flex items-center justify-center"
                  >
                    <span className="text-2xl text-white">💛</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
