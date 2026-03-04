import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Smartphone,
  Shield,
  Zap,
  Globe,
  CreditCard,
  Bell,
  ArrowRight,
  Check,
  Brackets,
  Timer,
  Award,
  TrendingUp,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Features - Tournament Management Tools",
  description:
    "Powerful cue sport management tools: smart brackets, live scoring, Elo ratings, and M-Pesa payments. Everything you need for professional tournaments.",
  keywords: [
    "pool tournament bracket generator",
    "snooker tournament software",
    "live match scoring app",
    "live pool scoring",
    "Elo rating system pool",
    "Elo rating snooker",
    "M-Pesa tournament payments",
    "pool league management software",
    "snooker league management",
    "tournament management features",
    "billiards tournament app",
    "pool tournament app Africa",
    "8-ball bracket generator",
    "9-ball tournament software",
    "pool club management",
    "automatic pool seeding",
    "cue sport tournament software",
    "cue sport management app",
    "cuesport africa",
    "cuesports africa",
    "billiards africa",
    "snooker africa",
    "pool tournament africa",
    "pool tournament management",
    "cue sport platform",
    "8 ball pool africa",
    "pool league africa",
    "African pool tournament",
    "cue sport tournament",
  ],
  openGraph: {
    title: "Features - CueSports Africa Tournament Management",
    description:
      "Smart brackets, live scoring, Elo ratings, M-Pesa payments. Everything you need for professional tournaments.",
    url: "https://cuesports.africa/features",
  },
  alternates: {
    canonical: "https://cuesports.africa/features",
  },
};

const heroFeatures = [
  "Unlimited tournaments",
  "Real-time brackets",
  "M-Pesa payments",
  "Elo ratings",
];

const mainFeatures = [
  {
    icon: Brackets,
    title: "Smart Bracket Generation",
    description:
      "Single elimination, double elimination, round robin, or Swiss. Our system automatically generates fair brackets with proper seeding based on player ratings.",
    highlights: [
      "Multiple format support",
      "Automatic seeding",
      "Bye distribution",
      "Live bracket updates",
    ],
  },
  {
    icon: Timer,
    title: "Live Match Scoring",
    description:
      "Real-time score updates that players, spectators, and fans can follow from anywhere. No more waiting for results.",
    highlights: [
      "Mobile-friendly scoring",
      "Instant updates",
      "Match timers",
      "Score verification",
    ],
  },
  {
    icon: TrendingUp,
    title: "Elo Rating System",
    description:
      "Professional rating system that tracks player skill over time. Every match counts toward your official ranking.",
    highlights: [
      "Skill-based ratings",
      "Rating history",
      "Performance analytics",
      "Leaderboards",
    ],
  },
  {
    icon: CreditCard,
    title: "Entry Fee Collection",
    description:
      "Collect entry fees online through M-Pesa or card. Funds are securely held and transferred after tournament completion.",
    highlights: [
      "M-Pesa integration",
      "Card payments",
      "Automatic payouts",
      "Transaction tracking",
    ],
  },
];

const additionalFeatures = [
  {
    icon: Trophy,
    title: "Tournament Management",
    description:
      "Create tournaments in minutes. Set rules, entry fees, and start times. Everything else is automated.",
  },
  {
    icon: Users,
    title: "Player Profiles",
    description:
      "Every player gets a profile with their match history, rating progression, and tournament achievements.",
  },
  {
    icon: Calendar,
    title: "Event Scheduling",
    description:
      "Plan recurring tournaments, set registration deadlines, and send automatic reminders to players.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Players receive SMS and email notifications for match calls, results, and tournament updates.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track attendance, revenue, and player engagement. Make data-driven decisions for your events.",
  },
  {
    icon: Globe,
    title: "Multi-Location Support",
    description:
      "Manage tournaments across multiple venues. Perfect for leagues and tournament series.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "Everything works on mobile. Players can register, check brackets, and view results from their phones.",
  },
  {
    icon: Shield,
    title: "Fair Play Enforcement",
    description:
      "Built-in tools to prevent sandbagging, manage disputes, and maintain competitive integrity.",
  },
];

const useCases = [
  {
    title: "Pool Halls & Bars",
    description:
      "Run weekly tournaments that keep players coming back. Track regulars, build community, and increase revenue.",
    icon: "🎱",
  },
  {
    title: "League Operators",
    description:
      "Manage season-long leagues with automatic standings, playoffs, and end-of-season rankings.",
    icon: "🏆",
  },
  {
    title: "Federations",
    description:
      "National and regional federations use CueSports to run official ranking events and track player development.",
    icon: "🌍",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CueSports Africa",
          applicationCategory: "SportsApplication",
          operatingSystem: "Web, iOS, Android",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free tier available",
          },
          featureList: [
            "Smart Bracket Generation",
            "Live Match Scoring",
            "Elo Rating System",
            "M-Pesa Entry Fee Collection",
            "Player Notifications",
            "Analytics Dashboard",
            "Multi-Location Support",
            "Mobile-First Design",
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://cuesports.africa",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Features",
              item: "https://cuesports.africa/features",
            },
          ],
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <span className="badge-pill animate-slide-up">
                <Zap className="h-3.5 w-3.5" />
                All-in-one platform
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Everything you need to run<br />
              <span className="text-electric text-glow">professional tournaments</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              From bracket generation to prize payouts, CueSports Africa handles
              the logistics so you can focus on the game.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {heroFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm card-dark px-4 py-2"
                >
                  <div className="w-4 h-4 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-electric" />
                  </div>
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="bg-electric text-[#030e10] font-semibold hover:bg-electric/90 glow-cyan rounded-full px-8 h-12" asChild>
                <Link href="/tournaments">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40 rounded-full px-8 h-12" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 lg:py-28" style={{ background: "rgba(0,30,40,0.4)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge-pill mb-4 inline-flex">Core Capabilities</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">
              Core features that power your tournaments
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Built specifically for pool tournament organizers in Africa, with
              the tools and integrations you actually need.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainFeatures.map((feature) => (
              <div
                key={feature.title}
                className="card-dark p-8 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-6 border-t border-border/40">
                  {feature.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-2.5 text-sm text-foreground/80"
                    >
                      <div className="w-4 h-4 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5 text-electric" />
                      </div>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge-pill mb-4 inline-flex">Complete Toolkit</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">
              And so much more
            </h2>
            <p className="text-muted-foreground text-sm">
              Every feature you need, built right in.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="card-dark p-6 card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 lg:py-28" style={{ background: "rgba(0,30,40,0.5)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built for <span className="text-electric">organizers like you</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Whether you run a local pool hall or a national federation, we
              have the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="text-center p-8 rounded-2xl border gradient-border relative card-hover"
              >
                <span className="text-5xl mb-6 block relative z-10">{useCase.icon}</span>
                <h3 className="text-xl font-bold mb-3 relative z-10 text-foreground">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,191,191,0.1) 0%, transparent 80%)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Award className="h-16 w-16 mx-auto mb-6 text-gold" />
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Ready to professionalize your tournaments?
          </h2>
          <p className="text-sm opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed text-muted-foreground">
            Join the growing community of organizers using CueSports Africa.
            Start free, upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-electric text-[#030e10] hover:bg-electric/90 font-semibold px-8 h-12 rounded-full glow-cyan"
              asChild
            >
              <Link href="/tournaments">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/60 hover:border-primary/40 rounded-full px-8 h-12"
              asChild
            >
              <Link href="/about/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
