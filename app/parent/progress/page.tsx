'use client';

import React, { useEffect, useState } from 'react';
import { getProfiles } from '@/lib/storage';
import { getHeartLevel } from '@/lib/progress';
import { CASEL_COMPETENCIES, KIND_PRINCIPLES, WORLDS } from '@/lib/constants';
import type { ChildProfile } from '@/lib/types';
import Card from '@/components/ui/Card';

export default function ProgressPage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfiles();
    setProfiles(p);
    if (p.length > 0) setSelectedId(p[0].id);
  }, []);

  const profile = profiles.find(p => p.id === selectedId);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gleea-warm-gray/60">No profiles to show progress for.</p>
      </div>
    );
  }

  const heartLevel = getHeartLevel(profile.progress.totalXP);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-4">Progress Details</h1>

      {/* Profile selector */}
      {profiles.length > 1 && (
        <div className="flex gap-2 mb-6">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedId === p.id
                  ? 'bg-gleea-pink text-white'
                  : 'bg-white text-gleea-warm-gray shadow-soft'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Heart Level */}
      <Card className="mb-4">
        <h3 className="font-bold text-gleea-warm-gray mb-2">Heart Level</h3>
        <div className="flex items-center gap-3">
          <div className="text-3xl">💛</div>
          <div>
            <div className="text-lg font-bold text-gleea-warm-gray">
              Level {heartLevel.level}: {heartLevel.name}
            </div>
            <div className="text-sm text-gleea-warm-gray/50">
              {profile.progress.totalXP} total XP
            </div>
          </div>
        </div>
      </Card>

      {/* Mission completion by world */}
      <Card className="mb-4">
        <h3 className="font-bold text-gleea-warm-gray mb-3">World Progress</h3>
        {WORLDS.map(world => {
          const prefix = world.id.split('-').map(w => w[0]).join('');
          const completed = profile.progress.completedMissions.filter(
            id => id.startsWith(prefix)
          ).length;

          return (
            <div key={world.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gleea-warm-gray">
                {world.emoji} {world.name}
              </span>
              <span className="text-sm font-bold text-gleea-warm-gray/70">
                {completed} completed
              </span>
            </div>
          );
        })}
      </Card>

      {/* KIND Principles progress */}
      <Card className="mb-4">
        <h3 className="font-bold text-gleea-warm-gray mb-3">KIND Principles</h3>
        {KIND_PRINCIPLES.map(principle => (
          <div key={principle.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <span className="text-sm font-bold text-gleea-warm-gray">
                {principle.id === 'eyes' ? '👁️' : principle.id === 'heart' ? '💖' : '🤲'}{' '}
                {principle.name}
              </span>
              <p className="text-xs text-gleea-warm-gray/50">{principle.description}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Streak history */}
      <Card>
        <h3 className="font-bold text-gleea-warm-gray mb-2">Streaks</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-extrabold text-gleea-gold">
              {profile.streaks.currentStreak}
            </div>
            <div className="text-xs text-gleea-warm-gray/50">Current streak</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gleea-pink">
              {profile.streaks.longestStreak}
            </div>
            <div className="text-xs text-gleea-warm-gray/50">Longest streak</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
