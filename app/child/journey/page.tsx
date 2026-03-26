'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getActiveProfile } from '@/lib/storage';
import { completeMission } from '@/lib/progress';
import { checkBadges, type BadgeDef } from '@/lib/badges';
import { GUIDES, WORLDS, REFLECTION_EMOJIS } from '@/lib/constants';
import type { ChildProfile, Mission } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import GuideAvatar from '@/components/guides/GuideAvatar';
import GuideNarrator from '@/components/guides/GuideNarrator';
import CelebrationOverlay from '@/components/rewards/CelebrationOverlay';
import Badge from '@/components/ui/Badge';

import kindnessGardenMissions from '@/data/missions/kindness-garden.json';
import friendshipForestMissions from '@/data/missions/friendship-forest.json';
import familyCoveMissions from '@/data/missions/family-cove.json';
import helpingHillsMissions from '@/data/missions/helping-hills.json';
import wonderWorldMissions from '@/data/missions/wonder-world.json';

const MISSION_DATA: Record<string, Mission[]> = {
  'kindness-garden': kindnessGardenMissions as Mission[],
  'friendship-forest': friendshipForestMissions as Mission[],
  'family-cove': familyCoveMissions as Mission[],
  'helping-hills': helpingHillsMissions as Mission[],
  'wonder-world': wonderWorldMissions as Mission[],
};

