"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tournamentApi, type Tournament } from "@/lib/api";

const fetchMyTournaments = async (): Promise<Tournament[]> => {
  const response = await tournamentApi.myRegistered();
  return response.data || [];
};

export default function PlayerTournamentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // SWR for registered tournaments with caching
  const { data: tournaments = [], isLoading } = useSWR<Tournament[]>(
    "my-tournaments",
    fetchMyTournaments,
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000,
    }
  );

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || t.status.value === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "registration":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-full">
      {/* Desktop Layout */}
      <div className="hidden lg:block p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Tournaments</h1>
            <p className="text-muted-foreground">
              Tournaments you&apos;ve registered for
            </p>
          </div>
          <Button asChild>
            <Link href="/tournaments">
              <Trophy className="h-4 w-4 mr-2" />
              Browse Tournaments
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "registration", "active", "completed"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid - Desktop */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-5 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {tournament.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tournament.organizer?.name || "Unknown Organizer"}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full shrink-0 ${getStatusColor(
                            tournament.status.value
                          )}`}
                        >
                          {tournament.status.label}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {tournament.dates.starts_at
                              ? new Date(
                                  tournament.dates.starts_at
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "TBD"}
                          </span>
                        </div>
                        {tournament.venue.name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{tournament.venue.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {tournament.stats.participants_count} participants
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-medium">
                          {tournament.format.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No tournaments found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't registered for any tournaments yet"}
              </p>
              <Button asChild>
                <Link href="/tournaments">Browse Tournaments</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile/PWA Layout */}
      <div className="lg:hidden">
        {/* Search Bar */}
        <div className="px-4 pt-2 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {["all", "registration", "active", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Tournaments List - Mobile */}
        {filteredTournaments.length > 0 ? (
          <div className="divide-y divide-border/30">
            {filteredTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="flex items-center gap-3 px-4 py-3 active:bg-muted/50 transition-colors"
              >
                {/* Tournament Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>

                {/* Tournament Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm truncate">
                      {tournament.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusColor(
                        tournament.status.value
                      )}`}
                    >
                      {tournament.status.label}
                    </span>
                    <span>•</span>
                    <span>
                      {tournament.dates.starts_at
                        ? formatDate(tournament.dates.starts_at)
                        : "TBD"}
                    </span>
                    <span>•</span>
                    <span>{tournament.stats.participants_count} players</span>
                  </div>
                  {tournament.venue.name && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{tournament.venue.name}</span>
                    </div>
                  )}
                </div>

                {/* Chevron */}
                <ChevronRight className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-8 py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No tournaments found
            </h3>
            <p className="text-xs text-muted-foreground text-center max-w-[220px]">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Register for tournaments to see them here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
