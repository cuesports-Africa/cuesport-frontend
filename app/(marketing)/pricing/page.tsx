import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HelpCircle, Check, Users, Trophy, Zap, Crown, Building2 } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { pricingTiers, formatTierPrice, entryFeeRate, type PricingTier } from "@/config/plans";

export const metadata: Metadata = {
  title: "Pricing - Per-Tournament Fees",
  description:
    "Simple per-tournament pricing for pool tournament organizers. Pay only when you host. Starting at KES 500 for up to 16 players. M-Pesa payments supported.",
  keywords: [
    "pool tournament software pricing",
    "tournament management cost",
    "M-Pesa tournament payments",
    "pool league software",
    "bracket generator pricing",
    "Elo rating system",
    "pay per tournament",
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background pt-20 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Pay per tournament, not per month
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No subscriptions. No monthly fees. Just pay when you host a tournament,
            based on the number of players.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Simple Pricing
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-6 mb-4">
              Choose your tournament size
            </h2>
            <p className="text-lg text-muted-foreground">
              One-time fee per tournament. All features included at every tier.
              Pay via M-Pesa or card.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
            {pricingTiers.map((tier) => {
              const Icon = tierIcons[tier.name] || Zap;
              const isHighlighted = tier.isPopular;

              return (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl p-6 transition-all duration-300 ${
                    isHighlighted
                      ? "bg-primary text-primary-foreground scale-105 shadow-2xl shadow-primary/20 border-2 border-gold"
                      : "bg-card border hover:shadow-xl hover:border-primary/20"
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gold text-primary text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isHighlighted ? "bg-gold/20" : "bg-primary/10"}`}>
                      <Icon className={`h-4 w-4 ${isHighlighted ? "text-gold" : "text-primary"}`} />
                    </div>
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                  </div>

                  <p className={`text-xs mb-4 ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {tier.label}
                  </p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold">{formatTierPrice(tier)}</span>
                    <span className={`text-xs block mt-1 ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      per tournament
                    </span>
                  </div>

                  <Button
                    asChild
                    className={`w-full mb-5 ${isHighlighted ? "bg-gold hover:bg-gold/90 text-primary" : ""}`}
                    variant={isHighlighted ? "default" : "outline"}
                    size="sm"
                  >
                    <Link href="/tournaments">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="space-y-2">
                    {tier.features.slice(0, 5).map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlighted ? "bg-gold/20" : "bg-green-100"}`}>
                          <Check className={`h-2.5 w-2.5 ${isHighlighted ? "text-gold" : "text-green-600"}`} />
                        </div>
                        <span className={`text-xs ${isHighlighted ? "text-primary-foreground/90" : ""}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Entry fee processing note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-xl">
              <span className="text-sm text-muted-foreground">
                Entry fee processing: <strong className="text-foreground">{entryFeeRate.percentage}%</strong> on collected player entry fees via M-Pesa/card
              </span>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Need a custom plan for your federation or large-scale events?
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about/contact?plan=enterprise">
                Contact us for Enterprise pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-16 pt-16 border-t">
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">No subscriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Pay per tournament</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">All features included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">M-Pesa & card payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-card rounded-xl p-6 border">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-10 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to host your first tournament?
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
              Join hundreds of organizers already using CueSports Africa to run
              professional pool tournaments. Pay only when you play.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary" asChild>
                <Link href="/tournaments">
                  Create a Tournament
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/about/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
