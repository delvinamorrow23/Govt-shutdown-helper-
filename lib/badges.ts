import type { ChildProfile } from './types';
import { updateProfile } from './storage';

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  category: 'world' | 'heart-level' | 'streak' | 'casel' | 'special' | 'guide-bond';
  description: string;
}

export const ALL_BADGES: BadgeDef[] = [
  // Special
  { id: 'first-mission', name: 'First Step', icon: '🌱', category: 'special', description: 'Complete your first mission' },
  { id: 'five-missions', name: 'High Five', icon: '🖐️', category: 'special', description: 'Complete 5 missions' },
  { id: 'ten-missions', name: 'Kindness Streak', icon: '💫', category: 'special', description: 'Complete 10 missions' },
  { id: 'kind-eyes', name: 'Kind Eyes Master', icon: '👁️', category: 'special', description: 'Complete 10 Kind Eyes missions' },
  { id: 'kind-heart', name: 'Kind Heart Master', icon: '💖', category: 'special', description: 'Complete 10 Kind Heart missions' },
  { id: 'kind-hands', name: 'Kind Hands Master', icon: '🤲', category: 'special', description: 'Complete 10 Kind Hands missions' },

  // Streaks
  { id: 'streak-3', name: '3-Day Glow', icon: '✨', category: 'streak', description: '3-day streak' },
  { id: 'streak-7', name: '7-Day Spark', icon: '🔥', category: 'streak', description: '7-day streak' },
  { id: 'streak-30', name: '30-Day Flame', icon: '🔥', category: 'streak', description: '30-day streak' },
  { id: 'streak-100', name: '100-Day Blaze', icon: '🌟', category: 'streak', description: '100-day streak' },

  // Heart levels
  { id: 'heart-3', name: 'Growing Kindness', icon: '💛', category: 'heart-level', description: 'Reach Heart Level 3' },
  { id: 'heart-5', name: 'Shining Star', icon: '⭐', category: 'heart-level', description: 'Reach Heart Level 5' },
  { id: 'heart-7', name: 'Heart of Gold', icon: '🏆', category: 'heart-level', description: 'Reach Heart Level 7' },
  { id: 'heart-10', name: 'Gleea Guardian', icon: '👑', category: 'heart-level', description: 'Reach Heart Level 10' },

  // World completion
  { id: 'kg-complete', name: 'Garden Guardian', icon: '🌻', category: 'world', description: 'Complete all Kindness Garden missions' },
  { id: 'ff-complete', name: 'Forest Friend', icon: '🌳', category: 'world', description: 'Complete all Friendship Forest missions' },
  { id: 'fc-complete', name: 'Cove Keeper', icon: '🏠', category: 'world', description: 'Complete all Family Cove missions' },
  { id: 'hh-complete', name: 'Hill Hero', icon: '⛰️', category: 'world', description: 'Complete all Helping Hills missions' },
  { id: 'ww-complete', name: 'Wonder Worker', icon: '✨', category: 'world', description: 'Complete all Wonder World missions' },

  // CASEL competencies
  { id: 'sa-5', name: 'Self-Aware Star', icon: '🪞', category: 'casel', description: '5 Self-Awareness missions' },
  { id: 'sm-5', name: 'Self-Manager', icon: '🎯', category: 'casel', description: '5 Self-Management missions' },
  { id: 'soc-5', name: 'Empathy Explorer', icon: '💝', category: 'casel', description: '5 Social Awareness missions' },
  { id: 'rs-5', name: 'Friendship Builder', icon: '🤝', category: 'casel', description: '5 Relationship Skills missions' },
  { id: 'rdm-5', name: 'Wise Chooser', icon: '🧭', category: 'casel', description: '5 Responsible Decision-Making missions' },

  // Guide bonds
  { id: 'bear-bond', name: "Bear's Best Friend", icon: '🐻', category: 'guide-bond', description: 'Max bond with Brave Bear' },
  { id: 'dog-bond', name: "Dog's Best Friend", icon: '🐕', category: 'guide-bond', description: 'Max bond with Loyal Dog' },
  { id: 'deer-bond', name: "Deer's Best Friend", icon: '🦌', category: 'guide-bond', description: 'Max bond with Gentle Deer' },
  { id: 'otter-bond', name: "Otter's Best Friend", icon: '🦦', category: 'guide-bond', description: 'Max bond with Joyful Otter' },
  { id: 'skunk-bond', name: "Skunk's Best Friend", icon: '🦨', category: 'guide-bond', description: 'Max bond with Sweet Skunk' },
  { id: 'squirrel-bond', name: "Squirrel's Pal", icon: '🐿️', category: 'guide-bond', description: 'Max bond with Sharing Squirrel' },
];

