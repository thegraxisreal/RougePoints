import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppProviders } from "./providers";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <ClerkProvider afterSignInUrl="/map" afterSignUpUrl="/map">
      <html lang="en" className="scroll-smooth" style={{ colorScheme: "dark" }}>
        <body
          className={`${instrumentSerif.variable} ${dmSans.variable} bg-[#0a0a0f] text-white antialiased selection:bg-amber-400/20 selection:text-amber-100`}
        >
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
