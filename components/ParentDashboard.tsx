'use client';

import React, { useState } from 'react';
import { Button, Card } from './ui';
import { getGuide } from '../lib/guides';
import { CASEL_LABEL } from '../lib/worlds';
import { AGE_BAND_LABEL, personalize } from '../lib/personalize';
import { newId } from '../lib/storage';
import type {
  Casel,
  ChildProfile,
  CustomMission,
  FlowerPetal,
  Reflection,
} from '../lib/types';

// Parent dashboard — the child-AI-safety and control view, made visible so the
// people most worried about "AI + kids" can see exactly what Gleea does. The
// guardrails reflect the canonical content principle: AI is limited to NAME
// personalization; all story content is human-authored and CASEL-aligned.
export function ParentDashboard({
  profile,
  flower,
  reflections,
  customMissions,
  onAddCustomMission,
  onSetMissionStatus,
}: {
  profile: ChildProfile;
  flower: FlowerPetal[];
  reflections: Reflection[];
  customMissions: CustomMission[];
  onAddCustomMission: (mission: CustomMission) => void;
  onSetMissionStatus: (id: string, status: CustomMission['status']) => void;
}) {
  const guide = getGuide(profile.guideId);

  const byCasel = flower.reduce<Record<string, number>>((acc, p) => {
    acc[p.casel] = (acc[p.casel] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h2 className="text-3xl font-extrabold text-parchment">Parent dashboard</h2>
      <p className="mt-1 text-parchment/70">
        How Gleea keeps {profile.name}’s experience safe — and how you stay in control.
      </p>

      <div className="mt-6 space-y-5">
        {/* Kindness Flower / CASEL profile */}
        <Card>
          <h3 className="font-rounded text-xl font-bold">Kindness Flower</h3>
          <p className="mt-1 text-sm text-parchment-ink/70">
            {profile.name}’s growth across the CASEL competencies, from completed missions.
          </p>
          {flower.length === 0 ? (
            <p className="mt-3 text-sm text-parchment-ink/60">No blooms yet — the first adventure grows the first petal.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(byCasel).map(([casel, n]) => (
                <span key={casel} className="rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold-deep">
                  {CASEL_LABEL[casel as Casel]} · {n}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Pillar 1 — Age-appropriate context (minimal data) */}
        <Pillar index={1} title="Age-appropriate by design"
          summary="Content is scaffolded to your child's age band. The only profile data used is the minimum below — stored on this device.">
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <Field label="First name" value={profile.name} />
            <Field label="Age band" value={AGE_BAND_LABEL[profile.ageBand]} />
            <Field label="Animal Guide" value={guide.name} />
          </dl>
        </Pillar>

        {/* Pillar 2 — Guardrails */}
        <Pillar index={2} title="Values-aligned guardrails"
          summary="What the AI can and cannot do, and what we collect.">
          <ul className="space-y-2 text-sm text-parchment-ink/80">
            <li>✓ <b>AI is limited to name personalization only</b> — every READ/DO/SHINE story is human-authored and CASEL-aligned, never AI-generated.</li>
            <li>✓ DO missions are always real-world, observable, dignity-centered actions (no purchases, no assumptions about home).</li>
            <li>✓ No dark patterns: no leaderboards, no login rewards, no shops, no sibling competition, no open comments.</li>
            <li>✓ Minimal data, on this device only: a first name, an age band, a chosen guide. No surname, birthdate, or contact info.</li>
          </ul>
        </Pillar>

        {/* Pillar 3 — Workflow embedding: parent approval */}
        <Pillar index={3} title="You’re in the loop"
          summary="Gleea assists, it doesn't replace you. Custom missions you write need your approval before your child sees them.">
          <CustomMissionStudio
            profile={profile}
            customMissions={customMissions}
            onAddCustomMission={onAddCustomMission}
            onSetMissionStatus={onSetMissionStatus}
          />
        </Pillar>

        {/* Pillar 4 — Participatory feedback */}
        <Pillar index={4} title="See how it’s landing"
          summary="Your child's simple SHINE feedback, so you can adjust focus over time.">
          {reflections.length === 0 ? (
            <p className="text-sm text-parchment-ink/60">No reflections yet.</p>
          ) : (
            <ul className="space-y-2">
              {reflections.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-2xl border border-parchment-shade bg-parchment-shade/40 p-3 text-sm">
                  <span className="text-2xl">{r.emoji ?? '—'}</span>
                  <span className="flex-1">{CASEL_LABEL[r.casel]}</span>
                  <span className="text-parchment-ink/50">{new Date(r.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
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
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-rounded font-bold text-twilight-900">
          {index}
        </span>
        <div className="min-w-0">
          <h3 className="font-rounded text-xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-parchment-ink/70">{summary}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-parchment-shade pt-4">{children}</div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-parchment-shade/50 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-parchment-ink/40">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function CustomMissionStudio({
  profile,
  customMissions,
  onAddCustomMission,
  onSetMissionStatus,
}: {
  profile: ChildProfile;
  customMissions: CustomMission[];
  onAddCustomMission: (mission: CustomMission) => void;
  onSetMissionStatus: (id: string, status: CustomMission['status']) => void;
}) {
  const [idea, setIdea] = useState('');

  function create() {
    const trimmed = idea.trim();
    if (!trimmed) return;
    onAddCustomMission({
      id: newId('mission'),
      createdAt: new Date().toISOString(),
      text: trimmed,
      status: 'pending',
    });
    setIdea('');
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-parchment-ink/70">
        Write a real-world kindness mission for {profile.name}. It appears only after you approve it.
        You can use <code>{'{{CHILD_NAME}}'}</code> and <code>{'{{GUIDE_NAME}}'}</code> and they’ll be filled in.
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={idea}
          maxLength={300}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. Help set the dinner table for grandma"
          className="min-w-0 flex-1 rounded-2xl border border-parchment-shade bg-white/70 px-4 py-3
                     text-parchment-ink placeholder-parchment-ink/40 focus:border-gold focus:outline-none"
        />
        <Button onClick={create} disabled={!idea.trim()}>Add mission</Button>
      </div>

      {customMissions.length > 0 && (
        <ul className="mt-4 space-y-2">
          {customMissions.map((m) => (
            <li key={m.id} className="rounded-2xl border border-parchment-shade bg-parchment-shade/40 p-3 text-sm">
              <p>{personalize(m.text, profile)}</p>
              <div className="mt-2 flex items-center gap-2">
                {m.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => onSetMissionStatus(m.id, 'approved')}
                      className="rounded-full bg-gold/25 px-3 py-1 text-xs font-bold text-gold-deep"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => onSetMissionStatus(m.id, 'declined')}
                      className="rounded-full bg-parchment-shade px-3 py-1 text-xs font-bold text-parchment-ink/70"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span
                    className={
                      'rounded-full px-3 py-1 text-xs font-bold ' +
                      (m.status === 'approved'
                        ? 'bg-gold/25 text-gold-deep'
                        : 'bg-parchment-shade text-parchment-ink/50')
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
