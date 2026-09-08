'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from './ui';

// Brand entry point. Gleea's mark is a painted heart; the in-app characters are
// the six Animal Guides. Gleea is a co-participation experience — grown-up and
// child do it together (the grown-up reads aloud, the child does the mission).
export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        className="text-7xl"
      >
        💛
      </motion.div>
      <motion.h1
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-5xl font-extrabold text-parchment"
      >
        Gleea
      </motion.h1>
      <motion.p
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-3 text-lg text-gold-soft"
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
          <p className="text-base leading-relaxed">
            Every adventure, a friendly <span className="font-bold">Animal Guide</span> walks
            beside your child through three gentle steps —{' '}
            <span className="font-bold text-gold-deep">Read</span> a story together,{' '}
            <span className="font-bold text-gold-deep">Do</span> a real kindness in the world,
            and <span className="font-bold text-gold-deep">Shine</span> by talking about how it felt.
          </p>
          <p className="mt-3 text-base leading-relaxed">
            Gleea is best done <span className="font-bold">together</span>: you read aloud, your
            little one leads the kindness. Watch your Kindness Garden bloom along the way. 🌱
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button onClick={onStart}>Meet your guide 🐾</Button>
      </motion.div>
    </div>
  );
}
