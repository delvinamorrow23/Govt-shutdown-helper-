// ARCHIVED CONTENT — the old GIVE and LEAD steps.
//
// The previous version of the app used a five-step loop:
// READ - DO - SHINE - GIVE - LEAD. The canonical Gleea Loop is now the three
// steps READ -> DO -> SHINE (SHINE is reflection, not action).
//
// GIVE and LEAD are intentionally PRESERVED here (not deleted, not folded into
// SHINE) so they can power a possible later tier. Nothing in the MVP UI imports
// or renders this; it exists to keep the content reversible.

export interface ArchivedStep {
  key: 'give' | 'lead';
  title: string;
  description: string;
  // Per age band, kept for when/if the tier is revived.
  prompts: { '3-4': string[]; '5-6': string[] };
}

export const ARCHIVED_STEPS: ArchivedStep[] = [
  {
    key: 'give',
    title: 'Give',
    description:
      'The old fourth step: turning kindness outward into a small act of ' +
      'giving (e.g. donating a toy, making something for someone).',
    prompts: {
      '3-4': ['What could you give to someone today?', 'Who would you give it to?'],
      '5-6': [
        'What is something you could give or make for someone who needs it?',
        'How do you think it would make them feel?',
      ],
    },
  },
  {
    key: 'lead',
    title: 'Lead',
    description:
      'The old fifth step: inviting the child to lead others in kindness ' +
      '(e.g. teaching a friend, starting a kind habit at home).',
    prompts: {
      '3-4': ['Can you show a friend how to be kind?', 'What kind thing can you start?'],
      '5-6': [
        'How could you help others be kind too?',
        'What kind habit could you lead in your family this week?',
      ],
    },
  },
];