// World-to-mission-prefix mapping
const WORLD_PREFIXES: Record<string, string> = {
  'kindness-garden': 'kg-',
  'friendship-forest': 'ff-',
  'family-cove': 'fc-',
  'helping-hills': 'hh-',
  'wonder-world': 'ww-',
};

const WORLD_MISSION_COUNTS: Record<string, number> = {
  'kindness-garden': 5,
  'friendship-forest': 5,
  'family-cove': 5,
  'helping-hills': 5,
  'wonder-world': 5,
};

// CASEL competency to badge prefix
const CASEL_BADGE_MAP: Record<string, string> = {
  'self-awareness': 'sa-5',
  'self-management': 'sm-5',
  'social-awareness': 'soc-5',
  'relationship-skills': 'rs-5',
  'responsible-decision-making': 'rdm-5',
};

/**
 * Check all badge criteria against profile and return any newly earned badges.
 * Also writes them to storage.
 */
export function checkBadges(
  profile: ChildProfile,
  missionMeta?: { caselCompetency: string; guideId: string; kindPrinciple: string; worldId: string }
): BadgeDef[] {
  const earned = new Set(profile.badges);
  const newBadges: BadgeDef[] = [];

  function award(badgeId: string) {
    if (!earned.has(badgeId)) {
      const badge = ALL_BADGES.find(b => b.id === badgeId);
      if (badge) {
        newBadges.push(badge);
        earned.add(badgeId);
      }
    }
  }

  const completed = profile.progress.completedMissions;
  const count = completed.length;

  // Mission count badges
  if (count >= 1) award('first-mission');
  if (count >= 5) award('five-missions');
  if (count >= 10) award('ten-missions');

  // Streak badges
  const streak = profile.streaks.currentStreak;
  if (streak >= 3) award('streak-3');
  if (streak >= 7) award('streak-7');
  if (streak >= 30) award('streak-30');
  if (streak >= 100) award('streak-100');

  // Heart level badges
  const level = profile.progress.heartLevel;
  if (level >= 3) award('heart-3');
  if (level >= 5) award('heart-5');
  if (level >= 7) award('heart-7');
  if (level >= 10) award('heart-10');

  // World completion badges
  for (const [world, prefix] of Object.entries(WORLD_PREFIXES)) {
    const worldComplete = completed.filter(id => id.startsWith(prefix)).length;
    const totalInWorld = WORLD_MISSION_COUNTS[world] || 5;
    if (worldComplete >= totalInWorld) {
      award(`${prefix.replace('-', '')}complete`);
    }
  }

  // CASEL competency badges (based on petal count)
  for (const [comp, badgeId] of Object.entries(CASEL_BADGE_MAP)) {
    const petalCount = profile.progress.flowerPetals[comp as keyof typeof profile.progress.flowerPetals] || 0;
    if (petalCount >= 5) award(badgeId);
  }

  // Guide bond badges
  for (const [guideId, bond] of Object.entries(profile.guideBonds)) {
    if ((bond || 0) >= 5) {
      const bondBadgeId = `${guideId.split('-')[1] || guideId}-bond`;
      award(bondBadgeId);
    }
  }

  // Write new badges to profile
  if (newBadges.length > 0) {
    updateProfile(profile.id, (p) => ({
      ...p,
      badges: [...p.badges, ...newBadges.map(b => b.id)],
    }));
  }

  return newBadges;
}
