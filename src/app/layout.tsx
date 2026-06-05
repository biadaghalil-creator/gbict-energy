import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NativeInit from "@/components/NativeInit";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <NativeInit />
        {children}
      </body>
    </html>
  );
}
