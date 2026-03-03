import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/pricing-cards";
import { JsonLd } from "@/components/seo/json-ld";
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

const stats = [
  { value: "1M+", label: "Active Players" },
  { value: "2K+", label: "Organisers" },
  { value: "47", label: "Counties" },
  { value: "8", label: "Countries" },
];

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

export default function Home() {
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

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] overflow-hidden hero-gradient flex items-center">
        {/* Background orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(0,191,191,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(0,245,255,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <div className="flex justify-center mb-8">
              <span className="badge-pill animate-slide-up">
                <Trophy className="h-3.5 w-3.5" />
                Africa&apos;s #1 Pool Tournament Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 text-foreground">
              Tournament{" "}
              <span className="shimmer-text">infrastructure</span>
              <br />
              for{" "}
              <span className="text-electric text-glow">African pool</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              The complete platform for running professional pool tournaments.
              Brackets, ratings, payments, and rankings — everything you need to
              grow the game across Africa.
            </p>

            {/* Search bar (TukioHub style) */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative flex items-center">
                <Search className="absolute left-5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search tournaments, players, venues..."
                  className="search-input-dark w-full pl-12 pr-32 py-3.5 text-sm"
                />
                <Button
                  size="sm"
                  className="absolute right-2 bg-electric text-[#030e10] font-semibold hover:bg-electric/90 rounded-full px-4 h-8 text-xs"
                >
                  Find Events
                </Button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/tournaments">
                <Button
                  size="lg"
                  className="bg-electric text-[#030e10] font-semibold hover:bg-electric/90 glow-cyan h-12 px-7 rounded-full text-sm"
                >
                  View Tournaments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/about/contact"
                className="flex items-center gap-2 text-muted-foreground hover:text-electric font-medium transition-colors text-sm px-4 py-3"
              >
                Contact sales
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Partners Logo Strip */}
            <div className="mt-16 pt-10 border-t border-border/20 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 label-caps">
                Trusted by Top African Organizers
              </p>
              <div className="flex justify-center opacity-70 hover:opacity-100 transition-opacity">
                <Image
                  src="/partners.png"
                  alt="Partner Logos"
                  width={800}
                  height={120}
                  className="h-10 md:h-12 w-auto object-contain"
                  priority
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="py-12 border-y border-border/50" style={{ background: "rgba(0,40,50,0.4)" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-electric mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
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
