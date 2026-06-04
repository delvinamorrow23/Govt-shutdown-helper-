
export const metadata = {

  title: "Shutdown Helper — Official links and local help (PA & NY)",
  description: "Personalized guidance during a federal shutdown. Find official agency status and nearby community resources in Pennsylvania and New York.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: { title: "Shutdown Helper — PA and NY", description: "Official links and local help during a federal shutdown.", url: "https://example.org", siteName: "Shutdown Helper", type: "website" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}