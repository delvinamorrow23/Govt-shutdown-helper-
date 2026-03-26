'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getActiveProfile } from '@/lib/storage';
import BottomNav from '@/components/layout/BottomNav';

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const profile = getActiveProfile();
    if (!profile) {
      router.push('/');
      return;
    }
    setReady(true);
  }, [router]);

  // Determine active tab from pathname
  const activeTab = pathname.includes('/journey')
    ? 'journey'
    : pathname.includes('/garden')
      ? 'garden'
      : pathname.includes('/badges')
        ? 'badges'
        : pathname.includes('/mini-games')
          ? 'games'
          : pathname.includes('/guides')
            ? 'guides'
            : 'home';

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gleea-cream pb-24">
      {children}
      <BottomNav activeTab={activeTab} />
    </div>
  );
}
