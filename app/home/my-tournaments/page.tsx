"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  MoreVertical,
  Play,
  Edit,
  Copy,
  Trash2,
  Eye,
  ChevronDown,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tournamentApi, type Tournament } from "@/lib/api";

type TournamentStatusValue = "pending_review" | "draft" | "registration" | "active" | "completed" | "cancelled";

const statusConfig: Record<TournamentStatusValue, { label: string; className: string }> = {
  pending_review: { label: "Pending Review", className: "bg-yellow-100 text-yellow-700" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  registration: { label: "Registration Open", className: "bg-blue-100 text-blue-700" },
  active: { label: "In Progress", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-purple-100 text-purple-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const tabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending Review" },
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live" },
  { id: "completed", label: "Completed" },
];

export default function MyTournamentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache helpers
  const CACHE_KEY = "my_tournaments_cache";
  const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }
    } catch {
      // Invalid cache
    }
    return null;
  };

  const setCachedData = (data: Tournament[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // Storage full
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsInitialLoad(false);
      return;
    }

    const cached = getCachedData();
    if (cached) {
      setTournaments(cached);
      setIsInitialLoad(false);
    }

    fetchTournaments(cached ? 'background' : 'initial');
  }, []);

  const fetchTournaments = async (mode: 'initial' | 'background' | 'refresh' = 'initial') => {
    try {
      if (mode === 'initial') setIsInitialLoad(true);
      if (mode === 'refresh') setIsRefreshing(true);
      setError(null);
      const response = await tournamentApi.myTournaments();
      const data = response.data || [];
      setTournaments(data);
      setCachedData(data);
    } catch (err) {
      console.error("Failed to fetch tournaments:", err);
      if (!getCachedData()) {
        setError(err instanceof Error ? err.message : "Failed to load tournaments");
      }
    } finally {
      setIsInitialLoad(false);
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" })}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" })}`;
    } else if (diffDays === -1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-KE", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.geographic_scope?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeTab) {
      case "pending":
        return tournament.status.value === "pending_review";
      case "upcoming":
        return tournament.status.value === "registration" || tournament.status.value === "draft";
      case "live":
        return tournament.status.value === "active";
      case "completed":
        return tournament.status.value === "completed";
      default:
        return true;
    }
  });

  if (isInitialLoad && tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
          <Loader2 className="h-3 w-3 animate-spin" />
          Refreshing...
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div>
            <p className="font-medium text-destructive">Failed to load tournaments</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => fetchTournaments('refresh')}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Tournaments</h1>
          <p className="text-muted-foreground text-sm">
            Tournaments you've created and hosted
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-primary">
          <Link href="/home/my-tournaments/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Tournament
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tournament List */}
      <div className="space-y-3">
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border">
            <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No tournaments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "Try a different search term" : "Create your first tournament to get started"}
            </p>
            <Button asChild className="bg-gold hover:bg-gold/90 text-primary">
              <Link href="/home/my-tournaments/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
              </Link>
            </Button>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-card rounded-xl border p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <Link
                        href={`/home/my-tournaments/${tournament.id}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {tournament.name}
                      </Link>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[tournament.status.value as TournamentStatusValue]?.className || "bg-gray-100 text-gray-700"}`}>
                        {tournament.status.value === "active" && (
                          <span className="w-1.5 h-1.5 bg-current rounded-full mr-1 animate-pulse" />
                        )}
                        {tournament.status.value === "pending_review" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {statusConfig[tournament.status.value as TournamentStatusValue]?.label || tournament.status.label}
                      </span>
                    </div>
                  </div>

                  {/* Pending Review Notice */}
                  {tournament.status.value === "pending_review" && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                      This tournament is being reviewed by our team. You'll be notified once it's approved.
                    </div>
                  )}

                  {/* Rejection Notice */}
                  {tournament.verification?.rejection_reason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                      <strong>Rejected:</strong> {tournament.verification.rejection_reason}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {tournament.status.value === "draft" || tournament.status.value === "pending_review"
                        ? "Not scheduled"
                        : (tournament.dates.starts_at ? formatDate(tournament.dates.starts_at) : "TBD")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {tournament.venue?.name || tournament.geographic_scope?.name || "No location"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {tournament.stats.participants_count} players
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {tournament.format.label}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium">
                      {tournament.entry_fee.is_free ? "Free Entry" : `Entry: ${tournament.entry_fee.formatted}`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {tournament.status.value === "active" && (
                    <Button size="sm" asChild>
                      <Link href={`/home/my-tournaments/${tournament.id}/live`}>
                        <Play className="h-4 w-4 mr-1" />
                        Manage
                      </Link>
                    </Button>
                  )}
                  {(tournament.status.value === "draft" || tournament.status.value === "pending_review") && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/home/my-tournaments/${tournament.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  )}
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setOpenMenu(openMenu === tournament.id ? null : tournament.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {openMenu === tournament.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-lg shadow-lg z-20 py-1">
                          <Link
                            href={`/home/my-tournaments/${tournament.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                          <Link
                            href={`/home/my-tournaments/${tournament.id}/edit`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit Tournament
                          </Link>
                          <button
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </button>
                          {tournament.status.value !== "active" && tournament.status.value !== "completed" && (
                            <>
                              <hr className="my-1" />
                              <button
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left text-destructive"
                                onClick={() => setOpenMenu(null)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar for registration */}
              {tournament.status.can_register && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Participants</span>
                    <span>{tournament.stats.participants_count} registered</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min((tournament.stats.participants_count / 64) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
