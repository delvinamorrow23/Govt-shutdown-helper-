'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card } from './ui';

// A light "grown-ups only" gate in front of the parent dashboard — a small
// arithmetic step a 3–6 year old can't solve, not real authentication (the MVP
// has no accounts). Keeps the parent area separate from the child flow.
export function ParentGate({
  onPass,
  onCancel,
}: {
  onPass: () => void;
  onCancel: () => void;
}) {
  const a = useMemo(() => 3 + Math.floor(Math.random() * 6), []);
  const b = useMemo(() => 4 + Math.floor(Math.random() * 6), []);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function check() {
    if (Number(value) === a + b) onPass();
    else setError(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6">
      <Card className="w-full text-center">
        <div className="text-5xl">🔒</div>
        <h2 className="mt-3 text-2xl font-extrabold">Grown-ups only</h2>
        <p className="mt-2 text-parchment-ink/70">
          To open the parent dashboard, please solve this:
        </p>
        <div className="mt-5 text-3xl font-extrabold text-gold-deep">
          {a} + {b} = ?
        </div>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          className="mt-4 w-32 rounded-2xl border border-parchment-shade bg-white/70 px-4 py-3
                     text-center text-2xl text-parchment-ink focus:border-gold focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-gold-deep">Not quite — try again.</p>}
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="soft" onClick={onCancel}>Back</Button>
          <Button onClick={check}>Enter</Button>
        </div>
      </Card>
    </div>
  );
}
