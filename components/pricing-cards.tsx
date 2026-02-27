import { Check, Zap, Users, Trophy, Crown, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pricingTiers, formatTierPrice, entryFeeRate, type PricingTier } from "@/config/plans";

const tierIcons: Record<string, typeof Zap> = {
  Small: Zap,
  Medium: Users,
  Large: Trophy,
  Major: Crown,
  Championship: Building2,
};

export function PricingCards() {
  // Show only 3 tiers on landing page (Small, Medium, Large)
  const displayTiers = pricingTiers.slice(0, 3);

  return (
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {displayTiers.map((tier) => {
        const Icon = tierIcons[tier.name] || Zap;
        const isHighlighted = tier.isPopular;

        return (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-8 transition-all duration-300 ${
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

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isHighlighted ? "bg-gold/20" : "bg-primary/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isHighlighted ? "text-gold" : "text-primary"}`}
                />
              </div>
              <h3 className="text-xl font-bold">{tier.name}</h3>
            </div>

            <p
              className={`text-sm mb-6 ${
                isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              {tier.label}
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold">{formatTierPrice(tier)}</span>
              <span
                className={`text-sm block mt-1 ${
                  isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                per tournament
              </span>
            </div>

            <div
              className={`text-xs mb-6 px-3 py-2 rounded-lg ${
                isHighlighted
                  ? "bg-white/10 text-primary-foreground/80"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              + {entryFeeRate.percentage}% on entry fee collections
            </div>

            <Button
              asChild
              className={`w-full mb-8 ${
                isHighlighted ? "bg-gold hover:bg-gold/90 text-primary" : ""
              }`}
              variant={isHighlighted ? "default" : "outline"}
              size="lg"
            >
              <Link href="/tournaments">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <div className="space-y-3">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isHighlighted ? "bg-gold/20" : "bg-green-100"
                    }`}
                  >
                    <Check
                      className={`h-3 w-3 ${isHighlighted ? "text-gold" : "text-green-600"}`}
                    />
                  </div>
                  <span
                    className={`text-sm ${isHighlighted ? "text-primary-foreground/90" : ""}`}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PricingSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Simple Pricing
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-6 mb-4">
            Pay per tournament, not per month
          </h2>
          <p className="text-lg text-muted-foreground">
            No subscriptions. No monthly fees. Just a one-time fee when you host.
          </p>
        </div>

        <PricingCards />

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="text-sm text-primary hover:underline"
          >
            View all 5 tiers including Major & Championship →
          </Link>
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
  );
}
