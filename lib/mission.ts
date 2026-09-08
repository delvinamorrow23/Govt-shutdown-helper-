import type { Mission } from './types';
import { DEFAULT_GUIDE_ID } from './guides';

// The single demo mission for the MVP, mirroring the Base44 `Mission` shape.
// Story text is STATIC and tokenized ({{CHILD_NAME}} / {{GUIDE_NAME}}); the DO
// step is a real-world, observable action (never pretend, never an in-app tap).
//
// PLACEHOLDER TEXT: the authoritative copy is the ~41 authored `casel_v2`
// missions in Base44. Run scripts/export-base44.mjs and drop Mission.json in to
// replace this. World = Kindness Garden, Guide = Joyful Otter (Self-Awareness).
export const DEMO_MISSION: Mission = {
  id: 'kg-otter-happy-ripple',
  missionNumber: 1,
  title: 'The Happy Ripple',
  worldId: 'kindness_garden',
  guideId: DEFAULT_GUIDE_ID,
  casel: 'self_awareness',
  agePrimary: 'seedling',
  xpValue: 10,
  audioSrc: '/audio/demo-story.mp3',
  deck: 'casel_v2',
  archived: false,
  ttsEnabled: false,
  // Guide-neutral & fully tokenized so any chosen guide reads consistently.
  // (The real casel_v2 missions are authored per specific guide; when they're
  // imported, {{GUIDE_NAME}} resolves to that mission's own guide.)
  read: {
    seedling:
      "{{CHILD_NAME}}, today {{GUIDE_NAME}} felt a warm, happy feeling inside. " +
      "“When I feel happy, I like to share it!” said {{GUIDE_NAME}}. " +
      "Happy feelings grow when we share them.",
    sprout:
      "{{CHILD_NAME}}, {{GUIDE_NAME}} noticed a warm, happy glow inside. " +
      "“Feelings are like ripples,” said {{GUIDE_NAME}}. “When I notice a happy " +
      "feeling and share it, it spreads to everyone around me.” Then {{GUIDE_NAME}} " +
      "gave a big, warm hello to a friend — and the friend’s whole face lit up.",
    bloomer:
      "{{CHILD_NAME}}, {{GUIDE_NAME}} noticed a warm, happy glow inside. " +
      "“Feelings are like ripples,” {{GUIDE_NAME}} said. “The first ripple is " +
      "noticing how I feel. The next is choosing to share it — and then it spreads " +
      "to everyone around me.”",
  },
  doInstruction: {
    seedling: 'Give someone in your home a big smile or a warm hello. Watch their face!',
    sprout:
      'Find someone today and share a happy feeling with them — a warm hello, a real ' +
      'smile, or a kind word. Notice what happens.',
    bloomer:
      'Notice a happy feeling in yourself today, then share it on purpose — a kind word, ' +
      'a compliment, or a helping hand — and watch the ripple it makes.',
  },
  shinePrompts: {
    seedling: [
      'How did your tummy feel when you smiled?',
      'Did they smile back?',
      'Show me your happy face!',
    ],
    sprout: [
      'What happy feeling did you notice inside you today?',
      'Who did you share it with, and what did you do?',
      'How do you think they felt? How did you feel?',
    ],
    bloomer: [
      'What feeling did you notice, and where did you feel it in your body?',
      'How did you choose to share it?',
      'What ripple did it make for the other person — and for you?',
    ],
  },
};
