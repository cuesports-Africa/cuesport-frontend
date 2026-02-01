import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/pricing-cards";
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
  },
  {
    quote:
      "The M-Pesa integration changed everything. Players pay instantly, and I don't have to chase cash.",
    author: "Grace Wanjiku",
    role: "Tournament Director",
    location: "Nairobi",
  },
  {
    quote:
      "Our league grew from 30 to 200 players. The rating system gives players something to compete for.",
    author: "Peter Kimani",
    role: "League Commissioner",
    location: "Nakuru",
  },
];

const customerTypes = [
  { title: "Pool Halls", count: "120+", icon: "🎱" },
  { title: "Leagues", count: "25+", icon: "🏆" },
  { title: "Organizers", count: "80+", icon: "👤" },
  { title: "Federations", count: "3", icon: "🌍" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-[#0a1628] via-primary to-[#0a2540]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh] py-16 lg:py-0">
            {/* Left Content */}
            <div className="text-white max-w-xl">
              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                <span className="text-white/90">Tournament</span>
                <br />
                <span className="text-white/90">infrastructure</span>
                <br />
                <span className="bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
                  for African pool
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                The complete platform for running professional pool tournaments.
                Brackets, ratings, payments, and rankings - everything you need
                to grow the game across Africa.
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-primary font-semibold h-12 px-6"
                  asChild
                >
                  <Link href="/auth/register">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  href="/about/contact"
                  className="text-white/80 hover:text-white font-medium flex items-center gap-1 transition-colors"
                >
                  Contact sales
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero.jpg"
                  alt="Professional pool table"
                  width={640}
                  height={480}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Two Paths to <span className="text-gold">Glory</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Regular */}
            <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Regular Tournaments</h3>
              <p className="text-muted-foreground mb-4">
                Open to everyone. Register, compete, and win. Perfect for casual
                players and building experience.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Open registration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Immediate
                  competition
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Rating points
                  earned
                </li>
              </ul>
            </div>

            {/* Special */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Special Tournaments</h3>
              <p className="opacity-90 mb-4">
                The path to becoming national champion. Progress from community
                to county to region to national level.
              </p>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" /> Community → National
                  pathway
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" /> Official sanctioned
                  events
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" /> National ranking
                  points
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
              Everything you need to run tournaments
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for pool tournament organizers in Africa, with
              the tools and integrations you actually need.
            </p>
          </div>

          {/* Main Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {mainFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-2 bg-card border rounded-full px-4 py-2 text-sm"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                {feature.title}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/features">
                See All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
              Trusted by organizers across Africa
            </h2>
          </div>

          {/* Customer Type Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {customerTypes.map((type) => (
              <div key={type.title} className="text-center p-4">
                <span className="text-3xl block mb-2">{type.icon}</span>
                <div className="text-2xl font-bold text-primary">
                  {type.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {type.title}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-card border rounded-xl p-6"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-foreground mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/customers">
                See More Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
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

          <PricingCards />

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">
                View Full Pricing Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-12 border-t">
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">14-day free trial</span>
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

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-gold fill-gold" />
            ))}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to professionalize your tournaments?
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            Join hundreds of organizers already using CueSports Africa to run
            professional pool tournaments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold/90 text-primary"
              asChild
            >
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/about/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
