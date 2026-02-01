"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Trophy,
  Swords,
  User,
  LogOut,
  Settings,
  Bell,
  ArrowLeftRight,
} from "lucide-react";
import { RoleSwitcher } from "@/components/role-switcher";
import { useAuth } from "@/contexts/auth-context";

// Desktop sidebar navigation
const playerNavItems = [
  { href: "/player", label: "Home", icon: Home },
  { href: "/player/tournaments", label: "My Tournaments", icon: Trophy },
  { href: "/player/matches", label: "Matches", icon: Swords },
  { href: "/player/profile", label: "Profile", icon: User },
];

// Mobile bottom nav (4 items max for native app feel)
const mobileNavItems = [
  { href: "/player", label: "Home", icon: Home },
  { href: "/player/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/player/matches", label: "Matches", icon: Swords },
  { href: "/player/profile", label: "Profile", icon: User },
];

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, isPlayer, isOrganizer, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/player");
      return;
    }

    if (!isLoading && isAuthenticated && !isPlayer) {
      // User is not a player, redirect to organizer dashboard if they're an organizer
      router.push("/organizer");
    }
  }, [isLoading, isAuthenticated, isPlayer, router]);

  const isActive = (href: string) => {
    if (href === "/player") {
      return pathname === "/player";
    }
    return pathname?.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isPlayer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                CS
              </span>
            </div>
            <span className="font-bold text-lg">CueSports</span>
          </Link>

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-1">
              {/* Player Navigation */}
              <li className="mb-2">
                <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Dashboard
                </span>
              </li>
              {playerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
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
                href="/player/profile"
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

      {/* Mobile Header - Native App Style */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between bg-muted/30 px-4 safe-area-top">
        {/* Profile Avatar - Tap to switch role if user has organizer role */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => isOrganizer ? router.push("/organizer") : router.push("/player/profile")}
            className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center active:opacity-70 transition-opacity"
            title={isOrganizer ? "Switch to Organizer" : "View Profile"}
          >
            {user?.player_profile?.photo_url ? (
              <img
                src={user.player_profile.photo_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {user?.player_profile?.first_name?.[0] || "P"}
              </span>
            )}
          </button>
          {/* Role switch indicator for users with both roles */}
          {isOrganizer && (
            <button
              onClick={() => router.push("/organizer")}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gold rounded-full border-2 border-background flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            >
              <ArrowLeftRight className="w-3 h-3 text-black" />
            </button>
          )}
        </div>

        {/* Welcome Text */}
        <div className="flex-1 text-center px-3">
          <p className="text-sm font-semibold text-foreground truncate">
            Hi, {user?.player_profile?.first_name || "Player"}!
          </p>
        </div>

        {/* Notification Bell */}
        <button className="w-9 h-9 flex items-center justify-center text-foreground rounded-full active:bg-muted transition-colors relative flex-shrink-0">
          <Bell className="h-5 w-5" />
          {/* Notification dot - uncomment when needed */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
        </button>
      </header>

      {/* Header spacer for fixed header */}
      <div className="lg:hidden h-14" />


      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Native App Style */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-[60px] max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 active:scale-95 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-primary/10" : ""}`}>
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
