'use client';

import Link from 'next/link';

interface BottomNavProps {
  activeTab: string;
}

const tabs = [
  {
    id: 'home',
    label: 'Home',
    path: '/child/home',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'journey',
    label: 'Journey',
    path: '/child/journey',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    id: 'garden',
    label: 'Garden',
    path: '/child/garden',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c0 0 0-4 0-10" />
        <path d="M12 12C12 12 8 8 5 8c-2 0-3 2-3 4s2 4 5 4" />
        <path d="M12 12c0 0 4-4 7-4 2 0 3 2 3 4s-2 4-5 4" />
        <path d="M12 6c0-2-1-4-3-4S6 3 7 5s3 3 5 3" />
        <path d="M12 6c0-2 1-4 3-4s3 1 2 3-3 3-5 3" />
      </svg>
    ),
  },
  {
    id: 'badges',
    label: 'Badges',
    path: '/child/badges',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'guides',
    label: 'Guides',
    path: '/child/guides',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="4" r="2" />
        <path d="M8 8c0 0 1.5-2 3-2s3 2 3 2" />
        <path d="M6 12c-1 1-2 3-2 5 0 3 3 5 7 5s7-2 7-5c0-2-1-4-2-5" />
        <path d="M9 16c0 0 1 1 2 1s2-1 2-1" />
        <circle cx="9" cy="13" r="0.5" fill="currentColor" />
        <circle cx="13" cy="13" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gleea-cream shadow-paper z-50 pb-safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.path}
              className={`
                flex flex-col items-center justify-center
                min-w-[56px] min-h-[48px] px-2 py-1
                rounded-xl transition-colors duration-200
                ${isActive ? 'text-gleea-pink' : 'text-gleea-charcoal/40 hover:text-gleea-charcoal/60'}
              `.trim()}
            >
              <div className={isActive ? 'scale-110 transition-transform' : 'transition-transform'}>
                {tab.icon}
              </div>
              <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-gleea-pink' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
