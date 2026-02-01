"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  BarChart3,
  Trophy,
  TrendingUp,
  Settings,
  Building2,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  email: string;
  roles?: {
    is_organizer: boolean;
  };
  player_profile?: {
    first_name: string;
    last_name: string;
    nickname?: string;
    photo_url?: string;
  };
  organizer_profile?: {
    organization_name: string;
  };
}

const profileTabs = [
  { href: "/profile", label: "Overview", icon: User, exact: true },
  { href: "/profile/matches", label: "Matches", icon: BarChart3 },
  { href: "/profile/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/profile/rating", label: "Rating", icon: TrendingUp },
  { href: "/profile/settings", label: "Settings", icon: Settings },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin?redirect=/profile");
      return;
    }

    const userData = localStorage.getItem("user");
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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const allTabs = [
    ...profileTabs,
    ...(user?.roles?.is_organizer && user?.organizer_profile
      ? [{ href: "/profile/organizer", label: "Organizer", icon: Building2 }]
      : []),
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Back to Dashboard */}
            <Link
              href="/home"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* Page Title - Center */}
            <h1 className="font-semibold">My Profile</h1>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-muted-foreground"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden lg:flex text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden lg:flex items-center gap-1 -mb-px overflow-x-auto">
            {allTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive(tab.href, tab.exact)
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Tab Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-2 border-t">
              {allTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(tab.href, tab.exact)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
