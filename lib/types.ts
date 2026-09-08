// Core data model for the Gleea MVP, aligned to the canonical Gleea product
// truth (six Animal Guides, five Worlds, three age bands, READ→DO→SHINE) and to
// the live Base44 content schema (Mission / Badge entities).
//
// Content principle (non-negotiable): AI is limited to NAME personalization
// only. READ / DO / SHINE content is authored, never AI-generated. Story text
// therefore carries {{CHILD_NAME}} / {{GUIDE_NAME}} tokens substituted locally.

// Three developmental bands. The MVP UI exposes Seedling + Sprout (ages 3–6);
// Bloomer (7–8) is modeled but not surfaced yet.
export type AgeBand = 'seedling' | 'sprout' | 'bloomer';

// Invisible to the child — scaffolds difficulty, never shown as "levels".
export type Difficulty = 'gentle' | 'growing' | 'stretching';

// CASEL competencies (Base44 enum, including Gleea's added "generosity").
export type Casel =
  | 'self_awareness'
  | 'self_management'
  | 'social_awareness'
  | 'relationship_skills'
  | 'responsible_decision_making'
  | 'generosity';

// The canonical three-step loop. No GIVE/LEAD (archived long ago; see
// lib/archive/giveLeadArchive.ts).
export type LoopStep = 'read' | 'do' | 'shine';

// The six Animal Guides are companions; the child is always the hero.
export interface Guide {
  id: string;
  name: string;      // e.g. "Joyful Otter"
  species: string;   // bear | dog | deer | otter | skunk | squirrel
  emoji: string;
  // Guide → CASEL mapping. INFERRED for the MVP; confirm with the content team.
  competency: Casel;
  homeWorldId: string;
  accent: string;    // hex
  blurb: string;     // child-facing one-liner
  persona: string;   // voice notes (used only for name-safe phrasing, not story gen)
}

export interface World {
  id: string;
  name: string;
  emoji: string;
  order: number;         // journey order (1..5)
  competencies: Casel[]; // canonical World → CASEL mapping
  blurb: string;
  locked: boolean;       // locked worlds show "Up next!", never "Locked"
}

// A mission mirrors the Base44 `Mission` entity. Story text is STATIC and
// tokenized; per-band variants scaffold reading level for the MVP.
export interface Mission {
  id: string;
  missionNumber: number;
  title: string;
  worldId: string;
  guideId: string;
  casel: Casel;
  agePrimary: AgeBand;
  read: Record<AgeBand, string>;          // READ — tokenized static story text
  doInstruction: Record<AgeBand, string>; // DO — real-world observable action only
  shinePrompts: Record<AgeBand, string[]>;// SHINE — reflection prompts
  xpValue: number;
  audioSrc: string;                        // one human-recorded narration file
  deck: 'legacy' | 'casel_v2';             // casel_v2 = source of truth
  archived: boolean;
  ttsEnabled?: boolean;                    // deferred TTS pipeline
}

// SHINE sentiment emojis (Base44 `overall_emoji` enum).
export type ChildFeedback = '😊' | '😢' | '😐' | '😕' | '😍';

// A completed SHINE reflection.
export interface Reflection {
  id: string;
  missionId: string;
  createdAt: string;
  emoji: ChildFeedback | null;
  casel: Casel;
}

// A petal on the child's Kindness Flower (CASEL profile), earned per mission.
export interface FlowerPetal {
  id: string;
  casel: Casel;
  emoji: string;
  earnedAt: string;
  missionId: string;
  worldId: string;
}

// Parent-authored custom mission — requires parent approval before a child
// sees it (Workflow Embedding).
export interface CustomMission {
  id: string;
  createdAt: string;
  text: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface ChildProfile {
  name: string;
  ageBand: AgeBand;
  guideId: string;
}

// Persisted state (localStorage), versioned. Bumped to v2 for the canon model.
export interface GleeaState {
  version: 2;
  profile: ChildProfile | null;
  flower: FlowerPetal[];
  reflections: Reflection[];
  customMissions: CustomMission[];
  completed: Record<string, Partial<Record<LoopStep, boolean>>>;
}
