'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hasParentPin, verifyParentPin, setParentPin } from '@/lib/storage';
import Button from '@/components/ui/Button';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hasPinSet = hasParentPin();
    if (!hasPinSet) {
      setIsSetup(true);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (isSetup) {
      setParentPin(pin);
      setAuthenticated(true);
    } else {
      if (verifyParentPin(pin)) {
        setAuthenticated(true);
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gleea-cream flex items-center justify-center px-6">
        <div className="bg-white rounded-gleea p-8 shadow-soft max-w-sm w-full">
          <h2 className="text-xl font-extrabold text-gleea-warm-gray mb-2 text-center">
            {isSetup ? 'Set Parent PIN' : 'Parent Dashboard'}
          </h2>
          <p className="text-gleea-warm-gray/60 text-sm text-center mb-6">
            {isSetup
              ? 'Create a 4-digit PIN to access the parent dashboard.'
              : 'Enter your PIN to continue.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]*"
              value={pin}
              onChange={e => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="4-digit PIN"
              className="w-full bg-gray-50 rounded-gleea px-5 py-4 text-xl text-center font-bold text-gleea-warm-gray placeholder:text-gleea-warm-gray/30 outline-none focus:ring-2 focus:ring-gleea-pink tracking-[0.5em]"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button variant="primary" size="lg" className="w-full" onClick={() => {}}>
              {isSetup ? 'Set PIN' : 'Enter'}
            </Button>
          </form>

          <button
            onClick={() => router.push('/')}
            className="w-full text-center text-gleea-warm-gray/40 text-sm mt-4"
          >
            ← Back to profiles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gleea-cream">
      {/* Parent nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/parent" className="font-bold text-gleea-warm-gray">
              Dashboard
            </Link>
            <Link href="/parent/progress" className="text-gleea-warm-gray/60 text-sm hover:text-gleea-pink">
              Progress
            </Link>
            <Link href="/parent/settings" className="text-gleea-warm-gray/60 text-sm hover:text-gleea-pink">
              Settings
            </Link>
          </div>
          <button onClick={() => router.push('/')} className="text-gleea-warm-gray/40 text-sm">
            Exit
          </button>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
