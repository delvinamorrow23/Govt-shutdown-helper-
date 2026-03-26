import { STORAGE_KEY } from './constants';
import type { GleeaStorage, ChildProfile, AppSettings } from './types';

const DEFAULT_STORAGE: GleeaStorage = {
  version: 1,
  parentPinHash: '',
  profiles: [],
  activeProfileId: null,
  settings: {
    audioEnabled: true,
    narrationSpeed: 'normal',
    hapticFeedback: true,
  },
};

// Simple hash for PINs (not cryptographic — local-only security)
export function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function getStorage(): GleeaStorage {
  if (typeof window === 'undefined') return DEFAULT_STORAGE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE;
    return JSON.parse(raw) as GleeaStorage;
  } catch {
    return DEFAULT_STORAGE;
  }
}

function setStorage(data: GleeaStorage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Profiles ──────────────────────────────────────────────

export function getProfiles(): ChildProfile[] {
  return getStorage().profiles;
}

export function getActiveProfile(): ChildProfile | null {
  const storage = getStorage();
  if (!storage.activeProfileId) return null;
  return storage.profiles.find(p => p.id === storage.activeProfileId) ?? null;
}

export function setActiveProfile(profileId: string | null): void {
  const storage = getStorage();
  storage.activeProfileId = profileId;
  setStorage(storage);
}

export function saveProfile(profile: ChildProfile): void {
  const storage = getStorage();
  const index = storage.profiles.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    storage.profiles[index] = profile;
  } else {
    storage.profiles.push(profile);
  }
  setStorage(storage);
}

export function deleteProfile(profileId: string): void {
  const storage = getStorage();
  storage.profiles = storage.profiles.filter(p => p.id !== profileId);
  if (storage.activeProfileId === profileId) {
    storage.activeProfileId = null;
  }
  setStorage(storage);
}

// ── PIN Verification ──────────────────────────────────────

export function verifyPin(profileId: string, pin: string): boolean {
  const profile = getProfiles().find(p => p.id === profileId);
  if (!profile) return false;
  return profile.pinHash === hashPin(pin);
}

export function setParentPin(pin: string): void {
  const storage = getStorage();
  storage.parentPinHash = hashPin(pin);
  setStorage(storage);
}

export function verifyParentPin(pin: string): boolean {
  const storage = getStorage();
  if (!storage.parentPinHash) return true; // No PIN set yet
  return storage.parentPinHash === hashPin(pin);
}

export function hasParentPin(): boolean {
  return !!getStorage().parentPinHash;
}

// ── Settings ──────────────────────────────────────────────

export function getSettings(): AppSettings {
  return getStorage().settings;
}

export function updateSettings(updates: Partial<AppSettings>): void {
  const storage = getStorage();
  storage.settings = { ...storage.settings, ...updates };
  setStorage(storage);
}

// ── Progress helpers ──────────────────────────────────────

export function updateProfile(profileId: string, updater: (profile: ChildProfile) => ChildProfile): void {
  const storage = getStorage();
  const index = storage.profiles.findIndex(p => p.id === profileId);
  if (index < 0) return;
  storage.profiles[index] = updater(storage.profiles[index]);
  setStorage(storage);
}
