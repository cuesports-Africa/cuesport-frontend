"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  Wallet,
  Plus,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { useOrganizerUser } from "@/app/organizer/auth-guard";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/organizer", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/organizer/tournaments", label: "Tournaments", icon: Trophy, exact: false },
  { href: "/organizer/wallet", label: "Wallet", icon: Wallet, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  if (href === "/organizer/tournaments") {
    return (
      pathname.startsWith(href) && pathname !== "/organizer/tournaments/create"
    );
  }
  return pathname.startsWith(href);
}

export function OrganizerMobileChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useOrganizerUser();
  const [accountOpen, setAccountOpen] = useState(false);

  const orgName = user.organizer_profile?.organization_name || "Organiser";
  const firstName = user.player_profile?.first_name || "";
  const lastName = user.player_profile?.last_name || "";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "OR";

  function handleLogout() {
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  const createActive = pathname === "/organizer/tournaments/create";

  return (
    <>
      {/* ── Top bar ─────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-canvas border-b border-rule">
        <div className="flex h-full items-center justify-between px-5">
          <Link href="/organizer" className="flex items-center">
            <Logo showTagline={false} size="sm" />
          </Link>
          <button
            onClick={() => setAccountOpen(true)}
            aria-label="Account menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-rule bg-bone font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-canvas active:bg-bone/80"
          >
            {initials}
          </button>
        </div>
      </header>

      {/* ── Bottom nav ──────────────────────────────── */}
      <nav
        aria-label="Primary"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas border-t border-rule"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-3 h-16">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <li key={item.href} className="contents">
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex flex-col items-center justify-center gap-1 transition-colors",
                    active ? "text-ink" : "text-mute-2 hover:text-ink"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-gold"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-ink" : "text-mute-2"
                    )}
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                  <span
                    className={cn(
                      "font-mono text-[9.5px] font-bold uppercase tracking-[0.18em]",
                      active ? "text-ink" : "text-mute-2"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── FAB ─────────────────────────────────────── */}
      <Link
        href="/organizer/tournaments/create"
        aria-label="Create new tournament"
        className={cn(
          "lg:hidden fixed right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[0_2px_12px_rgba(10,22,40,0.18)] transition-all active:scale-95",
          createActive
            ? "bg-navy text-white"
            : "bg-ink text-white hover:bg-navy"
        )}
        style={{
          bottom: `calc(env(safe-area-inset-bottom) + 5rem)`,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-gold/0 transition-all duration-300 hover:ring-gold/70"
        />
        <Plus className="h-6 w-6" />
      </Link>

      {/* ── Account sheet ───────────────────────────── */}
      <Sheet open={accountOpen} onOpenChange={setAccountOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-sm p-0 bg-canvas border-l border-rule"
        >
          <SheetHeader className="px-6 py-6 border-b border-rule text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
              Account
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-rule bg-bone font-mono text-[14px] font-bold uppercase tracking-[0.08em] text-ink">
                {initials}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-[16px] font-bold leading-tight text-ink truncate text-left">
                  {firstName} {lastName}
                </SheetTitle>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2 truncate">
                  Organiser
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="px-6 py-6 space-y-6">
            {/* Workspace */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
                Workspace
              </p>
              <p className="mt-2 text-[15px] font-semibold text-ink leading-tight">
                {orgName}
              </p>
              {user.email && (
                <p className="mt-1 text-[12px] text-mute truncate">
                  {user.email}
                </p>
              )}
            </div>

            <div className="h-px bg-rule" />

            {/* Quick links */}
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setAccountOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors",
                        active
                          ? "bg-bone text-ink"
                          : "text-mute hover:bg-bone/60 hover:text-ink"
                      )}
                    >
                      <span className="inline-flex items-center gap-3">
                        <Icon className="h-4 w-4 text-mute-2" />
                        {item.label}
                      </span>
                      {active && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-gold"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="h-px bg-rule" />

            <button
              onClick={() => {
                setAccountOpen(false);
                handleLogout();
              }}
              className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium text-mute transition-colors hover:bg-bone/60 hover:text-ink"
            >
              <LogOut className="h-4 w-4 text-mute-2 group-hover:text-ink transition-colors" />
              Sign out
            </button>

            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-mute-2">
              CueSports Africa · Organiser
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
