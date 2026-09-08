'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Pill } from './ui';
import { GUIDES, DEFAULT_GUIDE_ID } from '../lib/guides';
import { CASEL_LABEL } from '../lib/worlds';
import type { AgeBand, ChildProfile } from '../lib/types';

// Setup collects only what the guide needs to personalize by NAME: a first-name
// nickname and an age band. (Minimal data by design — no full names, no PII.)
// The MVP exposes Seedling (3–4) and Sprout (5–6); Bloomer (7–8) is deferred.
export function ProfileSetup({
  initial,
  onDone,
}: {
  initial: ChildProfile | null;
  onDone: (profile: ChildProfile) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [ageBand, setAgeBand] = useState<AgeBand>(initial?.ageBand ?? 'seedling');
  const [guideId, setGuideId] = useState(initial?.guideId ?? DEFAULT_GUIDE_ID);

  const canStart = name.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h2 className="text-center text-3xl font-extrabold text-parchment">Let’s set up your adventure</h2>
      <p className="mt-2 text-center text-parchment/70">
        Just a first name and an age — that’s all your guide needs.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <label htmlFor="child-name" className="mb-3 block font-rounded text-xl font-bold">
            What’s your first name?
          </label>
          <input
            id="child-name"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type a first name…"
            className="w-full rounded-2xl border border-parchment-shade bg-white/70 px-5 py-4 text-xl
                       text-parchment-ink placeholder-parchment-ink/40 focus:border-gold focus:outline-none
                       focus:ring-4 focus:ring-gold-soft/40"
          />
          <p className="mt-2 text-sm text-parchment-ink/60">First name only — we never ask for more.</p>
        </Card>

        <Card>
          <div className="mb-3 font-rounded text-xl font-bold">How old are you?</div>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { band: 'seedling' as AgeBand, label: 'Seedling · 3–4', emoji: '🌱' },
                { band: 'sprout' as AgeBand, label: 'Sprout · 5–6', emoji: '🌿' },
              ]
            ).map((o) => (
              <Pill
                key={o.band}
                emoji={o.emoji}
                active={ageBand === o.band}
                onClick={() => setAgeBand(o.band)}
              >
                {o.label}
              </Pill>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-1 font-rounded text-xl font-bold">Choose your Animal Guide</div>
          <p className="mb-4 text-sm text-parchment-ink/60">
            Your guide is your kindness companion — you’re always the hero.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GUIDES.map((g) => {
              const selected = guideId === g.id;
              return (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGuideId(g.id)}
                  className={
                    'flex items-center gap-4 rounded-2xl border p-4 text-left transition ' +
                    (selected
                      ? 'border-gold bg-gold/15 shadow-glow'
                      : 'border-parchment-shade bg-parchment-shade/40 hover:bg-parchment-shade/70')
                  }
                >
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl"
                    style={{ background: `${g.accent}33` }}
                  >
                    {g.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-rounded text-lg font-bold">{g.name}</span>
                    <span className="block text-sm text-parchment-ink/70">{g.blurb}</span>
                    <span className="mt-1 block text-xs font-semibold text-gold-deep">
                      {CASEL_LABEL[g.competency]}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Card>

        <div className="flex justify-center pt-2">
          <Button
            disabled={!canStart}
            onClick={() => onDone({ name: name.trim(), ageBand, guideId })}
          >
            Start our adventure 📖
          </Button>
        </div>
      </div>
    </div>
  );
}
