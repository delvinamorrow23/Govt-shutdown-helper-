import type { AgeBand, CASELCompetency, GuideId, WorldId } from './constants';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  ageBand: AgeBand;
  avatarGuide: GuideId;
  pinHash: string;
  createdAt: string;
  progress: ProgressState;
  streaks: StreakState;
  badges: string[];
  guideBonds: Partial<Record<GuideId, number>>;
}

export interface ProgressState {
  heartLevel: number;
  totalXP: number;
  currentWorldId: WorldId;
  completedMissions: string[];
  missionStates: Record<string, MissionPhase>;
  flowerPetals: Record<CASELCompetency, number>;
}

export type MissionPhase = 'locked' | 'available' | 'read' | 'do' | 'shine' | 'complete';

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string;
  dailyRewardClaimed: boolean;
  weeklyMissionsCompleted: number;
}

export interface Mission {
  id: string;
  worldId: WorldId;
  title: string;
  guideId: GuideId;
  caselCompetency: CASELCompetency;
  ageBands: AgeBand[];
  kindPrinciple: 'eyes' | 'heart' | 'hands';
  xpReward: number;
  story: StoryContent;
  doAction: DoAction;
  shinePrompt: string;
  order: number;
}

export interface StoryContent {
  title: string;
  pages: StoryPage[];
}

export interface StoryPage {
  text: string;
  narratorLine?: string;
}

export interface DoAction {
  instruction: string;
  steps: string[];
  seedlingSimplified?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'world' | 'heart-level' | 'streak' | 'casel' | 'special' | 'guide-bond';
  icon: string;
  unlockCriteria: string;
}

export interface GleeaStorage {
  version: number;
  parentPinHash: string;
  profiles: ChildProfile[];
  activeProfileId: string | null;
  settings: AppSettings;
}

export interface AppSettings {
  audioEnabled: boolean;
  narrationSpeed: 'slow' | 'normal';
  hapticFeedback: boolean;
}
