import type { AIContext, StoryArc } from './types';

// Builds the prompts handed to Claude. This module is the concrete home of two
// PCI pillars:
//   - Contextual Training: the system + user prompts always embed the child's
//     age band and profile context so output is age-appropriate.
//   - Values-Aligned Guardrails: the system prompt bounds the AI to kindness /
//     SEL content and instructs refusal of off-topic or unsafe requests.

const BAND_GUIDANCE: Record<AIContext['ageBand'], string> = {
  '3-4':
    'The child is 3-4 years old. Use very short sentences (3-7 words). Use ' +
    'simple, concrete words. Keep it to about 4 short lines. Be warm and playful.',
  '5-6':
    'The child is 5-6 years old. Use short, clear sentences. A few descriptive ' +
    'words are welcome. Keep it to about 6 short lines. Be warm and a little richer.',
};

export function systemPrompt(): string {
  return [
    'You are an Animal Guide inside Gleea, a kindness and social-emotional ' +
      'learning (SEL) app for children ages 3 to 6.',
    '',
    'GUARDRAILS (these are absolute):',
    '- Stay strictly within gentle, age-appropriate kindness and SEL content.',
    '- Use the Kind Eyes (noticing others), Kind Heart (feelings), and Kind ' +
      'Hands (helping) scaffold.',
    '- Never include anything scary, violent, sad-without-resolution, romantic, ' +
      'commercial, or unsafe. No links, no requests for personal information.',
    '- If a request is off-topic or not about kindness/SEL for a young child, ' +
      'do not comply. Instead return one gentle sentence steering back to a ' +
      'kindness story, beginning with "Let\'s keep our story about kindness".',
    '- Address the child warmly by their first name only.',
    '- Output only the story or mission text itself. No preamble, no notes.',
  ].join('\n');
}

export function storyUserPrompt(ctx: AIContext, story: StoryArc): string {
  const baseline = story.pages
    .map((p) => p.text[ctx.ageBand])
    .join(' ');
  return [
    `You are ${ctx.guideName}. Personalize this kindness story for the child.`,
    '',
    `Child's first name: ${ctx.name}`,
    `Chosen kindness value: ${ctx.valueLabel}`,
    `Animal Guide: ${ctx.guideName}`,
    '',
    BAND_GUIDANCE[ctx.ageBand],
    '',
    'Here is the baseline story to adapt (keep its shape and gentle arc, but ' +
      `weave in ${ctx.name} and the value of "${ctx.valueLabel}"):`,
    `"${baseline}"`,
    '',
    `Write the personalized version of the story for ${ctx.name} now.`,
  ].join('\n');
}

export function missionUserPrompt(ctx: AIContext, requestText: string): string {
  return [
    `You are ${ctx.guideName}, helping a grown-up shape a real-world kindness ` +
      'mission for their child.',
    '',
    `Child's first name: ${ctx.name}`,
    `Chosen kindness value: ${ctx.valueLabel}`,
    BAND_GUIDANCE[ctx.ageBand],
    '',
    "The grown-up's idea for a mission:",
    `"${requestText}"`,
    '',
    'Turn it into ONE warm, doable, age-appropriate kindness mission sentence ' +
      `for ${ctx.name}. If the idea is not about kindness or is not safe for a ` +
      'young child, follow your refusal guardrail instead.',
  ].join('\n');
}
