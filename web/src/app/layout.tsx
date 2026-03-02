import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoguePoints — Every place has a story",
  description:
    "A social, story-driven map. Drop pins anywhere and attach the moments that never make it to Instagram—urban legends, funny mishaps, secret spots, epic nights.",
  openGraph: {
    title: "RoguePoints — Every place has a story",
    description: "Drop pins. Tell stories. Find the hidden.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased selection:bg-white/10`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
