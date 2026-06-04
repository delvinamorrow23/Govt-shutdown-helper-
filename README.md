# Gleea — kindness stories for little hearts

Gleea is a kindness and social-emotional learning (SEL) app for children **ages
3 to 6**. A child picks an **Animal Guide**, and together they move through the
three-step **Gleea Loop**:

- **READ** — experience a story with the Animal Guide (personalized live by AI,
  with human-recorded narration).
- **DO** — a real-world kindness mission.
- **SHINE** — the family reflects together. SHINE is reflection, not action, and
  it grows the child's **kindness garden**.

This repo is the investor-ready MVP beta. It has **no backend dependency**:
state lives in the browser (localStorage) and AI runs through a small serverless
proxy that holds the API key.

## Quick start

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY (optional for the demo)
npm run dev                  # http://localhost:3000
```

The app works **with or without** an API key. Without one, the READ step uses a
local, age-appropriate fallback story so the demo never dead-ends; with one, the
Animal Guide personalizes the story live.

Add the demo narration file at `public/audio/demo-story.mp3` (see
`public/audio/README.md`).

## How the two frameworks map onto the build

**Empathy by Design — the product layer (personalization).** The Animal Guide
adapts the story and prompts to the individual child using their **name**, **age
band (3–4 vs 5–6)**, and **chosen kindness value**. This is the adaptive,
interactive wedge — implemented in `lib/api.ts`, `lib/prompt.ts`, and the
`/api/generate-story` proxy. (We *advance / operationalize* Empathy by Design.)

**PCI — the child-AI-safety governance layer**, surfaced in the **Parent
Dashboard** (`components/ParentDashboard.tsx`):

| PCI pillar | In the app |
|---|---|
| Contextual Training | The AI prompt always includes the age band + profile context (shown verbatim in the dashboard). |
| Values-Aligned Guardrails | The child-facing AI is bounded to kindness/SEL, refuses off-topic/unsafe prompts, and collects only a first name + age band + value. |
| Workflow Embedding | The AI assists but doesn't replace the parent — custom missions require parent approval before a child sees them. |
| Participatory Feedback | The dashboard logs every generation (Claude vs fallback) with the child's emoji feedback; the parent can flag and annotate. |

## Architecture

- **Frontend:** Next.js 14 (App Router) + React + Tailwind + framer-motion.
- **Persistence (MVP):** client-side `localStorage`, versioned (`lib/storage.ts`).
  No auth. (Supabase + cross-device sync is deferred.)
- **AI:** a Next.js Route Handler at `app/api/generate-story/route.ts` is the
  serverless proxy. It reads `ANTHROPIC_API_KEY` server-side, validates and
  size-limits requests, calls the Anthropic Messages API
  (`@anthropic-ai/sdk`), and returns only the generated text.

```
app/
  layout.tsx · page.tsx (client shell) · globals.css
  api/generate-story/route.ts        serverless proxy → Claude
components/   Welcome · ProfileSetup · GleeaLoop · AudioPlayer · Garden ·
              ParentGate · ParentDashboard · Nav · Starfield · ui
lib/
  types · guides · values · story · prompt · storage · api
  archive/giveLeadArchive.ts         archived GIVE/LEAD (reversible)
public/audio/                        drop-in narration slot
```

### Deploy (Vercel)

Import the repo at vercel.com/new (Next.js is auto-detected). Add
`ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) as environment variables.
The proxy runs as a serverless function; the key is never shipped to the client.

## Scope

**Built now:** one complete READ→DO→SHINE arc (Joyful Otter) with live
personalization, narration wiring, the SHINE family-reflection moment, the
garden growth moment, and the parent safety dashboard.

**Deferred (data model present, UI not built):** badges, collectibles, the
global kindness map, mini-games, the full story library, the archived GIVE/LEAD
tier, and a text-to-speech pipeline.

> Not affiliated with any government service. This is the Gleea SEL app.
