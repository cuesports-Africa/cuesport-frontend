import Link from "next/link";
import { Logo } from "./logo";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  tournaments: {
    title: "Tournaments",
    links: [
      { label: "Upcoming Events", href: "/tournaments" },
      { label: "Live Matches", href: "/tournaments" },
      { label: "Results", href: "/tournaments" },
      { label: "Special Tournaments", href: "/tournaments" },
    ],
  },
  players: {
    title: "Players",
    links: [
      { label: "Find Players", href: "/players" },
      { label: "Rankings", href: "/rankings" },
      { label: "Rating System", href: "/rankings" },
      { label: "Tournaments", href: "/tournaments" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about/mission" },
      { label: "How It Works", href: "/about/how-it-works" },
      { label: "Customers", href: "/customers" },
      { label: "Pricing", href: "/pricing" },
      { label: "Investors", href: "/investors" },
      { label: "Contact", href: "/about/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Fair Play Policy", href: "/legal/fair-play" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "/support/help" },
      { label: "Availability", href: "/availability" },
      { label: "Status", href: "/status" },
      { label: "News", href: "/news" },
    ],
  },
};

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com/cuesportsafrica",
    label: "Facebook",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/cuesportsafrica",
    label: "Twitter",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/cuesportsafrica",
    label: "Instagram",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/cuesportsafrica",
    label: "YouTube",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-border/10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-1 bg-gradient-to-r from-transparent via-electric/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-electric/[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* Newsletter Strip */}
      <div className="border-b border-border/10 relative z-10 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <h3 className="font-bold text-base text-foreground mb-1">
                Stay in the game
              </h3>
              <p className="text-sm text-muted-foreground">
                Tournament announcements & platform updates, straight to your inbox.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="search-input-dark w-full px-4 py-3 text-sm rounded-xl border border-border/20 focus:border-electric/50 transition-colors"
                />
              </div>
              <button className="flex-shrink-0 flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-bold bg-electric hover:bg-electric/90 text-[#030e10] transition-all glow-cyan hover:-translate-y-0.5">
                Subscribe
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 relative z-10">
            <div className="inline-block hover:scale-105 transition-transform duration-300">
              <Logo variant="white" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed font-medium">
              Africa&apos;s premier pool tournament and player management platform.
              Building the future of professional pool across the continent.
            </p>

            {/* Contact Info */}
            <div className="mt-8 space-y-4">
              <a
                href="mailto:info@cuesports.africa"
                className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-electric transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 group-hover:bg-electric/10 group-hover:border-electric/20 transition-colors shadow-sm">
                  <Mail className="h-4 w-4 text-foreground/70 group-hover:text-electric transition-colors" />
                </div>
                info@cuesports.africa
              </a>
              <a
                href="tel:+254700000000"
                className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-electric transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 group-hover:bg-electric/10 group-hover:border-electric/20 transition-colors shadow-sm">
                  <Phone className="h-4 w-4 text-foreground/70 group-hover:text-electric transition-colors" />
                </div>
                +254 700 000 000
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 shadow-sm">
                  <MapPin className="h-4 w-4 text-foreground/70" />
                </div>
                Nairobi, Kenya
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-electric/10 hover:border-electric/30 hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] group"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-electric transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="relative z-10">
              <h3 className="text-xs font-bold text-foreground mb-5 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-electric/50" />
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-electric transition-colors flex items-center group"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-electric opacity-0 group-hover:opacity-100">
                        ›
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/10 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-muted-foreground">
              &copy; {currentYear} CueSports Africa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs font-medium text-muted-foreground hidden md:block">
                Professionalizing pool across Africa
              </span>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-electric/5 border border-electric/10">
                <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
                <span className="text-[10px] font-bold text-electric uppercase tracking-wider">Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
