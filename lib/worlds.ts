import type { Casel, World } from './types';

// The five Worlds, journeyed in order. World → CASEL mappings are canonical.
// (Plus a `special` world for seasonal/one-off missions, kept out of the main
// journey.)
export const WORLDS: World[] = [
  {
    id: 'kindness_garden',
    name: 'Kindness Garden',
    emoji: '🌸',
    order: 1,
    competencies: ['self_awareness', 'self_management'],
    blurb: 'Where kindness begins — noticing your own feelings.',
    locked: false,
  },
  {
    id: 'friendship_forest',
    name: 'Friendship Forest',
    emoji: '🌲',
    order: 2,
    competencies: ['relationship_skills', 'social_awareness'],
    blurb: 'Making friends and noticing how others feel.',
    locked: true,
  },
  {
    id: 'family_cove',
    name: 'Family Cove',
    emoji: '🦦',
    order: 3,
    competencies: ['relationship_skills'],
    blurb: 'Warm and caring with the people at home.',
    locked: true,
  },
  {
    id: 'helping_hills',
    name: 'Helping Hills',
    emoji: '⛰️',
    order: 4,
    competencies: ['responsible_decision_making'],
    blurb: 'Making good choices and helping the community.',
    locked: true,
  },
  {
    id: 'wonder_world',
    name: 'Wonder World',
    emoji: '🌉',
    order: 5,
    competencies: ['social_awareness', 'generosity'],
    blurb: 'Caring for our whole wide world.',
    locked: true,
  },
];

export function getWorld(id: string): World {
  return WORLDS.find((w) => w.id === id) ?? WORLDS[0];
}

export const CASEL_LABEL: Record<Casel, string> = {
  self_awareness: 'Self-Awareness',
  self_management: 'Self-Management',
  social_awareness: 'Social Awareness',
  relationship_skills: 'Relationship Skills',
  responsible_decision_making: 'Responsible Decision-Making',
  generosity: 'Generosity',
};

// A soft flower emoji per competency, for the Kindness Flower.
export const CASEL_FLOWER: Record<Casel, string> = {
  self_awareness: '🌼',
  self_management: '🌷',
  social_awareness: '🌻',
  relationship_skills: '🌸',
  responsible_decision_making: '🪷',
  generosity: '💐',
};
