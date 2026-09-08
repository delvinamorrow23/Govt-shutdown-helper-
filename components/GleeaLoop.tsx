'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Card, StepDots } from './ui';
import { AudioPlayer } from './AudioPlayer';
import { DEMO_MISSION } from '../lib/mission';
import { getGuide } from '../lib/guides';
import { getWorld } from '../lib/worlds';
import { personalize } from '../lib/personalize';
import type { ChildFeedback, ChildProfile, CustomMission } from '../lib/types';

// The canonical three-step loop: READ → DO → SHINE.
// Story content is AUTHORED and personalized only by NAME (local token
// substitution) — never AI-generated. The DO step is always a real-world,
// observable action. SHINE is reflection (emoji), and completing it grows the
// Kindness Flower.

const FEEDBACK: ChildFeedback[] = ['😍', '😊', '😐', '😕', '😢'];

export function GleeaLoop({
  profile,
  approvedMissions,
  onShineComplete,
}: {
  profile: ChildProfile;
  approvedMissions: CustomMission[];
  onShineComplete: (emoji: ChildFeedback | null) => void;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [emoji, setEmoji] = useState<ChildFeedback | null>(null);

  const guide = getGuide(profile.guideId);
  const world = getWorld(DEMO_MISSION.worldId);
  const band = profile.ageBand;

  const storyText = personalize(DEMO_MISSION.read[band], profile);
  const approved = approvedMissions[0];
  const missionText = approved
    ? personalize(approved.text, profile)
    : personalize(DEMO_MISSION.doInstruction[band], profile);
  const shinePrompts = DEMO_MISSION.shinePrompts[band].map((p) => personalize(p, profile));

  return (
    <div className="mx-auto max-w-2xl px-5 py-6">
      <div className="mb-4 text-center text-sm font-semibold text-gold-soft">
        {world.emoji} {world.name}
      </div>
      <StepDots current={step} />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepShell key="read" badge="📖 Read" title={DEMO_MISSION.title} accent={guide.accent}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl animate-floaty">{guide.emoji}</span>
                <p className="text-sm text-parchment-ink/70">
                  Read this together — {guide.name} is here for {profile.name}.
                </p>
              </div>

              <AudioPlayer src={DEMO_MISSION.audioSrc} label={`Listen with ${guide.name}`} />

              <p className="mt-5 whitespace-pre-line text-xl leading-relaxed">{storyText}</p>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(1)}>Next: our mission →</Button>
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell key="do" badge="🌟 Do" title="Your kindness mission" accent={guide.accent}>
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl animate-floaty">{guide.emoji}</span>
                <p className="mt-5 text-2xl leading-relaxed">{missionText}</p>
                {approved && (
                  <p className="mt-3 text-sm text-gold-deep">
                    ✓ A special mission your grown-up made for you
                  </p>
                )}
                <p className="mt-4 text-sm text-parchment-ink/60">
                  Do this one in the real world — then come back to Shine together.
                </p>
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="soft" onClick={() => setStep(0)}>← Back</Button>
                <Button onClick={() => setStep(2)}>I did it! →</Button>
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell key="shine" badge="💖 Shine" title="Shine together" accent={guide.accent}>
              <p className="text-parchment-ink/80">
                Snuggle up and talk about today. This part is just for your family.
              </p>
              <ul className="mt-5 space-y-3">
                {shinePrompts.map((prompt, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="rounded-2xl border border-parchment-shade bg-parchment-shade/40 px-5 py-4 text-lg"
                  >
                    💬 {prompt}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6">
                <div className="mb-2 text-sm font-semibold text-parchment-ink/70">
                  How do you feel about your kindness today?
                </div>
                <div className="flex gap-3">
                  {FEEDBACK.map((f) => (
                    <button
                      key={f}
                      onClick={() => setEmoji(f)}
                      aria-label={`Feeling ${f}`}
                      className={
                        'grid h-14 w-14 place-items-center rounded-2xl text-3xl transition ' +
                        (emoji === f ? 'bg-gold shadow-glow' : 'bg-parchment-shade/50 hover:bg-parchment-shade')
                      }
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="soft" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={() => onShineComplete(emoji)}>We shined together! 💛</Button>
              </div>
            </StepShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepShell({
  badge,
  title,
  accent,
  children,
}: {
  badge: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <span
          className="inline-block rounded-full px-4 py-1 text-sm font-rounded font-bold text-twilight-900"
          style={{ background: accent }}
        >
          {badge}
        </span>
        <h2 className="mt-3 text-3xl font-extrabold">{title}</h2>
        <div className="mt-4">{children}</div>
      </Card>
    </motion.div>
  );
}
