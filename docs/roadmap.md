# Gleea Roadmap

This is the plan of record for how Gleea grows — especially **how AI
customization expands over time**. It reconciles two things:

- the **ambition** (from the beta kickoff): make AI-driven personalization a real
  product differentiator — the "software company, not media company" wedge; and
- the **current non-negotiable** (canonical product truth): *AI is limited to
  name personalization only; READ / DO / SHINE content is human-authored and
  CASEL-aligned, never AI-generated.*

We reconcile them by **staging** AI customization behind explicit safety and
governance gates, so each expansion is deliberate, reviewable, and never ships
child-facing AI prose without human authorship and (where relevant) parent
approval.

## Guiding principles — every phase must satisfy these

These are constant across all phases. If a phase can't satisfy them, it doesn't ship.

1. **Human-authored foundation.** The story canon (the ~41 `casel_v2` missions)
   is written and editorially owned by people. AI never silently replaces it.
2. **Co-participation.** Gleea is done together; AI never turns it into a
   "hand-the-kid-a-device" product.
3. **DO is always real-world, observable, dignity-centered action** — income- and
   housing-neutral, no purchases. AI never proposes fantasy or in-app-only tasks.
4. **CASEL alignment is mandatory** for every piece of content, human or
   AI-assisted.
5. **Parent in the loop.** Anything net-new that a child sees clears a human
   gate — the content team, the parent, or both.
6. **Data minimization / COPPA.** First name + age band + guide only; voice &
   drawing off by default; no unnecessary PII; internal-use consent scope.
7. **No dark patterns.** No leaderboards, streak-pressure, shops, or manipulation
   — AI is never used to increase engagement at the child's expense.
8. **Transparency.** Whatever the AI did is visible to the parent in the
   dashboard (Participatory Feedback).

## Part A — AI Customization Roadmap

Each phase names how AI is used, the guardrails (mapped to the PCI child-AI-safety
pillars), dependencies, and a principle check. Phases are additive.

### Phase 0 — Name personalization (SHIPPED, today)
- **AI use:** none at runtime. Authored, CASEL-aligned missions with
  `{{CHILD_NAME}}` / `{{GUIDE_NAME}}` tokens substituted **locally**
  (`lib/personalize.ts`). Fully static, no network, no data leaves the device.
- **Guardrails:** trivially compliant with all principles.
- **Status:** live in this MVP. This is the safe default the app always falls
  back to.

### Phase 1 — Server-side personalization *router* (no net-new prose)
- **Goal:** richer feel without generating story content.
- **AI use:** re-introduce a serverless proxy (the one archived at git `a8ac3f1`)
  that **selects and assembles authored content** for the child — e.g. picks the
  right authored age-band variant, orders authored sentences, chooses which
  authored encouragement line to show. The model routes among human-written
  pieces; it does **not** write new story prose.
- **Guardrails (PCI):** *Contextual Training* — age band + profile in every
  request. *Values-Aligned Guardrails* — output constrained to an allow-list of
  authored fragments; requests validated & size-limited server-side; key never
  in the client. *Participatory Feedback* — every assembly logged for parent view.
- **Dependencies:** the real `casel_v2` library imported (Base44 export); a
  serverless host (Vercel function) + `ANTHROPIC_API_KEY`.
- **Principle check:** ✅ no AI-authored child-facing prose.

### Phase 2 — AI-assisted **parent** custom-mission drafting (human-approved)
- **Goal:** help grown-ups turn an idea into a warm, age-appropriate DO mission.
- **AI use:** in the parent dashboard only, the AI drafts a custom-mission
  sentence from the parent's idea. It enters the existing **approval queue** and
  the child sees it **only after the parent approves**.
- **Guardrails (PCI):** *Workflow Embedding* — parent approval is mandatory;
  *Values-Aligned Guardrails* — bounded to real-world kindness actions, refuses
  off-topic/unsafe; *Participatory Feedback* — draft + source logged.
- **Dependencies:** Phase 1 proxy.
- **Principle check:** ✅ child-facing content still clears a human gate (the
  parent). This is the first place AI writes prose — and only via a person.

