"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { mainNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the homepage, the header floats over the dark hero photograph.
  // At the top: transparent background, white text. On scroll: solid white.
  const isHomepage = pathname === "/";
  const transparent = isHomepage && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : scrolled
            ? "bg-canvas/95 backdrop-blur-md shadow-[0_1px_0_0_var(--rule),0_8px_24px_-16px_rgba(15,23,42,0.12)]"
            : "bg-canvas",
      )}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="relative flex items-center justify-between h-[60px] sm:h-[68px]">
          {/* Left — logo (Logo component carries its own Link to "/") */}
          <div className="flex items-center shrink-0">
            <Logo size="sm" variant={transparent ? "white" : "default"} />
          </div>

          {/* Center nav — absolutely positioned for true horizontal centering */}
          <nav
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1"
            aria-label="Primary"
          >
            {mainNavItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative inline-flex items-center px-4 h-9 text-[14px] tracking-tight transition-colors",
                    transparent
                      ? active
                        ? "text-white font-semibold"
                        : "text-white/85 font-medium hover:text-white"
                      : active
                        ? "text-ink font-semibold"
                        : "text-mute font-medium hover:text-ink",
                  )}
                >
                  {item.title}
                  {active && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-4 right-4 -bottom-[18px] h-[2px] rounded-full transition-colors",
                        transparent ? "bg-gold" : "bg-navy",
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right — actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className={cn(
                "hidden md:inline-flex items-center h-9 px-3 text-[14px] font-medium transition-colors",
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-mute hover:text-ink",
              )}
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className={cn(
                "group hidden md:inline-flex items-center gap-2 h-10 pl-5 pr-1.5 rounded-pill text-[14px] font-bold transition-all",
                transparent
                  ? "bg-gold text-ink hover:brightness-95"
                  : "bg-navy text-white hover:bg-[#003a66]",
              )}
            >
              Get started
              <span
                className={cn(
                  "inline-flex items-center justify-center h-7 w-7 rounded-full transition-colors",
                  transparent
                    ? "bg-ink/15 group-hover:bg-ink/25"
                    : "bg-white/15 group-hover:bg-white/25",
                )}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "md:hidden inline-flex items-center justify-center h-10 w-10 -mr-2 rounded-lg transition-colors",
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-ink hover:bg-bone",
              )}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — always uses solid bg for readability */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-rule bg-canvas">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 py-3">
            <ul>
              {mainNavItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between py-4 border-b border-rule last:border-b-0 text-[15px]",
                        active
                          ? "text-ink font-semibold"
                          : "text-ink/80 font-medium",
                      )}
                    >
                      <span>{item.title}</span>
                      {active && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-navy"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 pt-4 border-t border-rule flex flex-col gap-2">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-2 rounded-pill bg-navy text-white text-[14px] font-bold"
              >
                Get started
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-6 rounded-pill border border-rule text-ink text-[14px] font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
