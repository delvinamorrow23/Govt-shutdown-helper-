'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Card, StepDots } from './ui';
import { AudioPlayer } from './AudioPlayer';
import { DEMO_STORY } from '../lib/story';
import { getGuide } from '../lib/guides';
import { buildContext, generateStory } from '../lib/api';
import { newId } from '../lib/storage';
import type {
  AIGeneration,
  ChildFeedback,
  ChildProfile,
  CustomMission,
} from '../lib/types';

// The canonical three-step Gleea Loop:
//   READ  — experience the story with the Animal Guide (live AI personalization
//           + human narration audio).
//   DO    — the real-world kindness mission.
//   SHINE — the family reflects together (reflection, not action). Essential;
//           completing it grows the garden.
//
// (The old GIVE/LEAD steps are archived in lib/archive/giveLeadArchive.ts and
// intentionally do not appear here.)

const FEEDBACK: { key: ChildFeedback; emoji: string; label: string }[] = [
  { key: 'love', emoji: '😍', label: 'Loved it' },
  { key: 'ok', emoji: '🙂', label: 'Liked it' },
  { key: 'meh', emoji: '😐', label: 'Just okay' },
];

export function GleeaLoop({
  profile,
  approvedMissions,
  onLogGeneration,
  onUpdateGeneration,
  onShineComplete,
}: {
  profile: ChildProfile;
  approvedMissions: CustomMission[];
  onLogGeneration: (gen: AIGeneration) => void;
  onUpdateGeneration: (id: string, patch: Partial<AIGeneration>) => void;
  onShineComplete: () => void;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const guide = getGuide(profile.guideId);
  const ctx = buildContext(profile);

  // READ: generated story state.
  const [storyText, setStoryText] = useState<string | null>(null);
  const [storySource, setStorySource] = useState<'claude' | 'fallback' | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<ChildFeedback | null>(null);
  const genIdRef = useRef<string | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    let cancelled = false;
    (async () => {
      const result = await generateStory(ctx);
      if (cancelled) return;
      const gen: AIGeneration = {
        id: newId('gen'),
        createdAt: new Date().toISOString(),
        type: 'story',
        context: ctx,
        output: result.text,
        source: result.source,
        flagged: false,
      };
      genIdRef.current = gen.id;
      setStoryText(result.text);
      setStorySource(result.source);
      setLoading(false);
      onLogGeneration(gen);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseFeedback(f: ChildFeedback) {
    setFeedback(f);
    if (genIdRef.current) onUpdateGeneration(genIdRef.current, { childFeedback: f });
  }

  // DO: prefer a parent-approved custom mission if one exists, else the default.
  const approved = approvedMissions[0];
  const missionText = approved ? approved.text : DEMO_STORY.mission[profile.ageBand];

  const shinePrompts = DEMO_STORY.shinePrompts[profile.ageBand];

  return (
    <div className="mx-auto max-w-2xl px-5 py-6">
      <StepDots current={step} />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepShell key="read" badge="📖 Read" title={DEMO_STORY.title} accent={guide.accent}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl animate-floaty">{guide.emoji}</span>
                <p className="text-sm text-white/70">
                  {guide.name} is telling this story just for {profile.name}.
                </p>
              </div>

              <AudioPlayer src={DEMO_STORY.audioSrc} label={`Listen with ${guide.name}`} />

              <div className="mt-5 min-h-[160px]">
                {loading ? (
                  <div className="flex items-center gap-3 text-white/70">
                    <span className="text-2xl animate-floaty">✨</span>
                    {guide.name} is sprinkling story magic…
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-line text-xl leading-relaxed text-white"
                  >
                    {storyText}
                  </motion.p>
                )}
              </div>

              {!loading && (
                <div className="mt-5">
                  <div className="mb-2 text-sm font-semibold text-white/70">
                    How did this story feel?
                  </div>
                  <div className="flex gap-3">
                    {FEEDBACK.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => chooseFeedback(f.key)}
                        aria-label={f.label}
                        className={
                          'grid h-14 w-14 place-items-center rounded-2xl text-3xl transition ' +
                          (feedback === f.key
                            ? 'bg-gleea-pink shadow-glow'
                            : 'bg-white/5 hover:bg-white/10')
                        }
                      >
                        {f.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button disabled={loading} onClick={() => setStep(1)}>
                  Next: our mission →
                </Button>
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell key="do" badge="🌟 Do" title="Your kindness mission" accent={guide.accent}>
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl animate-floaty">{guide.emoji}</span>
                <p className="mt-5 text-2xl leading-relaxed text-white">{missionText}</p>
                {approved && (
                  <p className="mt-3 text-sm text-gleea-gold">
                    ✓ A special mission your grown-up made for you
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="soft" onClick={() => setStep(0)}>
                  ← Back
                </Button>
                <Button onClick={() => setStep(2)}>I did it! →</Button>
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              key="shine"
              badge="💖 Shine"
              title="Shine together"
              accent={guide.accent}
            >
              <p className="text-white/80">
                Snuggle up with your grown-up and talk about today. This part is just for
                your family.
              </p>
              <ul className="mt-5 space-y-3">
                {shinePrompts.map((prompt, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg text-white"
                  >
                    💬 {prompt}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex justify-between">
                <Button variant="soft" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button onClick={onShineComplete}>We shined together! ✨</Button>
              </div>
            </StepShell>
          )}
        </AnimatePresence>
      </div>

      {storySource === 'fallback' && step === 0 && !loading && (
        <p className="mt-4 text-center text-xs text-white/40">
          Showing an offline story. Connect the AI to personalize it live.
        </p>
      )}
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
          className="inline-block rounded-full px-4 py-1 text-sm font-rounded font-bold text-night-900"
          style={{ background: accent }}
        >
          {badge}
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-white">{title}</h2>
        <div className="mt-4">{children}</div>
      </Card>
    </motion.div>
  );
}
