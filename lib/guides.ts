import type { Guide } from './types';

// Animal Guides are the in-app characters. Each is mapped to one CASEL
// social-emotional competency and one strand of the Kind Eyes / Kind Heart /
// Kind Hands scaffold. (The fairy / fairy-godmother is brand backstory, not an
// in-app character.)
export const GUIDES: Guide[] = [
  {
    id: 'joyful-otter',
    name: 'Joyful Otter',
    species: 'otter',
    emoji: '🦦',
    competency: 'self-awareness',
    kindSense: 'heart',
    accent: '#FF7AA8',
    blurb: 'Helps you notice the happy and the wobbly feelings inside.',
    persona:
      'Joyful Otter is warm, playful, and curious. Otter floats on its back, ' +
      'claps for small wins, and gently names feelings out loud so the child ' +
      'learns to notice their own (self-awareness).',
  },
  {
    id: 'calm-tortoise',
    name: 'Calm Tortoise',
    species: 'tortoise',
    emoji: '🐢',
    competency: 'self-management',
    kindSense: 'heart',
    accent: '#7AD0C0',
    blurb: 'Shows you how to take slow, steady breaths when feelings get big.',
    persona:
      'Calm Tortoise is slow, steady, and reassuring. Tortoise models taking ' +
      'a deep "shell breath" to settle big feelings (self-management).',
  },
  {
    id: 'gentle-deer',
    name: 'Gentle Deer',
    species: 'deer',
    emoji: '🦌',
    competency: 'social-awareness',
    kindSense: 'eyes',
    accent: '#C9A7FF',
    blurb: 'Helps you see when someone else might be feeling left out.',
    persona:
      'Gentle Deer is soft-spoken and observant. Deer notices how others feel ' +
      'and points it out kindly (social awareness / Kind Eyes).',
  },
  {
    id: 'brave-fox',
    name: 'Brave Fox',
    species: 'fox',
    emoji: '🦊',
    competency: 'relationship-skills',
    kindSense: 'hands',
    accent: '#FFB36B',
    blurb: 'Helps you make friends and say sorry when things go bumpy.',
    persona:
      'Brave Fox is friendly and encouraging. Fox helps the child take the ' +
      'first step toward a friend and repair little hurts (relationship skills).',
  },
  {
    id: 'wise-owl',
    name: 'Wise Owl',
    species: 'owl',
    emoji: '🦉',
    competency: 'responsible-decision-making',
    kindSense: 'hands',
    accent: '#9DB8FF',
    blurb: 'Helps you stop and choose the kind thing to do.',
    persona:
      'Wise Owl is thoughtful and calm. Owl asks "what would be kind here?" to ' +
      'help the child pause and choose (responsible decision-making).',
  },
];

export const DEFAULT_GUIDE_ID = 'joyful-otter';

export function getGuide(id: string): Guide {
  return GUIDES.find((g) => g.id === id) ?? GUIDES[0];
}

export const COMPETENCY_LABEL: Record<Guide['competency'], string> = {
  'self-awareness': 'Self-Awareness',
  'self-management': 'Self-Management',
  'social-awareness': 'Social Awareness',
  'relationship-skills': 'Relationship Skills',
  'responsible-decision-making': 'Responsible Decision-Making',
};

export const KIND_SENSE_LABEL: Record<Guide['kindSense'], string> = {
  eyes: 'Kind Eyes',
  heart: 'Kind Heart',
  hands: 'Kind Hands',
};
