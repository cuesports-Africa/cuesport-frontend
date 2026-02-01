"use client";

import useSWR from "swr";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Trophy,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { profileApi } from "@/lib/api";

interface RatingHistoryItem {
  id: number;
  rating_before: number;
  rating_after: number;
  change: number;
  match: {
    id: number;
    opponent_name: string;
    result: "win" | "loss";
  };
  tournament: {
    id: number;
    name: string;
  };
  recorded_at: string;
}

interface RatingHistoryResponse {
  data: RatingHistoryItem[];
  stats: {
    current_rating: number;
    highest_rating: number;
    lowest_rating: number;
    total_changes: number;
  };
}

const fetchRatingHistory = async (): Promise<RatingHistoryResponse> => {
  return (await profileApi.getRatingHistory()) as RatingHistoryResponse;
};

export default function PlayerRatingPage() {
  const { user } = useAuth();

  // SWR for rating history with 2 minute deduping (rating changes only after matches)
  const { data: ratingData, isLoading } = useSWR<RatingHistoryResponse>(
    "rating-history",
    fetchRatingHistory,
    {
      revalidateOnFocus: true,
      dedupingInterval: 120000, // Dedupe requests within 2 minutes
    }
  );

  const history = ratingData?.data || [];
  const stats = ratingData?.stats || null;

  const playerProfile = user?.player_profile;
  const currentRating = stats?.current_rating || playerProfile?.current_rating || 1200;
  const highestRating = stats?.highest_rating || playerProfile?.highest_rating || 1200;

  // Calculate rating change trends
  const recentChanges = history.slice(0, 10);
  const recentTrend = recentChanges.reduce((sum, h) => sum + h.change, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Rating History</h1>
        <p className="text-muted-foreground">
          Track your rating progress over time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentRating}</div>
            <div className="flex items-center gap-1 mt-1">
              {recentTrend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">
                    +{recentTrend} last 10 matches
                  </span>
                </>
              ) : recentTrend < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">
                    {recentTrend} last 10 matches
                  </span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No change</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Rating</CardTitle>
            <Trophy className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{highestRating}</div>
            <p className="text-sm text-muted-foreground">
              {currentRating === highestRating
                ? "Current peak!"
                : `${highestRating - currentRating} from peak`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Rating</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.lowest_rating || 1200}
            </div>
            <p className="text-sm text-muted-foreground">
              +{currentRating - (stats?.lowest_rating || 1200)} from lowest
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Changes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.total_changes || history.length}
            </div>
            <p className="text-sm text-muted-foreground">Total recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating History List */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.change > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : item.change < 0
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {item.change > 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : item.change < 0 ? (
                        <TrendingDown className="h-5 w-5" />
                      ) : (
                        <Minus className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          vs {item.match.opponent_name}
                        </span>
                        <span
                          className={`text-sm ${
                            item.match.result === "win"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          ({item.match.result === "win" ? "Won" : "Lost"})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.tournament.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        item.change > 0
                          ? "text-green-600 dark:text-green-400"
                          : item.change < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {item.change}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.rating_before} → {item.rating_after}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.recorded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No rating history yet</h3>
              <p className="text-muted-foreground">
                Your rating will update after you play matches in tournaments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
