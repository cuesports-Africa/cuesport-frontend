import Link from "next/link";

type LegalDoc = "privacy" | "terms" | "cookies";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  lastUpdated: string;
  contactEmail?: string;
  current: LegalDoc;
  children: React.ReactNode;
};

const siblings: { id: LegalDoc; label: string; href: string }[] = [
  { id: "privacy", label: "Privacy", href: "/legal/privacy" },
  { id: "terms", label: "Terms", href: "/legal/terms" },
  { id: "cookies", label: "Cookies", href: "/legal/cookies" },
];

export function LegalArticle({
  kicker = "Legal Notice",
  title,
  lead,
  lastUpdated,
  contactEmail,
  current,
  children,
}: Props) {
  return (
    <article className="bg-canvas">
      {/* ─── Hero band — kicker + headline + meta strip ─── */}
      <header className="mx-auto max-w-3xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:px-12 lg:pt-24 lg:pb-20">
        <div className="kicker">
          <span className="kicker-rule" />
          {kicker}
        </div>

        <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
          {title}
        </h1>

        {lead && (
          <p className="mt-6 max-w-[58ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.55] text-ink/70">
            {lead}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          <span className="tabular-nums">Last updated · {lastUpdated}</span>
          <span aria-hidden className="hidden h-px w-6 bg-rule sm:inline-block" />
          <nav className="flex items-center gap-5" aria-label="Legal documents">
            {siblings.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className={
                  s.id === current
                    ? "text-ink"
                    : "text-mute transition-colors hover:text-ink"
                }
                aria-current={s.id === current ? "page" : undefined}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Body — plain semantic markup styled via .legal-prose ─── */}
      <div className="legal-prose mx-auto max-w-3xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        {children}
      </div>

      {/* ─── Outro — contact + back link ─── */}
      {contactEmail && (
        <footer className="border-t border-rule">
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
              Questions
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-ink/80">
              Contact us at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
              >
                {contactEmail}
              </a>
              .
            </p>
            <Link
              href="/"
              className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
            >
              ← Back to home
            </Link>
          </div>
        </footer>
      )}
    </article>
  );
}
