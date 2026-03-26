'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GUIDES } from '@/lib/constants';

interface GuideNarratorProps {
  guideId: string;
  messages: string[];
  phase: 'read' | 'do' | 'shine' | 'complete' | 'idle';
  onMessageDone?: () => void;
}

const PHASE_ENTRANCES = {
  read: { emoji: '📖', bgColor: 'bg-gleea-sky/20', borderColor: 'border-gleea-sky/40' },
  do: { emoji: '🤲', bgColor: 'bg-gleea-forest-light/20', borderColor: 'border-gleea-forest/30' },
  shine: { emoji: '✨', bgColor: 'bg-gleea-gold-glow/30', borderColor: 'border-gleea-gold/40' },
  complete: { emoji: '🌟', bgColor: 'bg-gleea-pink-light/30', borderColor: 'border-gleea-pink/30' },
  idle: { emoji: '💛', bgColor: 'bg-white', borderColor: 'border-gray-100' },
};

const ENCOURAGE_LINES: Record<string, string[]> = {
  'brave-bear': [
    "You're being so brave!",
    "Courage looks great on you!",
    "Keep going — I believe in you!",
    "Every brave step matters!",
  ],
  'loyal-dog': [
    "That's what friends do!",
    "You're such a good friend!",
    "I'm right here with you!",
    "Friendship makes everything better!",
  ],
  'gentle-deer': [
    "Your kindness is so gentle and beautiful.",
    "You noticed what others needed — that's special.",
    "Empathy is your superpower!",
    "You see with Kind Eyes.",
  ],
  'joyful-otter': [
    "That made me so happy!",
    "Joy is contagious — spread it!",
    "You know what? You're amazing!",
    "Feelings are friends, not foes!",
  ],
  'sweet-skunk': [
    "Everyone belongs, and you proved it!",
    "You made someone feel included!",
    "Being different is beautiful!",
    "You chose what's right. I'm proud!",
  ],
  'sharing-squirrel': [
    "Sharing makes everything better!",
    "Your generosity is glowing!",
    "When we share, kindness multiplies!",
    "That was so generous of you!",
  ],
};

export default function GuideNarrator({ guideId, messages, phase, onMessageDone }: GuideNarratorProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const guide = GUIDES.find(g => g.id === guideId);
  const phaseStyle = PHASE_ENTRANCES[phase];

  // Typewriter effect
  useEffect(() => {
    if (messages.length === 0) return;
    const msg = messages[currentMessage];
    if (!msg) return;

    setIsTyping(true);
    setDisplayedText('');
    let i = 0;

    const interval = setInterval(() => {
      if (i < msg.length) {
        setDisplayedText(msg.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentMessage, messages]);

  function handleTap() {
    if (isTyping) {
      // Skip to full text
      setDisplayedText(messages[currentMessage]);
      setIsTyping(false);
      return;
    }

    if (currentMessage < messages.length - 1) {
      setCurrentMessage(c => c + 1);
    } else {
      onMessageDone?.();
    }
  }

  // Show random encouragement after message completes
  useEffect(() => {
    if (!isTyping && displayedText && phase !== 'idle') {
      const timer = setTimeout(() => setShowEncouragement(true), 1500);
      return () => clearTimeout(timer);
    }
    setShowEncouragement(false);
  }, [isTyping, displayedText, phase]);

  if (!guide || messages.length === 0) return null;

  const encourageLines = ENCOURAGE_LINES[guideId] || ENCOURAGE_LINES['brave-bear'];
  const encouragement = encourageLines[Math.floor(Math.random() * encourageLines.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-gleea p-4 ${phaseStyle.bgColor} border ${phaseStyle.borderColor} mb-4`}
    >
      <div className="flex items-start gap-3">
        {/* Animated guide avatar */}
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
          style={{ backgroundColor: guide.color }}
          animate={{
            y: [0, -4, 0],
            rotate: isTyping ? [0, 3, -3, 0] : 0,
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 0.5, repeat: isTyping ? Infinity : 0 },
          }}
        >
          {guide.name.charAt(0)}
          {/* Wing sparkle */}
          <motion.span
            className="absolute -top-1 -right-1 text-xs"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✦
          </motion.span>
        </motion.div>

        {/* Speech content */}
        <button onClick={handleTap} className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gleea-warm-gray/50">{guide.name}</span>
            <span className="text-xs">{phaseStyle.emoji}</span>
          </div>

          <p className="text-sm text-gleea-warm-gray leading-relaxed">
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-1.5 h-4 bg-gleea-pink ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>

          {/* Tap to continue hint */}
          {!isTyping && currentMessage < messages.length - 1 && (
            <motion.p
              className="text-xs text-gleea-warm-gray/30 mt-2"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Tap to continue...
            </motion.p>
          )}
        </button>
      </div>

      {/* Encouragement bubble */}
      <AnimatePresence>
        {showEncouragement && !isTyping && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/50"
          >
            <p className="text-xs text-gleea-warm-gray/50 italic">
              {encouragement}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
