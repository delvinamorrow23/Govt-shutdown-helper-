'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Pill } from './ui';
import { GUIDES, COMPETENCY_LABEL, KIND_SENSE_LABEL } from '../lib/guides';
import { VALUES } from '../lib/values';
import type { AgeBand, ChildProfile } from '../lib/types';

// Empathy by Design inputs: the three things the Animal Guide adapts to —
// the child's name, age band (3-4 vs 5-6), and chosen kindness value.
// Surname / DOB / anything else is deliberately NOT collected (PCI
// Values-Aligned Guardrails: no unnecessary personal data).
export function ProfileSetup({
  initial,
  onDone,
}: {
  initial: ChildProfile | null;
  onDone: (profile: ChildProfile) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [ageBand, setAgeBand] = useState<AgeBand>(initial?.ageBand ?? '3-4');
  const [guideId, setGuideId] = useState(initial?.guideId ?? GUIDES[0].id);
  const [valueId, setValueId] = useState(initial?.valueId ?? VALUES[0].id);

  const canStart = name.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h2 className="text-center text-3xl font-extrabold text-white">Let’s set up your story</h2>
      <p className="mt-2 text-center text-white/70">
        Your guide will use just a first name and age to make the story feel like it’s
        about you.
      </p>

      <div className="mt-8 space-y-6">
        {/* Name */}
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
            className="w-full rounded-2xl border border-white/15 bg-night-900/60 px-5 py-4 text-xl
                       text-white placeholder-white/40 focus:border-gleea-pink focus:outline-none
                       focus:ring-4 focus:ring-gleea-rose/40"
          />
          <p className="mt-2 text-sm text-white/50">First name only — we never ask for more.</p>
        </Card>

        {/* Age band */}
        <Card>
          <div className="mb-3 font-rounded text-xl font-bold">How old are you?</div>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { band: '3-4' as AgeBand, label: '3–4 years', emoji: '🐣' },
                { band: '5-6' as AgeBand, label: '5–6 years', emoji: '🌟' },
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

        {/* Animal Guide */}
        <Card>
          <div className="mb-1 font-rounded text-xl font-bold">Choose your Animal Guide</div>
          <p className="mb-4 text-sm text-white/60">
            Each guide helps with a different super-skill.
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
                      ? 'border-gleea-pink bg-white/10 shadow-glow'
                      : 'border-white/10 bg-white/5 hover:bg-white/10')
                  }
                >
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl"
                    style={{ background: `${g.accent}22` }}
                  >
                    {g.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-rounded text-lg font-bold text-white">
                      {g.name}
                    </span>
                    <span className="block text-sm text-white/70">{g.blurb}</span>
                    <span className="mt-1 block text-xs font-semibold text-gleea-gold">
                      {KIND_SENSE_LABEL[g.kindSense]} · {COMPETENCY_LABEL[g.competency]}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Kindness value */}
        <Card>
          <div className="mb-1 font-rounded text-xl font-bold">Pick a kindness to practice</div>
          <p className="mb-4 text-sm text-white/60">Your story will be about this.</p>
          <div className="flex flex-wrap gap-3">
            {VALUES.map((v) => (
              <Pill
                key={v.id}
                emoji={v.emoji}
                active={valueId === v.id}
                onClick={() => setValueId(v.id)}
              >
                {v.label}
              </Pill>
            ))}
          </div>
        </Card>

        <div className="flex justify-center pt-2">
          <Button
            disabled={!canStart}
            onClick={() => onDone({ name: name.trim(), ageBand, guideId, valueId })}
          >
            Start our story 📖
          </Button>
        </div>
      </div>
    </div>
  );
}
