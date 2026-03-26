'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  delay: number;
  duration: number;
}

interface CelebrationOverlayProps {
  show: boolean;
  type?: 'mission-complete' | 'badge-unlock' | 'level-up' | 'streak';
  message?: string;
  onDone?: () => void;
}

const PARTICLE_SETS = {
  'mission-complete': ['✨', '⭐', '🌟', '💛', '🌸'],
  'badge-unlock': ['🏆', '✨', '⭐', '🎉', '💫'],
  'level-up': ['💛', '✨', '🌟', '💖', '⬆️', '🎉'],
  'streak': ['🔥', '✨', '⭐', '💪', '🌟'],
};

function generateParticles(type: CelebrationOverlayProps['type']): Particle[] {
  const emojis = PARTICLE_SETS[type || 'mission-complete'];
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    size: 16 + Math.random() * 20,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
  }));
}

export default function CelebrationOverlay({ show, type = 'mission-complete', message, onDone }: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      setParticles(generateParticles(type));
      const timer = setTimeout(() => onDone?.(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, type, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-gleea-gold-glow/30 via-transparent to-transparent"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.5], scale: [0.5, 1.5, 2] }}
            transition={{ duration: 2 }}
          />

          {/* Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: `${p.x}%`, fontSize: p.size }}
              initial={{ y: '100vh', opacity: 0, rotate: 0 }}
              animate={{
                y: [`${p.y}vh`, `${p.y - 30}vh`],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
                scale: [0.3, 1.2, 0.8],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
              }}
            >
              {p.emoji}
            </motion.div>
          ))}

          {/* Center message burst */}
          {message && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.1, 1.2] }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.7, 1] }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-gleea px-8 py-4 shadow-glow">
                <p className="text-xl font-extrabold text-gleea-warm-gray text-center">
                  {message}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
