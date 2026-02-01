import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HelpCircle, Check, Zap, Crown, Building2 } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { plansList, formatPrice, formatEntryFee, type Plan, type PlanCode } from "@/config/plans";

export const metadata: Metadata = {
  title: "Pricing - Tournament Management Plans",
  description:
    "Simple, transparent pricing for pool tournament organizers. Start free with 2 tournaments/month. Pro plan at $12/mo for unlimited tournaments with M-Pesa entry fee collection.",
  keywords: [
    "pool tournament software pricing",
    "tournament management cost",
    "M-Pesa tournament payments",
    "pool league software",
    "bracket generator pricing",
    "Elo rating system",
  ],
  openGraph: {
    title: "Pricing - CueSports Africa Tournament Management",
    description:
      "Start free, scale as you grow. No hidden fees. M-Pesa & card payments supported.",
    url: "https://cuesports.africa/pricing",
  },
  alternates: {
    canonical: "https://cuesports.africa/pricing",
  },
};

const planIcons: Record<PlanCode, typeof Zap> = {
  starter: Zap,
  pro: Crown,
  business: Building2,
};

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa, Visa, Mastercard, and bank transfers. All payments are processed securely through Paystack.",
  },
  {
    question: "How do entry fee collections work?",
    answer: "Players pay entry fees through M-Pesa or card. Funds are held securely and transferred to your account after the tournament ends, minus processing fees.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No contracts. All plans are month-to-month and you can cancel anytime. We believe in earning your business every month.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your tournament history and player data remain accessible for 90 days after cancellation. You can export everything before that period ends.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Pay annually and get 2 months free on Pro and Business plans. Contact us for custom enterprise arrangements.",
  },
];

function getCtaHref(plan: Plan): string {
  if (plan.code === "business") return "/about/contact?plan=business";
  if (plan.amount === 0) return "/auth/register";
  return `/auth/register?plan=${plan.code}`;
}

function getCtaText(plan: Plan): string {
  if (plan.code === "business") return "Contact Sales";
  if (plan.amount === 0) return "Get Started Free";
  return "Start Free Trial";
}

export default function PricingPage() {
  const jsonLdOffers = plansList.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    description: plan.description,
    price: plan.amount / 100,
    priceCurrency: plan.currency,
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
            Pricing that scales with you
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re running your first tournament or managing a national
            series, we have a plan that fits.
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
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-muted-foreground">
              No hidden fees. No credit card required to start. Upgrade when
              you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plansList.map((plan) => {
              const Icon = planIcons[plan.code];
              const isHighlighted = plan.isPopular;
              const entryFeeText = formatEntryFee(plan);

              return (
                <div
                  key={plan.code}
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
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHighlighted ? "bg-gold/20" : "bg-primary/10"}`}>
                      <Icon className={`h-5 w-5 ${isHighlighted ? "text-gold" : "text-primary"}`} />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>

                  <p className={`text-sm mb-6 ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">{formatPrice(plan)}</span>
                    {plan.amount > 0 && (
                      <span className={`text-sm ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        /month
                      </span>
                    )}
                  </div>

                  {entryFeeText && (
                    <div className={`text-xs mb-6 px-3 py-2 rounded-lg ${isHighlighted ? "bg-white/10 text-primary-foreground/80" : "bg-muted text-muted-foreground"}`}>
                      Entry fee processing: {entryFeeText}
                    </div>
                  )}

                  <Button
                    asChild
                    className={`w-full mb-8 ${isHighlighted ? "bg-gold hover:bg-gold/90 text-primary" : ""}`}
                    variant={isHighlighted ? "default" : "outline"}
                    size="lg"
                  >
                    <Link href={getCtaHref(plan)}>
                      {getCtaText(plan)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlighted ? "bg-gold/20" : "bg-green-100"}`}>
                          <Check className={`h-3 w-3 ${isHighlighted ? "text-gold" : "text-green-600"}`} />
                        </div>
                        <span className={`text-sm ${isHighlighted ? "text-primary-foreground/90" : ""}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <div key={limitation} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-muted-foreground">–</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
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
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">14-day free trial on paid plans</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Cancel anytime</span>
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
              professional pool tournaments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary" asChild>
                <Link href="/auth/register">
                  Get Started Free
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
