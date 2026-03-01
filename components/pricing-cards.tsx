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
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {displayTiers.map((tier) => {
        const Icon = tierIcons[tier.name] || Zap;
        const isHighlighted = tier.isPopular;

        return (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-7 transition-all duration-300 ${isHighlighted
                ? "gradient-border scale-[1.02] shadow-2xl"
                : "card-dark card-hover"
              }`}
          >
            {isHighlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span
                  className="text-[#030e10] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
                  style={{ background: "var(--electric)" }}
                >
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isHighlighted
                    ? "bg-electric/10 border-electric/25"
                    : "bg-primary/10 border-primary/20"
                  }`}
              >
                <Icon
                  className={`h-5 w-5 ${isHighlighted ? "text-electric" : "text-primary"}`}
                />
              </div>
              <h3 className="text-xl font-bold">{tier.name}</h3>
            </div>

            <p className="text-sm mb-5 text-muted-foreground">{tier.label}</p>

            <div className="mb-5">
              <span className="text-4xl font-bold">{formatTierPrice(tier)}</span>
              <span className="text-sm text-muted-foreground block mt-1">
                per tournament
              </span>
            </div>

            <div
              className="text-xs mb-6 px-3 py-2 rounded-lg"
              style={{
                background: isHighlighted
                  ? "rgba(0,245,255,0.08)"
                  : "rgba(0,191,191,0.06)",
                border: "1px solid rgba(0,191,191,0.12)",
                color: "var(--muted-foreground)",
              }}
            >
              + {entryFeeRate.percentage}% on entry fee collections
            </div>

            <Button
              asChild
              className={`w-full mb-7 rounded-full font-semibold ${isHighlighted
                  ? "bg-electric text-[#030e10] hover:bg-electric/90 glow-cyan"
                  : ""
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
                <div key={feature} className="flex items-start gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlighted
                        ? "bg-electric/15"
                        : "bg-primary/12"
                      }`}
                  >
                    <Check
                      className={`h-2.5 w-2.5 ${isHighlighted ? "text-electric" : "text-primary"
                        }`}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
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
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="badge-pill mb-4 inline-flex">Simple Pricing</span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-4 mb-3">
            Pay per tournament, not per month
          </h2>
          <p className="text-muted-foreground text-sm">
            No subscriptions. No monthly fees. Just a one-time fee when you host.
          </p>
        </div>

        <PricingCards />

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="text-sm text-primary hover:text-electric transition-colors hover:underline"
          >
            View all 5 tiers including Major & Championship →
          </Link>
        </div>

        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Need a custom plan for your federation or large-scale events?
          </p>
          <Button variant="outline" size="lg" className="rounded-full border-border/60" asChild>
            <Link href="/about/contact?plan=enterprise">
              Contact us for Enterprise pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-14 pt-10 border-t border-border/30">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
            {["No subscriptions", "Pay per tournament", "All features included", "M-Pesa & card payments"].map(
              (badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{badge}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
