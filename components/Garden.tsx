'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from './ui';
import { CASEL_LABEL } from '../lib/worlds';
import type { Casel, FlowerPetal } from '../lib/types';

// The Kindness Garden. Each completed mission grows one bloom, tinted by the
// CASEL competency it practiced — together they form the child's Kindness
// Flower (a gentle CASEL profile). No streaks-as-pressure, no "0 missions"
// empty state, no competition.
export function Garden({
  petals,
  childName,
  justGrew,
  onReplay,
}: {
  petals: FlowerPetal[];
  childName: string;
  justGrew: boolean;
  onReplay: () => void;
}) {
  // Tally blooms per competency for the little "flower" summary.
  const byCasel = petals.reduce<Record<string, number>>((acc, p) => {
    acc[p.casel] = (acc[p.casel] ?? 0) + 1;
    return acc;
  }, {});

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
          <h2 className="mt-2 text-3xl font-extrabold text-parchment">
            Your garden grew, {childName}!
          </h2>
          <p className="mt-1 text-gold-soft">Kindness makes things bloom.</p>
        </motion.div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-rounded text-2xl font-bold">Kindness Garden</h3>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-sm font-bold text-gold-deep">
            {petals.length} {petals.length === 1 ? 'bloom' : 'blooms'}
          </span>
        </div>

        {petals.length === 0 ? (
          <p className="py-8 text-center text-parchment-ink/60">
            Ready for your first adventure? Finish a Gleea Loop to grow your first bloom! 🌱
          </p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {petals.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={i === petals.length - 1 && justGrew ? { scale: 0, y: 20 } : false}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                  title={`${CASEL_LABEL[p.casel as Casel]} · ${new Date(p.earnedAt).toLocaleDateString()}`}
                  className="grid aspect-square place-items-center rounded-2xl bg-gradient-to-b
                             from-gold/20 to-gold/[0.05] text-3xl"
                >
                  {p.emoji}
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(byCasel).map(([casel, n]) => (
                <span
                  key={casel}
                  className="rounded-full border border-parchment-shade bg-parchment-shade/40 px-3 py-1 text-xs font-semibold"
                >
                  {CASEL_LABEL[casel as Casel]} · {n}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 h-3 rounded-full bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" />
      </Card>

      <div className="mt-8 flex justify-center">
        <Button onClick={onReplay}>Read another story 📖</Button>
      </div>
    </div>
  );
}
