import type { AIContext, ChildProfile } from './types';
import { getGuide } from './guides';
import { getValue } from './values';
import { DEMO_STORY } from './story';

// Client-side helper that talks to the serverless proxy at /api/generate-story.
// The API key lives only on the server; this file never sees it.
//
// Crucially, if the proxy is unavailable (no API key configured, offline, or a
// transient error) we fall back to a locally-personalized version of the story
// so the demo never dead-ends. The returned `source` tells the UI and the
// parent dashboard whether the text came from Claude or the fallback.

export interface GenerationResult {
  text: string;
  source: 'claude' | 'fallback';
}

export function buildContext(profile: ChildProfile): AIContext {
  const guide = getGuide(profile.guideId);
  const value = getValue(profile.valueId);
  return {
    name: profile.name.trim() || 'friend',
    ageBand: profile.ageBand,
    valueId: value.id,
    valueLabel: value.label,
    guideId: guide.id,
    guideName: guide.name,
    competency: guide.competency,
  };
}

async function callProxy(payload: Record<string, unknown>): Promise<string | null> {
  try {
    const res = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: string };
    return typeof data.text === 'string' && data.text.trim() ? data.text.trim() : null;
  } catch {
    return null;
  }
}

export async function generateStory(ctx: AIContext): Promise<GenerationResult> {
  const text = await callProxy({ type: 'story', ...ctx });
  if (text) return { text, source: 'claude' };
  return { text: fallbackStory(ctx), source: 'fallback' };
}

export async function generateMission(
  ctx: AIContext,
  requestText: string,
): Promise<GenerationResult> {
  const text = await callProxy({ type: 'mission', requestText, ...ctx });
  if (text) return { text, source: 'claude' };
  return { text: fallbackMission(ctx, requestText), source: 'fallback' };
}

// Deterministic local personalization used when the proxy is unavailable.
export function fallbackStory(ctx: AIContext): string {
  const pages = DEMO_STORY.pages.map((p) => p.text[ctx.ageBand]);
  const opener =
    ctx.ageBand === '3-4'
      ? `${ctx.name}, here is a story about ${ctx.valueLabel.toLowerCase()}.`
      : `${ctx.name}, here is a story about ${ctx.valueLabel.toLowerCase()} with ${ctx.guideName}.`;
  const closer =
    ctx.ageBand === '3-4'
      ? `You can be kind too, ${ctx.name}!`
      : `Just like ${ctx.guideName}, you can show ${ctx.valueLabel.toLowerCase()} today, ${ctx.name}.`;
  return [opener, ...pages, closer].join(' ');
}

export function fallbackMission(ctx: AIContext, requestText: string): string {
  const idea = requestText.trim().replace(/\.$/, '');
  return `${ctx.name}, today’s kindness mission: ${idea}. ${ctx.guideName} will be cheering you on!`;
}
