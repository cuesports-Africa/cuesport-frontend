import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  UserPlus,
  Search,
  Trophy,
  TrendingUp,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

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
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How CueSports Africa Works
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            From signing up to winning championships — here's your path to
            becoming a ranked pool player in Africa.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-8 items-start ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-primary/20">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-muted/30 rounded-2xl h-64 flex items-center justify-center">
                  <step.icon className="h-24 w-24 text-primary/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Playing?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of players already competing on CueSports Africa.
            Registration is free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/tournaments">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
