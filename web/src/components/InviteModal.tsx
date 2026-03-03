"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export function InviteModal({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate async submission — swap for real API call when ready
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      // Reset state when modal closes so it's fresh next time
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
        setLoading(false);
      }, 300);
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-[2001] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[0.08] bg-[#0d0d14] p-8 shadow-2xl shadow-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(251,191,36,0.06), transparent 70%)",
            }}
          />

          {!submitted ? (
            <div className="relative z-10">
              {/* Pin icon */}
              <div className="mb-4">
                <svg viewBox="0 0 32 42" className="h-10 w-8">
                  <defs>
                    <filter id="modal-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" floodOpacity="0.4" />
                    </filter>
                  </defs>
                  <path
                    d="M16 0C7.2 0 0 7.2 0 16c0 11.2 14 24.5 15.2 25.6.4.4 1.2.4 1.6 0C18 40.5 32 27.2 32 16 32 7.2 24.8 0 16 0z"
                    fill="#fbbf24"
                    filter="url(#modal-glow)"
                  />
                  <circle cx="16" cy="16" r="6.5" fill="white" opacity="0.9" />
                </svg>
              </div>

              <Dialog.Title className="font-display text-3xl tracking-tight">
                Request access
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-white/45">
                RoguePoints is invite-only during beta. Drop your email and
                we&apos;ll reach out when a spot opens.
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/15 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-amber-400 px-5 py-3 font-semibold text-black hover:bg-amber-300 active:scale-[.97] disabled:opacity-60 transition glow-amber-sm cursor-pin"
                >
                  {loading ? "Sending\u2026" : "Request invite"}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-white/25">
                No spam. No sharing. Just a pin drop when you&apos;re in.
              </p>
            </div>
          ) : (
            <div className="relative z-10 py-4 text-center">
              {/* Map icon */}
              <div className="mb-4 flex justify-center">
                <svg viewBox="0 0 48 48" className="h-14 w-14">
                  <defs>
                    <filter id="modal-success-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fbbf24" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  <circle cx="24" cy="24" r="22" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.3)" strokeWidth="1" filter="url(#modal-success-glow)" />
                  <path d="M18 24l4 4 8-8" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Dialog.Title className="font-display text-3xl tracking-tight">
                You&apos;re on the list.
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm text-white/45">
                We&apos;ll drop you an invite when a spot opens. Keep your eyes
                on the map.
              </Dialog.Description>
              <Dialog.Close className="mt-6 inline-flex rounded-full border border-white/[0.08] px-5 py-2.5 text-sm text-white/50 hover:text-amber-300 hover:border-amber-400/30 transition cursor-pin">
                Close
              </Dialog.Close>
            </div>
          )}

          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1.5 text-white/25 hover:text-amber-300 transition">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
