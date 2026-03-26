'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfiles, verifyPin, setActiveProfile } from '@/lib/storage';
import { GUIDES } from '@/lib/constants';
import type { ChildProfile } from '@/lib/types';
import Button from '@/components/ui/Button';

function GuideCircle({ guideId, size = 56 }: { guideId: string; size?: number }) {
  const guide = GUIDES.find(g => g.id === guideId);
  if (!guide) return null;
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shadow-glow"
      style={{ width: size, height: size, backgroundColor: guide.color }}
    >
      {guide.name.charAt(0)}
    </div>
  );
}

function PinInput({ onSubmit }: { onSubmit: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function handleDigit(d: string) {
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      onSubmit(newPin);
    }
  }

  function handleDelete() {
    setPin(p => p.slice(0, -1));
    setError(false);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* PIN dots */}
      <div className="flex gap-3">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i < pin.length
                ? 'bg-gleea-pink border-gleea-pink'
                : 'bg-transparent border-gleea-pink/40'
            } ${error ? 'border-red-400' : ''}`}
            animate={error ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm">Wrong PIN. Try again!</p>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(key => (
          <button
            key={key || 'empty'}
            onClick={() => {
              if (key === 'del') handleDelete();
              else if (key) handleDigit(key);
            }}
            disabled={!key}
            className={`tap-target-large rounded-2xl text-xl font-bold flex items-center justify-center transition-all ${
              key === 'del'
                ? 'bg-gleea-pink-light/50 text-gleea-warm-gray'
                : key
                  ? 'bg-white shadow-soft text-gleea-warm-gray active:scale-95 active:bg-gleea-pink-light'
                  : 'invisible'
            }`}
          >
            {key === 'del' ? '←' : key}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfiles(getProfiles());
    setLoaded(true);
  }, []);

  function handlePinSubmit(pin: string) {
    if (!selectedProfile) return;
    if (verifyPin(selectedProfile.id, pin)) {
      setActiveProfile(selectedProfile.id);
      router.push('/child/home');
    } else {
      // Shake animation handled by PinInput error state
      setSelectedProfile({ ...selectedProfile }); // re-trigger
    }
  }

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-twilight-gradient flex flex-col items-center justify-center px-6 py-12">
      {/* Floating stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="star absolute text-gleea-gold-glow"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${5 + Math.random() * 40}%`,
              animationDelay: `${i * 0.3}s`,
              fontSize: `${12 + Math.random() * 16}px`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center">
          <motion.div
            className="text-6xl mb-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💛
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Gleea</h1>
          <p className="text-white/80 mt-1 text-lg">Grow Your Kindness</p>
        </div>

        <AnimatePresence mode="wait">
          {selectedProfile ? (
            // PIN Entry
            <motion.div
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/90 backdrop-blur rounded-gleea p-6 w-full shadow-soft"
            >
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gleea-warm-gray/60 text-sm mb-4"
              >
                ← Back
              </button>
              <div className="flex flex-col items-center gap-4">
                <GuideCircle guideId={selectedProfile.avatarGuide} size={64} />
                <h2 className="text-xl font-bold text-gleea-warm-gray">
                  Hi, {selectedProfile.name}!
                </h2>
                <p className="text-gleea-warm-gray/60 text-sm">Enter your PIN</p>
                <PinInput onSubmit={handlePinSubmit} />
              </div>
            </motion.div>
          ) : (
            // Profile Selection
            <motion.div
              key="profiles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full space-y-4"
            >
              {profiles.length > 0 ? (
                <>
                  <p className="text-white/80 text-center text-lg">Who&apos;s being kind today?</p>
                  <div className="space-y-3">
                    {profiles.map(profile => (
                      <motion.button
                        key={profile.id}
                        onClick={() => setSelectedProfile(profile)}
                        className="w-full bg-white/90 backdrop-blur rounded-gleea p-4 flex items-center gap-4 shadow-soft active:scale-[0.98] transition-transform"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <GuideCircle guideId={profile.avatarGuide} size={48} />
                        <div className="text-left">
                          <div className="font-bold text-gleea-warm-gray">{profile.name}</div>
                          <div className="text-sm text-gleea-warm-gray/60">
                            {profile.ageBand === 'seedling' ? '🌱' : profile.ageBand === 'sprout' ? '🌿' : '🌸'}{' '}
                            Level {profile.progress.heartLevel}
                          </div>
                        </div>
                        <div className="ml-auto text-gleea-pink text-xl">→</div>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-white/80 text-lg mb-2">Welcome to Gleea!</p>
                  <p className="text-white/60 text-sm">Create a profile to start your kindness journey.</p>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4"
                onClick={() => router.push('/auth/create-profile')}
              >
                {profiles.length > 0 ? '+ Add Another Adventurer' : '✨ Start Your Journey'}
              </Button>

              {profiles.length > 0 && (
                <button
                  onClick={() => router.push('/parent')}
                  className="w-full text-center text-white/50 text-sm mt-2 py-2"
                >
                  Parent Dashboard →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom credits */}
      <div className="absolute bottom-6 text-white/30 text-xs text-center">
        Gleea, PBC — Generous Listening, Ethical Empathy, Action
      </div>
    </div>
  );
}
