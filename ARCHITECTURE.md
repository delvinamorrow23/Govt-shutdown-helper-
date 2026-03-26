# Gleea Architecture Plan

## Overview

Gleea is a React-based web application for children's kindness and social-emotional learning (SEL), ages 3–12.
**GLEEA** = Generous Listening, Ethical Empathy, Action.

This document maps the current codebase state, proposes the target architecture, and defines the build phases.

---

## 1. Current Codebase Audit

### What Exists
The repo contains a **Government Shutdown Helper** — an unrelated Next.js 14 app. No Gleea code exists.

| File | Status | Action |
|------|--------|--------|
| `page.tsx` | Shutdown helper UI (has duplicate useState bug) | **Replace** |
| `layout.tsx` | Minimal root layout | **Repurpose** |
| `resources.json` | PA/NY shutdown resources | **Remove** |
| `globals.css` | Tailwind imports + minimal styles | **Repurpose** |
| `tailwind.config.js` | YMU brand colors | **Reconfigure for Gleea** |
| `package.json` | Next.js 14, React 18, Tailwind 3 | **Update name + add deps** |
| `next.config.js` | Basic config | **Keep** |
| `tsconfig.json` | Standard TS config | **Keep** |

### Issues in Current Code
- `page.tsx:82-83` and `page.tsx:99-100`: Duplicate `useState` declarations (would crash)
- No proper Next.js `app/` directory structure (files at root level)
- No component decomposition

---

## 2. Target Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS 3 + custom design tokens
- **State**: React Context + useReducer (local-first, no backend)
- **Persistence**: localStorage (designed for future backend migration)
- **Auth**: PIN-based child profiles (parent sets PIN)
- **Animation**: Framer Motion (fairy guides, transitions, celebrations)
- **Audio**: Web Audio API / Howler.js (narration, sound effects)
- **Icons/Art**: Custom SVG components matching paper-craft storybook style

### Design System — "Enchanted Paper-Craft"
Based on the provided art assets:
- **Texture**: Paper/felt layered aesthetic, soft edges
- **Palette**: Twilight gradients (pink-lavender-blue), warm browns, forest greens, golden glows
- **Accents**: Pink on-brand, golden heart glows, floating bubbles/stars
- **Typography**: Rounded, friendly, large for early readers
- **Interactions**: Large tap targets (min 48px), gentle animations, audio-first navigation

### Color Tokens
```
gleea-pink:      #E8739A   (primary accent)
gleea-pink-light:#F5C6D8   (backgrounds)
gleea-gold:      #D4A843   (hearts, achievements)
gleea-gold-glow: #F5E6A3   (glow effects)
gleea-forest:    #3D7A4A   (nature elements)
gleea-bark:      #8B6F47   (animal guides, trees)
gleea-twilight:  #9B8EC4   (sky, magical elements)
gleea-sky:       #B8D4E8   (daytime sky)
gleea-cream:     #FFF8F0   (page backgrounds)
gleea-warm-gray: #6B5E54   (text)
```

---

## 3. Directory Structure

