import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  UserPlus,
  Search,
  Trophy,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "How It Works - Get Started in 4 Steps",
  description:
    "Learn how CueSports Africa works. Create an account, find tournaments, compete with live scoring, and build your Elo rating — all in 4 simple steps.",
  keywords: [
    "how to join pool tournament",
    "how to join snooker tournament",
    "how to enter pool competition Africa",
    "pool tournament registration",
    "snooker tournament registration online",
    "Elo rating system pool",
    "Elo rating system snooker",
    "cuesports africa sign up",
    "African pool tournaments",
    "African snooker tournaments",
    "live scoring pool",
    "live scoring snooker",
    "how to play competitive pool",
    "pool tournament for beginners Africa",
    "how to get pool ranking",
    "cue sport registration",
    "cue sport platform Africa",
  ],
  openGraph: {
    title: "How CueSports Africa Works - 4 Simple Steps",
    description:
      "From signing up to winning championships. Create an account, find tournaments, compete live, and build your Elo rating.",
    url: "https://cuesports.africa/about/how-it-works",
  },
  alternates: {
    canonical: "https://cuesports.africa/about/how-it-works",
  },
};

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up for free as a player or organizer. Complete your profile with your location and skill level.",
    details: [
      "Quick registration with email or phone",
      "Set your home venue",
      "Choose your preferred game type",
    ],
  },
  {
    number: "02",
    icon: Search,
    title: "Find Tournaments",
    description:
      "Browse upcoming tournaments in your area. Filter by format, entry fee, and skill level.",
    details: [
      "See tournaments near you",
      "Check prize pools and formats",
      "Register and pay entry fees online",
    ],
  },
  {
    number: "03",
    icon: Trophy,
    title: "Compete & Win",
    description:
      "Play your matches with live scoring. Results are tracked automatically for fair competition.",
    details: [
      "Real-time bracket updates",
      "Live scoring from any device",
      "Instant notifications for your matches",
    ],
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Build Your Rating",
    description:
      "Every match counts toward your Elo rating. Climb the rankings from community to national level.",
    details: [
      "Professional Elo rating system",
      "Track your progress over time",
      "Qualify for bigger tournaments",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Get Started on CueSports Africa",
          description:
            "From signing up to winning championships — here's your path to becoming a ranked pool player in Africa.",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.description,
          })),
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
              name: "About",
              item: "https://cuesports.africa/about",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "How It Works",
              item: "https://cuesports.africa/about/how-it-works",
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <span className="badge-pill animate-slide-up">
              <Zap className="h-3.5 w-3.5" />
              Simple Process
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How CueSports Africa <span className="text-electric text-glow">Works</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From signing up to winning championships — here's your path to
            becoming a ranked pool player in Africa.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 lg:py-28" style={{ background: "rgba(0,30,40,0.4)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-bold font-mono text-electric/30">
                      {step.number}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-3 text-sm font-medium text-foreground/85"
                      >
                        <div className="w-5 h-5 rounded-full bg-electric/15 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-3.5 w-3.5 text-electric" />
                        </div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Visual Placeholder card */}
                <div className="flex-1 w-full max-w-sm lg:max-w-none">
                  <div className="card-dark aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <step.icon className="h-28 w-28 text-primary/20 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,191,191,0.1) 0%, transparent 80%)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ready to Start Playing?</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of players already competing on CueSports Africa.
            Registration is free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-electric text-[#030e10] hover:bg-electric/90 font-semibold px-8 h-12 rounded-full glow-cyan" asChild>
              <Link href="/tournaments">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40 rounded-full px-8 h-12" asChild>
              <Link href="/about/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
