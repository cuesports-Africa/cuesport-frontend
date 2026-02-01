"use client";

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
  ChevronRight,
  Loader2,
  Flame,
  Snowflake,
  Minus,
  Award,
  BarChart3,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api";

interface ProfileData {
  user: {
    id: number;
    email: string;
    phone_number: string;
    roles: {
      is_player: boolean;
      is_organizer: boolean;
    };
    player_profile?: {
      id: number;
      first_name: string;
      last_name: string;
      full_name: string;
      nickname?: string;
      photo_url?: string;
      date_of_birth: string;
      age: number;
      gender: string;
      rating: {
        current: number;
        best: number;
        category: string;
        category_label: string;
      };
      stats: {
        total_matches: number;
        wins: number;
        losses: number;
        win_rate: number;
        frames_won: number;
        frames_lost: number;
        frame_difference: number;
        tournaments_played: number;
        tournaments_won: number;
      };
      location?: {
        id: number;
        name: string;
        full_path: string;
      };
    };
    organizer_profile?: {
      id: number;
      organization_name: string;
      tournaments_hosted: number;
    };
    created_at: string;
  };
  stats?: {
    rating: number;
    rating_category: string;
    best_rating: number;
    total_matches: number;
    wins: number;
    losses: number;
    win_rate: number;
    lifetime_frames_won: number;
    lifetime_frames_lost: number;
    lifetime_frame_difference: number;
    tournaments_played: number;
    tournaments_won: number;
  };
  streak?: {
    current_streak: number;
    current_streak_type: "win" | "loss" | null;
    best_win_streak: number;
    worst_loss_streak: number;
  };
  recent_matches?: Array<{
    id: number;
    opponent_name: string;
    opponent_profile_id: number;
    won: boolean;
    score: string;
    rating_change: number;
    tournament_name: string;
    tournament_id: number;
    played_at: string;
  }>;
  rank?: {
    local: number | null;
    national: number | null;
  };
}

const fetcher = async () => {
  const response = await profileApi.get();
  return response as unknown as ProfileData;
};

function getRatingCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    beginner: "bg-gray-100 text-gray-700",
    novice: "bg-green-100 text-green-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-purple-100 text-purple-700",
    expert: "bg-orange-100 text-orange-700",
    master: "bg-red-100 text-red-700",
    pro: "bg-yellow-100 text-yellow-800",
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

