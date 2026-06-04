// Core data model for the Gleea MVP.
//
// The schema intentionally carries fields for deferred features (badges,
// collectibles, the global kindness map, the full story library, the archived
// GIVE/LEAD tier, and a future text-to-speech pipeline) so the architecture
// supports them without their UI being built yet.

export type AgeBand = '3-4' | '5-6';

// The Kind Eyes / Kind Heart / Kind Hands SEL scaffold for ages 3-6.
export type KindSense = 'eyes' | 'heart' | 'hands';

// CASEL's five social-emotional competencies. Each Animal Guide maps to one.
export type CaselCompetency =
  | 'self-awareness'
  | 'self-management'
  | 'social-awareness'
  | 'relationship-skills'
  | 'responsible-decision-making';

// The canonical three-step Gleea Loop. GIVE/LEAD are intentionally absent here
// (archived in lib/archive/giveLeadArchive.ts for a possible later tier).
export type LoopStep = 'read' | 'do' | 'shine';

export interface Guide {
  id: string;
  name: string;        // e.g. "Joyful Otter"
  species: string;     // e.g. "otter"
  emoji: string;
  competency: CaselCompetency;
  kindSense: KindSense;
  accent: string;      // tailwind-friendly hex for the guide's color
  blurb: string;       // child-facing one-liner
  persona: string;     // voice notes used when prompting the AI
}

export interface KindnessValue {
  id: string;
  label: string;       // e.g. "Including others"
  emoji: string;
  description: string; // parent-facing explanation
}

// A single page of the story. Text is provided per age band so the static
// fallback (and the AI's grounding) is age-appropriate.
export interface StoryPage {
  id: string;
  emoji: string;
  text: Record<AgeBand, string>;
}

export interface StoryArc {
  id: string;
  title: string;
  guideId: string;
  defaultValueId: string;
  // READ content, per age band.
  pages: StoryPage[];
  // DO: the real-world kindness mission, per age band.
  mission: Record<AgeBand, string>;
  // SHINE: family reflection prompts (shared moment), per age band.
  shinePrompts: Record<AgeBand, string[]>;
  // One human-recorded narration file for the READ step (Delvina supplies it).
  audioSrc: string;
  // Deferred: TTS pipeline would populate per-page audio later.
  ttsEnabled?: boolean;
}

export interface GardenElement {
  id: string;
  kind: 'flower' | 'star' | 'tree' | 'sprout';
  emoji: string;
  label: string;
  earnedAt: string;    // ISO timestamp
  storyId: string;
  valueId: string;
}

// PCI Participatory Feedback: every AI generation is logged so the parent can
// review, flag, and adjust it, and so the child's emoji feedback can tune
// future stories.
export interface AIGeneration {
  id: string;
  createdAt: string;
  type: 'story' | 'mission';
  // PCI Contextual Training: the exact context handed to the model.
  context: AIContext;
  output: string;
  source: 'claude' | 'fallback';
  flagged: boolean;
  parentNote?: string;
  childFeedback?: ChildFeedback;
}

export type ChildFeedback = 'love' | 'ok' | 'meh';

// PCI Workflow Embedding: parent-authored custom missions require approval
// before a child ever sees them.
export interface CustomMission {
  id: string;
  createdAt: string;
  text: string;
  status: 'pending' | 'approved' | 'declined';
  context: AIContext;
}

// The context object that travels to the AI proxy. Kept deliberately small:
// first name + age band + chosen value + guide. No surnames, no PII beyond a
// first name (PCI Values-Aligned Guardrails: collect no unnecessary data).
export interface AIContext {
  name: string;
  ageBand: AgeBand;
  valueId: string;
  valueLabel: string;
  guideId: string;
  guideName: string;
  competency: CaselCompetency;
}

export interface ChildProfile {
  name: string;
  ageBand: AgeBand;
  guideId: string;
  valueId: string;
}

// The single persisted blob (localStorage). Versioned for safe migrations.
export interface GleeaState {
  version: 1;
  profile: ChildProfile | null;
  garden: GardenElement[];
  generations: AIGeneration[];
  customMissions: CustomMission[];
  // Per-story completion flags for the loop.
  completed: Record<string, Partial<Record<LoopStep, boolean>>>;
}
