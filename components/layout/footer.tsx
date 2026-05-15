import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";

const sitemap = [
  {
    label: "Play",
    links: [
      { name: "Tournaments", href: "/tournaments" },
      { name: "Rankings", href: "/rankings" },
      { name: "Players", href: "/players" },
      { name: "Magazine", href: "/news" },
    ],
  },
  {
    label: "Organize",
    links: [
      { name: "Host an event", href: "/organizer" },
      { name: "Pricing", href: "/pricing" },
      { name: "How it works", href: "/about/how-it-works" },
    ],
  },
  {
    label: "About",
    links: [
      { name: "Our story", href: "/about" },
      { name: "Contact", href: "/about/contact" },
      { name: "Customers", href: "/customers" },
    ],
  },
];

const legalLinks = [
  { name: "Privacy", href: "/legal/privacy" },
  { name: "Terms", href: "/legal/terms" },
  { name: "Cookies", href: "/legal/cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-white">
      {/* Oversized brand-mark watermark — bleeds the footer edges, sits behind content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-14 z-0 hidden text-center lg:block"
      >
        <span
          className="block whitespace-nowrap font-extrabold leading-[0.8] tracking-[-0.06em] text-white/[0.04]"
          style={{ fontSize: "clamp(12rem, 27vw, 24rem)" }}
        >
          CueSports
        </span>
      </div>

      {/* Top — brand block (left) + sitemap (right) */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-14 pt-20 sm:px-8 lg:px-12 lg:pb-24 lg:pt-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Brand block — kicker + editorial close + body + CTA */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-[11px]">
              <span className="inline-block h-px w-7 bg-white/30 sm:w-9" />
              Africa&rsquo;s home of cue sports
            </div>

            <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
              Every name on the wall
              <br className="hidden sm:block" />{" "}
              <span className="text-white/55">starts somewhere.</span>
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-[1.55] text-white/65">
              CueSports Africa is the continental infrastructure for pool —
              tournaments, rankings, and a real path from a community hall to a
              continental final.
            </p>

            <Link
              href="/tournaments"
              className="group mt-8 inline-flex h-11 items-center gap-2 rounded-pill bg-gold pl-5 pr-2 text-[13px] font-bold text-ink transition-all hover:brightness-95"
            >
              Find a tournament
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/15 transition-colors group-hover:bg-ink/25">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Sitemap — three columns, mono-caps labels */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-8 lg:col-span-7">
            {sitemap.map((column) => (
              <div key={column.label}>
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  {column.label}
                </p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-white/85 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar — logo, tagline, legal, copyright */}
      <div className="relative z-10 border-t border-white/10 bg-ink/95">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Left: logo + tagline */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Logo variant="white" size="sm" />
              <span aria-hidden className="hidden text-white/25 sm:inline">·</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                Run the table.
              </span>
            </div>

            {/* Right: legal links + copyright */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white/85"
                >
                  {link.name}
                </Link>
              ))}
              <span aria-hidden className="hidden text-white/20 sm:inline">·</span>
              <span className="tabular-nums">© {year} CueSports Africa</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