function JourneyContent() {
  const searchParams = useSearchParams();
  const worldParam = searchParams.get('world');
  const missionParam = searchParams.get('mission');

  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<string>(worldParam || 'kindness-garden');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [phase, setPhase] = useState<'list' | 'read' | 'do' | 'shine' | 'complete'>('list');
  const [storyPage, setStoryPage] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'mission-complete' | 'badge-unlock' | 'level-up'>('mission-complete');
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [newBadges, setNewBadges] = useState<BadgeDef[]>([]);
  const [showBadgeReveal, setShowBadgeReveal] = useState(false);

  useEffect(() => {
    const p = getActiveProfile();
    setProfile(p);

    if (missionParam && worldParam) {
      const missions = MISSION_DATA[worldParam] || [];
      const m = missions.find(m => m.id === missionParam);
      if (m) {
        setActiveMission(m);
        setPhase('read');
      }
    }
  }, [worldParam, missionParam]);

  function refreshProfile() {
    setProfile(getActiveProfile());
  }

  function startMission(mission: Mission) {
    setActiveMission(mission);
    setPhase('read');
    setStoryPage(0);
    setSelectedEmoji(null);
    setNewBadges([]);
    setShowBadgeReveal(false);
  }

  function handleStoryNext() {
    if (!activeMission) return;
    if (storyPage < activeMission.story.pages.length - 1) {
      setStoryPage(s => s + 1);
    } else {
      setPhase('do');
    }
  }

  function handleDoComplete() {
    setPhase('shine');
  }

  function handleShineComplete() {
    if (!activeMission || !profile) return;

    const oldLevel = profile.progress.heartLevel;
    completeMission(profile.id, activeMission.id, activeMission.xpReward, activeMission.caselCompetency);

    const updatedProfile = getActiveProfile();
    if (!updatedProfile) return;

    // Check for new badges
    const earned = checkBadges(updatedProfile, {
      caselCompetency: activeMission.caselCompetency,
      guideId: activeMission.guideId,
      kindPrinciple: activeMission.kindPrinciple,
      worldId: activeMission.worldId,
    });
    setNewBadges(earned);

    // Determine celebration type
    if (updatedProfile.progress.heartLevel > oldLevel) {
      setCelebrationType('level-up');
      setCelebrationMessage(`Level Up! You're now ${updatedProfile.progress.heartLevel}!`);
    } else if (earned.length > 0) {
      setCelebrationType('badge-unlock');
      setCelebrationMessage(`Badge Unlocked: ${earned[0].name}!`);
    } else {
      setCelebrationType('mission-complete');
      setCelebrationMessage('');
    }

    setShowCelebration(true);
    refreshProfile();
    setPhase('complete');
  }

  const handleCelebrationDone = useCallback(() => {
    setShowCelebration(false);
    if (newBadges.length > 0) {
      setShowBadgeReveal(true);
    }
  }, [newBadges]);

  function handleBackToList() {
    setActiveMission(null);
    setPhase('list');
    setNewBadges([]);
    setShowBadgeReveal(false);
    refreshProfile();
  }

  if (!profile) return null;

  const worldMissions = (MISSION_DATA[selectedWorld] || []).filter(
    m => m.ageBands.includes(profile.ageBand as any)
  );

  const loopPhases = [
    { id: 'read', label: 'READ', emoji: '📖' },
    { id: 'do', label: 'DO', emoji: '🤲' },
    { id: 'shine', label: 'SHINE', emoji: '✨' },
  ];

  function phaseClass(lpId: string) {
    const activePhase = phase === 'complete' ? 'shine' : phase;
    const phaseOrder = ['read', 'do', 'shine'];
    const current = phaseOrder.indexOf(activePhase);
    const target = phaseOrder.indexOf(lpId);
    if (target < current) return 'bg-gleea-forest-light text-gleea-forest';
    if (target === current) {
      if (lpId === 'read') return 'bg-gleea-sky text-white';
      if (lpId === 'do') return 'bg-gleea-forest text-white';
      return 'bg-gleea-gold text-white';
    }
    return 'bg-gray-100 text-gleea-warm-gray/40';
  }

  return (
    <div className="px-5 pt-6">
      <CelebrationOverlay
        show={showCelebration}
        type={celebrationType}
        message={celebrationMessage}
        onDone={handleCelebrationDone}
      />

      <AnimatePresence mode="wait">
        {/* Mission List View */}
        {phase === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-4">Your Journey</h1>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
              {WORLDS.map(world => (
                <button
                  key={world.id}
                  onClick={() => setSelectedWorld(world.id)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    selectedWorld === world.id
                      ? 'bg-gleea-pink text-white shadow-glow-pink'
                      : 'bg-white text-gleea-warm-gray shadow-soft'
                  }`}
                >
                  {world.emoji} {world.name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {worldMissions.map((mission, i) => {
                const isCompleted = profile.progress.completedMissions.includes(mission.id);
                const guide = GUIDES.find(g => g.id === mission.guideId);

                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => !isCompleted && startMission(mission)}
                      disabled={isCompleted}
                      className="w-full text-left"
                    >
                      <Card className={`flex items-center gap-4 ${isCompleted ? 'opacity-60' : 'hover:shadow-glow-pink transition-shadow'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          isCompleted ? 'bg-gleea-forest-light' : 'bg-gleea-pink-light'
                        }`}>
                          {isCompleted ? '✓' : mission.order}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gleea-warm-gray">{mission.title}</div>
                          <div className="text-xs text-gleea-warm-gray/50 mt-0.5">
                            with {guide?.name} · {mission.xpReward} XP
                          </div>
                        </div>
                        {!isCompleted && <span className="text-gleea-pink">→</span>}
                      </Card>
                    </button>
                  </motion.div>
                );
              })}

              {worldMissions.length === 0 && (
                <Card className="text-center py-8">
                  <p className="text-gleea-warm-gray/50">No missions available for this world yet.</p>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* READ Phase */}
        {phase === 'read' && activeMission && (
          <motion.div key="read" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-[70vh] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              {loopPhases.map(lp => (
                <div key={lp.id} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${phaseClass(lp.id)}`}>
                  {lp.emoji} {lp.label}
                </div>
              ))}
            </div>

            <h2 className="text-xl font-extrabold text-gleea-warm-gray mb-4">
              {activeMission.story.title}
            </h2>

            {/* Narrator with typewriter */}
            <GuideNarrator
              guideId={activeMission.guideId}
              messages={[activeMission.story.pages[storyPage].narratorLine || ''].filter(Boolean)}
              phase="read"
            />

            <AnimatePresence mode="wait">
              <motion.div key={storyPage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <Card className="mb-4">
                  <p className="text-lg leading-relaxed text-gleea-warm-gray">
                    {activeMission.story.pages[storyPage].text}
                  </p>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 my-4">
              {activeMission.story.pages.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === storyPage ? 'bg-gleea-pink' : 'bg-gleea-pink/20'}`} />
              ))}
            </div>

            <Button variant="primary" size="lg" className="w-full" onClick={handleStoryNext}>
              {storyPage < activeMission.story.pages.length - 1 ? 'Next Page →' : 'Ready to DO! 🤲'}
            </Button>
          </motion.div>
        )}

        {/* DO Phase */}
        {phase === 'do' && activeMission && (
          <motion.div key="do" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-[70vh] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              {loopPhases.map(lp => (
                <div key={lp.id} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${phaseClass(lp.id)}`}>
                  {lp.emoji} {lp.label}
                </div>
              ))}
            </div>

            <h2 className="text-xl font-extrabold text-gleea-warm-gray mb-2">Time to DO!</h2>

            <GuideNarrator
              guideId={activeMission.guideId}
              messages={["Take your time! Come back when you're done. I'll be right here."]}
              phase="do"
            />

            <Card className="mb-4 border-2 border-gleea-forest/20">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🤲</div>
                <p className="text-lg font-bold text-gleea-warm-gray">
                  {profile.ageBand === 'seedling' && activeMission.doAction.seedlingSimplified
                    ? activeMission.doAction.seedlingSimplified
                    : activeMission.doAction.instruction}
                </p>
              </div>

              {profile.ageBand !== 'seedling' && (
                <div className="space-y-2 mt-4">
                  {activeMission.doAction.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gleea-forest-light text-gleea-forest text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gleea-warm-gray">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="mt-auto pt-6">
              <Button variant="primary" size="lg" className="w-full" onClick={handleDoComplete}>
                I did it! ✨
              </Button>
            </div>
          </motion.div>
        )}

        {/* SHINE Phase */}
        {phase === 'shine' && activeMission && (
          <motion.div key="shine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-[70vh] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              {loopPhases.map(lp => (
                <div key={lp.id} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${phaseClass(lp.id)}`}>
                  {lp.emoji} {lp.label}
                </div>
              ))}
            </div>

            <h2 className="text-xl font-extrabold text-gleea-warm-gray mb-2">Time to SHINE! ✨</h2>

            <GuideNarrator
              guideId={activeMission.guideId}
              messages={[activeMission.shinePrompt, "Pick how you feel! Every feeling is important."]}
              phase="shine"
            />

            <Card className="mb-4">
              <p className="text-center text-gleea-warm-gray/60 mb-4">How did it make you feel?</p>
              <div className="flex flex-wrap justify-center gap-3">
                {REFLECTION_EMOJIS.map(re => (
                  <motion.button
                    key={re.emoji}
                    onClick={() => setSelectedEmoji(re.emoji)}
                    className={`tap-target-large rounded-2xl flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all ${
                      selectedEmoji === re.emoji
                        ? 'bg-gleea-gold-glow shadow-glow scale-110'
                        : 'bg-white shadow-soft'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-2xl">{re.emoji}</span>
                    <span className="text-xs text-gleea-warm-gray/60">{re.label}</span>
                  </motion.button>
                ))}
              </div>
            </Card>

            <div className="mt-auto pt-6">
              <Button variant="primary" size="lg" className="w-full" onClick={handleShineComplete} disabled={!selectedEmoji}>
                Complete Mission 🌟
              </Button>
            </div>
          </motion.div>
        )}

        {/* Complete! */}
        {phase === 'complete' && activeMission && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="min-h-[70vh] flex flex-col items-center justify-center text-center">
            <motion.div className="text-6xl mb-4" animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8 }}>
              🌟
            </motion.div>

            <h2 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">Amazing!</h2>
            <p className="text-gleea-warm-gray/60 mb-6">
              You completed &ldquo;{activeMission.title}&rdquo;!
            </p>

            <Card className="w-full mb-4">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gleea-gold">+{activeMission.xpReward}</div>
                  <div className="text-xs text-gleea-warm-gray/50">XP earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">🌱</div>
                  <div className="text-xs text-gleea-warm-gray/50">Garden grew</div>
                </div>
                {profile && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gleea-forest">{profile.streaks.currentStreak}</div>
                    <div className="text-xs text-gleea-warm-gray/50">Day streak</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Badge reveals */}
            {showBadgeReveal && newBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-4"
              >
                <Card className="border-2 border-gleea-gold/30 bg-gleea-gold-glow/10">
                  <p className="text-sm font-bold text-gleea-gold text-center mb-3">
                    {newBadges.length > 1 ? 'New Badges Unlocked!' : 'New Badge Unlocked!'}
                  </p>
                  <div className="flex justify-center gap-4">
                    {newBadges.map(badge => (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <Badge name={badge.name} icon={badge.icon} earned size="lg" />
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            <GuideAvatar guideId={activeMission.guideId} size="lg" animated />
            <div className="mt-2">
              <GuideNarrator
                guideId={activeMission.guideId}
                messages={["Your kindness is growing! I'm so proud of you!"]}
                phase="complete"
              />
            </div>

            <Button variant="primary" size="lg" className="w-full mt-4" onClick={handleBackToList}>
              Continue Journey →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <Suspense fallback={null}>
      <JourneyContent />
    </Suspense>
  );
}
