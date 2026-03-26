'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getActiveProfile } from '@/lib/storage';
import { GUIDES, CASEL_COMPETENCIES } from '@/lib/constants';
import type { ChildProfile } from '@/lib/types';
import Card from '@/components/ui/Card';
import GuideAvatar from '@/components/guides/GuideAvatar';

export default function GuidesPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  if (!profile) return null;

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-gleea-warm-gray mb-2">Animal Guides</h1>
      <p className="text-gleea-warm-gray/60 mb-6">Your kindness companions</p>

      <div className="space-y-3">
        {GUIDES.map((guide, i) => {
          const bond = profile.guideBonds[guide.id as keyof typeof profile.guideBonds] || 0;
          const isChosen = profile.avatarGuide === guide.id;
          const casel = CASEL_COMPETENCIES.find(c => c.id === guide.casel);

          return (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className={`flex items-center gap-4 ${isChosen ? 'ring-2 ring-gleea-gold shadow-glow' : ''}`}>
                <GuideAvatar guideId={guide.id} size="lg" animated={isChosen} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gleea-warm-gray">{guide.name}</span>
                    {isChosen && (
                      <span className="text-xs bg-gleea-gold-glow text-gleea-gold px-2 py-0.5 rounded-full font-bold">
                        Your Guide
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gleea-warm-gray/60 mt-0.5">{guide.trait}</div>
                  {casel && (
                    <div className="text-xs mt-1" style={{ color: casel.color }}>
                      {casel.name}
                    </div>
                  )}

                  {/* Bond meter */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-xs text-gleea-warm-gray/40">Bond:</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full ${
                            level <= bond ? 'bg-gleea-gold' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
