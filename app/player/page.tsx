"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  Trophy,
  Swords,
  TrendingUp,
  Calendar,
  ArrowRight,
  Target,
  Medal,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { tournamentApi, profileApi, type Tournament } from "@/lib/api";

interface MatchHistoryItem {
  id: number;
  opponent: {
    id: number;
    name: string;
  };
  tournament: {
    id: number;
    name: string;
  };
  result: "win" | "loss";
  score: string;
  played_at: string;
}

interface DashboardData {
  upcomingTournaments: Tournament[];
  recentMatches: MatchHistoryItem[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const [tournamentsRes, matchesRes] = await Promise.all([
    tournamentApi.myRegistered({ page: 1 }),
    profileApi.getMatches({ limit: "5" }),
  ]);

  return {
    upcomingTournaments: tournamentsRes.data?.slice(0, 3) || [],
    recentMatches: (matchesRes as { data?: MatchHistoryItem[] }).data?.slice(0, 5) || [],
  };
};

export default function PlayerDashboardPage() {
  const { user } = useAuth();

  // SWR for dashboard data with 1 minute refresh interval
  const { data, isLoading } = useSWR<DashboardData>(
    "player-dashboard",
    fetchDashboardData,
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, // Refresh every 60 seconds
      dedupingInterval: 30000, // Dedupe requests within 30 seconds
    }
  );

  const upcomingTournaments = data?.upcomingTournaments || [];
  const recentMatches = data?.recentMatches || [];

  const playerProfile = user?.player_profile;

  // Helper to get stats with fallback to legacy flat fields
  const totalMatches = playerProfile?.stats?.total_matches ?? playerProfile?.total_matches ?? 0;
  const wins = playerProfile?.stats?.wins ?? playerProfile?.wins ?? 0;
  const losses = playerProfile?.stats?.losses ?? playerProfile?.losses ?? 0;
  const currentRating = playerProfile?.rating?.current ?? playerProfile?.current_rating ?? 1000;
  const bestRating = playerProfile?.rating?.best ?? playerProfile?.highest_rating ?? 1000;

  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Welcome Header - Hidden on mobile (shown in header), visible on desktop */}
      <div className="hidden lg:block px-6 pt-6">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {playerProfile?.first_name || "Player"}!
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here&apos;s your pool journey overview
        </p>
      </div>

      {/* Stats Grid - 2x2 on mobile, 4 cols on desktop */}
      <div className="px-4 pt-4 lg:px-6 lg:pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Rating Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Rating</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{currentRating}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Peak: {bestRating}
            </p>
          </div>

          {/* Matches Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Matches</span>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Swords className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalMatches}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {wins}W - {losses}L
            </p>
          </div>

          {/* Win Rate Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Win Rate</span>
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{winRate}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">All matches</p>
          </div>

          {/* Rank Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Rank</span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Crown className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {playerProfile?.country_rank ? `#${playerProfile.country_rank}` : "-"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {playerProfile?.country_player_count
                ? `of ${playerProfile.country_player_count} players`
                : "National"}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Tournaments Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Upcoming Tournaments</span>
          </div>
          <Link
            href="/player/tournaments"
            className="text-xs text-primary font-medium flex items-center gap-0.5"
          >
            See all
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="px-4 lg:px-6 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : upcomingTournaments.length > 0 ? (
          <div className="px-4 lg:px-6 space-y-2">
            {upcomingTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50 active:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {tournament.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tournament.dates.starts_at
                      ? new Date(tournament.dates.starts_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Date TBD"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      tournament.status.value === "active"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {tournament.status.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No upcoming tournaments
            </p>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/tournaments">Browse Tournaments</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent Matches Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Recent Matches</span>
          </div>
          <Link
            href="/player/matches"
            className="text-xs text-primary font-medium flex items-center gap-0.5"
          >
            See all
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="px-4 lg:px-6 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : recentMatches.length > 0 ? (
          <div className="px-4 lg:px-6 space-y-2">
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    vs {match.opponent.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {match.tournament.name}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-semibold ${
                      match.result === "win"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {match.result === "win" ? "W" : "L"}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {match.score}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Swords className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No matches played yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