```
app/
├── layout.tsx                    # Root layout (Gleea branding, font loading)
├── page.tsx                      # Landing / profile select screen
├── globals.css                   # Tailwind + Gleea design tokens
│
├── (auth)/
│   ├── select-profile/page.tsx   # Child profile selector (PIN entry)
│   └── create-profile/page.tsx   # New profile setup (name, age, avatar)
│
├── (app)/                        # Authenticated app shell
│   ├── layout.tsx                # App shell (nav, fairy guide, audio provider)
│   ├── home/page.tsx             # Daily mission + journey map
│   ├── journey/
│   │   ├── page.tsx              # Gleea Loop overview (READ→DO→SHINE→GIVE→LEAD)
│   │   └── [worldId]/
│   │       ├── page.tsx          # World hub (e.g., Kindness Garden)
│   │       └── [missionId]/
│   │           ├── page.tsx      # Mission flow container
│   │           ├── read/page.tsx # READ phase: story + narration
│   │           ├── do/page.tsx   # DO phase: real-world mission prompt
│   │           └── shine/page.tsx# SHINE phase: reflection (emoji/voice/draw)
│   ├── garden/page.tsx           # Kindness Flower + garden visualization
│   ├── badges/page.tsx           # Badge/achievement collection
│   ├── guides/page.tsx           # Animal Guide profiles + bonds
│   └── mini-games/
│       ├── page.tsx              # Mini-game hub
│       └── [gameId]/page.tsx     # Individual mini-game
│
├── parent/                       # Parent dashboard (separate PIN)
│   ├── layout.tsx                # Parent UI shell
│   ├── page.tsx                  # Dashboard overview
│   ├── progress/page.tsx         # SEL milestones, mission history
│   ├── settings/page.tsx         # Profile mgmt, pace, focus areas
│   └── circle/page.tsx           # Kindness Circle management
│
components/
├── ui/                           # Base design system
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── ProgressBar.tsx
│   ├── Badge.tsx
│   └── TapTarget.tsx             # Large accessible tap targets
│
├── guides/                       # Animal Guide components
│   ├── GuideAvatar.tsx           # Renders any guide with animations
│   ├── GuideSpeechBubble.tsx     # Narration/encouragement overlay
│   ├── BraveBear.tsx
│   ├── LoyalDog.tsx
│   ├── GentleDeer.tsx
│   ├── JoyfulOtter.tsx
│   ├── SweetSkunk.tsx
│   └── SharingSquirrel.tsx
│
├── garden/                       # Garden visualization
│   ├── KindnessFlower.tsx        # CASEL petal visualization
│   ├── GardenScene.tsx           # Full garden with growing elements
│   └── GrowthAnimation.tsx       # Petal/flower growth animations
│
├── journey/                      # Journey/mission components
│   ├── GleeaLoop.tsx             # READ→DO→SHINE progress indicator
│   ├── WorldMap.tsx              # Visual world selector
│   ├── MissionCard.tsx           # Mission preview card
│   ├── StoryReader.tsx           # Story display with narration
│   ├── MissionPrompt.tsx         # DO phase UI
│   └── ReflectionPanel.tsx       # SHINE phase (emoji/voice/draw)
│
├── rewards/                      # Gamification
│   ├── StreakCounter.tsx          # Daily streak display
│   ├── XPBar.tsx                 # Heart Level progress
│   ├── BadgeUnlock.tsx           # Badge unlock celebration
│   ├── DailyReward.tsx           # Daily reward claim
│   └── CelebrationOverlay.tsx    # Confetti/sparkles/guide cheering
│
├── mini-games/                   # SEL mini-games
│   ├── EmotionMatch.tsx          # Match emotions to situations
│   ├── KindnessChain.tsx         # Chain reaction kindness puzzle
│   └── FeelingsFinder.tsx        # Identify feelings in scenarios
│
├── parent/                       # Parent dashboard components
│   ├── SELMilestoneChart.tsx
│   ├── MissionHistory.tsx
│   ├── WeeklySummary.tsx
│   └── PaceSelector.tsx
│
└── layout/                       # Shared layout
    ├── AppShell.tsx              # Bottom nav + fairy guide
    ├── BottomNav.tsx             # Mobile-first bottom navigation
    └── AudioProvider.tsx         # Audio context for narration/SFX

lib/
├── storage.ts                    # localStorage abstraction (future: API adapter)
├── profiles.ts                   # Profile CRUD with PIN verification
├── missions.ts                   # Mission state machine (READ→DO→SHINE)
├── progress.ts                   # XP, Heart Level, streak calculations
├── badges.ts                     # Badge unlock logic
├── guides.ts                     # Animal Guide data + bond tracking
├── age-bands.ts                  # Seedling/Sprout/Bloomer content filtering
└── constants.ts                  # App-wide constants

data/
├── worlds.json                   # 5 worlds with metadata
├── missions/                     # Mission content by world
│   ├── kindness-garden.json      # ~25 missions
│   ├── friendship-forest.json
│   ├── family-cove.json
│   ├── helping-hills.json
│   └── wonder-world.json
├── stories/                      # Story content (125 stories)
│   └── [storyId].json           # Per-story: text, narration cues, guide
├── guides.json                   # Animal Guide profiles
├── badges.json                   # Badge definitions + unlock criteria
└── age-bands.json               # Age-appropriate content mappings
```

---

## 4. Core Data Models

### Profile (localStorage)
```typescript
interface ChildProfile {
  id: string;
  name: string;
  age: number;
  ageBand: 'seedling' | 'sprout' | 'bloomer';
  avatarGuide: GuideId;          // chosen Animal Guide
  pin: string;                    // 4-digit PIN (hashed)
  createdAt: string;
  gardenState: GardenState;
  progress: ProgressState;
  streaks: StreakState;
  badges: string[];               // earned badge IDs
  guideBonds: Record<GuideId, number>; // bond level per guide
}
```

