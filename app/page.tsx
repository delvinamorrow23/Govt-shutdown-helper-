'use client';

import React, { useEffect, useState } from 'react';
import { Starfield } from '../components/Starfield';
import { Nav, type View } from '../components/Nav';
import { Welcome } from '../components/Welcome';
import { ProfileSetup } from '../components/ProfileSetup';
import { GleeaLoop } from '../components/GleeaLoop';
import { Garden } from '../components/Garden';
import { ParentGate } from '../components/ParentGate';
import { ParentDashboard } from '../components/ParentDashboard';
import {
  loadState,
  saveState,
  newId,
  setProfile as setProfileMut,
  markStep,
  addGardenElement,
  logGeneration,
  updateGeneration,
  addCustomMission,
  setCustomMissionStatus,
} from '../lib/storage';
import { DEMO_STORY } from '../lib/story';
import type {
  AIGeneration,
  ChildProfile,
  CustomMission,
  GardenElement,
  GleeaState,
} from '../lib/types';

const BLOOMS: { kind: GardenElement['kind']; emoji: string; label: string }[] = [
  { kind: 'flower', emoji: '🌸', label: 'Cherry blossom' },
  { kind: 'flower', emoji: '🌷', label: 'Tulip' },
  { kind: 'star', emoji: '🌟', label: 'Kindness star' },
  { kind: 'flower', emoji: '🌻', label: 'Sunflower' },
  { kind: 'tree', emoji: '🌳', label: 'Kindness tree' },
  { kind: 'flower', emoji: '🌼', label: 'Daisy' },
  { kind: 'sprout', emoji: '🍀', label: 'Lucky clover' },
];

export default function Page() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<GleeaState>(() => loadState());
  const [view, setView] = useState<View>('welcome');
  const [justGrew, setJustGrew] = useState(false);
  // Bumps to force a fresh GleeaLoop (new story generation) on replay.
  const [loopKey, setLoopKey] = useState(0);

  // Hydrate from localStorage on the client only (avoids SSR mismatch).
  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setView(loaded.profile ? 'loop' : 'welcome');
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  function handleProfile(profile: ChildProfile) {
    setState((s) => setProfileMut(s, profile));
    setLoopKey((k) => k + 1);
    setView('loop');
  }

  function handleLogGeneration(gen: AIGeneration) {
    setState((s) => logGeneration(s, gen));
  }
  function handleUpdateGeneration(id: string, patch: Partial<AIGeneration>) {
    setState((s) => updateGeneration(s, id, patch));
  }
  function handleAddCustomMission(m: CustomMission) {
    setState((s) => addCustomMission(s, m));
  }
  function handleSetMissionStatus(id: string, status: CustomMission['status']) {
    setState((s) => setCustomMissionStatus(s, id, status));
  }

  function handleShineComplete() {
    const bloom = BLOOMS[state.garden.length % BLOOMS.length];
    const element: GardenElement = {
      id: newId('bloom'),
      kind: bloom.kind,
      emoji: bloom.emoji,
      label: bloom.label,
      earnedAt: new Date().toISOString(),
      storyId: DEMO_STORY.id,
      valueId: state.profile?.valueId ?? DEMO_STORY.defaultValueId,
    };
    setState((s) => {
      let next = markStep(s, DEMO_STORY.id, 'read');
      next = markStep(next, DEMO_STORY.id, 'do');
      next = markStep(next, DEMO_STORY.id, 'shine');
      return addGardenElement(next, element);
    });
    setJustGrew(true);
    setView('garden');
  }

  function handleReplay() {
    setJustGrew(false);
    setLoopKey((k) => k + 1);
    setView('loop');
  }

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="text-5xl animate-floaty">✨</div>
      </main>
    );
  }

  const approvedMissions = state.customMissions.filter((m) => m.status === 'approved');
  const showNav = view !== 'welcome' && view !== 'setup' && !!state.profile;

  return (
    <main className="relative min-h-screen">
      <Starfield />
      {showNav && <Nav current={view} onNavigate={setView} />}

      <div className="relative z-10">
        {view === 'welcome' && <Welcome onStart={() => setView('setup')} />}

        {view === 'setup' && (
          <ProfileSetup initial={state.profile} onDone={handleProfile} />
        )}

        {view === 'loop' && state.profile && (
          <GleeaLoop
            key={loopKey}
            profile={state.profile}
            approvedMissions={approvedMissions}
            onLogGeneration={handleLogGeneration}
            onUpdateGeneration={handleUpdateGeneration}
            onShineComplete={handleShineComplete}
          />
        )}

        {view === 'garden' && (
          <Garden
            elements={state.garden}
            childName={state.profile?.name ?? 'friend'}
            justGrew={justGrew}
            onReplay={handleReplay}
          />
        )}

        {view === 'parentgate' && (
          <ParentGate onPass={() => setView('parent')} onCancel={() => setView('loop')} />
        )}

        {view === 'parent' && state.profile && (
          <ParentDashboard
            profile={state.profile}
            generations={state.generations}
            customMissions={state.customMissions}
            onUpdateGeneration={handleUpdateGeneration}
            onAddCustomMission={handleAddCustomMission}
            onLogGeneration={handleLogGeneration}
            onSetMissionStatus={handleSetMissionStatus}
          />
        )}
      </div>
    </main>
  );
}
