"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface RatingHistoryEntry {
  old_rating: number;
  new_rating: number;
  change: number;
  formatted_change: string;
  reason: string;
  reason_label: string;
  created_at: string;
}

interface RatingHistoryResponse {
  rating_history: RatingHistoryEntry[];
}

const fetcher = async (): Promise<RatingHistoryResponse> => {
  const response = await profileApi.getRatingHistory();
  return response as unknown as RatingHistoryResponse;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { date: string; rating: number; change: number; reason_label: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
      <div className="font-semibold text-lg">{data.rating}</div>
      <div className="text-muted-foreground text-xs mb-2">
        {formatFullDate(data.date)}
      </div>
      <div className="border-t pt-2 mt-2">
        <div className="text-xs text-muted-foreground">{data.reason_label}</div>
        <div
          className={`text-sm font-medium mt-1 ${
            data.change > 0
              ? "text-green-600"
              : data.change < 0
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {data.change > 0 ? "+" : ""}
          {data.change} rating
        </div>
      </div>
    </div>
  );
}

export default function RatingPage() {
  const { data, error, isLoading } = useSWR("rating-history", fetcher, {
    revalidateOnFocus: false,
  });

  // Get profile data for current stats
  const { data: profileData } = useSWR("profile", async () => {
    const response = await profileApi.get();
    return response;
  }, {
    revalidateOnFocus: false,
  });

  const ratingHistory = data?.rating_history || [];

  // Transform data for chart
  const chartData = ratingHistory.map((entry) => ({
    date: entry.created_at,
    rating: entry.new_rating,
    change: entry.change,
    reason_label: entry.reason_label,
  }));

  // Get stats from profile
  const profile = (profileData as any)?.user?.player_profile;
  const stats = (profileData as any)?.stats;
  const currentRating = profile?.rating?.current || stats?.rating || 1000;
  const bestRating = profile?.rating?.best || stats?.best_rating || currentRating;
  const ratingCategory = profile?.rating?.category_label || stats?.rating_category || "Beginner";

  // Calculate period changes
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const change30d = ratingHistory
    .filter((e) => new Date(e.created_at) >= last30Days)
    .reduce((sum, e) => sum + e.change, 0);

  const change90d = ratingHistory
    .filter((e) => new Date(e.created_at) >= last90Days)
    .reduce((sum, e) => sum + e.change, 0);

  const changeAllTime = ratingHistory.reduce((sum, e) => sum + e.change, 0);

  // Calculate chart bounds
  const ratings = chartData.map((r) => r.rating);
  const minRating = ratings.length > 0 ? Math.min(...ratings) - 50 : 950;
  const maxRating = ratings.length > 0 ? Math.max(...ratings) + 50 : 1050;

  // Calculate lowest rating
  const lowestRating = ratings.length > 0 ? Math.min(...ratings) : currentRating;

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load rating history</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Rating Progress</h2>
        <p className="text-muted-foreground text-sm">
          Track your rating changes over time
        </p>
      </div>

      {/* Current Rating Card */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Current Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-primary">{currentRating}</div>
            <div className="text-sm text-muted-foreground mt-1">Current Rating</div>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}
            >
              {ratingCategory}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Award className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold">{bestRating}</div>
              <div className="text-xs text-muted-foreground">Peak Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Minus className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold">{lowestRating}</div>
              <div className="text-xs text-muted-foreground">Lowest</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                {changeAllTime > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : changeAllTime < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </div>
              <div
                className={`text-xl font-bold ${
                  changeAllTime > 0
                    ? "text-green-600"
                    : changeAllTime < 0
                    ? "text-red-600"
                    : ""
                }`}
              >
                {changeAllTime > 0 ? "+" : ""}
                {changeAllTime}
              </div>
              <div className="text-xs text-muted-foreground">Total Change</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold">{ratingHistory.length}</div>
              <div className="text-xs text-muted-foreground">Rating Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Changes */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-4 text-center">
          <div
            className={`text-xl font-bold ${
              change30d > 0
                ? "text-green-600"
                : change30d < 0
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {change30d > 0 ? "+" : ""}
            {change30d}
          </div>
          <div className="text-xs text-muted-foreground">Last 30 Days</div>
        </div>
        <div className="bg-card rounded-xl border p-4 text-center">
          <div
            className={`text-xl font-bold ${
              change90d > 0
                ? "text-green-600"
                : change90d < 0
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {change90d > 0 ? "+" : ""}
            {change90d}
          </div>
          <div className="text-xs text-muted-foreground">Last 90 Days</div>
        </div>
        <div className="bg-card rounded-xl border p-4 text-center">
          <div
            className={`text-xl font-bold ${
              changeAllTime > 0
                ? "text-green-600"
                : changeAllTime < 0
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {changeAllTime > 0 ? "+" : ""}
            {changeAllTime}
          </div>
          <div className="text-xs text-muted-foreground">All Time</div>
        </div>
      </div>

      {/* Rating Chart */}
      {chartData.length > 1 ? (
        <div className="bg-card rounded-xl border p-4">
          <h3 className="font-semibold mb-4">Rating History</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
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
                  tickFormatter={formatDate}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[minRating, maxRating]}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#ratingGradient)"
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={payload.change > 0 ? "#22c55e" : payload.change < 0 ? "#ef4444" : "#6b7280"}
                        stroke="white"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              Rating Gain
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Rating Loss
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border p-8 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No rating history yet</h3>
          <p className="text-muted-foreground text-sm">
            Your rating history will appear here after you play some matches.
          </p>
        </div>
      )}

      {/* Recent Rating Changes */}
      {ratingHistory.length > 0 && (
        <div className="bg-card rounded-xl border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Recent Rating Changes</h3>
          </div>
          <div className="divide-y max-h-[300px] overflow-y-auto">
            {ratingHistory.slice(0, 20).map((entry, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      entry.change > 0
                        ? "bg-green-100 text-green-700"
                        : entry.change < 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {entry.change > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : entry.change < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{entry.reason_label}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.old_rating} → {entry.new_rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      entry.change > 0
                        ? "text-green-600"
                        : entry.change < 0
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {entry.formatted_change}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
