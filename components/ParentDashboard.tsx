'use client';

import React, { useState } from 'react';
import { Button, Card } from './ui';
import { COMPETENCY_LABEL, getGuide } from '../lib/guides';
import { getValue } from '../lib/values';
import { buildContext, generateMission } from '../lib/api';
import { newId } from '../lib/storage';
import type {
  AIGeneration,
  ChildFeedback,
  ChildProfile,
  CustomMission,
} from '../lib/types';

// PCI child-AI-safety governance, made visible to the parent. The four pillars
// are surfaced here so the people most worried about "AI + kids" can see
// exactly what the AI did and stay in control.
export function ParentDashboard({
  profile,
  generations,
  customMissions,
  onUpdateGeneration,
  onAddCustomMission,
  onLogGeneration,
  onSetMissionStatus,
}: {
  profile: ChildProfile;
  generations: AIGeneration[];
  customMissions: CustomMission[];
  onUpdateGeneration: (id: string, patch: Partial<AIGeneration>) => void;
  onAddCustomMission: (mission: CustomMission) => void;
  onLogGeneration: (gen: AIGeneration) => void;
  onSetMissionStatus: (id: string, status: CustomMission['status']) => void;
}) {
  const guide = getGuide(profile.guideId);
  const value = getValue(profile.valueId);
  const ctx = buildContext(profile);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h2 className="text-3xl font-extrabold text-white">Parent dashboard</h2>
      <p className="mt-1 text-white/70">
        How Gleea keeps {profile.name}’s AI experience safe — and how you stay in control.
      </p>

      <div className="mt-6 space-y-5">
        {/* Pillar 1 — Contextual Training */}
        <Pillar
          index={1}
          title="Contextual Training"
          summary="Every AI prompt includes your child's age band and profile so the output is age-appropriate."
        >
          <p className="text-sm text-white/70">
            This is the exact context sent with each story request — nothing more:
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <Field label="First name" value={ctx.name} />
            <Field label="Age band" value={`${ctx.ageBand} years`} />
            <Field label="Kindness value" value={value.label} />
            <Field label="Animal Guide" value={guide.name} />
            <Field label="CASEL focus" value={COMPETENCY_LABEL[guide.competency]} />
          </dl>
        </Pillar>

        {/* Pillar 2 — Values-Aligned Guardrails */}
        <Pillar
          index={2}
          title="Values-Aligned Guardrails"
          summary="The child-facing AI is bounded to kindness / SEL content, refuses off-topic or unsafe prompts, and collects no unnecessary personal data."
        >
          <ul className="space-y-2 text-sm text-white/80">
            <li>✓ System rules keep stories gentle, kind, and age-appropriate.</li>
            <li>✓ Off-topic or unsafe requests are refused and steered back to kindness.</li>
            <li>✓ Requests are size-limited and validated before reaching the model.</li>
            <li>
              ✓ Data stored on this device only: a first name, an age band, and a chosen
              value. No surname, no birthdate, no contact info, no account.
            </li>
          </ul>
        </Pillar>

        {/* Pillar 3 — Workflow Embedding */}
        <Pillar
          index={3}
          title="Workflow Embedding"
          summary="The AI assists, it doesn't replace you. Custom missions you create need your approval before your child sees them."
        >
          <CustomMissionStudio
            profile={profile}
            customMissions={customMissions}
            onAddCustomMission={onAddCustomMission}
            onLogGeneration={onLogGeneration}
            onSetMissionStatus={onSetMissionStatus}
          />
        </Pillar>

        {/* Pillar 4 — Participatory Feedback */}
        <Pillar
          index={4}
          title="Participatory Feedback"
          summary="See everything the AI generated. Flag anything to review, add a note, and watch your child's simple feedback that tunes future stories."
        >
          <GenerationLog generations={generations} onUpdateGeneration={onUpdateGeneration} />
        </Pillar>
      </div>
    </div>
  );
}

