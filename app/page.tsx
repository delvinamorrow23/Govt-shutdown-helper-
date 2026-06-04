
'use client';
import React, { useMemo, useState } from 'react';
import resources from '../data/resources.json';
import '../styles/globals.css';

type Action = { text: string; href: string };
type Category = { key: string; label: string; blurb: string; actions: Action[]; notes: string };

const SOURCES = resources.sources as Record<string, string>;

function hydrateHref(href: string) {
  if (href.startsWith('@sources.')) {
    const key = href.replace('@sources.', '');
    return SOURCES[key] || '#';
  }
  return href;
}

const CATEGORIES = (resources.categories as Category[]).map(cat => ({
  ...cat,
  actions: cat.actions.map(a => ({ ...a, href: hydrateHref(a.href) }))
}));

const STATE_RESOURCES = resources.states as Record<string, { title: string; items: { text: string; href: string; desc?: string }[] }[]>;

const QUESTIONS = [
  {
    key: 'profile',
    label: 'Who are you today?',
    options: [
      { key: 'benefits', label: 'I receive federal benefits (Social Security, SSI, SNAP, WIC)' },
      { key: 'traveler', label: 'I am traveling soon (flights, national parks)' },
      { key: 'smallbiz_owner', label: 'I run a small business or nonprofit' },
      { key: 'student_parent', label: 'I am a student or parent (school meals, WIC)' },
      { key: 'immigrant', label: 'I have an immigration or passport need' },
      { key: 'other', label: 'Other or just browsing' },
    ],
  },
  {
    key: 'needs',
    label: 'What do you need right now?',
    options: [
      { key: 'payments', label: 'Confirm if my payments or services continue' },
      { key: 'deadlines', label: 'Deadline or appointment guidance' },
      { key: 'contact', label: 'Official contact or link' },
      { key: 'alternatives', label: 'Backup options or alternatives' },
    ],
  },
] as const;

const mapping = {
  benefits: ['ssa', 'snap_wic'],
  traveler: ['travel_air', 'parks'],
  smallbiz_owner: ['smallbiz'],
  student_parent: ['snap_wic'],
  immigrant: ['immigration'],
  other: ['ssa', 'snap_wic', 'smallbiz', 'travel_air'],
};

