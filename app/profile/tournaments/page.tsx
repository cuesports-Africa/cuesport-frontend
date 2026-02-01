"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trophy,
  Medal,
  Calendar,
  MapPin,
  Users,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api";

interface TournamentHistory {
  id: number;
  name: string;
  status: {
    value: string;
    label: string;
  };
  venue: {
    name: string;
    address: string;
  };
  dates: {
    starts_at: string;
    ends_at: string;
  };
  participant_count: number;
  my_result: {
    placement: number | null;
    matches_played: number;
    matches_won: number;
    rating_change: number;
  };
  format: string;
}

interface TournamentsResponse {
  data: TournamentHistory[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
  stats: {
    total_played: number;
    total_won: number;
    best_placement: number | null;
  };
}

type TournamentFilter = "all" | "won" | "active";

const fetcher = async (key: string): Promise<TournamentsResponse> => {
  const [, page, filter] = key.split("|");
  const params: Record<string, string> = { page };
  if (filter !== "all") {
    params.filter = filter;
  }
  const response = await profileApi.getTournaments(params);
  return response as unknown as TournamentsResponse;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPlacementBadge(placement: number | null) {
  if (!placement) return null;

  if (placement === 1) {
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
        <Trophy className="h-3 w-3" />
        1st Place
      </span>
    );
  }
  if (placement === 2) {
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
        <Medal className="h-3 w-3" />
        2nd Place
      </span>
    );
  }
  if (placement === 3) {
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
        <Medal className="h-3 w-3" />
        3rd Place
      </span>
    );
  }
  if (placement <= 8) {
    return (
      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
        Top 8
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
      #{placement}
    </span>
  );
}

function getStatusBadge(status: TournamentHistory["status"]) {
  const statusStyles: Record<string, string> = {
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

export default function TournamentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<TournamentFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data, error, isLoading } = useSWR(
    `profile-tournaments|${currentPage}|${filter}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const tournaments = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  const handleFilterChange = (newFilter: TournamentFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

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
        <p className="text-destructive mb-4">Failed to load tournament history</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tournament History</h2>
          <p className="text-muted-foreground text-sm">
            {meta?.total || 0} tournaments participated
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold">{stats.total_played}</div>
            <div className="text-xs text-muted-foreground">Tournaments Played</div>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.total_won}</div>
            <div className="text-xs text-muted-foreground">Tournaments Won</div>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.best_placement ? `#${stats.best_placement}` : "-"}
            </div>
            <div className="text-xs text-muted-foreground">Best Placement</div>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden md:flex"}`}>
        {(["all", "won", "active"] as TournamentFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f === "all" ? "All" : f === "won" ? "Won" : "Active"}
          </button>
        ))}
      </div>

      {/* Tournament List */}
      {tournaments.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No tournaments found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {filter === "won"
              ? "You haven't won any tournaments yet. Keep playing!"
              : filter === "active"
              ? "You're not currently in any active tournaments."
              : "You haven't participated in any tournaments yet."}
          </p>
          <Button asChild>
            <Link href="/tournaments">Find Tournaments</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className="bg-card rounded-xl border p-4 hover:border-primary/30 hover:shadow-md transition-all block"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Tournament Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold text-lg">{tournament.name}</h3>
                    {getStatusBadge(tournament.status)}
                    {getPlacementBadge(tournament.my_result.placement)}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(tournament.dates.starts_at)}
                    </span>
                    {(tournament.venue.name || tournament.venue.address) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {tournament.venue.name || tournament.venue.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {tournament.participant_count} players
                    </span>
                  </div>
                </div>

                {/* My Stats */}
                <div className="flex items-center gap-6 text-center md:text-right">
                  <div>
                    <div className="text-lg font-bold">
                      {tournament.my_result.matches_won}/{tournament.my_result.matches_played}
                    </div>
                    <div className="text-xs text-muted-foreground">Matches Won</div>
                  </div>
                  <div>
                    <div
                      className={`text-lg font-bold ${
                        tournament.my_result.rating_change > 0
                          ? "text-green-600"
                          : tournament.my_result.rating_change < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tournament.my_result.rating_change > 0 ? "+" : ""}
                      {tournament.my_result.rating_change}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {meta.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === meta.last_page}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
