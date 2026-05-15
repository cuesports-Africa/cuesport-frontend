import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { pricingTiers, formatTierPrice } from "@/config/plans";

export const metadata: Metadata = {
  title: "Pricing — Per-Tournament Fees",
  description:
    "Pay per tournament, not per month. Five tiers from KES 500 (up to 16 players) to KES 5,000 (unlimited). M-Pesa and card.",
  openGraph: {
    title: "Pricing — CueSports Africa",
    description:
      "Pay per tournament, not per month. Five tiers from KES 500 to KES 5,000. M-Pesa & card.",
    url: "https://cuesports.africa/pricing",
  },
  alternates: {
    canonical: "https://cuesports.africa/pricing",
  },
};

// Static approximations — KES is the actual billing currency. Update this map
// quarterly if exchange rates drift meaningfully.
// Reference: KES ~130/USD, KES ~0.083/NGN (Q2 2026).
const approxByTier: Record<string, string> = {
  Small: "≈ $4 USD · ₦6,000 NGN",
  Medium: "≈ $8 USD · ₦12,000 NGN",
  Large: "≈ $15 USD · ₦24,000 NGN",
  Major: "≈ $27 USD · ₦42,000 NGN",
  Championship: "≈ $38 USD · ₦60,000 NGN",
};

const faqs = [
  {
    question: "How does per-tournament pricing work?",
    answer:
      "You pay a one-time fee when you create a tournament, based on the maximum number of players. No monthly subscriptions, no hidden fees.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "M-Pesa, Visa, Mastercard, and bank transfer. All payments are processed securely through our payment partners.",
  },
  {
    question: "What if my tournament gets cancelled?",
    answer:
      "Cancel before registration opens and you get a full refund of the platform fee. After registration opens, contact support and we'll work it out case by case.",
  },
  {
    question: "Can I change the max players after creating a tournament?",
    answer:
      "You can increase max players before the tournament starts — you'll just pay the difference between tiers. Decreasing isn't supported after creation.",
  },
  {
    question: "Are there discounts for frequent organizers?",
    answer:
      "Yes — organizers running 5+ tournaments per month get a 10% discount. Federations and national leagues are eligible for custom arrangements.",
  },
];

