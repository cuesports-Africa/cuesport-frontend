import { Metadata } from "next";
import {
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  Download,
  Mail,
  Calendar,
  ChevronRight,
  Target,
  Zap,
  Shield,
  PieChart,
  Building2,
  Briefcase,
  FileText,
  PlayCircle,
  MapPin,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Investor Relations - Series A Funding",
  description:
    "Invest in Africa's premier pool management platform. $2.8B TAM, 127% YoY growth, 15 countries. Join us in professionalizing cue sports across the continent.",
  keywords: [
    "CueSports Africa investment",
    "Africa sports tech startup",
    "pool management platform investment",
    "Series A Africa",
    "sports technology Africa",
    "Kenya startup investment",
  ],
  openGraph: {
    title: "Investor Relations - CueSports Africa",
    description:
      "Building Africa's sports technology infrastructure. Now raising Series A.",
    url: "https://cuesports.africa/investors",
  },
  alternates: {
    canonical: "https://cuesports.africa/investors",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const keyMetrics = [
  { label: "Active Players", value: "5,000+", change: "+127%", period: "YoY" },
  { label: "Tournaments Hosted", value: "200+", change: "+85%", period: "YoY" },
  { label: "Countries", value: "15", change: "+5", period: "New in 2024" },
  { label: "Monthly Growth", value: "23%", change: "Avg", period: "2024" },
];

const marketOpportunity = [
  { region: "East Africa", population: "180M", penetration: "0.02%", potential: "High" },
  { region: "West Africa", population: "400M", penetration: "0.01%", potential: "Very High" },
  { region: "Southern Africa", population: "170M", penetration: "0.03%", potential: "High" },
  { region: "North Africa", population: "250M", penetration: "0.01%", potential: "Medium" },
];

const investmentHighlights = [
  {
    icon: Target,
    title: "First-Mover Advantage",
    description: "Only comprehensive digital platform for pool management in Africa. No direct competitors at scale.",
  },
  {
    icon: TrendingUp,
    title: "Proven Growth",
    description: "127% year-over-year user growth with strong retention. Organic word-of-mouth driving adoption.",
  },
  {
    icon: Globe,
    title: "Massive TAM",
    description: "1.4 billion people across 54 countries. Pool is the most popular bar sport on the continent.",
  },
  {
    icon: Zap,
    title: "Capital Efficient",
    description: "Lean operations with 80% gross margins on premium subscriptions. Path to profitability clear.",
  },
  {
    icon: Shield,
    title: "Defensible Moat",
    description: "Network effects strengthen with each player. Rating history and tournament data create switching costs.",
  },
  {
    icon: Users,
    title: "Community-Led",
    description: "Organizers and venues drive growth. Platform creates value for entire ecosystem.",
  },
];

const timeline = [
  { year: "2023", quarter: "Q1", title: "Founded", description: "Platform launched in Kenya" },
  { year: "2023", quarter: "Q3", title: "1,000 Players", description: "Reached first milestone" },
  { year: "2024", quarter: "Q1", title: "Expansion", description: "Launched in 5 new countries" },
  { year: "2024", quarter: "Q3", title: "5,000 Players", description: "5x growth achieved" },
  { year: "2025", quarter: "Q2", title: "Series A", description: "Targeting expansion funding" },
  { year: "2026", quarter: "Q4", title: "100K Players", description: "Pan-African leadership" },
];

const leadership = [
  {
    name: "CEO & Founder",
    role: "Chief Executive Officer",
    bio: "Former professional player with 10+ years in sports technology.",
    image: null,
  },
  {
    name: "CTO",
    role: "Chief Technology Officer",
    bio: "Ex-Safaricom engineer. Built systems serving millions of users.",
    image: null,
  },
  {
    name: "COO",
    role: "Chief Operating Officer",
    bio: "Sports league management veteran. Scaled operations across Africa.",
    image: null,
  },
];

const documents = [
  { title: "Company Overview", type: "PDF", size: "2.4 MB", icon: FileText },
  { title: "Investor Deck 2024", type: "PDF", size: "8.1 MB", icon: Briefcase },
  { title: "Market Analysis", type: "PDF", size: "3.2 MB", icon: PieChart },
  { title: "Product Demo", type: "Video", size: "Watch", icon: PlayCircle },
];

const pressReleases = [
  { date: "Jan 2025", title: "CueSports Africa Expands to 15 African Countries" },
  { date: "Nov 2024", title: "Platform Hosts 200th Tournament Milestone" },
  { date: "Sep 2024", title: "Partnership with Kenya Pool Federation Announced" },
  { date: "Jun 2024", title: "Seed Round Successfully Closed" },
];

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CueSports Africa",
          description: "Africa's premier pool tournament and player management platform",
          url: "https://cuesports.africa",
          foundingDate: "2023",
          foundingLocation: {
            "@type": "Place",
            name: "Nairobi, Kenya",
          },
          numberOfEmployees: {
            "@type": "QuantitativeValue",
            minValue: 10,
            maxValue: 50,
          },
          funding: {
            "@type": "MonetaryGrant",
            name: "Series A",
            description: "Series A funding round for pan-African expansion",
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/10 to-transparent" />

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Now Raising Series A
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Building Africa's Sports
              <span className="text-gold block">Technology Infrastructure</span>
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl">
              CueSports Africa is professionalizing pool across the continent.
              Join us in creating the definitive platform for Africa's most popular bar sport.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary font-semibold">
                <Mail className="mr-2 h-5 w-5" />
                Contact Investor Relations
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10">
                <Download className="mr-2 h-5 w-5" />
                Download Investor Deck
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Ticker */}
      <section className="bg-secondary border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {keyMetrics.map((metric) => (
              <div key={metric.label} className="py-8 px-6 text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  {metric.change} {metric.period}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Invest in CueSports Africa
            </h2>
            <p className="text-lg text-muted-foreground">
              A unique opportunity to capture the digitization of sports in the world's
              fastest-growing continent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentHighlights.map((item) => (
              <div
                key={item.title}
                className="group p-8 rounded-2xl border bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                The African Opportunity
              </h2>
              <p className="text-lg opacity-80 mb-8">
                Africa has 1.4 billion people and the youngest population on Earth.
                Pool is played in virtually every town and city. Yet there's no digital
                infrastructure for the sport.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Untapped Market</h4>
                    <p className="text-sm opacity-70">Estimated 50M+ recreational pool players across Africa with zero digital engagement</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Mobile-First Continent</h4>
                    <p className="text-sm opacity-70">Africa leads in mobile money adoption. Our platform is built for smartphone-first users</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rising Middle Class</h4>
                    <p className="text-sm opacity-70">Growing disposable income driving demand for organized recreational activities</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-gold" />
                Regional Market Analysis
              </h3>
              <div className="space-y-4">
                {marketOpportunity.map((region) => (
                  <div key={region.region} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <div>
                      <div className="font-medium">{region.region}</div>
                      <div className="text-sm opacity-60">{region.population} population</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-60">Current penetration</div>
                      <div className="font-semibold text-gold">{region.penetration}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <div className="text-3xl font-bold text-gold">$2.8B</div>
                <div className="text-sm opacity-70">Total Addressable Market by 2030</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Timeline */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">
              From a single country to pan-African ambitions
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={`${item.year}-${item.quarter}`}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="inline-block p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
                      <div className="text-sm font-medium text-primary mb-1">
                        {item.year} {item.quarter}
                      </div>
                      <div className="text-lg font-semibold mb-1">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>

                  <div className="hidden md:flex w-4 h-4 rounded-full bg-primary border-4 border-background absolute left-1/2 -translate-x-1/2" />

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Revenue Model</h2>
            <p className="text-lg text-muted-foreground">
              Multiple revenue streams with high margin potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="font-semibold mb-2">Subscriptions</div>
              <p className="text-sm text-muted-foreground">Premium player and organizer plans</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border text-center">
              <div className="text-4xl font-bold text-primary mb-2">30%</div>
              <div className="font-semibold mb-2">Transaction Fees</div>
              <p className="text-sm text-muted-foreground">Tournament entries and prize pools</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border text-center">
              <div className="text-4xl font-bold text-primary mb-2">20%</div>
              <div className="font-semibold mb-2">Sponsorships</div>
              <p className="text-sm text-muted-foreground">Brand partnerships and advertising</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border text-center">
              <div className="text-4xl font-bold text-primary mb-2">10%</div>
              <div className="font-semibold mb-2">Data & API</div>
              <p className="text-sm text-muted-foreground">Federation licenses and analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground">
              Experienced operators building for Africa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadership.map((person) => (
              <div key={person.role} className="text-center group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-foreground/80" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
                <div className="text-sm text-primary font-medium mb-3">{person.role}</div>
                <p className="text-sm text-muted-foreground">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources & Documents */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Documents */}
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Investor Resources
              </h2>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <a
                    key={doc.title}
                    href="#"
                    className="flex items-center justify-between p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <doc.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Press Releases */}
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                Press Releases
              </h2>
              <div className="space-y-4">
                {pressReleases.map((press) => (
                  <a
                    key={press.title}
                    href="#"
                    className="block p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="text-sm text-muted-foreground mb-2">{press.date}</div>
                    <div className="font-medium group-hover:text-primary transition-colors flex items-center justify-between">
                      {press.title}
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </a>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                View All Press Releases
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Partner With Us
            </h2>
            <p className="text-lg opacity-80 mb-8">
              We're building something transformative for Africa.
              If you share our vision, we'd love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary font-semibold">
                <Mail className="mr-2 h-5 w-5" />
                investors@cuesportsafrica.com
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Call
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <MapPin className="h-4 w-4" />
                  Headquarters
                </div>
                <div className="font-medium">Nairobi, Kenya</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Building2 className="h-4 w-4" />
                  Stage
                </div>
                <div className="font-medium">Series A</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Briefcase className="h-4 w-4" />
                  Founded
                </div>
                <div className="font-medium">2023</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-8 bg-muted/50 border-t">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto">
            This page contains forward-looking statements that involve risks and uncertainties.
            Actual results may differ materially from those projected. Investment in early-stage
            companies involves significant risk. Past performance is not indicative of future results.
            This is not an offer to sell securities.
          </p>
        </div>
      </section>
    </div>
  );
}
