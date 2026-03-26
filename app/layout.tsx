import './globals.css';

export const metadata = {
  title: 'Gleea — Grow Your Kindness',
  description: 'A kindness and social-emotional learning app for children ages 3–12. Generous Listening, Ethical Empathy, Action.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gleea-cream font-body text-gleea-warm-gray">
        {children}
      </body>
    </html>
  );
}
