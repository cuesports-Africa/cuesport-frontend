import Link from "next/link";
import Image from "next/image";
import heroImage from "@/public/hero.jpg";
import heroMobileImage from "@/public/hero-mobile.jpg";
import whyImage from "@/public/why.jpg";
import spotlightImage from "@/public/spotlight.jpg";
import organizersImage from "@/public/organizers.jpg";
import news1Image from "@/public/news-1.jpg";
import news2Image from "@/public/news-2.jpg";
import news3Image from "@/public/news-3.jpg";
import wallImage from "@/public/wall.jpg";
import { HomeRankings } from "@/components/home-rankings";
import { getHomeData } from "@/lib/home-data";
import { JsonLd } from "@/components/seo/json-ld";
import { AppDownloadButton } from "@/components/app-download-button";
import { ArrowUpRight, Smartphone } from "lucide-react";

// TODO: wire to /api/news (or /api/articles) when content is published.
// Placeholder editorial pieces — same shape the magazine archive uses.
const homeNews: Array<{
  category: string;
  headline: string;
  excerpt: string;
  byline: string;
  date: string;
  href: string;
  image: typeof news1Image;
}> = [
  {
    category: "Match Report",
    headline: "A frame to decide the county: Mwangi 5, Otieno 4.",
    excerpt: "The Kirinyaga Open final went the distance — the title turned on the black.",
    byline: "CueSports Africa Editorial",
    date: "13 May 2026",
    href: "/news",
    image: news1Image,
  },
  {
    category: "Profile",
    headline: "Brian Odhiambo wants the continental top three.",
    excerpt: "How a quiet club in Mombasa decided its best player was good enough for Africa.",
    byline: "CueSports Africa Editorial",
    date: "11 May 2026",
    href: "/news",
    image: news2Image,
  },
  {
    category: "Analysis",
    headline: "Why Western League players keep climbing the rankings.",
    excerpt: "A look at the regional Elo numbers — and the halls behind them.",
    byline: "CueSports Africa Editorial",
    date: "09 May 2026",
    href: "/news",
    image: news3Image,
  },
];

