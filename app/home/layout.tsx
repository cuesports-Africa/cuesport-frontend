"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Trophy,
  BarChart3,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  ChevronRight,
  Building2,
  Plus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const playerNavItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/rankings", label: "Rankings", icon: BarChart3 },
  { href: "/home/profile", label: "Profile", icon: User },
];

const organizerNavItems = [
  { href: "/home/my-tournaments", label: "My Hosted", icon: Calendar },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    email: string;
    roles?: {
      is_organizer: boolean;
    };
    player_profile?: { first_name: string; last_name: string };
    organizer_profile?: { organization_name: string };
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/auth/signin?redirect=/home");
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        // Invalid user data
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home";
    }
    // For external routes like /tournaments, /rankings
    if (!href.startsWith("/home")) {
      return pathname.startsWith(href);
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CS</span>
            </div>
            <span className="font-bold text-lg">CueSports</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-1">
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

              {/* Organizer Section */}
              {user?.roles?.is_organizer && user?.organizer_profile && (
                <>
                  <li className="mt-4 mb-2">
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
                  <li>
                    <Link
                      href="/home/my-tournaments/new"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Create Tournament
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Bottom section */}
            <div className="mt-auto space-y-1">
              {/* Become Organizer (if not already) */}
              {(!user?.roles?.is_organizer || !user?.organizer_profile) && (
                <Link
                  href="/home/become-organizer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  <Building2 className="h-5 w-5" />
                  Become Organizer
                </Link>
              )}
              <button
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-50 cursor-not-allowed"
                disabled
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">CS</span>
          </div>
          <span className="font-semibold">CueSports</span>
        </div>
        <button className="p-2 text-muted-foreground relative">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">CS</span>
                  </div>
                  <span className="font-bold">CueSports</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User info */}
              {user && (
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.player_profile
                          ? `${user.player_profile.first_name} ${user.player_profile.last_name}`
                          : "Player"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-1">
                  {playerNavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </span>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Organizer Section in Mobile */}
                {user?.roles?.is_organizer && user?.organizer_profile && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Organizer
                    </p>
                    <ul className="space-y-1">
                      {organizerNavItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-gold/20 text-gold"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              {item.label}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/home/my-tournaments/new"
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <Plus className="h-5 w-5" />
                            Create Tournament
                          </span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </nav>

              {/* Become Organizer (if not already) */}
              {(!user?.roles?.is_organizer || !user?.organizer_profile) && (
                <div className="p-4 border-t">
                  <Link
                    href="/home/become-organizer"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Building2 className="h-5 w-5" />
                      Become Organizer
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Bottom section */}
              <div className="p-4 border-t space-y-1">
                <button
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen pb-20 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {playerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
