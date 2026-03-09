import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RoguePoints",
  description: "How RoguePoints collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  const updated = "March 9, 2026";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6">
              <defs>
                <linearGradient id="rgp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0" stopColor="#fbbf24" />
                  <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path
                d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                fill="url(#rgp-grad)"
              />
            </svg>
            <span className="font-display text-xl italic tracking-tight text-white/90 group-hover:text-amber-300 transition-colors">
              RoguePoints
            </span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/60 mb-3">
            Legal
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/35">Last updated: {updated}</p>
        </div>

        <div className="prose-privacy">
          <Section title="1. Overview">
            <p>
              RoguePoints (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates
              roguepoints.com (the &ldquo;Service&rdquo;). This Privacy Policy explains what
              information we collect, how we use it, and the choices you have. By using the
              Service you agree to these practices.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <Subsection title="Information you provide">
              <ul>
                <li>
                  <strong>Account information</strong> — When you sign in via Google (through
                  Clerk), we receive your name, email address, and profile photo.
                </li>
                <li>
                  <strong>Content you create</strong> — Pin titles, stories, category tags,
                  and any photos you attach.
                </li>
                <li>
                  <strong>Reactions &amp; interactions</strong> — Emoji reactions you add to
                  other users&apos; pins.
                </li>
              </ul>
            </Subsection>
            <Subsection title="Information collected automatically">
              <ul>
                <li>
                  <strong>Location data</strong> — The geographic coordinates you choose when
                  dropping a pin. We never track your device location in the background.
                </li>
                <li>
                  <strong>Usage data</strong> — Pages visited, features used, and general
                  interaction patterns (via standard server logs and analytics).
                </li>
                <li>
                  <strong>Device &amp; browser data</strong> — IP address, browser type, and
                  operating system collected automatically with each request.
                </li>
              </ul>
            </Subsection>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>Provide, maintain, and improve the Service.</li>
              <li>Display your pins and stories on the map.</li>
              <li>Authenticate your account and keep it secure.</li>
              <li>Send you service-related notices (e.g., changes to this policy).</li>
              <li>Detect abuse and enforce our Terms of Service.</li>
              <li>Generate anonymised, aggregated usage analytics.</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal information to third parties.</p>
          </Section>

          <Section title="4. Sharing of Information">
            <p>
              We share data only in the following limited circumstances:
            </p>
            <ul>
              <li>
                <strong>Service providers</strong> — Trusted vendors (hosting, authentication,
                analytics) who process data on our behalf under confidentiality obligations.
              </li>
              <li>
                <strong>Legal requirements</strong> — When required by law, court order, or to
                protect the rights and safety of RoguePoints or others.
              </li>
              <li>
                <strong>Business transfers</strong> — In the event of a merger, acquisition, or
                sale of assets, your data may be transferred to the successor entity.
              </li>
            </ul>
          </Section>

          <Section title="5. Pins and Public Content">
            <p>
              Pins you drop are visible to other users of the Service by default. Your display
              name and avatar are shown alongside content you create. Think carefully before
              including personally identifiable information in a pin story.
            </p>
            <p>
              You may delete your own pins at any time from the map view. Deleted pins are
              removed from public view immediately and purged from our systems within 30 days.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your account data for as long as your account is active. If you delete
              your account, we will delete or anonymise your personal information within 30 days,
              except where retention is required for legal obligations.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We use industry-standard measures including HTTPS encryption, access controls, and
              regular security reviews to protect your information. No method of transmission over
              the internet is 100% secure; we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="8. Children&rsquo;s Privacy">
            <p>
              The Service is not directed to children under 13. We do not knowingly collect
              personal information from children under 13. If you believe a child has provided
              us with personal information, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, or
              delete your personal data, or to restrict or object to certain processing. To
              exercise any of these rights, contact us at the address below.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              material changes by updating the &ldquo;Last updated&rdquo; date at the top of this
              page. Continued use of the Service after changes take effect constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy, please reach out:
            </p>
            <p>
              <strong>RoguePoints</strong>
              <br />
              Email:{" "}
              <a href="mailto:privacy@roguepoints.com" className="text-amber-300/80 hover:text-amber-300 transition-colors">
                privacy@roguepoints.com
              </a>
            </p>
          </Section>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-amber-300/80 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to RoguePoints
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5">
              <path
                d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                fill="rgba(251,191,36,0.3)"
              />
            </svg>
            <span className="text-sm text-white/30">
              &copy; {new Date().getFullYear()} RoguePoints
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white/35 hover:text-amber-300/70 transition">
              Terms
            </a>
            <a href="/privacy" className="text-amber-300/60 hover:text-amber-300 transition">
              Privacy
            </a>
            <a href="#" className="text-white/35 hover:text-amber-300/70 transition">
              Contact
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        .prose-privacy p {
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .prose-privacy ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: rgba(255,255,255,0.55);
        }
        .prose-privacy li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .prose-privacy strong {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl tracking-tight mb-4 text-white/90">{title}</h2>
      <div className="prose-privacy">{children}</div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-white/70 mb-2">{title}</h3>
      {children}
    </div>
  );
}
