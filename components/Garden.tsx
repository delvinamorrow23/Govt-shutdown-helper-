'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from './ui';
import type { GardenElement } from '../lib/types';

// The kindness garden. One element grows each time a family completes SHINE.
// (Badges, collectibles, and the global kindness map are deferred; the data
// model supports them but their UI is not built yet.)
export function Garden({
  elements,
  childName,
  justGrew,
  onReplay,
}: {
  elements: GardenElement[];
  childName: string;
  justGrew: boolean;
  onReplay: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      {justGrew && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          className="mb-6 text-center"
        >
          <div className="text-6xl">🎉</div>
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            Your garden grew, {childName}!
          </h2>
          <p className="mt-1 text-gleea-rose">Kindness makes things bloom.</p>
        </motion.div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-rounded text-2xl font-bold text-white">Kindness Garden</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-gleea-gold">
            {elements.length} grown
          </span>
        </div>

        {elements.length === 0 ? (
          <p className="py-8 text-center text-white/60">
            Your garden is waiting. Finish a Gleea Loop to grow your first bloom! 🌱
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {elements.map((el, i) => (
              <motion.div
                key={el.id}
                initial={i === elements.length - 1 && justGrew ? { scale: 0, y: 20 } : false}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                title={`${el.label} · ${new Date(el.earnedAt).toLocaleDateString()}`}
                className="grid aspect-square place-items-center rounded-2xl bg-gradient-to-b
                           from-white/10 to-white/[0.03] text-3xl"
              >
                {el.emoji}
              </motion.div>
            ))}
          </div>
        )}

        {/* Soft ground line for a storybook garden feel. */}
        <div className="mt-6 h-3 rounded-full bg-gradient-to-r from-gleea-mint/40 via-gleea-mint/20 to-gleea-mint/40" />
      </Card>

      <div className="mt-8 flex justify-center">
        <Button onClick={onReplay}>Read another story 📖</Button>
      </div>
    </div>
  );
}
