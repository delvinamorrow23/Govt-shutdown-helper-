import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt, storyUserPrompt, missionUserPrompt } from '../../../lib/prompt';
import { DEMO_STORY } from '../../../lib/story';
import type { AIContext } from '../../../lib/types';

// Serverless proxy for the child-facing AI. This runs on the server (Vercel /
// Node runtime), reads the Anthropic API key from an environment variable, and
// never exposes it to the browser. It accepts the child's context + a story or
// mission request, calls Claude server-side, and returns ONLY the generated
// text. Malformed or oversized requests are rejected.
//
// SDK usage verified against platform.claude.com (Client SDKs / Quickstart):
//   import Anthropic from '@anthropic-ai/sdk'
//   const client = new Anthropic()                       // reads ANTHROPIC_API_KEY
//   await client.messages.create({ model, max_tokens, system, messages })
//   text lives in response.content[] blocks where block.type === 'text'.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';
const MAX_BODY_BYTES = 4_000; // reject oversized payloads
const MAX_NAME = 40;
const MAX_REQUEST_TEXT = 300;
const AGE_BANDS = new Set(['3-4', '5-6']);

type Payload = AIContext & { type: 'story' | 'mission'; requestText?: string };

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function validate(raw: unknown): { data: Payload | null; error: string } {
  const fail = (error: string) => ({ data: null, error });
  if (typeof raw !== 'object' || raw === null) return fail('Invalid body');
  const b = raw as Record<string, unknown>;

  const type = b.type;
  if (type !== 'story' && type !== 'mission') return fail('Invalid type');

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name || name.length > MAX_NAME) return fail('Invalid name');

  if (typeof b.ageBand !== 'string' || !AGE_BANDS.has(b.ageBand)) {
    return fail('Invalid ageBand');
  }

  const strFields = ['valueId', 'valueLabel', 'guideId', 'guideName', 'competency'] as const;
  for (const f of strFields) {
    if (typeof b[f] !== 'string' || (b[f] as string).length > 80) {
      return fail(`Invalid ${f}`);
    }
  }

  let requestText: string | undefined;
  if (type === 'mission') {
    requestText = typeof b.requestText === 'string' ? b.requestText.trim() : '';
    if (!requestText || requestText.length > MAX_REQUEST_TEXT) {
      return fail('Invalid requestText');
    }
  }

  return {
    error: '',
    data: {
      type,
      name,
      ageBand: b.ageBand as AIContext['ageBand'],
      valueId: b.valueId as string,
      valueLabel: b.valueLabel as string,
      guideId: b.guideId as string,
      guideName: b.guideName as string,
      competency: b.competency as AIContext['competency'],
      requestText,
    },
  };
}

export async function POST(req: Request) {
  // Reject oversized payloads up front when the length is advertised.
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > MAX_BODY_BYTES) return bad('Request too large', 413);

  const rawText = await req.text();
  if (rawText.length > MAX_BODY_BYTES) return bad('Request too large', 413);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return bad('Malformed JSON');
  }

  const { data, error } = validate(parsed);
  if (!data) return bad(error);

  // No key configured: tell the client so it can use its local fallback.
  // (502 keeps it out of the "client error" bucket; the client treats any
  // non-OK response as "fall back".)
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'AI not configured', fallback: true }, { status: 503 });
  }

  const ctx: AIContext = {
    name: data.name,
    ageBand: data.ageBand,
    valueId: data.valueId,
    valueLabel: data.valueLabel,
    guideId: data.guideId,
    guideName: data.guideName,
    competency: data.competency,
  };

  const user =
    data.type === 'story'
      ? storyUserPrompt(ctx, DEMO_STORY)
      : missionUserPrompt(ctx, data.requestText as string);

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: systemPrompt(),
      messages: [{ role: 'user', content: user }],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    if (!text) return bad('Empty generation', 502);
    return Response.json({ text, source: 'claude' });
  } catch {
    // Surface a generic failure; the client falls back locally.
    return bad('Generation failed', 502);
  }
}
