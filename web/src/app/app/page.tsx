"use client";

import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";

const Map = dynamic(
  () => import("@/components/Map").then((m) => m.Map),
  { ssr: false, loading: () => <div className="h-screen w-full animate-pulse bg-[#0a0a0f]" /> }
);

export default function AppPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Map />

      {/* Floating nav bar */}
      <header className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7 drop-shadow-lg">
            <defs>
              <linearGradient id="rgp-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
              fill="url(#rgp-g)"
            />
          </svg>
          <span
            className="text-lg italic tracking-tight text-white/90"
            style={{ fontFamily: "var(--font-display)" }}
          >
            RoguePoints
          </span>
        </div>

        <div className="pointer-events-auto">
        <UserButton
          appearance={{
            variables: { colorPrimary: "#fbbf24" },
            elements: {
              avatarBox: "ring-1 ring-amber-400/30",
            },
          }}
        />
        </div>
      </header>
    </div>
  );
}
