# Gleea — kindness stories for little hearts

Gleea is a kindness and social-emotional learning (SEL) app for children **ages
3–6** (Seedling 3–4, Sprout 5–6). It's a **co-participation** experience — a
grown-up reads aloud, the child does a real kindness — moving through the
three-step **Gleea Loop** with a friendly **Animal Guide**:

- **READ** — read a short story together with your Animal Guide.
- **DO** — a real-world, observable kindness mission (never pretend, never a tap).
- **SHINE** — reflect together (emoji), growing the child's **Kindness Garden**.

This is the investor-ready MVP beta: **no backend**, state in the browser
(localStorage), no accounts.

## Aligned to the canonical Gleea product

- **Six Animal Guides:** Brave Bear, Loyal Dog, Gentle Deer, Joyful Otter, Sweet
  Skunk, Sharing Squirrel (companions — the child is always the hero).
- **Five Worlds:** Kindness Garden → Friendship Forest → Family Cove → Helping
  Hills → Wonder World, each mapped to CASEL competencies.
- **Three age bands** in the model (Seedling / Sprout / Bloomer); the MVP UI
  exposes Seedling + Sprout.
- **Content principle (non-negotiable):** AI is limited to **name
  personalization only**. All READ/DO/SHINE content is human-authored and
  CASEL-aligned — never AI-generated. Story text carries `{{CHILD_NAME}}` /
  `{{GUIDE_NAME}}` tokens substituted **locally** (`lib/personalize.ts`).
- **Design:** twilight gradient (no stars/sparkles), gold accent (#D4AF37),
  parchment cards. No dark patterns; no "0 missions" empty state; gentle streaks.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Add the demo narration file at `public/audio/demo-story.mp3` (see
`public/audio/README.md`). No API keys or environment variables are required.

## Content: this demo vs. the real library

The MVP ships **one placeholder mission** ("The Happy Ripple", Kindness Garden,
Joyful Otter) authored for Seedling/Sprout/Bloomer. The authoritative content is
the ~41 authored `casel_v2` missions in Base44. To import the real content:

```bash
B44_KEY=<your_api_key> node scripts/export-base44.mjs
```

This writes `data/base44-export/` (read-only; never stores your key). Only
`Mission.json` + `Badge.json` are git-tracked; per-child records are ignored.
See `docs/base44-content-audit.md` for the content model and the reconciliation
plan. (Note: this project's cloud sessions cannot reach `base44.app` — run the
exporter locally.)

## Architecture

```
app/           layout · page (client shell) · globals.css   (fully static)
components/    Welcome · ProfileSetup · GleeaLoop · AudioPlayer · Garden ·
               ParentGate · ParentDashboard · Nav · ui
lib/
  types · guides · worlds · mission · personalize · storage
  archive/giveLeadArchive.ts   archived GIVE/LEAD (reversible)
public/audio/  drop-in narration slot
scripts/export-base44.mjs      read-only Base44 content exporter
```

### Deploy (Vercel)

Import the repo at vercel.com/new — Next.js is auto-detected. No env vars needed;
it deploys as a static site and the Vercel URL is your shareable live preview,
auto-redeploying on every push.

## Connect this to your own GitHub repo

To move this code into a fresh, empty repo (e.g. `your-account/GLEEA`), run these
on your machine — signed in as the account that **owns** the target repo:

```bash
git clone https://github.com/delvinamorrow23/Govt-shutdown-helper-.git gleea
cd gleea
git checkout claude/gleea-beta-rebuild-3az4I
git remote add gleea https://github.com/<your-account>/GLEEA.git
git push gleea claude/gleea-beta-rebuild-3az4I:main
```

For a clean single-commit history instead:

```bash
git checkout --orphan gleea-main
git commit -m "Gleea MVP beta"
git remote add gleea https://github.com/<your-account>/GLEEA.git
git push gleea gleea-main:main
```

## Scope

**Built now:** one complete READ→DO→SHINE arc with a real Animal Guide, narration
wiring, name personalization, the SHINE reflection, the Kindness Garden growth
moment, and the parent safety dashboard.

**Deferred (data model present, UI not built):** the full 41-mission library and
Worlds journey map, badges, community/Global Garden, educator & district
features, and a text-to-speech pipeline.

**What's next** — including how AI customization expands in staged, safety-gated
phases — is in [`docs/roadmap.md`](docs/roadmap.md). Today the app is at **AI
Phase 0** (name personalization only); richer AI personalization is planned
behind explicit governance gates.

> This is the Gleea SEL app. Not affiliated with any government service.
