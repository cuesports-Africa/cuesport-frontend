import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Search, Trophy, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Browse tournaments, player rankings, or news on CueSports Africa.",
  robots: { index: false, follow: true },
};

const quickLinks = [
  {
    icon: Trophy,
    label: "Browse Tournaments",
    href: "/tournaments",
    description: "Find upcoming pool tournaments near you",
  },
  {
    icon: Search,
    label: "Player Rankings",
    href: "/rankings",
    description: "View Elo ratings and leaderboards",
  },
  {
    icon: Newspaper,
    label: "Latest News",
    href: "/news",
    description: "Tournament coverage and player stories",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="text-8xl font-bold text-electric/20 mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-10 text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Try one of these instead:
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-dark p-5 rounded-2xl card-hover group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-bold text-sm mb-1 group-hover:text-electric transition-colors">
                  {link.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-electric text-[#030e10] hover:bg-electric/90 font-semibold px-8 h-12 rounded-full glow-cyan"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