function Pillar({
  index,
  title,
  summary,
  children,
}: {
  index: number;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gleea-pink font-rounded font-bold text-white">
          {index}
        </span>
        <div className="min-w-0">
          <h3 className="font-rounded text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/70">{summary}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4">{children}</div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-night-900/50 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}

const FEEDBACK_EMOJI: Record<ChildFeedback, string> = { love: '😍', ok: '🙂', meh: '😐' };

function GenerationLog({
  generations,
  onUpdateGeneration,
}: {
  generations: AIGeneration[];
  onUpdateGeneration: (id: string, patch: Partial<AIGeneration>) => void;
}) {
  if (generations.length === 0) {
    return <p className="text-sm text-white/60">Nothing generated yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {generations.map((g) => (
        <li key={g.id} className="rounded-2xl border border-white/10 bg-night-900/40 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-bold uppercase text-white/70">
              {g.type}
            </span>
            <span
              className={
                'rounded-full px-2 py-0.5 font-bold ' +
                (g.source === 'claude'
                  ? 'bg-gleea-mint/20 text-gleea-mint'
                  : 'bg-white/10 text-white/60')
              }
            >
              {g.source === 'claude' ? 'Claude' : 'Offline fallback'}
            </span>
            <span className="text-white/40">{new Date(g.createdAt).toLocaleString()}</span>
            {g.childFeedback && (
              <span className="ml-auto text-lg" title={`Child feedback: ${g.childFeedback}`}>
                {FEEDBACK_EMOJI[g.childFeedback]}
              </span>
            )}
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-white/90">{g.output}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onUpdateGeneration(g.id, { flagged: !g.flagged })}
              className={
                'rounded-full px-3 py-1 text-xs font-bold transition ' +
                (g.flagged
                  ? 'bg-gleea-pink text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20')
              }
            >
              {g.flagged ? '🚩 Flagged' : 'Flag for review'}
            </button>
            <input
              defaultValue={g.parentNote ?? ''}
              placeholder="Add a note…"
              onBlur={(e) => onUpdateGeneration(g.id, { parentNote: e.target.value })}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-night-900/60 px-3 py-1
                         text-xs text-white placeholder-white/30 focus:border-gleea-pink focus:outline-none"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function CustomMissionStudio({
  profile,
  customMissions,
  onAddCustomMission,
  onLogGeneration,
  onSetMissionStatus,
}: {
  profile: ChildProfile;
  customMissions: CustomMission[];
  onAddCustomMission: (mission: CustomMission) => void;
  onLogGeneration: (gen: AIGeneration) => void;
  onSetMissionStatus: (id: string, status: CustomMission['status']) => void;
}) {
  const ctx = buildContext(profile);
  const [idea, setIdea] = useState('');
  const [busy, setBusy] = useState(false);

  async function create() {
    const trimmed = idea.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    const result = await generateMission(ctx, trimmed);
    const now = new Date().toISOString();
    onLogGeneration({
      id: newId('gen'),
      createdAt: now,
      type: 'mission',
      context: ctx,
      output: result.text,
      source: result.source,
      flagged: false,
    });
    onAddCustomMission({
      id: newId('mission'),
      createdAt: now,
      text: result.text,
      status: 'pending',
      context: ctx,
    });
    setIdea('');
    setBusy(false);
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">
        Draft a custom mission idea. The guide will phrase it for {profile.name}; you approve
        before it appears.
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={idea}
          maxLength={300}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. help set the dinner table for grandma"
          className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-night-900/60 px-4 py-3
                     text-white placeholder-white/40 focus:border-gleea-pink focus:outline-none"
        />
        <Button onClick={create} disabled={busy || !idea.trim()}>
          {busy ? 'Thinking…' : 'Draft mission'}
        </Button>
      </div>

      {customMissions.length > 0 && (
        <ul className="mt-4 space-y-2">
          {customMissions.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-white/10 bg-night-900/40 p-3 text-sm"
            >
              <p className="text-white/90">{m.text}</p>
              <div className="mt-2 flex items-center gap-2">
                {m.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => onSetMissionStatus(m.id, 'approved')}
                      className="rounded-full bg-gleea-mint/20 px-3 py-1 text-xs font-bold text-gleea-mint"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => onSetMissionStatus(m.id, 'declined')}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span
                    className={
                      'rounded-full px-3 py-1 text-xs font-bold ' +
                      (m.status === 'approved'
                        ? 'bg-gleea-mint/20 text-gleea-mint'
                        : 'bg-white/10 text-white/50')
                    }
                  >
                    {m.status === 'approved' ? '✓ Approved' : 'Declined'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