### Phase 3 — AI **authoring tool** for the content team (internal, not in-app)
- **Goal:** accelerate producing the story library (missions, variants,
  translations) at quality.
- **AI use:** an internal tool that drafts mission candidates for **human editors**
  to revise, CASEL-tag, and sign off. Output enters the canon only after
  editorial approval; nothing reaches a child un-edited.
- **Guardrails:** editorial sign-off + CASEL review are mandatory; provenance
  tracked (which drafts were AI-assisted).
- **Dependencies:** content-ops process; style + CASEL rubric.
- **Principle check:** ✅ "human-authored" preserved — AI assists authors, it
  isn't the author of record.

### Phase 4 — Bounded live story personalization (opt-in, guarded) — *requires a policy decision*
- **Goal:** the kickoff's original wedge — a story that adapts live to the child
  (name, guide, a chosen interest/context) on top of an **authored skeleton**.
- **AI use:** fill authored slots / lightly re-voice authored beats within strict
  templates — never free-form open generation.
- **Guardrails (PCI):** parent **opt-in**; start at the oldest band (Bloomer 7–8)
  before younger bands; content safety filters + refusal; full logging with
  parent flag/adjust; red-team + human spot-review before and after launch;
  instant fallback to authored text.
- **⚠️ Governance gate:** this phase **amends the current "name personalization
  only" principle**. It ships only after an explicit, documented decision by
  Delvina to change that rule, with the guardrails above signed off. Until then,
  Phase 4 stays on the roadmap, not in the product.
- **Dependencies:** Phases 1–3; a safety/eval harness; legal/COPPA review.
- **Principle check:** ⚠️ conditional — allowed only under the governance gate.

## Part B — Product Roadmap (feature milestones)

Tied to the canonical launch timeline. Kindness Cards → Q1 2026 · Books →
Holiday 2026 · App beta → Q1 2027.

| Milestone | What ships | AI phase in play |
|---|---|---|
| **App MVP beta** (this build) | READ→DO→SHINE, 6 guides, Kindness Garden, one demo mission, parent safety dashboard, localStorage | Phase 0 |
| **Content complete** | Import the ~41 `casel_v2` missions + badges from Base44; Worlds journey map; age filtering (Seedling/Sprout, then Bloomer) | Phase 0 → 1 |
| **Core** | Kindness Flower (CASEL profile), weekly preview, invisible adaptive difficulty (Gentle/Growing/Stretching), badges (6 categories) | Phase 1 |
| **Parent intelligence** | Focus areas, pace preference, life-event sensitivity, weekly summaries & certificates, multi-child; AI-assisted custom missions | Phase 2 |
| **Backend & accounts** | Move from localStorage to a real backend (e.g. Supabase) for cross-device progress and school rollups | — |
| **Community** | Global Garden collective goals, Family Adventures, celebration reactions only (no open comments) | — |
| **Engagement + audio** | Text-to-speech narration pipeline (beyond the single human-recorded demo track); seasonal events | — |
| **Educator / District** (post-seed, Phase 3 product tier) | EducatorNote, DistrictReport, School dashboards | Phase 3 |
| **Live personalization pilot** | Bounded, opt-in adaptive stories | Phase 4 (behind the governance gate) |

## How the two frameworks map to the roadmap

- **Empathy by Design (product layer):** the personalization that adapts to the
  child grows phase by phase — from name (P0) → assembly (P1) → parent-authored
  AI (P2) → live adaptation (P4). We *operationalize* Empathy by Design; we don't
  claim to have coined it.
- **PCI (child-AI-safety governance layer):** the four pillars — Contextual
  Training, Values-Aligned Guardrails, Workflow Embedding, Participatory Feedback
  — are the checklist each phase is measured against, and are surfaced in the
  parent dashboard so the safety story is visible to families and investors.

## Open decisions (for Delvina)

1. **Approve the Phase 4 governance gate?** i.e. are we willing, later and with
   guardrails, to amend "name personalization only" for a bounded, opt-in live
   personalization pilot — or does that rule stay absolute?
2. **Sequence:** do we pull Phase 2 (parent-authored AI missions) earlier as an
   investor demo, since it's human-gated and low-risk?
3. **Backend timing:** when do we move off localStorage to accounts/sync?
