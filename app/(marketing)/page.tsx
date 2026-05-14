import Link from "next/link";
import Image from "next/image";
import heroImage from "@/public/hero.jpg";
import heroMobileImage from "@/public/hero-mobile.jpg";
import whyImage from "@/public/why.jpg";
import spotlightImage from "@/public/spotlight.jpg";
import organizersImage from "@/public/organizers.jpg";
import { Button } from "@/components/ui/button";
import { HomeRankings } from "@/components/home-rankings";
import { getHomeData } from "@/lib/home-data";
import { PricingCards } from "@/components/pricing-cards";
import { JsonLd } from "@/components/seo/json-ld";
import { AppDownloadButton } from "@/components/app-download-button";
import { ArrowUpRight } from "lucide-react";
import {
  ArrowRight,
  Check,
  Brackets,
  Timer,
  TrendingUp,
  CreditCard,
  Trophy,
  Users,
  Calendar,
  Bell,
  BarChart3,
  Globe,
  Smartphone,
  Shield,
  Quote,
  MapPin,
  Star,
  Search,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";

const mainFeatures = [
  {
    icon: Brackets,
    title: "Smart Bracket Generation",
    description:
      "Single elimination, double elimination, round robin, or Swiss. Automatic seeding based on player ratings.",
  },
  {
    icon: Timer,
    title: "Live Match Scoring",
    description:
      "Real-time score updates that players and spectators can follow from anywhere.",
  },
  {
    icon: TrendingUp,
    title: "Elo Rating System",
    description:
      "Professional rating system that tracks player skill. Every match counts toward your ranking.",
  },
  {
    icon: CreditCard,
    title: "Entry Fee Collection",
    description:
      "Collect entry fees via M-Pesa or card. Funds held securely and transferred after events.",
  },
];

const additionalFeatures = [
  { icon: Trophy, title: "Tournament Management" },
  { icon: Users, title: "Player Profiles" },
  { icon: Calendar, title: "Event Scheduling" },
  { icon: Bell, title: "SMS Notifications" },
  { icon: BarChart3, title: "Analytics Dashboard" },
  { icon: Globe, title: "Multi-Location Support" },
  { icon: Smartphone, title: "Mobile First" },
  { icon: Shield, title: "Fair Play Enforcement" },
];

const testimonials = [
  {
    quote:
      "Before CueSports, I spent hours managing brackets on paper. Now I set up a tournament in 5 minutes.",
    author: "James Ochieng",
    role: "Kutus Pool Club",
    location: "Kirinyaga",
    rating: 5,
  },
  {
    quote:
      "The M-Pesa integration changed everything. Players pay instantly, and I don't have to chase cash.",
    author: "Grace Wanjiku",
    role: "Tournament Director",
    location: "Nairobi",
    rating: 5,
  },
  {
    quote:
      "Our league grew from 30 to 200 players. The rating system gives players something to compete for.",
    author: "Peter Kimani",
    role: "League Commissioner",
    location: "Nakuru",
    rating: 5,
  },
];

const customerTypes = [
  { title: "Pool Halls", count: "120+", icon: "🎱" },
  { title: "Leagues", count: "25+", icon: "🏆" },
  { title: "Organizers", count: "80+", icon: "👤" },
  { title: "Federations", count: "3", icon: "🌍" },
];

const tournamentCategories = [
  { label: "All Events", emoji: "🎯", active: true },
  { label: "Pool / 8-Ball", emoji: "🎱" },
  { label: "Snooker", emoji: "🏴" },
  { label: "9-Ball", emoji: "🔵" },
  { label: "Carrom", emoji: "⭕" },
  { label: "Special Events", emoji: "🏆" },
];

const featuredTournaments = [
  {
    title: "Nairobi Open Championship",
    organizer: "CueSports Africa",
    location: "Nairobi CBD",
    date: "Mar 15, 2026",
    status: "upcoming",
    prize: "KES 50,000",
    players: "64",
    type: "8-Ball",
  },
  {
    title: "Mombasa Coastal Classic",
    organizer: "Coast Pool Federation",
    location: "Mombasa",
    date: "Mar 22, 2026",
    status: "registration",
    prize: "KES 30,000",
    players: "32",
    type: "Snooker",
  },
  {
    title: "Kisumu Lake Region Open",
    organizer: "Western Pool League",
    location: "Kisumu",
    date: "Apr 5, 2026",
    status: "upcoming",
    prize: "KES 25,000",
    players: "48",
    type: "Pool",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: Target,
    title: "Create Your Tournament",
    description: "Set up brackets, entry fees, rules, and scheduling in under 5 minutes.",
  },
  {
    step: "02",
    icon: Users,
    title: "Players Register & Pay",
    description: "Collect registrations and M-Pesa payments automatically — no chasing cash.",
  },
  {
    step: "03",
    icon: Zap,
    title: "Run & Score Live",
    description: "Update scores in real-time. Brackets auto-advance. Everyone follows live.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Rankings Update",
    description: "Elo ratings update instantly. Players see their standing grow with every win.",
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
                2,000+ organizers · 46 counties · 1M+ players
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

      {/* ─── For Organizers — dark, quiet pitch, magazine spread ─── */}
      <section
        className="relative overflow-hidden bg-ink py-20 text-white lg:py-28"
        aria-labelledby="home-organizers-heading"
      >
        {/* Subtle radial accent — barely-there warmth from behind the image side */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 85% 50%, rgba(201,162,39,0.06), transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16">

            {/* Text — left on desktop, top on mobile */}
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                For Organizers
              </p>
              <h2
                id="home-organizers-heading"
                className="text-[clamp(2.5rem,5.6vw,4.5rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-white"
              >
                The room is yours.
                <br />
                <span className="text-white/45">We just keep the record.</span>
              </h2>
              <p className="mt-8 max-w-[55ch] text-[clamp(1.05rem,1.4vw,1.25rem)] font-light leading-[1.5] text-white/75">
                Every tournament that matters started with someone deciding to make it real.
                The brackets, the entry fees, the names on the wall — we handle the paperwork
                so you can handle the room.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
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
                  className="inline-flex h-12 items-center px-2 text-[14px] font-medium text-white/65 transition-colors hover:text-white"
                >
                  See pricing
                </Link>
              </div>
            </div>

            {/* Image — right on desktop, bottom on mobile */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
              <Image
                src={organizersImage}
                alt=""
                fill
                placeholder="blur"
                quality={75}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              {/* Soft bottom vignette to anchor it to the dark page */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 60%, rgba(10,22,40,0.55) 100%)",
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ─── Browse by Category + Featured Tournaments ─── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-pill text-xs">
                  <Calendar className="h-3 w-3" />
                  Curated Events
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Happening <span className="text-electric">Soon</span>
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Discover unforgettable tournaments. New events added daily.
              </p>
            </div>
            <Link href="/tournaments" className="hidden md:flex items-center gap-1.5 text-sm text-primary hover:text-electric transition-colors font-medium">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-8 lg:gap-10">
            {/* Sidebar categories */}
            <aside className="hidden md:block w-56 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <Brackets className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground/70 tracking-wide uppercase text-xs label-caps">
                  Browse by Type
                </span>
              </div>
              <div className="space-y-1">
                {tournamentCategories.map((cat) => (
                  <button
                    key={cat.label}
                    className={`category-item ${cat.active ? "active" : ""}`}
                  >
                    <span className="text-base leading-none">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Tournament cards */}
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredTournaments.map((t) => (
                  <Link href="/tournaments" key={t.title}>
                    <div className="card-dark p-5 h-full group cursor-pointer">
                      {/* Status badge */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span
                          className={`status-badge ${t.status === "upcoming"
                            ? "upcoming"
                            : "registration"
                            }`}
                        >
                          {t.status === "upcoming" ? "Upcoming" : "Open Registration"}
                        </span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                          {t.type}
                        </span>
                      </div>

                      <h3 className="font-bold text-base mb-1 group-hover:text-electric transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        by {t.organizer}
                      </p>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          {t.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          {t.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          {t.players} players max
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Prize Pool</div>
                          <div className="font-bold text-electric text-sm">{t.prize}</div>
                        </div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center border border-border/50 group-hover:border-electric/40 group-hover:bg-electric/10 transition-all">
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-electric transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile view all */}
              <div className="mt-6 text-center md:hidden">
                <Link href="/tournaments">
                  <Button variant="outline" className="rounded-full border-border/60">
                    View All Tournaments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "rgba(0,30,40,0.5)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="badge-pill mb-4 inline-flex">
              <Zap className="h-3.5 w-3.5" />
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Up and running in <span className="text-electric">minutes</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              From idea to live tournament — no technical knowledge needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-12px)] w-full h-px border-t border-dashed border-border/50 z-0" />
                )}
                <div className="card-dark p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/50 font-mono tracking-widest">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Two Paths to Glory ─── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge-pill mb-4 inline-flex">
              <Trophy className="h-3.5 w-3.5" />
              Tournament Types
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Two Paths to <span className="text-electric">Glory</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Regular */}
            <div className="card-dark p-8 card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 border border-primary/20">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Regular Tournaments</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Open to everyone. Register, compete, and win. Perfect for casual
                players and building experience.
              </p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-primary" />
                  </div>
                  Open registration
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-primary" />
                  </div>
                  Immediate competition
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-primary" />
                  </div>
                  Rating points earned
                </li>
              </ul>
            </div>

            {/* Special — highlighted with gradient border */}
            <div className="gradient-border rounded-2xl p-8 card-hover relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-electric text-[#030e10] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ Official Pathway
                </span>
              </div>
              <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center mb-5 border border-electric/20">
                <Trophy className="w-6 h-6 text-electric" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Special Tournaments</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                The path to becoming national champion. Progress from community
                to county to region to national level.
              </p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-electric" />
                  </div>
                  Community → National pathway
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-electric" />
                  </div>
                  Official sanctioned events
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-electric" />
                  </div>
                  National ranking points
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-20" style={{ background: "rgba(0,30,40,0.4)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="badge-pill mb-4 inline-flex">
              <Zap className="h-3.5 w-3.5" />
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
              Everything you need to run tournaments
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Built specifically for pool tournament organizers in Africa, with
              the tools and integrations you actually need.
            </p>
          </div>

          {/* Main Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-10">
            {mainFeatures.map((feature) => (
              <div key={feature.title} className="card-dark p-6 card-hover group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2 text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all border"
                style={{
                  background: "rgba(0,191,191,0.06)",
                  borderColor: "rgba(0,191,191,0.15)",
                  color: "#6cb8c4",
                }}
              >
                <feature.icon className="h-3.5 w-3.5 text-primary" />
                {feature.title}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/features">
              <Button variant="outline" size="lg" className="rounded-full border-border/60 hover:border-primary/40">
                See All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="badge-pill mb-4 inline-flex">
              <Star className="h-3.5 w-3.5 fill-current" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
              Trusted by organizers <span className="text-electric">across Africa</span>
            </h2>
          </div>

          {/* Customer Type Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-14">
            {customerTypes.map((type) => (
              <div
                key={type.title}
                className="text-center p-5 rounded-xl"
                style={{
                  background: "rgba(0,191,191,0.05)",
                  border: "1px solid rgba(0,191,191,0.1)",
                }}
              >
                <span className="text-3xl block mb-2">{type.icon}</span>
                <div className="text-2xl font-bold text-electric">{type.count}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{type.title}</div>
              </div>
            ))}
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="card-dark p-6">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-electric fill-electric" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-primary/25 mb-3" />
                <p className="text-sm text-foreground/80 mb-5 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div
                  className="pt-4"
                  style={{ borderTop: "1px solid rgba(0,191,191,0.1)" }}
                >
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {testimonial.role}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                    <MapPin className="h-3 w-3 text-primary" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/customers">
              <Button variant="outline" size="lg" className="rounded-full border-border/60 hover:border-primary/40">
                See More Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section className="py-20" style={{ background: "rgba(0,30,40,0.4)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="badge-pill mb-4 inline-flex">
              <CreditCard className="h-3.5 w-3.5" />
              Simple Pricing
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-4 mb-3">
              Start free, scale as you grow
            </h2>
            <p className="text-muted-foreground text-sm">
              No hidden fees. No credit card required to start. Upgrade when
              you&apos;re ready.
            </p>
          </div>

          <PricingCards />

          <div className="mt-8 text-center">
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="rounded-full border-border/60 hover:border-primary/40">
                View Full Pricing Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-10 border-t border-border/30">
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
              {[
                "No credit card required",
                "14-day free trial",
                "Cancel anytime",
                "M-Pesa & card payments",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-electric" />
                  </div>
                  <span className="text-sm text-muted-foreground">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-24 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,191,191,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-electric fill-electric" />
            ))}
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 max-w-3xl mx-auto">
            Ready to professionalize
            <br />
            <span className="text-electric text-glow">your tournaments?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-sm leading-relaxed">
            Join hundreds of organizers already using CueSports Africa to run
            professional pool tournaments across the continent.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/tournaments">
              <Button
                size="lg"
                className="bg-electric text-[#030e10] font-semibold hover:bg-electric/90 glow-cyan h-12 px-8 rounded-full"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 hover:border-primary/40 rounded-full h-12 px-8"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
