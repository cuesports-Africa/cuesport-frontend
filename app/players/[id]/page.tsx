"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Medal,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
  BarChart3,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { playerApi } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PublicPlayerProfile {
  player: {
    id: number;
    first_name: string;
    last_name: string;
    nickname?: string;
    photo_url?: string;
    gender: string;
    rating: number;
    best_rating: number;
    rating_category: string;
    total_matches: number;
    wins: number;
    losses: number;
    win_rate: number;
    tournaments_played: number;
    tournaments_won: number;
    location: {
      name: string;
      full_path: string;
    };
    member_since: string;
  };
  rank?: {
    local: number | null;
    national: number | null;
  };
  recent_matches?: Array<{
    id: number;
    opponent: {
      id: number;
      name: string;
    };
    result: "win" | "loss";
    score: string;
    rating_change: number;
    tournament: {
      id: number;
      name: string;
    };
    played_at: string;
  }>;
  rating_history?: Array<{
    date: string;
    rating: number;
  }>;
}

const fetcher = async (key: string): Promise<PublicPlayerProfile> => {
  const [, id] = key.split("|");
  const response = await playerApi.get(Number(id));
  return response as unknown as PublicPlayerProfile;
};

function getRatingCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    beginner: "bg-gray-100 text-gray-700",
    novice: "bg-green-100 text-green-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-purple-100 text-purple-700",
    expert: "bg-orange-100 text-orange-700",
    master: "bg-red-100 text-red-700",
    grandmaster: "bg-yellow-100 text-yellow-800",
  };
  return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-700";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PublicPlayerProfile() {
  const params = useParams();
  const playerId = params.id as string;

  const { data, error, isLoading } = useSWR(
    playerId ? `player|${playerId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Player Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The player you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/players">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Players
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const player = data.player;
  const recentMatches = data.recent_matches || [];
  const ratingHistory = data.rating_history || [];
  const rank = data.rank;

  // Calculate chart bounds
  const ratings = ratingHistory.map((r) => r.rating);
  const minRating = Math.min(...ratings, player.rating) - 50;
  const maxRating = Math.max(...ratings, player.best_rating) + 50;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/players"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Players
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted overflow-hidden">
                {player.photo_url ? (
                  <Image
                    src={player.photo_url}
                    alt={player.first_name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-muted-foreground">
                    {player.first_name[0]}
                    {player.last_name[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {player.first_name} {player.last_name}
                  </h1>
                  {player.nickname && (
                    <p className="text-lg text-muted-foreground">
                      &quot;{player.nickname}&quot;
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {player.location?.full_path && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {player.location.full_path}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member since {formatDate(player.member_since)}
                    </span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="text-center md:text-right">
                  <div className="text-4xl md:text-5xl font-bold text-primary">
                    {player.rating}
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getRatingCategoryColor(
                      player.rating_category
                    )}`}
                  >
                    {player.rating_category}
                  </span>
                </div>
              </div>

              {/* Peak Rating */}
              {player.best_rating > player.rating && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-muted-foreground">Peak rating:</span>
                  <span className="font-semibold">{player.best_rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Win Rate */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">Win Rate</span>
            </div>
            <div className="text-2xl font-bold">{player.win_rate?.toFixed(1) || 0}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {player.wins}W - {player.losses}L
            </div>
          </div>

          {/* Total Matches */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Matches</span>
            </div>
            <div className="text-2xl font-bold">{player.total_matches}</div>
            <div className="text-xs text-muted-foreground mt-1">Total played</div>
          </div>

          {/* Tournaments */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Tournaments</span>
            </div>
            <div className="text-2xl font-bold">{player.tournaments_played}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {player.tournaments_won} won
            </div>
          </div>

          {/* Rank */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Medal className="h-4 w-4" />
              <span className="text-sm">Local Rank</span>
            </div>
            <div className="text-2xl font-bold">
              {rank?.local ? `#${rank.local}` : "-"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {rank?.national ? `#${rank.national} national` : "In their area"}
            </div>
          </div>
        </div>

        {/* Rating Chart */}
        {ratingHistory.length > 1 && (
          <div className="bg-card rounded-xl border p-4">
            <h3 className="font-semibold mb-4">Rating History</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ratingHistory}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[minRating, maxRating]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-card border rounded-lg shadow-lg p-2 text-sm">
                          <div className="font-semibold">{payload[0].value}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(payload[0].payload.date)}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#ratingGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Matches */}
        <div className="bg-card rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Recent Matches</h3>
          </div>
          {recentMatches.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No matches played yet
            </div>
          ) : (
            <div className="divide-y">
              {recentMatches.slice(0, 5).map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        match.result === "win"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {match.result === "win" ? "W" : "L"}
                    </div>
                    <div>
                      <div className="font-medium">
                        vs{" "}
                        <Link
                          href={`/players/${match.opponent.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {match.opponent.name}
                        </Link>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Link
                          href={`/tournaments/${match.tournament.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {match.tournament.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{match.score}</div>
                    <div
                      className={`text-sm font-medium ${
                        match.rating_change > 0
                          ? "text-green-600"
                          : match.rating_change < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {match.rating_change > 0 ? "+" : ""}
                      {match.rating_change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
