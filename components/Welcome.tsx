'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from './ui';

// Brand entry point. The fairy / fairy-godmother appears here as ORIGIN STORY
// only — she is the brand's backstory, not an in-app character. The in-app
// characters are the Animal Guides, introduced on the next screen.
export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        className="text-7xl"
      >
        🧚✨
      </motion.div>
      <motion.h1
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-5xl font-extrabold text-white"
      >
        Gleea
      </motion.h1>
      <motion.p
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-3 text-lg text-gleea-rose"
      >
        Little stories that grow kind hearts.
      </motion.p>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 w-full"
      >
        <Card className="text-left">
          <p className="text-base leading-relaxed text-white/90">
            Long ago, a kindness fairy wished that every child could learn to be
            gentle, brave, and caring. She couldn’t be everywhere at once — so she
            sent her friends, the <span className="font-bold text-gleea-gold">Animal Guides</span>,
            to walk beside each child.
          </p>
          <p className="mt-3 text-base leading-relaxed text-white/90">
            Together you’ll <span className="font-bold text-gleea-rose">Read</span> a
            story, <span className="font-bold text-gleea-rose">Do</span> a kindness
            mission, and <span className="font-bold text-gleea-rose">Shine</span> as a
            family — and watch your kindness garden grow.
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button onClick={onStart}>Meet your guide ✨</Button>
      </motion.div>
    </div>
  );
}