export default function ProfileOverview() {
  const { data, error, isLoading } = useSWR("profile", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load profile</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const playerProfile = data.user.player_profile;
  const stats = data.stats;
  const streak = data.streak;
  const recentMatches = data.recent_matches || [];
  const rank = data.rank;

  if (!playerProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No player profile found</p>
        <Button asChild>
          <Link href="/profile/settings">Complete Profile</Link>
        </Button>
      </div>
    );
  }

  // Use stats from either the stats object or player_profile.stats
  const currentRating = playerProfile.rating?.current || stats?.rating || 1000;
  const bestRating = playerProfile.rating?.best || stats?.best_rating || currentRating;
  const ratingCategory = playerProfile.rating?.category_label || stats?.rating_category || "Beginner";
  const totalMatches = playerProfile.stats?.total_matches || stats?.total_matches || 0;
  const wins = playerProfile.stats?.wins || stats?.wins || 0;
  const losses = playerProfile.stats?.losses || stats?.losses || 0;
  const winRate = playerProfile.stats?.win_rate || stats?.win_rate || 0;
  const tournamentsPlayed = playerProfile.stats?.tournaments_played || stats?.tournaments_played || 0;
  const tournamentsWon = playerProfile.stats?.tournaments_won || stats?.tournaments_won || 0;
  const framesWon = playerProfile.stats?.frames_won || stats?.lifetime_frames_won || 0;
  const framesLost = playerProfile.stats?.frames_lost || stats?.lifetime_frames_lost || 0;
  const frameDiff = playerProfile.stats?.frame_difference || stats?.lifetime_frame_difference || 0;

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted overflow-hidden">
              {playerProfile.photo_url ? (
                <Image
                  src={playerProfile.photo_url}
                  alt={playerProfile.first_name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-muted-foreground">
                  {playerProfile.first_name?.[0]}
                  {playerProfile.last_name?.[0]}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {playerProfile.first_name} {playerProfile.last_name}
                </h2>
                {playerProfile.nickname && (
                  <p className="text-lg text-muted-foreground">
                    &quot;{playerProfile.nickname}&quot;
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {playerProfile.location?.full_path || "Location not set"}
                  </span>
                  {playerProfile.age && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {playerProfile.age} years old
                    </span>
                  )}
                </div>
              </div>

              {/* Rating Badge */}
              <div className="text-center md:text-right">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  {currentRating}
                </div>
                <div className="text-sm text-muted-foreground">Current Rating</div>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getRatingCategoryColor(
                    playerProfile.rating?.category || ""
                  )}`}
                >
                  {ratingCategory}
                </span>
              </div>
            </div>

            {/* Peak Rating */}
            {bestRating > currentRating && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">Peak rating:</span>
                <span className="font-semibold">{bestRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Win Rate */}
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="h-4 w-4" />
            <span className="text-sm">Win Rate</span>
          </div>
          <div className="text-2xl font-bold">
            {winRate?.toFixed(1) || 0}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {wins}W - {losses}L
          </div>
        </div>

        {/* Total Matches */}
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Matches</span>
          </div>
          <div className="text-2xl font-bold">{totalMatches}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total played
          </div>
        </div>

        {/* Tournaments */}
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Trophy className="h-4 w-4" />
            <span className="text-sm">Tournaments</span>
          </div>
          <div className="text-2xl font-bold">{tournamentsPlayed}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {tournamentsWon} won
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
            {rank?.national ? `#${rank.national} national` : "In your area"}
          </div>
        </div>
      </div>

      {/* Streak & Frame Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Current Streak</div>
              <div className="flex items-center gap-2">
                {streak?.current_streak_type === "win" ? (
                  <>
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-xl font-bold text-orange-500">
                      {streak.current_streak} Wins
                    </span>
                  </>
                ) : streak?.current_streak_type === "loss" ? (
                  <>
                    <Snowflake className="h-5 w-5 text-blue-500" />
                    <span className="text-xl font-bold text-blue-500">
                      {streak.current_streak} Losses
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold text-muted-foreground">
                      No streak
                    </span>
                  </>
                )}
              </div>
            </div>
            {streak?.current_streak_type === "win" && (streak.current_streak || 0) >= 3 && (
              <div className="text-3xl">🔥</div>
            )}
          </div>
        </div>

        {/* Frame Difference */}
        <div className="bg-card rounded-xl border p-4">
          <div className="text-sm text-muted-foreground mb-1">Frame Statistics</div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold">
                {framesWon} - {framesLost}
              </span>
              <span className="text-sm text-muted-foreground ml-2">frames</span>
            </div>
            <div
              className={`flex items-center gap-1 text-lg font-semibold ${
                frameDiff > 0
                  ? "text-green-600"
                  : frameDiff < 0
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {frameDiff > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : frameDiff < 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              {frameDiff > 0 ? "+" : ""}
              {frameDiff}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-card rounded-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Recent Matches</h3>
          <Link
            href="/profile/matches"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {recentMatches.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No matches played yet
          </div>
        ) : (
          <div className="divide-y">
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      match.won
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {match.won ? "W" : "L"}
                  </div>
                  <div>
                    <div className="font-medium">vs {match.opponent_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {match.tournament_name}
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

      {/* Organizer Stats (if applicable) */}
      {data.user.roles.is_organizer && data.user.organizer_profile && (
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold">
                  {data.user.organizer_profile.organization_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.user.organizer_profile.tournaments_hosted || 0} tournaments hosted
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/organizer">
                View Stats
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
