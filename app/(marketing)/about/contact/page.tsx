import { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Contact CueSports Africa for tournament inquiries, partnerships, or technical support. Reach us via email or WhatsApp — we typically respond within 24 hours.",
  openGraph: {
    title: "Contact Us — CueSports Africa",
    description:
      "Have questions? Reach out via email or WhatsApp. We typically respond within 24 hours.",
    url: "https://cuesports.africa/about/contact",
  },
  alternates: {
    canonical: "https://cuesports.africa/about/contact",
  },
};

const channels = [
  {
    icon: Mail,
    kicker: "Email",
    primary: "info@cuesports.africa",
    href: "mailto:info@cuesports.africa",
    note: "General inquiries, organizer questions, and feedback. We typically reply within 24 hours.",
  },
  {
    icon: MessageSquare,
    kicker: "WhatsApp",
    primary: "+254 700 000 000",
    href: "https://wa.me/254700000000",
    note: "For quick questions during business hours. Expect a reply within the hour.",
  },
  {
    icon: MapPin,
    kicker: "Office",
    primary: "Nairobi, Kenya",
    href: null,
    note: "We work across the continent, but the room we shoot from is in Nairobi.",
  },
  {
    icon: Clock,
    kicker: "Hours",
    primary: "Mon – Sat · 8am – 6pm EAT",
    href: null,
    note: "Messages outside these hours get answered first thing the next morning.",
  },
];

const topics = [
  {
    label: "Tournament organizers",
    body: "Hosting a series, an open, or a one-night league? Tell us a little about it and we'll set you up.",
    cta: { text: "support@cuesports.africa", href: "mailto:support@cuesports.africa" },
  },
  {
    label: "Partnerships & sponsorship",
    body: "Sponsors, equipment partners, venue partners, federations.",
    cta: { text: "partners@cuesports.africa", href: "mailto:partners@cuesports.africa" },
  },
  {
    label: "Press & media",
    body: "Stories, interviews, photography, coverage requests.",
    cta: { text: "press@cuesports.africa", href: "mailto:press@cuesports.africa" },
  },
  {
    label: "Privacy & legal",
    body: "Data requests, account deletion, anything else legal-shaped.",
    cta: { text: "privacy@cuesportsafrica.com", href: "mailto:privacy@cuesportsafrica.com" },
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact CueSports Africa",
          url: "https://cuesports.africa/about/contact",
          mainEntity: {
            "@type": "Organization",
            name: "CueSports Africa",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+254-700-000-000",
                contactType: "customer support",
                email: "info@cuesports.africa",
                availableLanguage: ["English", "Swahili"],
                hoursAvailable: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "08:00",
                  closes: "18:00",
                },
              },
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://cuesports.africa" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://cuesports.africa/about" },
            { "@type": "ListItem", position: 3, name: "Contact", item: "https://cuesports.africa/about/contact" },
          ],
        }}
      />

      <article className="bg-canvas">
        {/* ─── Hero band ─── */}
        <header className="mx-auto max-w-5xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:px-12 lg:pt-24 lg:pb-20">
          <div className="kicker">
            <span className="kicker-rule" />
            Contact
          </div>

          <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
            Reach the room.
          </h1>

          <p className="mt-6 max-w-[58ch] text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.55] text-ink/70">
            Players, organizers, partners, press — whoever you are, the line is open.
            We answer every message, usually within a day.
          </p>
        </header>

        {/* ─── Primary channels — 4-card grid ─── */}
        <section className="border-t border-rule" aria-labelledby="contact-channels">
          <h2 id="contact-channels" className="sr-only">Contact channels</h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              const content = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                      {ch.kicker}
                    </span>
                    <Icon className="h-4 w-4 text-mute-2" strokeWidth={1.5} aria-hidden />
                  </div>
                  <p className="mt-6 text-[18px] font-semibold leading-[1.25] tracking-[-0.01em] text-ink">
                    {ch.primary}
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.55] text-ink/65">
                    {ch.note}
                  </p>
                  {ch.href && (
                    <span className="mt-6 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-navy">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </>
              );
              const baseClass = `relative flex flex-col px-6 py-10 sm:px-7 sm:py-12 lg:px-8 lg:py-14 ${
                i > 0 ? "sm:border-l sm:border-rule" : ""
              } ${i >= 2 ? "border-t border-rule sm:border-t lg:border-t-0" : ""} ${
                i === 1 ? "border-t border-rule sm:border-t-0" : ""
              } ${i === 2 ? "lg:border-l lg:border-rule" : ""}`;

              return ch.href ? (
                <a
                  key={ch.kicker}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`${baseClass} transition-colors hover:bg-bone/60`}
                >
                  {content}
                </a>
              ) : (
                <div key={ch.kicker} className={baseClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── By topic — narrower reading column, editorial list ─── */}
        <section
          className="border-t border-rule"
          aria-labelledby="contact-by-topic"
        >
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              By topic
            </div>
            <h2
              id="contact-by-topic"
              className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink"
            >
              The right inbox for the right question.
            </h2>

            <dl className="mt-10 divide-y divide-rule border-y border-rule">
              {topics.map((t) => (
                <div
                  key={t.label}
                  className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:gap-8 sm:py-8"
                >
                  <dt className="sm:col-span-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:pt-1">
                    {t.label}
                  </dt>
                  <dd className="sm:col-span-8">
                    <p className="text-[15px] leading-[1.6] text-ink/80">{t.body}</p>
                    <a
                      href={t.cta.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
                    >
                      {t.cta.text}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-12 text-[14px] leading-[1.6] text-ink/60">
              Not sure where to start?{" "}
              <a
                href="mailto:info@cuesports.africa"
                className="text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
              >
                info@cuesports.africa
              </a>{" "}
              and we'll route you.
            </p>

            <Link
              href="/"
              className="mt-12 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
