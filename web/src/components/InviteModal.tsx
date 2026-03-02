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
        <Dialog.Overlay className="fixed inset-0 z-[2000] bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-[2001] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]">

          {!submitted ? (
            <>
              <div className="mb-1 text-3xl">📍</div>
              <Dialog.Title className="text-2xl font-bold tracking-tight">
                Request access
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-white/60">
                RoguePoints is invite-only during beta. Drop your email and we&apos;ll
                reach out when a spot opens.
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-green-500 px-5 py-3 font-semibold text-black hover:bg-green-400 active:scale-[.98] disabled:opacity-60 transition"
                >
                  {loading ? "Sending…" : "Request invite"}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-white/30">
                No spam. No sharing. Just a pin drop when you&apos;re in.
              </p>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className="mb-4 text-5xl">🗺️</div>
              <Dialog.Title className="text-2xl font-bold tracking-tight">
                You&apos;re on the list.
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm text-white/60">
                We&apos;ll drop you an invite when a spot opens. Keep your eyes on the map.
              </Dialog.Description>
              <Dialog.Close className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:text-white transition">
                Close
              </Dialog.Close>
            </div>
          )}

          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1.5 text-white/30 hover:text-white/70 transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
