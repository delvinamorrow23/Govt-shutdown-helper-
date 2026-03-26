'use client';

import React, { useEffect, useState } from 'react';
import { getProfiles } from '@/lib/storage';
import { getHeartLevel } from '@/lib/progress';
import { GUIDES, CASEL_COMPETENCIES, AGE_BANDS } from '@/lib/constants';
import type { ChildProfile } from '@/lib/types';
import Card from '@/components/ui/Card';
import GuideAvatar from '@/components/guides/GuideAvatar';

export default function ParentDashboard() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
        <h2 className="text-xl font-bold text-gleea-warm-gray mb-2">No profiles yet</h2>
        <p className="text-gleea-warm-gray/60">Create a child profile from the home screen to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">Parent Dashboard</h1>
      <p className="text-gleea-warm-gray/60 mb-6">Track your children&apos;s kindness journey</p>

      {profiles.map(profile => {
        const heartLevel = getHeartLevel(profile.progress.totalXP);
        const guide = GUIDES.find(g => g.id === profile.avatarGuide);
        const ageBand = AGE_BANDS.find(b => b.id === profile.ageBand);
        const totalPetals = Object.values(profile.progress.flowerPetals).reduce((a, b) => a + b, 0);

        return (
          <Card key={profile.id} className="mb-6">
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <GuideAvatar guideId={profile.avatarGuide} size="md" />
              <div>
                <h3 className="font-bold text-gleea-warm-gray text-lg">{profile.name}</h3>
                <div className="text-sm text-gleea-warm-gray/60">
                  Age {profile.age} · {ageBand?.name} · {heartLevel.name}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="text-xl font-extrabold text-gleea-pink">
                  {profile.progress.completedMissions.length}
                </div>
                <div className="text-xs text-gleea-warm-gray/50">Missions</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-gleea-gold">
                  {profile.progress.totalXP}
                </div>
                <div className="text-xs text-gleea-warm-gray/50">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-gleea-forest">
                  {profile.streaks.currentStreak}
                </div>
                <div className="text-xs text-gleea-warm-gray/50">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-gleea-twilight">
                  {profile.badges.length}
                </div>
                <div className="text-xs text-gleea-warm-gray/50">Badges</div>
              </div>
            </div>

            {/* CASEL breakdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gleea-warm-gray/70">SEL Growth</h4>
              {CASEL_COMPETENCIES.map(comp => {
                const value = profile.progress.flowerPetals[comp.id as keyof typeof profile.progress.flowerPetals] || 0;
                return (
                  <div key={comp.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                    <span className="text-xs text-gleea-warm-gray/60 flex-1">{comp.name}</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: comp.color,
                          width: `${Math.min((value / 10) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gleea-warm-gray/40 w-6 text-right">{value}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent activity */}
            {profile.streaks.lastCompletionDate && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gleea-warm-gray/40">
                Last active: {new Date(profile.streaks.lastCompletionDate).toLocaleDateString()}
                {' · '}Longest streak: {profile.streaks.longestStreak} days
              </div>
            )}
          </Card>
        );
      })}

      {/* Gleea Loop explanation for parents */}
      <Card className="bg-gleea-pink-soft">
        <h3 className="font-bold text-gleea-warm-gray mb-2">About the Gleea Loop</h3>
        <p className="text-sm text-gleea-warm-gray/70 mb-3">
          Each mission follows three phases designed to build social-emotional skills:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-gleea-sky text-white rounded-full px-2 py-0.5 text-xs font-bold">READ</span>
            <span className="text-gleea-warm-gray/70">Story builds understanding of a kindness concept</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gleea-forest text-white rounded-full px-2 py-0.5 text-xs font-bold">DO</span>
            <span className="text-gleea-warm-gray/70">Real-world kindness action (offline, no purchases needed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gleea-gold text-white rounded-full px-2 py-0.5 text-xs font-bold">SHINE</span>
            <span className="text-gleea-warm-gray/70">Reflection builds emotional vocabulary and metacognition</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
