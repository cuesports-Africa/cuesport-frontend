"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Wallet,
  TrendingUp,
  Calendar,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { tournamentApi, type Tournament } from "@/lib/api";
import { CreateTournamentModal } from "@/components/organizer/create-tournament-modal";

interface OrganizerStats {
  total_tournaments: number;
  active_tournaments: number;
  total_participants: number;
  pending_payouts: number;
  total_revenue: number;
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<OrganizerStats>({
    total_tournaments: 0,
    active_tournaments: 0,
    total_participants: 0,
    pending_payouts: 0,
    total_revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await tournamentApi.myTournaments();
      const allTournaments = response.data || [];
      setTournaments(allTournaments.slice(0, 5));

      const active = allTournaments.filter(
        (t) => t.status.value === "active" || t.status.value === "registration"
      ).length;
      const participants = allTournaments.reduce(
        (sum, t) => sum + t.stats.participants_count,
        0
      );

      setStats({
        total_tournaments: allTournaments.length,
        active_tournaments: active,
        total_participants: participants,
        pending_payouts: 0,
        total_revenue: 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const organizerProfile = user?.organizer_profile;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600";
      case "registration":
        return "bg-blue-500/10 text-blue-600";
      case "pending_review":
        return "bg-yellow-500/10 text-yellow-600";
      case "completed":
        return "bg-gray-500/10 text-gray-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="space-y-5">
      {/* Welcome Header - Hidden on mobile (shown in header), visible on desktop */}
      <div className="hidden lg:block px-6 pt-6">
        <h1 className="text-2xl font-bold text-foreground">
          {organizerProfile?.organization_name || "Organizer Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your tournaments and track performance
        </p>
      </div>

      {/* Create Tournament Button - Desktop only */}
      <div className="hidden lg:block px-6">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gold text-black hover:bg-gold/90 rounded-xl h-12 text-sm font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Stats Grid - 2x2 on mobile, 4 cols on desktop */}
      <div className="px-4 pt-4 lg:px-6 lg:pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Tournaments Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Tournaments</span>
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-gold" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total_tournaments}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {stats.active_tournaments} active
            </p>
          </div>

          {/* Participants Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Participants</span>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total_participants}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Total registered
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Revenue</span>
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.total_revenue > 0 ? `KES ${(stats.total_revenue / 1000).toFixed(0)}K` : "KES 0"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Entry fees
            </p>
          </div>

          {/* Payouts Card */}
          <Link href="/organizer/payouts" className="block">
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm active:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Payouts</span>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.pending_payouts > 0 ? `KES ${(stats.pending_payouts / 1000).toFixed(0)}K` : "KES 0"}
              </p>
              <p className="text-[11px] text-gold mt-0.5">
                View payouts
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Tournaments Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            <span className="font-semibold text-sm">Recent Tournaments</span>
          </div>
          <Link
            href="/organizer/tournaments"
            className="text-xs text-gold font-medium flex items-center gap-0.5"
          >
            See all
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="px-4 lg:px-6 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : tournaments.length > 0 ? (
          <div className="px-4 lg:px-6 space-y-2">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/organizer/tournaments/${tournament.id}`}
                className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50 active:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground truncate">
                      {tournament.name}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${getStatusColor(
                        tournament.status.value
                      )}`}
                    >
                      {tournament.status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {tournament.stats.participants_count}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {tournament.dates.starts_at
                        ? new Date(tournament.dates.starts_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "TBD"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No tournaments yet
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
              className="rounded-full bg-gold text-black hover:bg-gold/90"
            >
              Create your first tournament
            </Button>
          </div>
        )}
      </div>

      {/* Quick Links Section - Simplified for mobile */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-4 lg:px-6">
          <span className="font-semibold text-sm">Quick Actions</span>
        </div>
        <div className="px-4 lg:px-6 grid grid-cols-2 gap-2">
          <Link
            href="/organizer/tournaments"
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 active:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">Manage</p>
              <p className="text-[11px] text-muted-foreground">Tournaments</p>
            </div>
          </Link>

          <Link
            href="/organizer/payouts"
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 active:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">Payouts</p>
              <p className="text-[11px] text-muted-foreground">Earnings</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
