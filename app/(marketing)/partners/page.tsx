import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Partners — Build with us",
  description:
    "CueSports Africa is the continental home of cue sports — rankings, tournaments, and the magazine of record. We're looking for partners to help define the next chapter.",
  openGraph: {
    title: "Partners — CueSports Africa",
    description:
      "Build the continental home of cue sports with us. Sponsorship, series, equipment, and federation partnerships.",
    url: "https://cuesports.africa/partners",
  },
  alternates: {
    canonical: "https://cuesports.africa/partners",
  },
};

const lanes = [
  {
    num: "01",
    title: "Title sponsorship",
    body: "Your name on the season. Headline placement across the platform — homepage, rankings, the magazine, every bracket. The cleanest way to be the first voice players hear when they think continental.",
  },
  {
    num: "02",
    title: "Series & tournament partner",
    body: "Anchor a tour, a major, or a regional ladder. Co-branded events, prize backing, route to the players who'll show up week after week. Best fit for brands building loyalty in a specific country or region.",
  },
  {
    num: "03",
    title: "Equipment & venue",
    body: "Tables, cues, balls, lights, halls, clinics. If you make the room or what's in it, our platform is how players find you — from a kid choosing their first cue to a club kitting out twelve tables.",
  },
  {
    num: "04",
    title: "Federations & governance",
    body: "National bodies, continental federations, certification programs. Use our rankings as the official record. Our infrastructure runs your competition; your authority shapes the standards.",
  },
];

const offer = [
  {
    label: "Audience",
    body: "Players, organizers, fans across the continent. Real ones — ranked, active, returning.",
  },
  {
    label: "Surface",
    body: "Homepage placement, ranking page sponsorship, in-app banners, the magazine, bracket frames.",
  },
  {
    label: "Story",
    body: "We tell partner stories editorially — never as ads. Real reporting, real photography.",
  },
  {
    label: "Data",
    body: "Verifiable engagement: tournament entries, app installs, regional reach, season-on-season growth.",
  },
];

export default function PartnersPage() {
  return (
    <article className="bg-canvas">
      {/* ─── Hero — bold thesis + primary CTA ─── */}
      <header className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-12 lg:pt-32 lg:pb-28">
          <div className="kicker">
            <span className="kicker-rule" />
            For partners
          </div>

          <h1 className="mt-7 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink">
            Help us build the home
            <br className="hidden sm:block" />{" "}
            <span className="text-ink/55">of cue sports in Africa.</span>
          </h1>

          <p className="mt-8 max-w-[62ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.5] text-ink/75">
            CueSports Africa is the continental ranking, the tournament rail,
            and the magazine of record for pool across Africa. We&rsquo;re early. That&rsquo;s the point.
            The partners who arrive now help define what this becomes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:partners@cuesports.africa?subject=Partnership%20inquiry"
              className="group inline-flex h-12 items-center gap-2 rounded-pill bg-ink pl-6 pr-3 text-[14px] font-bold text-white transition-all hover:bg-navy"
            >
              Start the conversation
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink transition-transform group-hover:translate-x-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href="mailto:partners@cuesports.africa"
              className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
            >
              partners@cuesports.africa
            </a>
          </div>
        </div>
      </header>

      {/* ─── The thesis — dark band, editorial close ─── */}
      <section className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="partners-thesis">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 30% 40%, rgba(0,78,134,0.16), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="kicker kicker-on-dark">
            <span className="kicker-rule" />
            The moment
          </div>

          <h2
            id="partners-thesis"
            className="mt-6 text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.025em] text-white"
          >
            Africa has played cue sports forever. Now it has the infrastructure to keep the record.
          </h2>

          <div className="mt-10 space-y-6 text-[16px] leading-[1.7] text-white/75">
            <p>
              From a hall in Mombasa to a club in Lagos, the same game has been
              running for decades. What didn&rsquo;t exist was the continental layer
              &mdash; a single ranking, a shared bracket format, a place to find every
              tournament and every player. We&rsquo;re building it.
            </p>
            <p>
              The brands that show up early to a sport rarely leave. Think of how
              the first jersey sponsor of any league is still the name everyone
              remembers. That&rsquo;s the opportunity here, on a continent of a billion
              people and a game that everyone, everywhere, already plays.
            </p>
            <p className="text-white/85">
              We&rsquo;re selective about partners because partnership is editorial.
              Your story sits next to player stories, tournament reports, and the
              ranking itself. Reputation in &mdash; reputation out.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Partnership lanes — 4-up grid ─── */}
      <section className="border-t border-rule" aria-labelledby="partners-lanes">
        <div className="mx-auto max-w-5xl px-5 pt-16 pb-4 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
          <div className="kicker">
            <span className="kicker-rule" />
            Partnership lanes
          </div>
          <h2
            id="partners-lanes"
            className="mt-4 max-w-3xl text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink"
          >
            Four ways in. Pick the one that fits.
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2">
          {lanes.map((l, i) => (
            <div
              key={l.num}
              className={`relative flex flex-col px-6 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16 ${
                i % 2 === 1 ? "sm:border-l sm:border-rule" : ""
              } ${i >= 2 ? "border-t border-rule" : "sm:border-t-0"} ${
                i === 1 ? "border-t border-rule sm:border-t-0" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute-2 tabular-nums">
                {l.num}
              </span>
              <h3 className="mt-4 text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
                {l.title}
              </h3>
              <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.65] text-ink/75">
                {l.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── What we offer — definition list ─── */}
      <section className="border-t border-rule bg-bone/60" aria-labelledby="partners-offer">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="kicker">
            <span className="kicker-rule" />
            What partners get
          </div>
          <h2
            id="partners-offer"
            className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink"
          >
            More than a logo placement.
          </h2>

          <dl className="mt-10 divide-y divide-rule border-y border-rule">
            {offer.map((o) => (
              <div
                key={o.label}
                className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:gap-8 sm:py-8"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:col-span-4 sm:pt-1">
                  {o.label}
                </dt>
                <dd className="sm:col-span-8">
                  <p className="text-[15px] leading-[1.6] text-ink/80">{o.body}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Final CTA — centered, simple ─── */}
      <section className="relative isolate overflow-hidden border-t border-rule bg-ink py-20 text-center text-white lg:py-28">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(201,162,39,0.12), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
            Get in touch
          </p>
          <h2 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
            One email. One conversation.
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-[clamp(0.95rem,1.2vw,1.1rem)] font-light leading-[1.55] text-white/75">
            Tell us who you are and what you&rsquo;d like to build. We answer every serious inquiry inside two business days.
          </p>

          <a
            href="mailto:partners@cuesports.africa?subject=Partnership%20inquiry"
            className="group mt-10 inline-flex h-12 items-center gap-2 rounded-pill bg-gold pl-6 pr-3 text-[14px] font-bold text-ink transition-all hover:brightness-95"
          >
            partners@cuesports.africa
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
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
  );
}
