import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NativeInit from "@/components/NativeInit";
import ThemeController from "@/components/ThemeController";

// Runs before paint to set the day/night theme with no flash:
// a manual choice (cookie) wins, otherwise light between 07:00–18:00.
const themeInitScript = `(function(){try{var m=document.cookie.match(/GBICT_THEME=(light|dark)/);var h=new Date().getHours();var t=m?m[1]:((h>=7&&h<18)?'light':'dark');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark')}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GBICT Energy — One platform for your battery, solar and grid",
  description:
    "Connect your home battery, solar and dynamic energy contract into one platform that charges, stores and sells power at exactly the right moment — automatically lowering your bill.",
};

// viewport-fit=cover enables env(safe-area-inset-*) so the native app can
// respect the notch / Dynamic Island / home indicator.
export const viewport: Viewport = {
  themeColor: "#07080D",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <NativeInit />
        <ThemeController />
        {children}
      </body>
    </html>
  );
}
