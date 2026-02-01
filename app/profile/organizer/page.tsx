"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  Loader2,
  Building2,
  Trophy,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { organizerApi, tournamentApi, Tournament } from "@/lib/api";

interface OrganizerProfile {
  id: number;
  organization_name: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  tournaments_hosted: number;
  created_at: string;
}

interface OrganizerStats {
  tournaments_hosted: number;
  active_tournaments: number;
  total_participants: number;
}

interface OrganizerData {
  organizer_profile: OrganizerProfile;
  stats: OrganizerStats;
}

const fetcher = async (): Promise<{ profile: OrganizerData; tournaments: Tournament[] }> => {
  const [profileRes, tournamentsRes] = await Promise.all([
    organizerApi.getProfile(),
    tournamentApi.myTournaments({ page: 1 }),
  ]);

  return {
    profile: profileRes as unknown as OrganizerData,
    tournaments: tournamentsRes.data || [],
  };
};

function getStatusBadge(status: Tournament["status"]) {
  const statusStyles: Record<string, string> = {
    pending_review: "bg-yellow-100 text-yellow-700",
    draft: "bg-gray-100 text-gray-700",
    registration: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles[status.value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.value === "active" && (
        <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mr-1 animate-pulse" />
      )}
      {status.label}
    </span>
  );
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrganizerProfilePage() {
  const { data, error, isLoading } = useSWR("organizer-profile", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.profile?.organizer_profile) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No Organizer Profile</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You don't have an organizer profile yet. Become an organizer to host
          tournaments and manage events.
        </p>
        <Button asChild>
          <Link href="/become-organizer">Become an Organizer</Link>
        </Button>
      </div>
    );
  }

  const organizer = data.profile.organizer_profile;
  const stats = data.profile.stats;
  const recentTournaments = data.tournaments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Organizer Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            Manage your tournaments and view statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/organizer/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/organizer/tournaments/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Tournament
            </Link>
          </Button>
        </div>
      </div>

      {/* Organization Info */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            {organizer.logo_url ? (
              <Image
                src={organizer.logo_url}
                alt={organizer.organization_name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold">{organizer.organization_name}</h3>
            {organizer.description && (
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {organizer.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Organizer since {formatDate(organizer.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Trophy className="h-4 w-4" />
            <span className="text-sm">Total Tournaments</span>
          </div>
          <div className="text-2xl font-bold">{stats?.tournaments_hosted || organizer.tournaments_hosted || 0}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats?.active_tournaments || 0} active
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Total Players</span>
          </div>
          <div className="text-2xl font-bold">{stats?.total_participants || 0}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Across all tournaments
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Active</span>
          </div>
          <div className="text-2xl font-bold">{stats?.active_tournaments || 0}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Tournaments running
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Revenue</span>
          </div>
          <div className="text-2xl font-bold">-</div>
          <div className="text-xs text-muted-foreground mt-1">
            View finances
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/organizer/tournaments"
          className="bg-card rounded-xl border p-4 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Manage Tournaments</div>
              <div className="text-sm text-muted-foreground">
                View and edit all tournaments
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          href="/organizer/participants"
          className="bg-card rounded-xl border p-4 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Player Management</div>
              <div className="text-sm text-muted-foreground">
                Manage registrations
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          href="/organizer/payouts"
          className="bg-card rounded-xl border p-4 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Payouts</div>
              <div className="text-sm text-muted-foreground">
                View earnings & payouts
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Recent Tournaments */}
      <div className="bg-card rounded-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Recent Tournaments</h3>
          <Link
            href="/organizer/tournaments"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {recentTournaments.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">No tournaments yet</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first tournament to get started
            </p>
            <Button asChild>
              <Link href="/organizer/tournaments/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {recentTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/organizer/tournaments/${tournament.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{tournament.name}</span>
                    {getStatusBadge(tournament.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatDate(tournament.dates.starts_at)} &middot;{" "}
                    {tournament.stats.participants_count} players
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