### Mission
```typescript
interface Mission {
  id: string;
  worldId: WorldId;
  title: string;
  guideId: GuideId;
  caselCompetency: CASELCompetency;
  ageBands: AgeBand[];            // which age bands see this
  story: StoryContent;
  doAction: DoAction;             // real-world mission
  shinePrompt: string;
  xpReward: number;
  badgeIds?: string[];            // badges this can unlock
  kindPrinciple: 'eyes' | 'heart' | 'hands';
}

type WorldId = 'kindness-garden' | 'friendship-forest' | 'family-cove'
             | 'helping-hills' | 'wonder-world';

type GuideId = 'brave-bear' | 'loyal-dog' | 'gentle-deer'
             | 'joyful-otter' | 'sweet-skunk' | 'sharing-squirrel';

type CASELCompetency = 'self-awareness' | 'self-management'
                     | 'social-awareness' | 'relationship-skills'
                     | 'responsible-decision-making';

type AgeBand = 'seedling' | 'sprout' | 'bloomer';
```

### Progress
```typescript
interface ProgressState {
  heartLevel: number;             // overall level
  totalXP: number;
  currentWorldId: WorldId;
  completedMissions: string[];    // mission IDs
  missionStates: Record<string, MissionPhase>;
  flowerPetals: Record<CASELCompetency, number>; // garden growth
}

type MissionPhase = 'locked' | 'read' | 'do' | 'shine' | 'complete';
```

### Streaks & Rewards
```typescript
interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string;     // ISO date
  dailyRewardClaimed: boolean;
  weeklyMissionsCompleted: number;
}
```

---

## 5. The Gleea Loop — Mission State Machine

```
    ┌──────────┐
    │  LOCKED   │  (prerequisites not met)
    └────┬─────┘
         │ unlock
    ┌────▼─────┐
    │   READ   │  Story + narration with Animal Guide
    └────┬─────┘
         │ story complete
    ┌────▼─────┐
    │    DO    │  Real-world kindness action (offline)
    └────┬─────┘
         │ mark done
    ┌────▼─────┐
    │  SHINE   │  Reflect: emoji + voice/drawing
    └────┬─────┘
         │ reflection submitted
    ┌────▼─────┐
    │ COMPLETE │  XP awarded, garden grows, badge check
    └──────────┘
```

Each phase transition triggers:
- Guide encouragement animation
- Sound effect
- Progress bar update
- Garden petal growth (on COMPLETE)
- Streak update (on COMPLETE)
- Badge unlock check (on COMPLETE)

---

## 6. Animal Guides — Fairy Narrators

Based on the art assets (paper-craft winged animals with glowing hearts):

| Guide | Visual | Role | Appears In |
|-------|--------|------|-----------|
| Brave Bear | Brown bear, copper wings, golden heart, forest den | Courage encouragement | Kindness Garden, Helping Hills |
| Sharing Squirrel | Red squirrel, copper wings, acorn with heart | Generosity narration | All worlds (cross-competency) |
| Loyal Dog | (to be designed) | Friendship guidance | Friendship Forest |
| Gentle Deer | (to be designed) | Empathy modeling | Friendship Forest |
| Joyful Otter | (to be designed) | Emotion recognition | Kindness Garden |
| Sweet Skunk | (to be designed) | Inclusion champion | Helping Hills |

### Guide Behavior System
- Guides appear as floating overlays with speech bubbles
- Narrate story text (audio + text)
- Encourage during DO phase ("You're being so brave!")
- Celebrate during SHINE phase
- React to streaks and badges
- Bond level increases with interaction → unlocks guide-specific animations

---

## 7. Gamification Architecture

### Heart Level System
```
XP thresholds:    Level 1: 0    → Level 2: 50
                  Level 3: 150  → Level 4: 300
                  Level 5: 500  → Level 6: 750
                  ...scaling curve
```

### Badge Categories
| Category | Examples | Trigger |
|----------|----------|---------|
| World Completion | "Garden Guardian" | Complete all missions in a world |
| Heart Level | "Growing Heart" (L5) | Reach heart level milestone |
| Kindness Streak | "7-Day Spark", "30-Day Flame", "100-Day Blaze" | Consecutive days |
| CASEL Growth | "Empathy Explorer" | 10 missions in one competency |
| Special | "First Mission", "Circle of Friends" | One-time achievements |
| Guide Bond | "Bear's Best Friend" | Max bond with a guide |

