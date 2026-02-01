"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Trophy,
  Wallet,
  Building2,
  LogOut,
  Settings,
  Bell,
  ArrowLeftRight,
} from "lucide-react";
import { RoleSwitcher } from "@/components/role-switcher";
import { useAuth } from "@/contexts/auth-context";

const organizerNavItems = [
  { href: "/organizer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organizer/tournaments", label: "My Tournaments", icon: Trophy },
  { href: "/organizer/payouts", label: "Payouts", icon: Wallet },
  { href: "/organizer/profile", label: "Organization", icon: Building2 },
];

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, isOrganizer, isPlayer, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/organizer");
      return;
    }

    if (!isLoading && isAuthenticated && !isOrganizer) {
      // User is not an organizer, redirect to player dashboard if they're a player
      router.push("/player");
    }
  }, [isLoading, isAuthenticated, isOrganizer, router]);

  const isActive = (href: string) => {
    if (href === "/organizer") {
      return pathname === "/organizer";
    }
    return pathname?.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  if (!isAuthenticated || !isOrganizer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-black font-bold text-sm">CS</span>
            </div>
            <span className="font-bold text-lg">CueSports</span>
          </Link>

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-1">
              {/* Organizer Navigation */}
              <li className="mb-2">
                <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Organizer
                </span>
              </li>
              {organizerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-gold/20 text-gold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom section */}
            <div className="mt-auto space-y-1">
              <Link
                href="/organizer/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Header - Native App Style (matches player layout) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between bg-muted/30 px-4 safe-area-top">
        {/* Avatar - Left side, tap to switch to Player Dashboard */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => isPlayer ? router.push("/player") : router.push("/organizer/profile")}
            className="w-9 h-9 rounded-full overflow-hidden bg-gold/10 flex items-center justify-center active:opacity-70 transition-opacity"
            title={isPlayer ? "Switch to Player" : "View Profile"}
          >
            {user?.organizer_profile?.logo_url ? (
              <img
                src={user.organizer_profile.logo_url}
                alt="Organization"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-gold" />
            )}
          </button>
          {/* Role switch indicator for users with both roles */}
          {isPlayer && (
            <button
              onClick={() => router.push("/player")}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            >
              <ArrowLeftRight className="w-3 h-3 text-primary-foreground" />
            </button>
          )}
        </div>

        {/* Organization Name - Center */}
        <div className="flex-1 text-center px-3">
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.organizer_profile?.organization_name || "Organizer"}
          </p>
        </div>

        {/* Notification Bell - Right side */}
        <button className="w-9 h-9 flex items-center justify-center text-foreground rounded-full active:bg-muted transition-colors relative flex-shrink-0">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      {/* Header spacer for fixed header */}
      <div className="lg:hidden h-14" />

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen pb-20 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Native App Style */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-[60px] max-w-md mx-auto">
          {organizerNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 active:scale-95 ${
                  active ? "text-gold" : "text-muted-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-gold/10" : ""}`}>
                  <item.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
                </div>
                <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
