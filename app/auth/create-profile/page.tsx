'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GUIDES, AGE_BANDS } from '@/lib/constants';
import { createProfile } from '@/lib/profiles';
import Button from '@/components/ui/Button';

type Step = 'name' | 'age' | 'guide' | 'pin';

export default function CreateProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
  const [pinError, setPinError] = useState(false);

  const steps: Step[] = ['name', 'age', 'guide', 'pin'];
  const stepIndex = steps.indexOf(step);

  function nextStep() {
    const next = steps[stepIndex + 1];
    if (next) setStep(next);
  }

  function prevStep() {
    if (stepIndex === 0) {
      router.push('/');
      return;
    }
    setStep(steps[stepIndex - 1]);
  }

  function handlePinDigit(d: string) {
    if (pinStep === 'enter') {
      if (pin.length < 4) {
        const newPin = pin + d;
        setPin(newPin);
        if (newPin.length === 4) {
          setTimeout(() => setPinStep('confirm'), 300);
        }
      }
    } else {
      if (pinConfirm.length < 4) {
        const newConfirm = pinConfirm + d;
        setPinConfirm(newConfirm);
        if (newConfirm.length === 4) {
          if (newConfirm === pin) {
            // Create profile!
            createProfile(name, age!, guideId as any, pin);
            router.push('/child/home');
          } else {
            setPinError(true);
            setTimeout(() => {
              setPinConfirm('');
              setPinError(false);
            }, 600);
          }
        }
      }
    }
  }

  function handlePinDelete() {
    if (pinStep === 'enter') {
      setPin(p => p.slice(0, -1));
    } else {
      setPinConfirm(p => p.slice(0, -1));
      setPinError(false);
    }
  }

  const selectedGuide = GUIDES.find(g => g.id === guideId);

  return (
    <div className="min-h-screen bg-sunrise-gradient flex flex-col px-6 py-8">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button onClick={prevStep} className="text-white/70 mr-4 text-lg">←</button>
        {steps.map((s, i) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              i <= stepIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* STEP 1: Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full text-center"
            >
              <h2 className="text-2xl font-extrabold text-white mb-2">What&apos;s your name?</h2>
              <p className="text-white/70 mb-6">We&apos;ll use it on your kindness journey!</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                maxLength={20}
                className="w-full bg-white/90 backdrop-blur rounded-gleea px-5 py-4 text-xl text-center font-bold text-gleea-warm-gray placeholder:text-gleea-warm-gray/30 outline-none focus:ring-2 focus:ring-gleea-pink shadow-soft"
                autoFocus
              />
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={nextStep}
                disabled={!name.trim()}
              >
                Next →
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Age */}
          {step === 'age' && (
            <motion.div
              key="age"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full text-center"
            >
              <h2 className="text-2xl font-extrabold text-white mb-2">How old are you, {name}?</h2>
              <p className="text-white/70 mb-6">This helps us pick the right adventures.</p>
              <div className="grid grid-cols-3 gap-3">
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(a => {
                  const band = AGE_BANDS.find(b => a >= b.minAge && a <= b.maxAge);
                  return (
                    <motion.button
                      key={a}
                      onClick={() => setAge(a)}
                      className={`tap-target-large rounded-2xl text-xl font-bold transition-all ${
                        age === a
                          ? 'bg-gleea-pink text-white shadow-glow-pink scale-105'
                          : 'bg-white/90 text-gleea-warm-gray shadow-soft active:scale-95'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {a}
                      {band && age === a && (
                        <div className="text-xs font-normal mt-0.5">
                          {band.id === 'seedling' ? '🌱' : band.id === 'sprout' ? '🌿' : '🌸'}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={nextStep}
                disabled={age === null}
              >
                Next →
              </Button>
            </motion.div>
          )}

          {/* STEP 3: Guide Selection */}
          {step === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full text-center"
            >
              <h2 className="text-2xl font-extrabold text-white mb-2">Choose your guide!</h2>
              <p className="text-white/70 mb-6">This friend will help you on your kindness journey.</p>
              <div className="grid grid-cols-2 gap-3">
                {GUIDES.map(guide => (
                  <motion.button
                    key={guide.id}
                    onClick={() => setGuideId(guide.id)}
                    className={`rounded-gleea p-4 flex flex-col items-center gap-2 transition-all ${
                      guideId === guide.id
                        ? 'bg-white shadow-glow scale-105 ring-2 ring-gleea-gold'
                        : 'bg-white/80 shadow-soft active:scale-95'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: guide.color }}
                    >
                      {guide.name.charAt(0)}
                    </div>
                    <div className="font-bold text-gleea-warm-gray text-sm">{guide.name}</div>
                    <div className="text-xs text-gleea-warm-gray/60">{guide.trait}</div>
                  </motion.button>
                ))}
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={nextStep}
                disabled={!guideId}
              >
                Next →
              </Button>
            </motion.div>
          )}

          {/* STEP 4: PIN */}
          {step === 'pin' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full text-center"
            >
              <div className="mb-2">
                {selectedGuide && (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
                    style={{ backgroundColor: selectedGuide.color }}
                  >
                    {selectedGuide.name.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">
                {pinStep === 'enter' ? 'Set your secret PIN' : 'Confirm your PIN'}
              </h2>
              <p className="text-white/70 mb-6">
                {pinStep === 'enter'
                  ? 'Pick 4 numbers only you know!'
                  : 'Enter it one more time to be sure.'}
              </p>

              {/* PIN dots */}
              <div className="flex gap-3 justify-center mb-6">
                {[0, 1, 2, 3].map(i => {
                  const currentPin = pinStep === 'enter' ? pin : pinConfirm;
                  return (
                    <motion.div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 ${
                        i < currentPin.length
                          ? 'bg-white border-white'
                          : 'bg-transparent border-white/40'
                      } ${pinError ? 'border-red-300' : ''}`}
                      animate={pinError ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    />
                  );
                })}
              </div>

              {pinError && (
                <p className="text-red-200 text-sm mb-4">PINs didn&apos;t match. Try again!</p>
              )}

              {/* Number pad */}
              <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(key => (
                  <button
                    key={key || 'empty'}
                    onClick={() => {
                      if (key === 'del') handlePinDelete();
                      else if (key) handlePinDigit(key);
                    }}
                    disabled={!key}
                    className={`tap-target-large rounded-2xl text-xl font-bold flex items-center justify-center transition-all ${
                      key === 'del'
                        ? 'bg-white/20 text-white'
                        : key
                          ? 'bg-white/90 shadow-soft text-gleea-warm-gray active:scale-95 active:bg-gleea-pink-light'
                          : 'invisible'
                    }`}
                  >
                    {key === 'del' ? '←' : key}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