export default function PricingPage() {
  const jsonLdOffers = pricingTiers.map((tier) => ({
    "@type": "Offer",
    name: `${tier.name} Tournament`,
    description: tier.label,
    price: tier.amount / 100,
    priceCurrency: tier.currency,
    availability: "https://schema.org/InStock",
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "CueSports Africa Tournament Management",
          description: "Professional pool tournament management software for Africa",
          brand: { "@type": "Brand", name: "CueSports Africa" },
          offers: jsonLdOffers,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://cuesports.africa" },
            { "@type": "ListItem", position: 2, name: "Pricing", item: "https://cuesports.africa/pricing" },
          ],
        }}
      />

      <article className="bg-canvas">
        {/* ─── Hero band ─── */}
        <header className="mx-auto max-w-5xl px-5 pt-20 pb-12 sm:px-8 sm:pt-24 sm:pb-16 lg:px-12 lg:pt-32 lg:pb-20">
          <div className="kicker">
            <span className="kicker-rule" />
            Pricing
          </div>

          <h1 className="mt-7 text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink">
            Pay per tournament.
            <br className="hidden sm:block" />{" "}
            <span className="text-ink/55">No subscriptions.</span>
          </h1>

          <p className="mt-8 max-w-[60ch] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.55] text-ink/75">
            One fee per tournament, set by the player count. M-Pesa and card.
            Every tier runs the same engine &mdash; only the player ceiling changes.
          </p>
        </header>

        {/* ─── The schedule ─── */}
        <section className="border-t border-rule" aria-labelledby="pricing-schedule">
          <div className="mx-auto max-w-5xl px-5 pt-16 pb-8 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
            <div className="kicker">
              <span className="kicker-rule" />
              Fee schedule
            </div>
            <h2
              id="pricing-schedule"
              className="mt-4 max-w-3xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.025em] text-ink"
            >
              Five tiers. Pick by ceiling.
            </h2>
          </div>

          <div className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
            <dl className="border-y border-rule divide-y divide-rule">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 sm:gap-x-6 sm:py-9"
                >
                  <dt className="col-span-12 sm:col-span-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    {tier.name}
                  </dt>
                  <dd className="col-span-7 sm:col-span-5 text-[15px] leading-[1.4] text-ink/80 sm:text-[16px]">
                    {tier.label}
                  </dd>
                  <dd className="col-span-5 sm:col-span-4 text-right">
                    <span className="block text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.02em] text-ink tabular-nums">
                      {formatTierPrice(tier)}
                    </span>
                    <span className="mt-1 block text-[11px] leading-[1.3] text-mute-2 tabular-nums">
                      {approxByTier[tier.name]}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
                      per tournament
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 max-w-[60ch] font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-mute-2">
              USD / NGN figures are approximate. All tournaments are billed and settled in KES.
            </p>
          </div>
        </section>

        {/* ─── What's included — single editorial paragraph ─── */}
        <section className="border-t border-rule bg-bone/60" aria-labelledby="pricing-included">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              What you get
            </div>
            <h2
              id="pricing-included"
              className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink"
            >
              Same engine, every tier.
            </h2>

            <div className="mt-8 space-y-5 text-[15px] leading-[1.7] text-ink/80">
              <p>
                Every tournament &mdash; from a 16-player Sunday open to a 256-player Major &mdash;
                gets the same core engine: single-elimination brackets, Elo rating updates,
                SMS and email notifications, real-time bracket updates, and entry-fee collection.
              </p>
              <p>
                Larger tiers unlock tournament analytics, priority support, and at the
                Championship level, a dedicated account manager. There&rsquo;s no feature gate &mdash;
                the difference between tiers is the player ceiling, not what the platform can do.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Custom / federations ─── */}
        <section className="border-t border-rule" aria-labelledby="pricing-custom">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              Federations & series
            </div>
            <h2
              id="pricing-custom"
              className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink"
            >
              Running a federation, national league, or multi-venue series?
            </h2>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-[1.65] text-ink/75">
              Custom arrangements for federations, sanctioned leagues, and operators
              running 5+ tournaments a month. Volume discounts, custom branding, white-label rankings.
            </p>
            <Link
              href="/about/contact?plan=enterprise"
              className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
            >
              Talk to us about a custom plan
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* ─── FAQ — editorial dl ─── */}
        <section className="border-t border-rule" aria-labelledby="pricing-faq">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              Frequently asked
            </div>
            <h2
              id="pricing-faq"
              className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink"
            >
              Questions, plainly answered.
            </h2>

            <dl className="mt-10 divide-y divide-rule border-y border-rule">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-12 sm:gap-8 sm:py-9"
                >
                  <dt className="sm:col-span-5 text-[15px] font-semibold leading-[1.4] text-ink">
                    {faq.question}
                  </dt>
                  <dd className="sm:col-span-7 text-[15px] leading-[1.65] text-ink/75">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── Final CTA — dark band ─── */}
        <section className="relative isolate overflow-hidden border-t border-rule bg-ink py-20 text-center text-white lg:py-28">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(0,78,134,0.14), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
              Ready
            </p>
            <h2 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
              Host your first tournament.
            </h2>
            <p className="mx-auto mt-5 max-w-[48ch] text-[clamp(0.95rem,1.2vw,1.1rem)] font-light leading-[1.55] text-white/75">
              Sign up as an organizer, pick your tier, run your bracket. Pay only when you host.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center gap-2 rounded-pill bg-gold pl-6 pr-3 text-[14px] font-bold text-ink transition-all hover:brightness-95"
              >
                Become an organizer
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/about/contact?plan=enterprise"
                className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
              >
                Or talk to us
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Back link ─── */}
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
          >
            ← Back to home
          </Link>
        </div>
      </article>
    </>
  );
}
