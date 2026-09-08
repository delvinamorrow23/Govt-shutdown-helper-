import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Gleea — Kindness stories for little hearts',
  description:
    'Gleea is a kindness and social-emotional learning app for children ages 3 to 6. ' +
    'Read a story with your Animal Guide, do a kindness mission, and shine together as a family.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export const viewport: Viewport = {
  themeColor: '#0e1030',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
