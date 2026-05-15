// /about — Our story. Founded 2025 in Kirinyaga County, Kenya by
// Anthony Chege (Founder), Thomas Ngomono, Chris Mutwiri.

import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About — Our story",
  description:
    "CueSports Africa is the continental home of cue sports — rankings, tournaments, and the magazine of record. Built because pool deserved more than to be played in silence.",
  openGraph: {
    title: "About — CueSports Africa",
    description:
      "Africa has played this game for decades. We built the layer that lets it count.",
    url: "https://cuesports.africa/about",
  },
  alternates: {
    canonical: "https://cuesports.africa/about",
  },
};

const crosslinks = [
  {
    label: "Magazine",
    description: "Reports, player stories, and the record of the season.",
    href: "/news",
  },
  {
    label: "Partners",
    description: "Sponsors, equipment, federations — build the room with us.",
    href: "/partners",
  },
  {
    label: "Contact",
    description: "Talk to us. Players, organizers, press, partners.",
    href: "/about/contact",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CueSports Africa",
          url: "https://cuesports.africa",
          description:
            "Africa's home of cue sports — rankings, tournaments, and the magazine of record.",
          foundingDate: "2025",
          foundingLocation: {
            "@type": "Place",
            name: "Kirinyaga County, Kenya",
            address: {
              "@type": "PostalAddress",
              addressRegion: "Kirinyaga County",
              addressCountry: "KE",
            },
          },
          founder: [
            { "@type": "Person", name: "Anthony Chege", jobTitle: "Founder" },
            { "@type": "Person", name: "Thomas Ngomono", jobTitle: "Co-founder" },
            { "@type": "Person", name: "Chris Mutwiri", jobTitle: "Co-founder" },
          ],
          areaServed: "Africa",
          sameAs: [],
        }}
      />

      <article className="bg-canvas">
        {/* ─── Hero band ─── */}
        <header className="mx-auto max-w-5xl px-5 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-12 lg:pt-32 lg:pb-24">
          <div className="kicker">
            <span className="kicker-rule" />
            About · CueSports Africa
          </div>

          <h1 className="mt-7 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink">
            We built this
            <br className="hidden sm:block" />{" "}
            <span className="text-ink/55">because someone had to.</span>
          </h1>

          <p className="mt-8 max-w-[62ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.5] text-ink/75">
            Pool has been played seriously across Africa for decades &mdash; in college halls,
            county clubs, the back rooms of every town. What never existed was the continental
            layer: a shared ranking, a shared bracket format, a shared record of who beat whom
            and where. CueSports Africa is that layer.
          </p>
        </header>

        {/* ─── 01 · How it started ─── */}
        <section className="border-t border-rule" aria-labelledby="about-origin">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              01 · Origin
            </div>
            <h2
              id="about-origin"
              className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              How it started.
            </h2>

            <div className="mt-10 space-y-6 text-[16px] leading-[1.7] text-ink/80">
              <p>
                It started as an evening thing. Three friends in Kirinyaga County &mdash; Anthony
                Chege, Thomas Ngomono, and Chris Mutwiri &mdash; kept noticing the same gap. Pool
                was played seriously across Kenya, sometimes for real money, often for real pride.
                Brackets were drawn on receipt paper. Ratings were stories players told about
                themselves. Cross-county players had no way to know who they were really up against
                until the cue was already chalked.
              </p>
              <p>
                In 2025, the question got concrete enough to build something around: if every
                other sport on the continent has a record of its competition, why doesn&rsquo;t
                cue sports? What was a hobby became a project. What was a project became
                infrastructure for a sport that had been there the whole time.
              </p>
              <p>
                We named it CueSports Africa because the name had to be a promise: not a
                county, not a club, not a tournament series. The continent.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 02 · What we're building ─── */}
        <section className="border-t border-rule bg-bone/60" aria-labelledby="about-mission">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              02 · Mission
            </div>
            <h2
              id="about-mission"
              className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Three layers. One sport.
            </h2>

            <p className="mt-8 max-w-[60ch] text-[16px] leading-[1.7] text-ink/80">
              CueSports Africa runs on three layers, each one earning the next:
            </p>

            <dl className="mt-10 divide-y divide-rule border-y border-rule">
              <div className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-8">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:col-span-3 sm:pt-1">
                  Rankings
                </dt>
                <dd className="sm:col-span-9 text-[15px] leading-[1.7] text-ink/80">
                  An Elo-based continental ranking. Updated after every confirmed match.
                  The single source of truth for who&rsquo;s playing well right now.
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-8">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:col-span-3 sm:pt-1">
                  Tournaments
                </dt>
                <dd className="sm:col-span-9 text-[15px] leading-[1.7] text-ink/80">
                  The rail any organizer can use to run a serious event &mdash; brackets,
                  entry-fee collection, live updates, settlement. From a 16-player Sunday open
                  to a continental Major.
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-8">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:col-span-3 sm:pt-1">
                  Magazine
                </dt>
                <dd className="sm:col-span-9 text-[15px] leading-[1.7] text-ink/80">
                  The stories around the ranking &mdash; players, halls, results, controversies.
                  Cue sports has produced its share of legends. They deserve a record.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ─── 03 · Today ─── */}
        <section className="border-t border-rule" aria-labelledby="about-today">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              03 · Today
            </div>
            <h2
              id="about-today"
              className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Started in Kirinyaga. Growing across the continent.
            </h2>

            <p className="mt-8 max-w-[60ch] text-[16px] leading-[1.7] text-ink/80">
              The honest version: we&rsquo;re early. That&rsquo;s the point. The names that
              show up on the ranking now are the names history will start with.
            </p>
          </div>
        </section>

        {/* ─── 04 · Who's behind this ─── */}
        <section className="border-t border-rule bg-bone/60" aria-labelledby="about-people">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              04 · People
            </div>
            <h2
              id="about-people"
              className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Built by people who play.
            </h2>

            <div className="mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                Founders
              </p>

              <dl className="mt-6 divide-y divide-rule border-y border-rule">
                <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:gap-8">
                  <dt className="sm:col-span-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">
                    Anthony Chege
                  </dt>
                  <dd className="sm:col-span-7 font-mono text-[11px] uppercase tracking-[0.18em] text-mute sm:pt-2">
                    Founder
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:gap-8">
                  <dt className="sm:col-span-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">
                    Thomas Ngomono
                  </dt>
                  <dd className="sm:col-span-7 font-mono text-[11px] uppercase tracking-[0.18em] text-mute sm:pt-2">
                    Co-founder
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:gap-8">
                  <dt className="sm:col-span-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">
                    Chris Mutwiri
                  </dt>
                  <dd className="sm:col-span-7 font-mono text-[11px] uppercase tracking-[0.18em] text-mute sm:pt-2">
                    Co-founder
                  </dd>
                </div>
              </dl>

              <p className="mt-10 max-w-[58ch] text-[15px] leading-[1.7] text-ink/75">
                Three friends from Kirinyaga County, Kenya. Built this on evenings and weekends
                until the evenings weren&rsquo;t enough.
              </p>

              <p className="mt-6 text-[14px] leading-[1.6] text-ink/60">
                A small team of engineers, organizers, and players. We&rsquo;re hiring.{" "}
                <Link
                  href="/about/contact"
                  className="text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
                >
                  Talk to us
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ─── 05 · Where we're going ─── */}
        <section className="border-t border-rule" aria-labelledby="about-future">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker">
              <span className="kicker-rule" />
              05 · What&rsquo;s next
            </div>
            <h2
              id="about-future"
              className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              The continent, fully on the table.
            </h2>

            <div className="mt-10 space-y-6 text-[16px] leading-[1.7] text-ink/80">
              <p>
                The five-year version: every country in Africa with active cue sports has a
                ranked player base on this platform. The continental championship has a real
                bracket, a real prize pool, and a real seeding from twelve months of
                qualifying events. Federations use our infrastructure because it&rsquo;s the
                infrastructure, not because we asked them to.
              </p>
              <p>
                The one-year version: more cities, more tournaments, more organizers running
                more weekends. The magazine starts writing the player profiles the sport has
                always deserved. We sign our first major sponsor.
              </p>
              <p className="text-ink/70">
                If any of that sounds like a room you want to be in &mdash; as a player, an
                organizer, a partner, or a teammate &mdash; the next page is the one you&rsquo;ll
                want.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Cross-links / outro ─── */}
        <section className="border-t border-rule bg-ink text-white" aria-labelledby="about-next">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="kicker kicker-on-dark">
              <span className="kicker-rule" />
              Keep reading
            </div>
            <h2
              id="about-next"
              className="mt-4 max-w-3xl text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-white"
            >
              Three doors from here.
            </h2>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
              {crosslinks.map((c, i) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className={`group flex flex-col px-2 py-8 transition-colors hover:bg-white/[0.04] sm:px-6 sm:py-10 ${
                    i === 0 ? "" : ""
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                    {c.label}
                  </span>
                  <p className="mt-4 text-[17px] leading-[1.4] text-white">
                    {c.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                    Open
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
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
