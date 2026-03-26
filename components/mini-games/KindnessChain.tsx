'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface KindnessChainProps {
  onComplete: (score: number) => void;
  ageBand: 'seedling' | 'sprout' | 'bloomer';
}

interface ChainStep {
  prompt: string;
  kindAction: string;
  unkindAction: string;
  kindIsLeft: boolean;
}

const CHAIN_STEPS: ChainStep[] = [
  { prompt: 'Someone drops their books.', kindAction: 'Help pick them up', unkindAction: 'Walk past', kindIsLeft: true },
  { prompt: 'A friend looks sad today.', kindAction: 'Ask if they\'re okay', unkindAction: 'Ignore them', kindIsLeft: false },
  { prompt: 'Your sibling wants to play.', kindAction: 'Play together', unkindAction: 'Say "go away"', kindIsLeft: true },
  { prompt: 'Someone made a mistake.', kindAction: 'Encourage them', unkindAction: 'Laugh at them', kindIsLeft: false },
  { prompt: 'There\'s one cookie left.', kindAction: 'Offer to share', unkindAction: 'Grab it first', kindIsLeft: true },
  { prompt: 'New student at school.', kindAction: 'Say "welcome!"', unkindAction: 'Don\'t notice', kindIsLeft: false },
  { prompt: 'Your friend draws a picture.', kindAction: 'Say something nice', unkindAction: 'Say it\'s not good', kindIsLeft: true },
  { prompt: 'Someone is being left out.', kindAction: 'Invite them to join', unkindAction: 'Keep playing without them', kindIsLeft: false },
];

export default function KindnessChain({ onComplete, ageBand }: KindnessChainProps) {
  const totalSteps = ageBand === 'seedling' ? 4 : ageBand === 'sprout' ? 5 : 6;
  const [steps, setSteps] = useState<ChainStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [chainLength, setChainLength] = useState(0);
  const [selected, setSelected] = useState<'kind' | 'unkind' | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffled = [...CHAIN_STEPS].sort(() => Math.random() - 0.5).slice(0, totalSteps);
    setSteps(shuffled);
  }, [totalSteps]);

  function handleChoice(isKind: boolean) {
    if (selected) return;
    setSelected(isKind ? 'kind' : 'unkind');
    if (isKind) setChainLength(c => c + 1);

    setTimeout(() => {
      if (currentStep + 1 >= totalSteps) {
        setGameOver(true);
      } else {
        setCurrentStep(s => s + 1);
        setSelected(null);
      }
    }, 1000);
  }

  if (steps.length === 0) return null;

  if (gameOver) {
    const perfect = chainLength === totalSteps;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        {/* Chain visualization */}
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                i < chainLength ? 'bg-gleea-pink text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i < chainLength ? '💛' : '○'}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-5xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
        >
          {perfect ? '🔗' : chainLength > totalSteps / 2 ? '💛' : '✨'}
        </motion.div>
        <h3 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">
          {perfect ? 'Unbreakable Chain!' : chainLength > totalSteps / 2 ? 'Strong Chain!' : 'Keep Growing!'}
        </h3>
        <p className="text-gleea-warm-gray/60 mb-2">
          You built a {chainLength}-link kindness chain!
        </p>
        <p className="text-sm text-gleea-warm-gray/40 mb-6">
          Each kind choice makes the chain stronger.
        </p>
        <Button variant="primary" size="lg" onClick={() => onComplete(chainLength)}>
          Collect {chainLength * 5} XP →
        </Button>
      </motion.div>
    );
  }

  const step = steps[currentStep];
  const leftAction = step.kindIsLeft ? step.kindAction : step.unkindAction;
  const rightAction = step.kindIsLeft ? step.unkindAction : step.kindAction;
  const leftIsKind = step.kindIsLeft;

  return (
    <div>
      {/* Chain progress */}
      <div className="flex justify-center gap-1 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              i < currentStep
                ? i < chainLength
                  ? 'bg-gleea-pink text-white'
                  : 'bg-gray-300'
                : i === currentStep
                  ? 'bg-gleea-pink/30 border-2 border-gleea-pink'
                  : 'bg-gray-200'
            }`}
          >
            {i < currentStep ? (i < chainLength ? '💛' : '·') : ''}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Scenario */}
          <div className="bg-white rounded-gleea p-5 shadow-soft mb-6 text-center">
            <p className="text-lg text-gleea-warm-gray font-bold">{step.prompt}</p>
            <p className="text-sm text-gleea-warm-gray/50 mt-1">What would kindness do?</p>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => handleChoice(leftIsKind)}
              disabled={!!selected}
              className={`tap-target-large rounded-gleea p-4 text-center transition-all ${
                selected === 'kind' && leftIsKind
                  ? 'bg-gleea-forest-light border-2 border-gleea-forest'
                  : selected === 'unkind' && !leftIsKind
                    ? 'bg-red-50 border-2 border-red-300'
                    : selected && leftIsKind
                      ? 'bg-gleea-forest-light/50'
                      : 'bg-white shadow-soft'
              }`}
              whileTap={!selected ? { scale: 0.95 } : {}}
            >
              <span className="text-sm font-bold text-gleea-warm-gray">{leftAction}</span>
            </motion.button>

            <motion.button
              onClick={() => handleChoice(!leftIsKind)}
              disabled={!!selected}
              className={`tap-target-large rounded-gleea p-4 text-center transition-all ${
                selected === 'kind' && !leftIsKind
                  ? 'bg-gleea-forest-light border-2 border-gleea-forest'
                  : selected === 'unkind' && leftIsKind
                    ? 'bg-red-50 border-2 border-red-300'
                    : selected && !leftIsKind
                      ? 'bg-gleea-forest-light/50'
                      : 'bg-white shadow-soft'
              }`}
              whileTap={!selected ? { scale: 0.95 } : {}}
            >
              <span className="text-sm font-bold text-gleea-warm-gray">{rightAction}</span>
            </motion.button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {selected && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center mt-4 font-bold ${
                  selected === 'kind' ? 'text-gleea-forest' : 'text-gleea-pink'
                }`}
              >
                {selected === 'kind'
                  ? 'Kindness link added! 💛'
                  : 'Hmm, the kind choice was better. Let\'s keep going!'}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
