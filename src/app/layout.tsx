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
  title: "GBICT Energy — Het besturingssysteem voor jouw thuisenergie",
  description:
    "Verbind elke batterij met elk dynamisch energiecontract. Bespaar automatisch honderden euro's per jaar met AI-gestuurde optimalisatie.",
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
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <NativeInit />
        <ThemeController />
        {children}
      </body>
    </html>
  );
}
