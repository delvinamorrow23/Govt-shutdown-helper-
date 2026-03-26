'use client';

import React, { useEffect, useState } from 'react';
import { getProfiles, getSettings, updateSettings, deleteProfile } from '@/lib/storage';
import { AGE_BANDS } from '@/lib/constants';
import type { ChildProfile, AppSettings } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(getProfiles());
    setSettings(getSettings());
  }, []);

  function handleSettingChange(key: keyof AppSettings, value: any) {
    updateSettings({ [key]: value });
    setSettings(getSettings());
  }

  function handleDeleteProfile(id: string) {
    deleteProfile(id);
    setProfiles(getProfiles());
    setDeleteConfirm(null);
  }

  if (!settings) return null;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-4">Settings</h1>

      {/* App Settings */}
      <Card className="mb-4">
        <h3 className="font-bold text-gleea-warm-gray mb-3">App Settings</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gleea-warm-gray">Audio narration</span>
            <button
              onClick={() => handleSettingChange('audioEnabled', !settings.audioEnabled)}
              className={`w-12 h-7 rounded-full transition-all ${
                settings.audioEnabled ? 'bg-gleea-pink' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ml-1 ${
                  settings.audioEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gleea-warm-gray">Narration speed</span>
            <select
              value={settings.narrationSpeed}
              onChange={e => handleSettingChange('narrationSpeed', e.target.value)}
              className="bg-gray-50 rounded-lg px-3 py-1.5 text-sm text-gleea-warm-gray"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
            </select>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gleea-warm-gray">Haptic feedback</span>
            <button
              onClick={() => handleSettingChange('hapticFeedback', !settings.hapticFeedback)}
              className={`w-12 h-7 rounded-full transition-all ${
                settings.hapticFeedback ? 'bg-gleea-pink' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ml-1 ${
                  settings.hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </Card>

      {/* Child Profiles */}
      <Card className="mb-4">
        <h3 className="font-bold text-gleea-warm-gray mb-3">Child Profiles</h3>
        {profiles.length === 0 ? (
          <p className="text-sm text-gleea-warm-gray/50">No profiles created yet.</p>
        ) : (
          <div className="space-y-3">
            {profiles.map(profile => {
              const ageBand = AGE_BANDS.find(b => b.id === profile.ageBand);
              return (
                <div key={profile.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-bold text-gleea-warm-gray text-sm">{profile.name}</div>
                    <div className="text-xs text-gleea-warm-gray/50">
                      Age {profile.age} · {ageBand?.name} · {profile.progress.completedMissions.length} missions
                    </div>
                  </div>
                  {deleteConfirm === profile.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-xs text-red-500 font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-gleea-warm-gray/50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(profile.id)}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* About */}
      <Card>
        <h3 className="font-bold text-gleea-warm-gray mb-2">About Gleea</h3>
        <div className="text-sm text-gleea-warm-gray/60 space-y-1">
          <p>Gleea, PBC — Kindness Infrastructure for the World</p>
          <p>CASEL-aligned social-emotional learning for ages 3–12</p>
          <p className="text-xs text-gleea-warm-gray/40 mt-3">
            Generous Listening, Ethical Empathy, Action
          </p>
          <p className="text-xs text-gleea-warm-gray/40">
            Version 0.1.0 · Data stored locally on this device
          </p>
        </div>
      </Card>
    </div>
  );
}
