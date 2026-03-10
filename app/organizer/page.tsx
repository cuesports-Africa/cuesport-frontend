"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Trophy,
  Users,
  DollarSign,
  CalendarPlus,
  List,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  organizerApi,
  tournamentApi,
  type OrganizerStats,
  type Tournament,
} from "@/lib/api";
import { useOrganizerUser } from "@/app/organizer/auth-guard";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  registration: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  pending_review: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

function formatDate(dateString?: string): string {
  if (!dateString) return "No date set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `KSh ${(amount / 1_000).toFixed(1)}K`;
  }
  return `KSh ${amount.toLocaleString()}`;
}

export default function OrganizerDashboard() {
  const { user } = useOrganizerUser();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, tournamentsRes] = await Promise.all([
          organizerApi.getStats(),
          tournamentApi.myTournaments({ page: 1 }),
        ]);
        setStats(statsRes);
        setTournaments(tournamentsRes.data.slice(0, 5));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card-dark rounded-2xl p-8 border border-border/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {error}
          </p>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              organizerApi
                .getStats()
                .then((s) => {
                  setStats(s);
                  return tournamentApi.myTournaments({ page: 1 });
                })
                .then((t) => setTournaments(t.data.slice(0, 5)))
                .catch((e) =>
                  setError(
                    e instanceof Error
                      ? e.message
                      : "Failed to load dashboard data"
                  )
                )
                .finally(() => setLoading(false));
            }}
            className="bg-electric text-white hover:bg-electric/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const orgName =
    user.organizer_profile?.organization_name || "Organiser";

  const statCards = [
    {
      label: "Total Tournaments",
      value: stats?.total_tournaments ?? 0,
      icon: Trophy,
    },
    {
      label: "Active Tournaments",
      value: stats?.active_tournaments ?? 0,
      icon: TrendingUp,
    },
    {
      label: "Total Players",
      value: stats?.total_players ?? 0,
      icon: Users,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.total_revenue ?? 0),
      icon: DollarSign,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {orgName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s an overview of your tournament activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="card-dark rounded-2xl p-6 border border-border/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-electric" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-dark rounded-2xl p-6 border border-border/20">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/organizer/tournaments/create">
            <Button className="bg-electric text-white hover:bg-electric/90">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Create Tournament
            </Button>
          </Link>
          <Link href="/organizer/tournaments">
            <Button
              variant="outline"
              className="border-border/30 text-foreground hover:bg-white/5"
            >
              <List className="h-4 w-4 mr-2" />
              View All Tournaments
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Tournaments */}
      <div className="card-dark rounded-2xl p-6 border border-border/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Tournaments
          </h2>
          {tournaments.length > 0 && (
            <Link
              href="/organizer/tournaments"
              className="text-sm text-electric hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-electric/5 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-electric/40" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No tournaments yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first tournament to get started.
            </p>
            <Link href="/organizer/tournaments/create">
              <Button className="bg-electric text-white hover:bg-electric/90">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tournaments.map((tournament) => {
              const statusValue = tournament.status.value;
              const badgeClass =
                STATUS_COLORS[statusValue] || STATUS_COLORS.draft;

              return (
                <Link
                  key={tournament.id}
                  href={`/organizer/tournaments/${tournament.id}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/10 hover:border-border/30 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tournament.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {tournament.status.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(tournament.dates.starts_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <Users className="h-3.5 w-3.5" />
                    <span>{tournament.stats.participants_count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
