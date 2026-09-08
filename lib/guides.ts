import type { Casel, Guide } from './types';

// The six Animal Guides (canonical). Guides are companions — the child is
// always the hero. Names and species are canonical; the guide → CASEL and
// guide → home-World mappings are INFERRED for the MVP and should be confirmed
// with the content team (CASEL for a given mission always comes from the
// mission's own `casel` field, not from the guide).
export const GUIDES: Guide[] = [
  {
    id: 'brave_bear',
    name: 'Brave Bear',
    species: 'bear',
    emoji: '🐻',
    competency: 'responsible_decision_making',
    homeWorldId: 'helping_hills',
    accent: '#C68A4E',
    blurb: 'Helps you be brave and make good, kind choices.',
    persona: 'Brave Bear is steady, warm, and encouraging.',
  },
  {
    id: 'loyal_dog',
    name: 'Loyal Dog',
    species: 'dog',
    emoji: '🐶',
    competency: 'relationship_skills',
    homeWorldId: 'friendship_forest',
    accent: '#E0A458',
    blurb: 'Helps you be a good friend and stick together.',
    persona: 'Loyal Dog is friendly, playful, and dependable.',
  },
  {
    id: 'gentle_deer',
    name: 'Gentle Deer',
    species: 'deer',
    emoji: '🦌',
    competency: 'social_awareness',
    homeWorldId: 'friendship_forest',
    accent: '#C9A7FF',
    blurb: 'Helps you notice how other people feel.',
    persona: 'Gentle Deer is soft-spoken and observant.',
  },
  {
    id: 'joyful_otter',
    name: 'Joyful Otter',
    species: 'otter',
    emoji: '🦦',
    competency: 'self_awareness',
    homeWorldId: 'family_cove',
    accent: '#7AD0C0',
    blurb: 'Helps you notice the feelings inside you.',
    persona: 'Joyful Otter is warm, playful, and curious.',
  },
  {
    id: 'sweet_skunk',
    name: 'Sweet Skunk',
    species: 'skunk',
    emoji: '🦨',
    competency: 'self_management',
    homeWorldId: 'kindness_garden',
    accent: '#9DB8FF',
    blurb: 'Helps you take slow breaths when feelings get big.',
    persona: 'Sweet Skunk is calm, gentle, and reassuring.',
  },
  {
    id: 'sharing_squirrel',
    name: 'Sharing Squirrel',
    species: 'squirrel',
    emoji: '🐿️',
    competency: 'generosity',
    homeWorldId: 'wonder_world',
    accent: '#E8A87C',
    blurb: 'Helps you share and give with a happy heart.',
    persona: 'Sharing Squirrel is generous, bright, and eager.',
  },
];

export const DEFAULT_GUIDE_ID = 'joyful_otter';

export function getGuide(id: string): Guide {
  return GUIDES.find((g) => g.id === id) ?? GUIDES[0];
}
