// Gleea Loop phases
export const GLEEA_LOOP_PHASES = ['read', 'do', 'shine'] as const;
export type GleeaLoopPhase = typeof GLEEA_LOOP_PHASES[number];

// Worlds
export const WORLDS = [
  { id: 'kindness-garden', name: 'Kindness Garden', emoji: '🌱', color: '#A8D5B0' },
  { id: 'friendship-forest', name: 'Friendship Forest', emoji: '🌳', color: '#3D7A4A' },
  { id: 'family-cove', name: 'Family Cove', emoji: '🏠', color: '#B8D4E8' },
  { id: 'helping-hills', name: 'Helping Hills', emoji: '⛰️', color: '#9B8EC4' },
  { id: 'wonder-world', name: 'Wonder World', emoji: '✨', color: '#D4A843' },
] as const;

export type WorldId = typeof WORLDS[number]['id'];

// Animal Guides
export const GUIDES = [
  { id: 'brave-bear', name: 'Brave Bear', trait: 'Courage Champion', casel: 'self-management', color: '#8B6F47', hasArt: true },
  { id: 'loyal-dog', name: 'Loyal Dog', trait: 'Friendship Guide', casel: 'relationship-skills', color: '#C4956A', hasArt: false },
  { id: 'gentle-deer', name: 'Gentle Deer', trait: 'Kindness Scout', casel: 'social-awareness', color: '#D4A843', hasArt: false },
  { id: 'joyful-otter', name: 'Joyful Otter', trait: 'Happiness Helper', casel: 'self-awareness', color: '#6BA3BE', hasArt: false },
  { id: 'sweet-skunk', name: 'Sweet Skunk', trait: 'Inclusion Champion', casel: 'responsible-decision-making', color: '#9B8EC4', hasArt: false },
  { id: 'sharing-squirrel', name: 'Sharing Squirrel', trait: 'Generosity Guide', casel: 'cross-competency', color: '#C47B4A', hasArt: true },
] as const;

export type GuideId = typeof GUIDES[number]['id'];

// CASEL Competencies
export const CASEL_COMPETENCIES = [
  { id: 'self-awareness', name: 'Self-Awareness', color: '#6BA3BE' },
  { id: 'self-management', name: 'Self-Management', color: '#8B6F47' },
  { id: 'social-awareness', name: 'Social Awareness', color: '#D4A843' },
  { id: 'relationship-skills', name: 'Relationship Skills', color: '#C4956A' },
  { id: 'responsible-decision-making', name: 'Responsible Decision-Making', color: '#9B8EC4' },
] as const;

export type CASELCompetency = typeof CASEL_COMPETENCIES[number]['id'];

// Age Bands
export const AGE_BANDS = [
  { id: 'seedling', name: 'Seedling', ages: '3–4', minAge: 3, maxAge: 4, tapSize: 64, description: 'Simple 1-step actions, parent-assisted' },
  { id: 'sprout', name: 'Sprout', ages: '5–6', minAge: 5, maxAge: 6, tapSize: 56, description: '2-step actions, growing independence' },
  { id: 'bloomer', name: 'Bloomer', ages: '7–8', minAge: 7, maxAge: 8, tapSize: 48, description: 'Multi-step actions, independent' },
] as const;

export type AgeBand = typeof AGE_BANDS[number]['id'];

// KIND Principles
export const KIND_PRINCIPLES = [
  { id: 'eyes', name: 'Kind Eyes', description: 'See the good in others' },
  { id: 'heart', name: 'Kind Heart', description: 'Feel with empathy' },
  { id: 'hands', name: 'Kind Hands', description: 'Act with generosity' },
] as const;

// XP / Heart Level thresholds
export const HEART_LEVELS = [
  { level: 1, xpRequired: 0, name: 'Little Seed' },
  { level: 2, xpRequired: 50, name: 'Sprouting Heart' },
  { level: 3, xpRequired: 150, name: 'Growing Kindness' },
  { level: 4, xpRequired: 300, name: 'Blooming Spirit' },
  { level: 5, xpRequired: 500, name: 'Shining Star' },
  { level: 6, xpRequired: 750, name: 'Kindness Champion' },
  { level: 7, xpRequired: 1050, name: 'Heart of Gold' },
  { level: 8, xpRequired: 1400, name: 'Wonder Maker' },
  { level: 9, xpRequired: 1800, name: 'Light Bringer' },
  { level: 10, xpRequired: 2250, name: 'Gleea Guardian' },
];

// Reflection emojis for SHINE phase
export const REFLECTION_EMOJIS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '🌟', label: 'Proud' },
  { emoji: '🤗', label: 'Warm' },
  { emoji: '😌', label: 'Calm' },
];

// Storage key
export const STORAGE_KEY = 'gleea-app';
