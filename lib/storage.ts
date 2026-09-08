import type {
  ChildProfile,
  CustomMission,
  FlowerPetal,
  GleeaState,
  LoopStep,
  Reflection,
} from './types';

// Client-side persistence for the MVP: a single versioned JSON blob in
// localStorage. No server, no auth. (Base44 was the old backend; a more robust
// backend is a post-seed concern.)

const KEY = 'gleea.state.v2';

function emptyState(): GleeaState {
  return {
    version: 2,
    profile: null,
    flower: [],
    reflections: [],
    customMissions: [],
    completed: {},
  };
}

const isBrowser = typeof window !== 'undefined';

export function loadState(): GleeaState {
  if (!isBrowser) return emptyState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as GleeaState;
    if (parsed.version !== 2) return emptyState();
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

export function saveState(state: GleeaState): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota or privacy mode — fail quietly; the demo still works in-memory.
  }
}

export function newId(prefix = 'id'): string {
  if (isBrowser && 'randomUUID' in crypto) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- mutators (each returns the next state) ----

export function setProfile(state: GleeaState, profile: ChildProfile): GleeaState {
  return { ...state, profile };
}

export function markStep(state: GleeaState, missionId: string, step: LoopStep): GleeaState {
  const forMission = { ...(state.completed[missionId] ?? {}), [step]: true };
  return { ...state, completed: { ...state.completed, [missionId]: forMission } };
}

export function addPetal(state: GleeaState, petal: FlowerPetal): GleeaState {
  return { ...state, flower: [...state.flower, petal] };
}

export function addReflection(state: GleeaState, reflection: Reflection): GleeaState {
  return { ...state, reflections: [reflection, ...state.reflections] };
}

export function addCustomMission(state: GleeaState, mission: CustomMission): GleeaState {
  return { ...state, customMissions: [mission, ...state.customMissions] };
}

export function setCustomMissionStatus(
  state: GleeaState,
  id: string,
  status: CustomMission['status'],
): GleeaState {
  return {
    ...state,
    customMissions: state.customMissions.map((m) =>
      m.id === id ? { ...m, status } : m,
    ),
  };
}
