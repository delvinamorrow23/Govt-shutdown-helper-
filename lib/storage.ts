import type {
  AIGeneration,
  ChildProfile,
  CustomMission,
  GardenElement,
  GleeaState,
  LoopStep,
} from './types';

// Client-side persistence for the MVP. No server, no auth: the whole state is a
// single versioned JSON blob in localStorage. (Supabase + cross-device sync is
// a deferred, post-MVP concern.)

const KEY = 'gleea.state.v1';

function emptyState(): GleeaState {
  return {
    version: 1,
    profile: null,
    garden: [],
    generations: [],
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
    if (parsed.version !== 1) return emptyState();
    // Merge with defaults so older blobs missing a field stay valid.
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

// Small id helper (crypto.randomUUID where available).
export function newId(prefix = 'id'): string {
  if (isBrowser && 'randomUUID' in crypto) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- focused mutators (each returns the next state) ----

export function setProfile(state: GleeaState, profile: ChildProfile): GleeaState {
  return { ...state, profile };
}

export function markStep(
  state: GleeaState,
  storyId: string,
  step: LoopStep,
): GleeaState {
  const forStory = { ...(state.completed[storyId] ?? {}), [step]: true };
  return { ...state, completed: { ...state.completed, [storyId]: forStory } };
}

export function addGardenElement(
  state: GleeaState,
  element: GardenElement,
): GleeaState {
  return { ...state, garden: [...state.garden, element] };
}

export function logGeneration(
  state: GleeaState,
  generation: AIGeneration,
): GleeaState {
  return { ...state, generations: [generation, ...state.generations] };
}

export function updateGeneration(
  state: GleeaState,
  id: string,
  patch: Partial<AIGeneration>,
): GleeaState {
  return {
    ...state,
    generations: state.generations.map((g) =>
      g.id === id ? { ...g, ...patch } : g,
    ),
  };
}

export function addCustomMission(
  state: GleeaState,
  mission: CustomMission,
): GleeaState {
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
