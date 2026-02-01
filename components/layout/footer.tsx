import Link from "next/link";
import { Logo } from "./logo";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  tournaments: {
    title: "Tournaments",
    links: [
      { label: "Upcoming Events", href: "/tournaments/upcoming" },
      { label: "Live Matches", href: "/tournaments/live" },
      { label: "Results", href: "/tournaments/results" },
      { label: "Special Tournaments", href: "/tournaments/special" },
    ],
  },
  players: {
    title: "Players",
    links: [
      { label: "Find Players", href: "/players/search" },
      { label: "Rankings", href: "/rankings" },
      { label: "Rating System", href: "/rankings/rating-system" },
      { label: "My Dashboard", href: "/home" },
    ],
  },
  news: {
    title: "News",
    links: [
      { label: "Latest News", href: "/news" },
      { label: "Tournament Reports", href: "/news/tournaments" },
      { label: "Player Spotlights", href: "/news/players" },
      { label: "Announcements", href: "/news/announcements" },
    ],
  },
  shop: {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Cues & Accessories", href: "/shop/cues" },
      { label: "Apparel", href: "/shop/apparel" },
      { label: "Equipment", href: "/shop/equipment" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about/mission" },
      { label: "How It Works", href: "/about/how-it-works" },
      { label: "Our Customers", href: "/customers" },
      { label: "Pricing", href: "/pricing" },
      { label: "Investors", href: "/investors" },
      { label: "Contact Us", href: "/about/contact" },
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
      { label: "Help & Security", href: "/support/help" },
      { label: "Availability", href: "/availability" },
      { label: "Status", href: "/status" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/cuesportsafrica", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/cuesportsafrica", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/cuesportsafrica", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/cuesportsafrica", label: "YouTube" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo variant="white" />
            <p className="mt-4 text-sm opacity-80 max-w-xs">
              Africa&apos;s premier pool tournament and player management platform.
              Building the future of professional pool across the continent.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:info@cuesports.africa"
                className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                info@cuesports.africa
              </a>
              <a
                href="tel:+254700000000"
                className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                +254 700 000 000
              </a>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <MapPin className="h-4 w-4" />
                Nairobi, Kenya
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gold mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-70">
              &copy; {currentYear} CueSports Africa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm opacity-70">
                Professionalizing pool across Africa
              </span>
              <div className="hidden md:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs opacity-70">Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
