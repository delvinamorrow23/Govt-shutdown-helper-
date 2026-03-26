import { HEART_LEVELS } from './constants';
import type { ChildProfile, ProgressState, StreakState } from './types';
import { updateProfile } from './storage';

export function getHeartLevel(xp: number): typeof HEART_LEVELS[number] {
  let current = HEART_LEVELS[0];
  for (const level of HEART_LEVELS) {
    if (xp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXPToNextLevel(xp: number): { current: number; required: number; progress: number } {
  const currentLevel = getHeartLevel(xp);
  const nextLevel = HEART_LEVELS.find(l => l.level === currentLevel.level + 1);
  if (!nextLevel) return { current: xp, required: xp, progress: 1 };

  const currentLevelXP = xp - currentLevel.xpRequired;
  const requiredXP = nextLevel.xpRequired - currentLevel.xpRequired;
  return {
    current: currentLevelXP,
    required: requiredXP,
    progress: currentLevelXP / requiredXP,
  };
}

export function awardXP(profileId: string, xp: number, caselCompetency: string): void {
  updateProfile(profileId, (profile) => {
    const newXP = profile.progress.totalXP + xp;
    const newLevel = getHeartLevel(newXP);
    const petals = { ...profile.progress.flowerPetals };
    const key = caselCompetency as keyof typeof petals;
    if (key in petals) {
      petals[key] = (petals[key] || 0) + 1;
    }

    return {
      ...profile,
      progress: {
        ...profile.progress,
        totalXP: newXP,
        heartLevel: newLevel.level,
        flowerPetals: petals,
      },
    };
  });
}

export function completeMission(profileId: string, missionId: string, xp: number, caselCompetency: string): void {
  updateProfile(profileId, (profile) => {
    const newXP = profile.progress.totalXP + xp;
    const newLevel = getHeartLevel(newXP);
    const petals = { ...profile.progress.flowerPetals };
    const key = caselCompetency as keyof typeof petals;
    if (key in petals) {
      petals[key] = (petals[key] || 0) + 1;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.streaks.lastCompletionDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = profile.streaks.currentStreak;
    if (lastDate === today) {
      // Already completed today, no streak change
    } else if (lastDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    return {
      ...profile,
      progress: {
        ...profile.progress,
        totalXP: newXP,
        heartLevel: newLevel.level,
        completedMissions: [...profile.progress.completedMissions, missionId],
        missionStates: { ...profile.progress.missionStates, [missionId]: 'complete' },
        flowerPetals: petals,
      },
      streaks: {
        currentStreak: newStreak,
        longestStreak: Math.max(profile.streaks.longestStreak, newStreak),
        lastCompletionDate: today,
        dailyRewardClaimed: profile.streaks.dailyRewardClaimed,
        weeklyMissionsCompleted: profile.streaks.weeklyMissionsCompleted + 1,
      },
    };
  });
}

export function createDefaultProgress(): ProgressState {
  return {
    heartLevel: 1,
    totalXP: 0,
    currentWorldId: 'kindness-garden',
    completedMissions: [],
    missionStates: {},
    flowerPetals: {
      'self-awareness': 0,
      'self-management': 0,
      'social-awareness': 0,
      'relationship-skills': 0,
      'responsible-decision-making': 0,
    },
  };
}

export function createDefaultStreaks(): StreakState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: '',
    dailyRewardClaimed: false,
    weeklyMissionsCompleted: 0,
  };
}