function Pill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-sm border ${
      active ? 'bg-ymu-orange text-white border-ymu-orange' : 'bg-white text-gray-700 border-gray-300'
    }`}>
      {children}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}


export default function Page() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [state, setState] = useState<string>('');

  // Banner config from JSON (optional)
  const banner = (resources as any).banner || { enabled: false };

  function shareSite() {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://example.org';
    const text = 'Shutdown Helper: official links and local help (PA and NY)';
    if (navigator.share) {
      navigator.share({ title: 'Shutdown Helper', text, url }).catch(() => {});
    } else {
      // Fallback: open mailto
      window.location.href = `mailto:?subject=Shutdown Helper&body=${encodeURIComponent(text + ' ' + url)}`;
    }
  }

  const selectedCats = useMemo(() => {
    const p = answers.profile as keyof typeof mapping;
    return p ? mapping[p] : [];
  }, [answers]);

  const showCat = (key: string) => selectedCats.includes(key);
  const statePacks = state ? STATE_RESOURCES[state as 'PA' | 'NY'] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
<div className="w-full bg-ymu-purple text-white">
  <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
    <div className="font-semibold">YMUai — People-Centered Intelligence for Social Impact</div>
    <button onClick={shareSite} className="text-sm underline">Share</button>
  </div>
</div>
<header className="max-w-5xl mx-auto px-6 pt-10 pb-6">

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-ymu-orange text-white grid place-items-center font-bold">US</div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Shutdown Helper</h1>
            <p className="text-gray-600">Personalized, official links and local help where you live.</p>
          </div>
        </div>
      </header>

      
{banner?.enabled ? (
  <div className="bg-ymu-orange/10 border border-ymu-orange text-ymu-orange max-w-5xl mx-auto mt-4 mb-2 rounded-xl px-4 py-3">
    <div className="text-sm">
      <span className="font-semibold">Update:</span> {banner.message}
      {banner.link ? (
        <a className="underline ml-2" href={banner.link} target="_blank" rel="noreferrer">Learn more</a>
      ) : null}
    </div>
  </div>
) : null}
<main className="max-w-5xl mx-auto px-6 pb-16">

        <section className="rounded-2xl border border-gray-200 p-6 bg-white mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="How it works">
              <p>Choose who you are, pick your state, and get the right link and a nearby safety net.</p>
            </Card>
            <Card title="What stays live?">
              <p>
                Many essential services continue while others pause or slow. Impacts vary by agency and program. Use the
                <a className="underline ml-1" href={SOURCES.omb_contingency} target="_blank" rel="noreferrer">OMB hub</a>
                {' '}for authoritative status.
              </p>
            </Card>
            <Card title="Share it forward">
              <p>Send this to a neighbor who needs fast answers. Calm beats chaos.</p>
            </Card>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 p-6 bg-white mb-6">
          <h2 className="text-xl font-semibold mb-4">Get personalized guidance</h2>

          <div className="mb-4">
            <div className="mb-2 font-medium">Your state</div>
            <div className="flex flex-wrap gap-2">
              {[{ key: 'PA', label: 'Pennsylvania' }, { key: 'NY', label: 'New York' }].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setState(s.key)}
                  className={`rounded-2xl px-3 py-1 border ${
                    state === s.key ? 'bg-ymu-orange text-white border-ymu-orange' : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {QUESTIONS.map((q) => (
            <div key={q.key} className="mb-4">
              <div className="mb-2 font-medium">{q.label}</div>
              <div className="flex flex-wrap gap-2">
                {q.options.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.key }))}
                    className={`rounded-2xl px-3 py-1 border ${
                      answers[q.key] === o.key ? 'bg-ymu-orange text-white border-ymu-orange' : 'bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-3">
            <Pill active={!!state}>{state ? `State: ${state}` : 'Select a state'}</Pill>
            <Pill active={!!answers.profile}>{answers.profile ? 'Profile selected' : 'Select a profile'}</Pill>
            <Pill active={!!answers.needs}>{answers.needs ? 'Need selected' : 'Select a need'}</Pill>
          </div>
        </section>

        <section className="space-y-4 mb-8">
          {CATEGORIES.filter((c) => showCat(c.key)).map((cat) => (
            <div key={cat.key} className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{cat.label}</h2>
                  <p className="text-gray-700 mt-1">{cat.blurb}</p>
                </div>
                <div className="text-sm text-gray-500">Updated Oct 2025</div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <Card title="Do first">
                  <ul className="list-disc ml-5 space-y-1">
                    {answers.needs === 'payments' && <li>Check status at the official link before calling.</li>}
                    {answers.needs === 'deadlines' && <li>Write down deadlines and look for posted extensions.</li>}
                    {answers.needs === 'contact' && <li>Use agency pages; avoid third-party numbers from search ads.</li>}
                    {answers.needs === 'alternatives' && <li>Identify state or nonprofit backups temporarily.</li>}
                    {!answers.needs && <li>Use the actions to visit the official page for your situation.</li>}
                  </ul>
                </Card>
                <Card title="Official links">
                  <ul className="space-y-2">
                    {cat.actions.map((a, idx) => (
                      <li key={idx}>
                        <a className="underline" href={a.href} target="_blank" rel="noreferrer">
                          {a.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card title="Notes and tips">
                  <p>{cat.notes}</p>
                </Card>
              </div>
            </div>
          ))}

          {!selectedCats.length && (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              Make selections above to see personalized guidance.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 p-6 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Local community resources</h2>
              <p className="text-gray-700 mt-1">
                When federal services slow, community groups help bridge the gap. These are trusted starting points in your state.
              </p>
            </div>
            <div className="text-sm text-gray-500">PA and NY</div>
          </div>

          {!state && <div className="mt-4 text-gray-600">Pick Pennsylvania or New York above to see nearby help.</div>}

          {state && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {statePacks?.map((pack, i) => (
                <Card key={i} title={pack.title}>
                  <ul className="space-y-2">
                    {pack.items.map((it, j) => (
                      <li key={j}>
                        <a className="underline" href={it.href} target="_blank" rel="noreferrer">{it.text}</a>
                        {it.desc ? <span className="text-gray-600 ml-1">{it.desc}</span> : null}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </section>

        <footer className="max-w-5xl mx-auto mt-12 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>Sources: OMB agency contingency plans, SSA updates, HHS, and program trackers. Built by YMUai.</span>
            <a href={SOURCES.omb_contingency} className="underline" target="_blank" rel="noreferrer">OMB hub</a>
            <span>•</span>
            <a href={SOURCES.ssa_blog} className="underline" target="_blank" rel="noreferrer">SSA</a>
            <span>•</span>
            <a href={SOURCES.frac_snap} className="underline" target="_blank" rel="noreferrer">SNAP</a>
            <span>•</span>
            <a href={SOURCES.frac_child} className="underline" target="_blank" rel="noreferrer">WIC and child nutrition</a>
          </div>
          <p className="mt-2">This page aggregates links to official sources and reputable nonprofits. It is not an official government website.</p>
        </footer>
      </main>
    </div>
  );
}
