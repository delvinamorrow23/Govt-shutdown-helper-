'use client';

import React, { useEffect, useState } from 'react';
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
  addPetal,
  addReflection,
  addCustomMission,
  setCustomMissionStatus,
} from '../lib/storage';
import { DEMO_MISSION } from '../lib/mission';
import { CASEL_FLOWER } from '../lib/worlds';
import type {
  ChildFeedback,
  ChildProfile,
  CustomMission,
  FlowerPetal,
  GleeaState,
  Reflection,
} from '../lib/types';

export default function Page() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<GleeaState>(() => loadState());
  const [view, setView] = useState<View>('welcome');
  const [justGrew, setJustGrew] = useState(false);
  const [loopKey, setLoopKey] = useState(0);

  // Hydrate from localStorage on the client only (avoids SSR mismatch).
  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setView(loaded.profile ? 'loop' : 'welcome');
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  function handleProfile(profile: ChildProfile) {
    setState((s) => setProfileMut(s, profile));
    setLoopKey((k) => k + 1);
    setView('loop');
  }

  function handleAddCustomMission(m: CustomMission) {
    setState((s) => addCustomMission(s, m));
  }
  function handleSetMissionStatus(id: string, status: CustomMission['status']) {
    setState((s) => setCustomMissionStatus(s, id, status));
  }

  function handleShineComplete(emoji: ChildFeedback | null) {
    const casel = DEMO_MISSION.casel;
    const petal: FlowerPetal = {
      id: newId('petal'),
      casel,
      emoji: CASEL_FLOWER[casel],
      earnedAt: new Date().toISOString(),
      missionId: DEMO_MISSION.id,
      worldId: DEMO_MISSION.worldId,
    };
    const reflection: Reflection = {
      id: newId('reflection'),
      missionId: DEMO_MISSION.id,
      createdAt: new Date().toISOString(),
      emoji,
      casel,
    };
    setState((s) => {
      let next = markStep(s, DEMO_MISSION.id, 'read');
      next = markStep(next, DEMO_MISSION.id, 'do');
      next = markStep(next, DEMO_MISSION.id, 'shine');
      next = addReflection(next, reflection);
      return addPetal(next, petal);
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
        <div className="text-5xl animate-floaty">💛</div>
      </main>
    );
  }

  const approvedMissions = state.customMissions.filter((m) => m.status === 'approved');
  const showNav = view !== 'welcome' && view !== 'setup' && !!state.profile;

  return (
    <main className="relative min-h-screen">
      {showNav && <Nav current={view} onNavigate={setView} />}

      <div className="relative z-10">
        {view === 'welcome' && <Welcome onStart={() => setView('setup')} />}

        {view === 'setup' && <ProfileSetup initial={state.profile} onDone={handleProfile} />}

        {view === 'loop' && state.profile && (
          <GleeaLoop
            key={loopKey}
            profile={state.profile}
            approvedMissions={approvedMissions}
            onShineComplete={handleShineComplete}
          />
        )}

        {view === 'garden' && (
          <Garden
            petals={state.flower}
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
            flower={state.flower}
            reflections={state.reflections}
            customMissions={state.customMissions}
            onAddCustomMission={handleAddCustomMission}
            onSetMissionStatus={handleSetMissionStatus}
          />
        )}
      </div>
    </main>
  );
}
