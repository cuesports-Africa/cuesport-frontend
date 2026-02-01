"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  email: string;
  player_profile?: {
    first_name: string;
    last_name: string;
  };
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        // Invalid data
      }
    }
  }, []);

  const firstName = user?.player_profile?.first_name || "Player";

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here's what's happening with your game
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/tournaments/upcoming"
          className="bg-card rounded-xl border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Find Tournaments</h3>
              <p className="text-sm text-muted-foreground">Browse upcoming events</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>

        <Link
          href="/rankings"
          className="bg-card rounded-xl border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">View Rankings</h3>
              <p className="text-sm text-muted-foreground">See leaderboards</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>

        <Link
          href="/home/my-tournaments"
          className="bg-card rounded-xl border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">My Tournaments</h3>
              <p className="text-sm text-muted-foreground">Registered & hosted</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-card rounded-xl border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No recent activity</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          Join a tournament to start building your match history and player rating.
        </p>
        <Button asChild>
          <Link href="/tournaments/upcoming">
            Browse Tournaments
          </Link>
        </Button>
      </div>
    </div>
  );
}
