'use client';

import { useState } from 'react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('submitted');
  }

  if (status === 'submitted') {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-green-400/40 bg-green-500/10 px-6 py-4 max-w-md">
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <div>
          <p className="font-semibold text-green-300">You&apos;re on the list!</p>
          <p className="text-sm text-white/60">We&apos;ll reach out when RoguePoints launches in Glens Falls.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-400/20"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition"
      >
        Join Waitlist
      </button>
    </form>
  );
}
