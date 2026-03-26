import { nanoid } from 'nanoid';
import { AGE_BANDS } from './constants';
import type { AgeBand, GuideId } from './constants';
import type { ChildProfile } from './types';
import { hashPin, saveProfile, setActiveProfile } from './storage';
import { createDefaultProgress, createDefaultStreaks } from './progress';

export function getAgeBand(age: number): AgeBand {
  for (const band of AGE_BANDS) {
    if (age >= band.minAge && age <= band.maxAge) {
      return band.id as AgeBand;
    }
  }
  // Default: if older than 8, use bloomer; if younger than 3, use seedling
  if (age > 8) return 'bloomer';
  return 'seedling';
}

export function createProfile(
  name: string,
  age: number,
  avatarGuide: GuideId,
  pin: string
): ChildProfile {
  const profile: ChildProfile = {
    id: nanoid(10),
    name,
    age,
    ageBand: getAgeBand(age),
    avatarGuide,
    pinHash: hashPin(pin),
    createdAt: new Date().toISOString(),
    progress: createDefaultProgress(),
    streaks: createDefaultStreaks(),
    badges: [],
    guideBonds: { [avatarGuide]: 1 },
  };

  saveProfile(profile);
  setActiveProfile(profile.id);
  return profile;
}
