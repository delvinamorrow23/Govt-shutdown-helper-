# Base44 content audit & reconciliation

Source: the Base44 API reference for the live app
(`gleea-the-kindness-adventure-…base44.app`). This cloud session **cannot reach
Base44** (egress policy blocks `base44.app`), so live records must be pulled with
`scripts/export-base44.mjs` from a machine that can reach it. This doc captures
the **content model** from the API reference and reconciles it with the MVP rebuild.

## The real content model (source of truth)

**Entities.** Content: `Mission`, `Badge`. Runtime/analytics (per-child, may hold
personal data): `UserProgress`, `Reflection`, `CASELInsight`, `SELMilestone`,
`ChildBadge`, `ActivityLog`, `ParentalSettings`, `EducatorNote`, `School`,
`DistrictReport`, `User`.

**Canonical taxonomy (from schema enums):**

- **6 Animal Guides:** `bear`, `dog`, `deer`, `otter`, `skunk`, `squirrel`
  (missions may also target `all_guides` or `gleea`).
- **3 age bands:** `seedling` (3–4), `sprout` (5–6), `bloomer` (7–8).
- **5 Worlds** (+ `special`): `kindness_garden`, `friendship_forest`,
  `family_cove`, `helping_hills`, `wonder_world`.
- **CASEL competencies:** `self_awareness`, `self_management`, `social_awareness`,
  `relationship_skills`, `responsible_decision_making`, **`generosity`**.
- **Loop = READ → DO → SHINE.** `Mission` has `read_text` (READ),
  `do_instruction` (DO), `shine_prompts[]` (SHINE). No GIVE/LEAD anywhere —
  this **confirms** the three-step collapse was correct.
- **Missions:** numbered `1–41`; `deck` = `casel_v2` (**source of truth**) vs
  `legacy` (superseded, `archived: true` — exclude). Story text is **STATIC**
  authored copy using `{{CHILD_NAME}}` / `{{GUIDE_NAME}}` substitution tokens.
- **Gamification:** `xp_value`/`total_xp`, `current_streak`, `Badge` (categories
  world/heart/streak/casel/special/guide, frames, colors, earned messages).
- **Privacy/COPPA:** child nickname only (no full names); `ParentalSettings`
  carries `coppa_consent` (internal-only scope), with voice & drawing reflections
  **OFF by default** and separate opt-in required.

## Gap analysis — MVP rebuild vs. canon

| Area | Rebuild (now) | Canon (Base44) | Action |
|---|---|---|---|
| Guides | 5 invented (Joyful Otter, Calm Tortoise, Gentle Deer, Brave Fox, Wise Owl) | 6 real: bear, dog, deer, otter, skunk, squirrel | **Replace roster** with the real 6 (otter & deer overlap; tortoise/fox/owl are wrong) |
| Age bands | 2 (`3-4`, `5-6`) | 3 (`seedling`, `sprout`, `bloomer`) | Rename to Seedling/Sprout(/Bloomer); decide if 7–8 is in MVP |
| Content axis | invented "kindness values" (sharing, helping…) | **5 Worlds** × guide × CASEL | Re-model around Worlds + missions; values ≈ CASEL focus areas |
| Stories | 1 invented demo (otter & crab) | up to 41 authored missions (`casel_v2`) | Import real missions once exported; AI grounds on them |
| Personalization | live Claude generation | STATIC text + `{{CHILD_NAME}}`/`{{GUIDE_NAME}}` | Keep AI as the **new** wedge, but ground it on the real mission text |
| SHINE | emoji + reflection prompts | `shine_prompts[]` + `overall_emoji` (😊😢😐😕😍) | Matches — align emoji set |
| Garden | "grow a bloom" meta | Worlds + XP + streaks + Badges | Keep garden as MVP delight or map to Worlds/XP |
| Badges | data-model stub (deferred UI) | full `Badge` system | Matches the "deferred" plan |
| Parent view | 4 PCI pillars (framing) | `ParentalSettings` (COPPA, opt-ins, focus areas, limits, gentle mode) + educator/district | Fold real ParentalSettings fields in later |
| Educator/District | not built | `EducatorNote`, `DistrictReport`, `School` | Later B2B tier (defer) |

## What still needs the live export

The **actual authored text** — all `casel_v2` `Mission` records (`read_text`,
`do_instruction`, `shine_prompts`, world/guide/CASEL mapping) and `Badge`
definitions. Run `scripts/export-base44.mjs` (see its header) and commit
`data/base44-export/Mission.json` + `Badge.json`; I'll wire them in and align the
taxonomy above.
