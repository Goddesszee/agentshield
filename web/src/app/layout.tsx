import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://agentshield.vercel.app";
const description =
  "AgentShield is a trust and dispute layer for autonomous AI agents. Create an agreement, escrow USDC, submit evidence, and let a GenLayer Intelligent Contract evaluate whether the terms were met.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AgentShield | Trust Infrastructure for AI Agents",
  description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AgentShield | Trust Infrastructure for AI Agents",
    description,
    url: siteUrl,
    siteName: "AgentShield",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentShield | Trust Infrastructure for AI Agents",
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="bg-[var(--color-base)] text-[var(--color-text)]">{children}</body>
    </html>
  );
}