### Daily Rewards
- Login → collect daily "kindness spark"
- Sparks grow the Kindness Flower ambient glow
- 7 sparks = bonus XP
- No penalty for missing days (celebrate growth, don't guilt)

### Kindness Flower (Garden)
- 5 petals = 5 CASEL competencies
- Each petal grows as missions in that competency complete
- Visual: paper-craft flower with glowing center heart
- Ambient sparkles increase with overall progress

---

## 8. Age Band Adaptations

| Feature | Seedling (3-4) | Sprout (5-6) | Bloomer (7-8) |
|---------|---------------|--------------|---------------|
| Story length | 2-3 sentences | 4-6 sentences | 8-12 sentences |
| Text display | Audio only, large images | Large text + audio | Standard text + audio option |
| DO missions | 1-step ("Give a hug") | 2-step ("Draw + give") | Multi-step with planning |
| SHINE reflection | Emoji only (3 choices) | Emoji + simple words | Emoji + voice/drawing |
| Navigation | Parent-assisted, minimal | Semi-independent | Independent |
| Tap targets | 64px minimum | 56px minimum | 48px minimum |

---

## 9. Build Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Scaffold Next.js app directory structure
- [ ] Design system: Tailwind config with Gleea tokens
- [ ] PIN-based profile system (create, select, localStorage)
- [ ] App shell with bottom navigation
- [ ] Age band selection during profile creation

### Phase 2: Journey Core (Weeks 3-4)
- [ ] World map with 5 worlds
- [ ] Mission data structure + sample missions (5 per world)
- [ ] Gleea Loop state machine (READ → DO → SHINE)
- [ ] Story reader component with text display
- [ ] Reflection panel (emoji picker)
- [ ] XP + Heart Level system

### Phase 3: Animal Guides (Weeks 5-6)
- [ ] Guide avatar components (SVG/image-based)
- [ ] Speech bubble narration overlay
- [ ] Guide selection during profile creation
- [ ] Guide encouragement triggers at each mission phase
- [ ] Bond tracking system

### Phase 4: Garden & Rewards (Weeks 7-8)
- [ ] Kindness Flower visualization (5 CASEL petals)
- [ ] Garden scene with growing elements
- [ ] Streak counter + daily rewards
- [ ] Badge system with unlock animations
- [ ] Celebration overlays (sparkles, confetti)

### Phase 5: Parent Dashboard (Weeks 9-10)
- [ ] Parent PIN + separate dashboard entry
- [ ] Progress overview (missions, Heart Level, badges)
- [ ] CASEL competency breakdown chart
- [ ] Weekly summary view
- [ ] Settings: pace, focus areas, age band adjustment

### Phase 6: Mini-Games & Polish (Weeks 11-12)
- [ ] 2-3 SEL mini-games (Emotion Match, Kindness Chain)
- [ ] Audio narration integration
- [ ] Animation polish (Framer Motion)
- [ ] Mobile responsiveness pass
- [ ] Accessibility audit (WCAG AA, screen readers)

---

## 10. localStorage Schema

Designed for easy migration to a backend API:

```typescript
// All data under 'gleea' key
interface GleeaStorage {
  version: 1;
  parentPin: string;              // hashed
  profiles: ChildProfile[];
  activeProfileId: string | null;
  settings: {
    audioEnabled: boolean;
    narrationSpeed: 'slow' | 'normal';
    hapticFeedback: boolean;
  };
}
```

### Migration Strategy
The `lib/storage.ts` module exposes a `StorageAdapter` interface:
```typescript
interface StorageAdapter {
  getProfiles(): Promise<ChildProfile[]>;
  saveProfile(profile: ChildProfile): Promise<void>;
  getProgress(profileId: string): Promise<ProgressState>;
  saveProgress(profileId: string, progress: ProgressState): Promise<void>;
  // ... etc
}
```
Phase 1 implements `LocalStorageAdapter`. Future backend migration implements `APIStorageAdapter` — same interface, swap the provider.

---

## 11. Dependencies to Add

```json
{
  "framer-motion": "^11.x",       // animations
  "howler": "^2.2.x",            // audio playback
  "@heroicons/react": "^2.x",    // utility icons
  "zustand": "^4.x",             // lightweight state (alternative to Context)
  "nanoid": "^5.x"               // profile ID generation
}
```

---

## 12. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Zustand + localStorage | Simpler than Redux, persists naturally, easy to swap |
| Auth | PIN-based (no accounts) | Age-appropriate, no email needed, parent controls access |
| Routing | Next.js App Router | Already in stack, supports layouts well |
| Animation | Framer Motion | Best React animation library, handles gesture + layout |
| Audio | Howler.js | Cross-browser, handles sprites, good for narration |
| Art style | Paper-craft SVG + image assets | Matches existing art, performant, scalable |
| Mobile-first | Tailwind responsive | Bottom nav, large targets, portrait-optimized |
| No dark patterns | No login streaks, no FOMO | Core design principle — celebrate growth, don't guilt |

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| localStorage limits (~5-10MB) | Store only progress data, not content. Content in static JSON. |
| No audio assets yet | Build narration slots with TTS fallback, swap real audio later |
| 125 stories needed | Start with 25 sample stories (5/world), scaffold the rest |
| Art assets for 4 guides incomplete | Use placeholder SVGs matching paper-craft style |
| COPPA compliance | No PII collected, no accounts, parent PIN gate, no sharing |

---

## Next Step

Awaiting approval of this architecture before writing code. Phase 1 (Foundation) is ready to begin immediately.
