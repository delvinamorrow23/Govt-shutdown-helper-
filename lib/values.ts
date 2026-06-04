import type { KindnessValue } from './types';

// The kindness values a child (with their grown-up) can choose. The chosen
// value personalizes the story and the DO mission.
export const VALUES: KindnessValue[] = [
  {
    id: 'including',
    label: 'Including others',
    emoji: '🤝',
    description: 'Inviting someone in so no one feels left out.',
  },
  {
    id: 'sharing',
    label: 'Sharing',
    emoji: '🧺',
    description: 'Taking turns and sharing what we have.',
  },
  {
    id: 'helping',
    label: 'Helping',
    emoji: '💪',
    description: 'Lending a hand when someone needs it.',
  },
  {
    id: 'gentle-words',
    label: 'Gentle words',
    emoji: '💬',
    description: 'Using kind, gentle words with people.',
  },
  {
    id: 'caring-nature',
    label: 'Caring for nature',
    emoji: '🌱',
    description: 'Looking after animals, plants, and our world.',
  },
];

export const DEFAULT_VALUE_ID = 'including';

export function getValue(id: string): KindnessValue {
  return VALUES.find((v) => v.id === id) ?? VALUES[0];
}
