import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music Visualizer - Real-time Audio Visualization",
  description:
    "Create stunning real-time music visualizations with beat detection, multiple animation styles, and WebM video export. Powered by Web Audio API and Canvas.",
  generator: "v0.app",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased magenta-gradient">
        <div
          className="fixed inset-0 -z-10 magenta-gradient"
          style={{ filter: "blur(80px) saturate(180%)", opacity: 0.7 }}
        />
        {children}
      </body>
    </html>
  );
}
