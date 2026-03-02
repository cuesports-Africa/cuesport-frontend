import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Quote, MapPin, Trophy, Users, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Our Customers - Success Stories",
  description:
    "120+ pool halls, 25+ leagues, and 3 national federations trust CueSports Africa. Read testimonials from organizers across Kenya, Tanzania, Uganda, and more.",
  keywords: [
    "pool tournament software reviews",
    "CueSports Africa testimonials",
    "tournament management success stories",
    "pool hall management Kenya",
    "billiards league software Africa",
  ],
  openGraph: {
    title: "Customer Success Stories - CueSports Africa",
    description:
      "Trusted by 120+ pool halls and leagues across Africa. See how organizers run professional tournaments.",
    url: "https://cuesports.africa/customers",
  },
  alternates: {
    canonical: "https://cuesports.africa/customers",
  },
};

const testimonials = [
  {
    quote:
      "Before CueSports, I spent hours managing brackets on paper. Now I set up a tournament in 5 minutes and everything runs automatically.",
    author: "James Ochieng",
    role: "Owner, Kutus Pool Club",
    location: "Kirinyaga, Kenya",
    stats: { tournaments: 48, players: 320 },
  },
  {
    quote:
      "The M-Pesa integration changed everything. Players pay entry fees instantly, and I don't have to chase cash. It's professional.",
    author: "Grace Wanjiku",
    role: "Tournament Director",
    location: "Nairobi, Kenya",
    stats: { tournaments: 24, players: 180 },
  },
  {
    quote:
      "Our league has grown from 30 players to over 200 since we started using CueSports. The rating system gives players something to compete for.",
    author: "Peter Kimani",
    role: "League Commissioner",
    location: "Nakuru, Kenya",
    stats: { tournaments: 96, players: 215 },
  },
  {
    quote:
      "Players love checking their rankings and stats. It keeps them engaged between tournaments. We've seen attendance go up 40%.",
    author: "Samuel Mwangi",
    role: "Venue Manager",
    location: "Mombasa, Kenya",
    stats: { tournaments: 36, players: 140 },
  },
  {
    quote:
      "We run national qualifiers across 12 counties. CueSports lets us manage everything from one dashboard. No more spreadsheet chaos.",
    author: "David Otieno",
    role: "Federation Official",
    location: "Kenya Pool Association",
    stats: { tournaments: 72, players: 850 },
  },
  {
    quote:
      "The live scoring feature is a hit. Players who can't make it to the venue follow along on their phones. It builds community.",
    author: "Mary Njeri",
    role: "Pool Hall Owner",
    location: "Thika, Kenya",
    stats: { tournaments: 52, players: 165 },
  },
];

const customerTypes = [
  {
    title: "Pool Halls & Bars",
    count: "120+",
    description: "Venues running regular tournaments to build community and drive traffic",
    icon: "🎱",
  },
  {
    title: "League Operators",
    count: "25+",
    description: "Season-long leagues with standings, playoffs, and official rankings",
    icon: "🏆",
  },
  {
    title: "Independent Organizers",
    count: "80+",
    description: "Individuals running tournaments at multiple venues",
    icon: "👤",
  },
  {
    title: "Federations",
    count: "3",
    description: "National federations using CueSports for official ranking events",
    icon: "🌍",
  },
];

const stats = [
  { value: "500+", label: "Tournaments Run" },
  { value: "15,000+", label: "Players Registered" },
  { value: "50,000+", label: "Matches Tracked" },
  { value: "8", label: "Countries" },
];

export default function CustomersPage() {
  return (
    <main className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "CueSports Africa Customer Success Stories",
          description: "Testimonials and success stories from tournament organizers",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: testimonials.map((t, i) => ({
              "@type": "Review",
              position: i + 1,
              reviewBody: t.quote,
              author: {
                "@type": "Person",
                name: t.author,
                jobTitle: t.role,
              },
              itemReviewed: {
                "@type": "SoftwareApplication",
                name: "CueSports Africa",
              },
            })),
          },
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
              name: "Customers",
              item: "https://cuesports.africa/customers",
            },
          ],
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
              <Users className="h-4 w-4" />
              Our Community
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Trusted by organizers across Africa
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              From local pool halls to national federations, see how organizers
              use CueSports to run professional tournaments.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl lg:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Types */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {customerTypes.map((type) => (
              <div
                key={type.title}
                className="text-center p-6 rounded-xl bg-card border"
              >
                <span className="text-4xl block mb-4">{type.icon}</span>
                <div className="text-2xl font-bold text-primary mb-1">
                  {type.count}
                </div>
                <h3 className="font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What organizers say
            </h2>
            <p className="text-muted-foreground">
              Real feedback from real tournament organizers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-card border rounded-2xl p-8 flex flex-col"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-foreground mb-6 flex-1">
                  "{testimonial.quote}"
                </p>
                <div className="border-t pt-6">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {testimonial.role}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <MapPin className="h-3 w-3" />
                    {testimonial.location}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-gold" />
                      <span>{testimonial.stats.tournaments} events</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-primary" />
                      <span>{testimonial.stats.players} players</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story Highlight */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-3xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-gold fill-gold"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Featured Story
                </span>
              </div>
              <blockquote className="text-xl lg:text-2xl font-medium mb-8">
                "We started with 8 players at our first tournament. One year
                later, we have 320 registered players and run 4 tournaments
                every week. CueSports made it possible to scale without adding
                staff. The system just works."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">🎱</span>
                </div>
                <div>
                  <div className="font-bold text-lg">Kutus Pool Club</div>
                  <div className="text-muted-foreground">
                    Kirinyaga, Kenya
                  </div>
                  <div className="text-sm text-primary mt-1">
                    Running since 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Join the community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Start running professional tournaments today. No credit card
            required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/tournaments">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