export default async function Home() {
  const { pulse, rankingsMen, rankingsWomen, rankingsUpdatedAt } =
    await getHomeData();

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "CueSports Africa — Tournament Infrastructure for African Pool",
          description:
            "The complete platform for running professional pool tournaments. Brackets, ratings, payments, and rankings.",
          url: "https://cuesports.africa",
          about: {
            "@type": "SportsOrganization",
            name: "CueSports Africa",
            sport: "Cue Sports",
            url: "https://cuesports.africa",
            description:
              "Africa's #1 pool tournament platform. Professional tournament management, Elo ratings, and M-Pesa payments.",
            areaServed: {
              "@type": "Continent",
              name: "Africa",
            },
          },
        }}
      />

      {/* ─── Hero — atmospheric photo background, extends behind header ─── */}
      <section className="relative isolate overflow-hidden bg-ink text-white min-h-[88vh] flex flex-col -mt-[60px] sm:-mt-[68px] pt-[60px] sm:pt-[68px]">
        {/* Desktop & tablet — landscape composition */}
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          placeholder="blur"
          quality={75}
          sizes="(min-width: 768px) 100vw, 1px"
          className="hidden md:block object-cover object-center -z-20"
        />
        {/* Mobile — portrait composition, same brand mood */}
        <Image
          src={heroMobileImage}
          alt=""
          fill
          priority
          placeholder="blur"
          quality={75}
          sizes="(max-width: 767px) 100vw, 1px"
          className="block md:hidden object-cover object-center -z-20"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.75) 38%, rgba(10,22,40,0.45) 72%, rgba(10,22,40,0.3) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 -z-10"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.55) 100%)",
          }}
        />
        <div className="relative flex-1 flex flex-col mx-auto max-w-6xl w-full px-5 sm:px-8 lg:px-12 pt-16 pb-14 lg:pt-24 lg:pb-16">
          <div className="flex-1 flex flex-col justify-center max-w-[760px]">
              <h1 className="text-[clamp(2.75rem,6.6vw,5.75rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-white">
                Run the table.
              </h1>

              <p className="mt-4 text-[clamp(1.15rem,1.8vw,1.5rem)] italic font-light text-white/70 leading-[1.2] tracking-tight">
                Africa&rsquo;s home of cue sports.
              </p>

              <p className="mt-7 max-w-[52ch] text-[15px] md:text-[17px] leading-[1.55] text-white/75">
                Find a tournament near you. Play your match.
                <br />
                Climb the rankings — across the continent.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/tournaments"
                  className="group inline-flex items-center gap-2 h-12 pl-6 pr-2 rounded-pill bg-gold text-ink text-[14px] font-bold hover:brightness-95 transition-all"
                >
                  Find a tournament
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-ink/15 group-hover:bg-ink/25 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center h-12 px-6 rounded-pill border border-white/25 text-white font-medium text-[14px] hover:bg-white/5 transition-colors"
                >
                  For organizers
                </Link>
              </div>

          </div>

          {/* Bottom hairline strip — separates CTAs from factual footer */}
          <div className="relative mt-12 lg:mt-16 pt-6 border-t border-white/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
                Africa&rsquo;s home of cue sports
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 nums-tabular">
                2,000+ organizers · 46 countries · 1M+ players
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pulse — the heartbeat of African pool, restrained editorial band ─── */}
      <section
        className="border-y border-white/[0.06] py-16 lg:py-20"
        style={{ background: "rgb(7, 16, 30)" }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                Right now · Across the continent
              </p>
              {pulse.matchesLive > 0 ? (
                <p className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.15] tracking-[-0.02em] text-white">
                  <span className="font-bold tabular-nums text-gold">{pulse.matchesLive}</span>
                  <span className="font-light"> matches live</span>
                  {pulse.venues > 0 && (
                    <>
                      <span className="mx-3 text-white/25">·</span>
                      <span className="font-bold tabular-nums text-gold">{pulse.venues}</span>
                      <span className="font-light"> venues</span>
                    </>
                  )}
                  {pulse.countries > 0 && (
                    <>
                      <span className="mx-3 text-white/25">·</span>
                      <span className="font-bold tabular-nums text-gold">{pulse.countries}</span>
                      <span className="font-light"> countries</span>
                    </>
                  )}
                </p>
              ) : (
                <p className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.15] tracking-[-0.02em] text-white">
                  Pool. Snooker. Billiards. Carrom.{" "}
                  <span className="text-white/60">One game.</span>
                </p>
              )}
            </div>
            <Link
              href="/tournaments"
              className="group inline-flex items-center gap-2 text-[14px] font-medium text-gold transition-opacity hover:opacity-80"
            >
              Find tournaments near you
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Top of the Table — interactive Men/Women tabs, live data ─── */}
      <HomeRankings
        men={rankingsMen}
        women={rankingsWomen}
        updatedAt={rankingsUpdatedAt}
      />

      {/* ─── The Why — brand essay, magazine spread (light act, soft mesh) ─── */}
      <section
        className="relative overflow-hidden py-20 text-ink lg:py-28"
        aria-labelledby="home-why-heading"
        style={{
          // Layered: subtle brand-blue mesh top-left, subtle gold mesh bottom-right,
          // sitting on a soft neutral grey base. All very low opacity so the page reads
          // as "grey paper with a hint of brand" rather than coloured.
          background:
            "radial-gradient(ellipse 70% 55% at 12% 18%, rgba(0,78,134,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 88% 82%, rgba(201,162,39,0.07), transparent 55%), #ECECEE",
        }}
      >
        {/* Subtle film grain to keep the mesh from looking flat — pure CSS, no asset */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)",
            backgroundSize: "3px 3px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

            {/* Image — atmospheric portrait, sits like a printed plate on the page */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-300 shadow-[0_30px_60px_-30px_rgba(0,78,134,0.35)] ring-1 ring-zinc-900/5">
              <Image
                src={whyImage}
                alt=""
                fill
                placeholder="blur"
                quality={75}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Text — eyebrow, headline, body, quiet link */}
            <div className="flex flex-col justify-center">
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Why we&rsquo;re here
              </p>
              <h2
                id="home-why-heading"
                className="text-[clamp(2.5rem,5.6vw,4.5rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-ink"
              >
                Pool was always African.
              </h2>
              <p className="mt-8 max-w-[58ch] text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal leading-[1.55] text-zinc-700">
                The game has lived in halls and clubs across the continent for decades — played
                seriously, never seen. CueSports Africa exists because pool deserved more than that.
                A record. A ranking. A real path from the county hall to the continental stage.
              </p>
              <Link
                href="/about"
                className="group mt-10 inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-80"
                style={{ color: "#004E86" }}
              >
                Read our story
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Player Spotlight — long-form magazine feature (light act) ─── */}
      <section
        className="relative overflow-hidden bg-zinc-100 py-20 text-ink lg:py-28"
        aria-labelledby="home-spotlight-heading"
      >
        {/* Subtle film grain — same texture as The Why for paper consistency */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)",
            backgroundSize: "3px 3px",
          }}
        />
        {/* Single quiet brand-blue glow, off-center — quieter mesh than The Why */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 70% 20%, rgba(0,78,134,0.06), transparent 65%)",
          }}
        />

        <article className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">

          {/* Top header — left-aligned magazine-cover style */}
          <header className="max-w-3xl">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Spotlight · Volume 01
            </p>
            <h2
              id="home-spotlight-heading"
              className="text-[clamp(2.25rem,4.8vw,3.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink"
            >
              The night his name<br className="hidden sm:block" /> went on the wall.
            </h2>
            <p className="mt-6 max-w-[55ch] text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal leading-[1.5] text-zinc-700">
              From weekend money games in Kakamega to the continental top ten —
              the patient apprenticeship of a player you&rsquo;ll soon hear shouted in halls
              from Mombasa to Lagos.
            </p>
            <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <span>Words · CueSports Africa Editorial</span>
              <span aria-hidden className="text-zinc-300">·</span>
              <span>6 min read</span>
            </p>
          </header>

          {/* Hero photograph — full-width landscape plate */}
          <figure className="relative mt-12 lg:mt-16">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-300 shadow-[0_40px_80px_-40px_rgba(0,78,134,0.35)] ring-1 ring-zinc-900/5">
              <Image
                src={spotlightImage}
                alt=""
                fill
                placeholder="blur"
                quality={75}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover object-center"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Photograph · Edouard Tamba
            </figcaption>
          </figure>

          {/* Body — pull quote + meta + CTA */}
          <div className="mx-auto mt-14 max-w-3xl lg:mt-20">

            {/* Pull quote — the soul of the piece, brand blue */}
            <blockquote className="border-l-2 border-zinc-300 pl-6 lg:pl-8">
              <p
                className="text-[clamp(1.4rem,2.6vw,2rem)] font-light italic leading-[1.25] tracking-[-0.015em]"
                style={{ color: "#004E86" }}
              >
                &ldquo;Pool isn&rsquo;t about the table. It&rsquo;s about the table
                you grew up next to.&rdquo;
              </p>
              <footer className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                — Featured player, Kakamega Pool Club
              </footer>
            </blockquote>

            {/* Bottom row — credentials + CTA */}
            <div className="mt-14 flex flex-col gap-4 border-t border-zinc-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <dl className="grid grid-cols-3 gap-x-6 gap-y-1">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    County
                  </dt>
                  <dd className="mt-1 text-[14px] font-semibold text-ink">Kakamega</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Rating
                  </dt>
                  <dd className="mt-1 text-[14px] font-semibold tabular-nums text-ink">
                    1,000
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Rank
                  </dt>
                  <dd className="mt-1 text-[14px] font-semibold tabular-nums text-ink">
                    #5 KE
                  </dd>
                </div>
              </dl>
              <Link
                href="/news"
                className="group inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-80"
                style={{ color: "#004E86" }}
              >
                Read the full story
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

          </div>

        </article>
      </section>

      {/* ─── For Organizers — full-bleed photo with text overlay ─── */}
      <section
        className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-ink text-white lg:min-h-[88vh]"
        aria-labelledby="home-organizers-heading"
      >
        {/* Full-bleed background image */}
        <Image
          src={organizersImage}
          alt=""
          fill
          placeholder="blur"
          quality={75}
          sizes="100vw"
          className="object-cover object-center -z-20"
        />

        {/* Legibility scrim — bottom-up on mobile, left-to-right on desktop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 sm:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,22,40,0.30) 0%, rgba(10,22,40,0.55) 45%, rgba(10,22,40,0.92) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 hidden sm:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.75) 35%, rgba(10,22,40,0.35) 65%, rgba(10,22,40,0.10) 100%)",
          }}
        />
        {/* Subtle bottom-edge fade so the section bleeds into whatever's below */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 -z-10"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.55) 100%)",
          }}
        />

        {/* Content container */}
        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65">
              For Organizers
            </p>
            <h2
              id="home-organizers-heading"
              className="text-[clamp(2.25rem,5.2vw,4.25rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-white"
            >
              The room is yours.
              <br />
              <span className="text-white/55">We just keep the record.</span>
            </h2>
            <p className="mt-7 max-w-[48ch] text-[clamp(1rem,1.3vw,1.2rem)] font-light leading-[1.5] text-white/85">
              Every tournament that matters started with someone deciding to make it real.
              We handle the paperwork so you can handle the room.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/organizer"
                className="group inline-flex h-12 items-center gap-2 rounded-pill bg-gold pl-6 pr-2 text-[14px] font-bold text-ink transition-all hover:brightness-95"
              >
                Host an event
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/15 transition-colors group-hover:bg-ink/25">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center px-2 text-[14px] font-medium text-white/75 transition-colors hover:text-white"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── News / From the Magazine — light editorial archive teaser ─── */}
      <section
        className="relative overflow-hidden bg-zinc-100 py-20 text-ink lg:py-28"
        aria-labelledby="home-news-heading"
      >
        {/* Subtle film grain — same paper texture as Why and Spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)",
            backgroundSize: "3px 3px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">

          {/* Section header — eyebrow + headline, with right-aligned CTA on desktop */}
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-16">
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                From the magazine
              </p>
              <h2
                id="home-news-heading"
                className="text-[clamp(2.5rem,5.6vw,4.5rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-ink"
              >
                The table this week.
              </h2>
            </div>
            <Link
              href="/news"
              className="group hidden items-center gap-2 self-end pb-2 text-[14px] font-semibold transition-opacity hover:opacity-80 sm:inline-flex"
              style={{ color: "#004E86" }}
            >
              See all stories
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {homeNews.map((article) => (
              <Link
                key={article.headline}
                href={article.href}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-300 ring-1 ring-zinc-900/5 shadow-[0_20px_40px_-25px_rgba(0,78,134,0.25)]">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    placeholder="blur"
                    quality={75}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5">
                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "#004E86" }}
                  >
                    {article.category}
                  </p>
                  <h3
                    className="mt-2.5 text-[clamp(1.1rem,1.5vw,1.35rem)] font-extrabold leading-[1.15] tracking-[-0.015em] text-ink transition-colors"
                    style={{}}
                  >
                    <span className="group-hover:text-[#004E86] transition-colors">
                      {article.headline}
                    </span>
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.5] text-zinc-600">
                    {article.excerpt}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {article.byline} · {article.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile CTA — only shown when section header CTA is hidden */}
          <div className="mt-12 text-center sm:hidden">
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-80"
              style={{ color: "#004E86" }}
            >
              See all stories
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ─── Final Brand Statement — light magazine final spread, portrait + close ─── */}
      <section
        className="relative overflow-hidden py-20 text-ink lg:py-28"
        aria-labelledby="home-close-heading"
        style={{
          // Same brand mesh + grey base as The Why so the page's light sections share DNA.
          background:
            "radial-gradient(ellipse 60% 50% at 10% 20%, rgba(0,78,134,0.10), transparent 60%), radial-gradient(ellipse 55% 50% at 90% 85%, rgba(201,162,39,0.08), transparent 55%), #ECECEE",
        }}
      >
        {/* Paper grain — matches Why + Spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)",
            backgroundSize: "3px 3px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

            {/* Image LEFT — portrait of a player, magazine "final spread" plate */}
            <div
              className="fade-up-in relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-300 shadow-[0_40px_80px_-40px_rgba(0,78,134,0.35)] ring-1 ring-zinc-900/5"
              style={{ animationDelay: "0ms" }}
            >
              <Image
                src={wallImage}
                alt=""
                fill
                placeholder="blur"
                quality={75}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Text RIGHT — eyebrow → headline → hairline → CTA */}
            <div className="flex flex-col">
              {/* Eyebrow — bookend with the hero tagline */}
              <p
                className="fade-up-in mb-7 font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500 sm:text-[12px]"
                style={{ animationDelay: "100ms" }}
              >
                Africa&rsquo;s home of cue sports
              </p>

              {/* The closing line — massive, two-part with muted resolution */}
              <h2
                id="home-close-heading"
                className="fade-up-in text-[clamp(2.5rem,6.4vw,5.5rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-ink"
                style={{ animationDelay: "220ms" }}
              >
                Put your name
                <br />
                <span className="text-zinc-400">on the wall.</span>
              </h2>

              {/* Hairline flourish — magazine "end-mark" */}
              <div
                className="fade-up-in mt-9 h-px w-16 bg-zinc-400"
                style={{ animationDelay: "400ms" }}
              />

              {/* Single CTA — gold pill, the conversion close */}
              <div
                className="fade-up-in mt-8"
                style={{ animationDelay: "500ms" }}
              >
                <Link
                  href="/tournaments"
                  className="group inline-flex h-12 items-center gap-2 rounded-pill bg-gold pl-6 pr-2 text-[14px] font-bold text-ink transition-all hover:brightness-95"
                >
                  Find a tournament near you
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/15 transition-colors group-hover:bg-ink/25">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Get the App — floating rounded card on canvas, breathing room before footer ─── */}
      <div className="bg-canvas px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
        <section
          className="relative isolate overflow-hidden rounded-[28px] border border-rule bg-ink py-20 text-center text-white sm:rounded-[32px] lg:py-24"
          aria-labelledby="home-app-heading"
        >
          {/* Single quiet brand-blue radial — different from the brand-statement's gold glow */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(0,78,134,0.14), transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
          <h2
            id="home-app-heading"
            className="text-[clamp(1.85rem,4.6vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white"
          >
            The table, in your pocket.
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-[clamp(0.95rem,1.2vw,1.1rem)] font-light leading-[1.5] text-white/75">
            Brackets, rankings, match results — wherever the game finds you.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            {/* Google Play — official badge, active, links to Play Store */}
            <AppDownloadButton
              href="https://play.google.com/store/apps/details?id=com.cuesportsafrica.app"
              source="home_app_section_android"
              className="inline-block transition-opacity hover:opacity-85"
            >
              <Image
                src="/badges/google-play.png"
                alt="Get it on Google Play"
                width={180}
                height={54}
                className="h-20 w-auto select-none"
                unoptimized
              />
            </AppDownloadButton>

            {/* App Store — official badge, visually muted, non-functional. */}
            <div
              className="relative inline-flex cursor-not-allowed items-center"
              aria-disabled="true"
              title="iOS app coming soon"
            >
              <Image
                src="/badges/app-store.svg"
                alt="Download on the App Store (coming soon)"
                width={180}
                height={54}
                className="h-14 w-auto select-none opacity-45"
                unoptimized
              />
            </div>
          </div>
          </div>
        </section>
      </div>

    </div>
  );
}
