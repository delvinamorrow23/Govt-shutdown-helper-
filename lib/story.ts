import type { StoryArc } from './types';
import { DEFAULT_GUIDE_ID } from './guides';
import { DEFAULT_VALUE_ID } from './values';

// The single complete demo story arc for the MVP: READ -> DO -> SHINE,
// featuring Joyful Otter, defaulting to the "Including others" value.
//
// Text is written for both age bands so the experience (and the AI's grounding)
// is age-appropriate even with no network/API key. The 3-4 band is shorter with
// simpler words; the 5-6 band is a little longer and richer.
//
// The full story LIBRARY is deferred; this is the one arc the demo ships.
export const DEMO_STORY: StoryArc = {
  id: 'otter-little-crab',
  title: 'Joyful Otter and the Little Lost Crab',
  guideId: DEFAULT_GUIDE_ID,
  defaultValueId: DEFAULT_VALUE_ID,
  audioSrc: '/audio/demo-story.mp3',
  ttsEnabled: false,
  pages: [
    {
      id: 'p1',
      emoji: '🌊',
      text: {
        '3-4': 'Joyful Otter splashed in the sparkly water. Splash, splash!',
        '5-6':
          'Joyful Otter floated on the sparkly blue water, watching the sun ' +
          'dance on the waves. It was a happy, splashy kind of day.',
      },
    },
    {
      id: 'p2',
      emoji: '🦀',
      text: {
        '3-4': 'On a rock sat a little crab. All alone. Sad.',
        '5-6':
          'On a rock near the shore sat a little crab, all by herself. Her ' +
          'tiny claws drooped. She looked a little bit lonely.',
      },
    },
    {
      id: 'p3',
      emoji: '👀',
      text: {
        '3-4': 'Otter looked with Kind Eyes. "She needs a friend," said Otter.',
        '5-6':
          'Joyful Otter looked with Kind Eyes and noticed how she felt. ' +
          '"I think she wishes someone would play with her," Otter said softly.',
      },
    },
    {
      id: 'p4',
      emoji: '🤝',
      text: {
        '3-4': 'Otter swam over. "Want to play with me?" Otter asked.',
        '5-6':
          'So Otter swam right over and gave a friendly wave. "Would you like ' +
          'to play with me?" Otter asked. "There is always room for one more."',
      },
    },
    {
      id: 'p5',
      emoji: '🎉',
      text: {
        '3-4': 'The crab smiled big! They played all day. Hooray!',
        '5-6':
          'The little crab’s face lit up with the biggest smile. They ' +
          'built sandcastles and chased bubbles until the sky turned pink. ' +
          'Including someone made the whole day brighter.',
      },
    },
  ],
  mission: {
    '3-4':
      'Today, find someone who is playing alone and say: "Want to play with me?"',
    '5-6':
      'Today, look with your Kind Eyes for someone who seems left out — at ' +
      'home, at school, or at the park — and invite them to join you.',
  },
  shinePrompts: {
    '3-4': [
      'Who did you include today?',
      'How did your tummy feel when you were kind?',
      'Show me your happy face!',
    ],
    '5-6': [
      'Who did you notice with your Kind Eyes today?',
      'What did you say or do to include them?',
      'How do you think they felt? How did YOU feel?',
      'When has someone included you?',
    ],
  },
};
