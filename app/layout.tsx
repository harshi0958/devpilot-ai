import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/common/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevPilot AI",
    template: "%s | DevPilot AI",
  },
  description:
    "AI-Powered Multi-Agent Software Development Assistant for Developers, Students, and Startups.",
  keywords: [
    "DevPilot AI",
    "Artificial Intelligence",
    "Software Development",
    "Frontend Development",
    "UI UX",
    "Software Architect",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Harshit Jariwala" }],
  creator: "Harshit Jariwala",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}