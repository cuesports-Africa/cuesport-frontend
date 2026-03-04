import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HelpCircle, Check, Users, Trophy, Zap, Crown, Building2, CreditCard } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { pricingTiers, formatTierPrice, entryFeeRate, type PricingTier } from "@/config/plans";

export const metadata: Metadata = {
  title: "Pricing - Per-Tournament Fees",
  description:
    "Simple per-tournament pricing for pool tournament organizers. Pay only when you host. Starting at KES 500 for up to 16 players. M-Pesa payments supported.",
  keywords: [
    "pool tournament software pricing",
    "snooker tournament software cost",
    "tournament management cost",
    "M-Pesa tournament payments",
    "pool league software",
    "snooker league software pricing",
    "bracket generator pricing",
    "Elo rating system",
    "pay per tournament",
    "pool tournament entry fee collection",
    "how much does pool tournament software cost",
    "affordable pool tournament app Africa",
    "free pool tournament software",
    "cue sport software pricing",
    "cue sport tournament cost",
  ],
  openGraph: {
    title: "Pricing - CueSports Africa Tournament Management",
    description:
      "Pay per tournament, not per month. No subscriptions. M-Pesa & card payments supported.",
    url: "https://cuesports.africa/pricing",
  },
  alternates: {
    canonical: "https://cuesports.africa/pricing",
  },
};

const tierIcons: Record<string, typeof Zap> = {
  Small: Zap,
  Medium: Users,
  Large: Trophy,
  Major: Crown,
  Championship: Building2,
};

const faqs = [
  {
    question: "How does per-tournament pricing work?",
    answer: "You pay a one-time fee when you create a tournament, based on the maximum number of players you set. No monthly subscriptions or hidden fees.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa, Visa, Mastercard, and bank transfers. All payments are processed securely through our payment partners.",
  },
  {
    question: "How do entry fee collections work?",
    answer: `Players pay entry fees through M-Pesa or card. We charge ${entryFeeRate.percentage}% processing fee on collected entry fees. Funds are transferred to your account after the tournament ends.`,
  },
  {
    question: "What if my tournament gets cancelled?",
    answer: "If you cancel before registration opens, you get a full refund. After registration opens, contact our support team for assistance.",
  },
  {
    question: "Can I change the max players after creating a tournament?",
    answer: "You can increase the max players (and pay the difference) before the tournament starts. Decreasing is not supported after creation.",
  },
  {
    question: "Do you offer discounts for frequent organizers?",
    answer: "Yes! Organizers who host 5+ tournaments per month get a 10% discount. Contact us for custom arrangements for federations and leagues.",
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
    <main className="min-h-screen">
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
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
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
              name: "Pricing",
              item: "https://cuesports.africa/pricing",
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
              Transparent Fees
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Pay per tournament, <span className="text-electric text-glow">not per month</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            No subscriptions. No monthly fees. Just pay when you host a tournament,
            based on the number of players.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 lg:py-28" style={{ background: "rgba(0,30,40,0.4)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Choose your tournament size
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              One-time fee per tournament. All features included at every tier.
              Pay seamlessly via M-Pesa or card.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {pricingTiers.map((tier) => {
              const Icon = tierIcons[tier.name] || Zap;
              const isHighlighted = tier.isPopular;

              return (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl p-6 transition-all duration-300 card-hover ${isHighlighted
                    ? "gradient-border shadow-2xl scale-[1.02] transform lg:-translate-y-2 z-10"
                    : "card-dark"
                    }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-electric text-[#030e10] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isHighlighted ? "bg-electric/15 border-electric/30" : "bg-primary/10 border-primary/20"}`}>
                      <Icon className={`h-5 w-5 ${isHighlighted ? "text-electric glow-text" : "text-primary"}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6 h-8">
                    {tier.label}
                  </p>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">{formatTierPrice(tier)}</span>
                    <span className="text-xs block mt-1 text-muted-foreground font-medium">
                      per tournament
                    </span>
                  </div>

                  <div
                    className="text-[11px] mb-6 px-3 py-2.5 rounded-xl border"
                    style={{
                      background: isHighlighted
                        ? "rgba(0,245,255,0.08)"
                        : "rgba(0,191,191,0.06)",
                      borderColor: isHighlighted
                        ? "rgba(0,245,255,0.15)"
                        : "rgba(0,191,191,0.12)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    + {entryFeeRate.percentage}% processing on entry fees
                  </div>

                  <Button
                    asChild
                    className={`w-full mb-6 rounded-full h-11 font-semibold ${isHighlighted ? "bg-electric hover:bg-electric/90 text-[#030e10] glow-cyan" : ""}`}
                    variant={isHighlighted ? "default" : "outline"}
                    size="default"
                  >
                    <Link href="/tournaments">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="space-y-3">
                    {tier.features.slice(0, 5).map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlighted ? "bg-electric/15" : "bg-primary/15"}`}>
                          <Check className={`h-2.5 w-2.5 ${isHighlighted ? "text-electric" : "text-primary"}`} />
                        </div>
                        <span className="text-xs text-foreground/80 leading-relaxed font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6 label-caps">
              Enterprise & Large Scale Events
            </p>
            <p className="text-sm text-foreground/80 mb-6 max-w-md mx-auto">
              Need a custom plan for your federation, national league, or multi-venue tournament series?
            </p>
            <Button variant="outline" size="lg" className="rounded-full border-border/60 hover:border-primary/40 h-12 px-8" asChild>
              <Link href="/about/contact?plan=enterprise">
                Contact us for Custom Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-20 pt-12 border-t border-border/30">
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              {[
                { label: "No subscriptions", icon: Check },
                { label: "Pay per tournament", icon: Zap },
                { label: "All features included", icon: Crown },
                { label: "M-Pesa & cards", icon: CreditCard },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <badge.icon className="h-4 w-4 text-electric" />
                  </div>
                  <span className="text-sm font-medium text-foreground/85">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge-pill mb-4 inline-flex">
              <HelpCircle className="h-3.5 w-3.5" />
              Got Questions?
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question} className="card-dark p-6 card-hover">
                <h3 className="font-bold text-foreground mb-3 text-sm">{faq.question}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
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
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to host your first tournament?
          </h2>
          <p className="text-sm opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed text-muted-foreground">
            Join hundreds of organizers already using CueSports Africa to run
            professional pool tournaments. Pay only when you play.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="bg-electric text-[#030e10] hover:bg-electric/90 font-semibold px-8 h-12 rounded-full glow-cyan" asChild>
              <Link href="/tournaments">
                Create a Tournament
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40 rounded-full px-8 h-12" asChild>
              <Link href="/about/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
