"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Wallet,
  Plus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { useOrganizerUser } from "@/app/organizer/auth-guard";

const navItems = [
  { href: "/organizer", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/organizer/tournaments", label: "Tournaments", icon: Trophy, exact: false },
  { href: "/organizer/wallet", label: "Wallet", icon: Wallet, exact: false },
];

export function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useOrganizerUser();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    if (href === "/organizer/tournaments") {
      return (
        pathname.startsWith(href) && pathname !== "/organizer/tournaments/create"
      );
    }
    return pathname.startsWith(href);
  }

  function handleLogout() {
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  const orgName = user.organizer_profile?.organization_name || "Organiser";
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "OR";

  const createActive = pathname === "/organizer/tournaments/create";

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 z-40 h-screen w-64 bg-canvas border-r border-rule flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-rule shrink-0">
        <Link href="/organizer" className="flex items-center">
          <Logo showTagline={false} size="sm" />
        </Link>
      </div>

      {/* Workspace */}
      <div className="px-6 pt-6 pb-5 border-b border-rule">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Workspace
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-rule bg-bone font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-tight text-ink truncate">
              {orgName}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
              Organiser
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 pt-6 overflow-y-auto">
        <p className="px-3 mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors",
                    active
                      ? "bg-bone text-ink"
                      : "text-mute hover:text-ink hover:bg-bone/60"
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-gold"
                    />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-ink" : "text-mute-2 group-hover:text-ink"
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Create CTA */}
        <div className="mt-6 px-3">
          <Link
            href="/organizer/tournaments/create"
            className={cn(
              "group inline-flex w-full items-center justify-between gap-2 rounded-pill px-4 py-2.5 text-[13px] font-semibold transition-colors",
              createActive
                ? "bg-navy text-white"
                : "bg-ink text-white hover:bg-navy"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New tournament
            </span>
            <span
              aria-hidden
              className="inline-block h-px w-4 bg-gold opacity-70 transition-all group-hover:w-5"
            />
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-5 border-t border-rule">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-mute transition-colors hover:text-ink hover:bg-bone/60"
        >
          <LogOut className="h-4 w-4 text-mute-2 group-hover:text-ink transition-colors" />
          Sign out
        </button>
        <p className="mt-3 px-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-mute-2">
          CueSports Africa · Organiser
        </p>
      </div>
    </aside>
  );
}
