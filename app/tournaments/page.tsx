"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Trophy,
  MapPin,
  Calendar,
  Star,
  Circle,
  Clock,
  User,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  tournamentApi,
  matchesApi,
  Tournament,
  FeedTournament,
  FeedMatch,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "registration" | "active" | "completed";

// localStorage-based favorites (no cookie consent needed)
const FAVORITES_KEY = "cuesports_favorite_matches";

function getFavoriteMatches(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Invalid data
  }
  return [];
}

function setFavoriteMatches(matches: number[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(matches));
  } catch {
    // localStorage full or disabled
  }
}

function toggleFavorite(matchId: number): number[] {
  const favorites = getFavoriteMatches();
  const index = favorites.indexOf(matchId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(matchId);
  }
  setFavoriteMatches(favorites);
  return favorites;
}

// Player avatar component
function PlayerAvatar({ photoUrl, name }: { photoUrl: string | null; name: string }) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={20}
        height={20}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
      <User className="h-3 w-3 text-muted-foreground" />
    </div>
  );
}

function formatTime(dateString: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDateNav(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) return "Today";
  if (target.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (target.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function MatchCard({
  match,
  tournamentId,
  isFavorite,
  onToggleFavorite,
}: {
  match: FeedMatch;
  tournamentId: number;
  isFavorite: boolean;
  onToggleFavorite: (matchId: number) => void;
}) {
  const isLive = match.status.value === "in_progress";
  const isCompleted = match.status.value === "completed";
  const isScheduled = match.status.value === "scheduled";
  const isPendingConfirmation = match.status.value === "pending_confirmation";

  return (
    <div className="flex hover:bg-muted/30 transition-colors border-b border-border/20">
      {/* Live indicator bar */}
      <div
        className={cn(
          "w-1 flex-shrink-0",
          isLive && "bg-red-500",
          isPendingConfirmation && "bg-amber-500"
        )}
      />

      <Link
        href={`/tournaments/${tournamentId}/matches/${match.id}`}
        className="flex-1 flex items-center px-3 py-2"
      >
        {/* Time/Status Column */}
        <div className="w-11 flex-shrink-0 text-center">
          {isLive && (
            <span className="text-[11px] font-semibold text-red-500">LIVE</span>
          )}
          {isPendingConfirmation && (
            <span className="text-[11px] font-medium text-amber-500">PEND</span>
          )}
          {isScheduled && (
            <span className="text-[11px] text-muted-foreground">
              {match.scheduled_at ? formatTime(match.scheduled_at) : "-"}
            </span>
          )}
          {isCompleted && (
            <span className="text-[11px] text-muted-foreground font-medium">FT</span>
          )}
        </div>

        {/* Players & Scores */}
        <div className="flex-1 min-w-0 text-[13px]">
          {/* Player 1 */}
          <div className="flex items-center justify-between leading-snug py-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <PlayerAvatar
                photoUrl={match.player1?.photo_url || null}
                name={match.player1?.name || "TBD"}
              />
              <span
                className={cn(
                  "truncate",
                  isCompleted && match.winner_id === match.player1?.id && "font-semibold"
                )}
              >
                {match.player1?.name || "TBD"}
              </span>
            </div>
            <span
              className={cn(
                "font-medium ml-3 w-6 text-right",
                isCompleted && match.winner_id === match.player1?.id && "text-primary"
              )}
            >
              {isCompleted || isPendingConfirmation ? match.player1_score ?? "-" : ""}
            </span>
          </div>
          {/* Player 2 */}
          <div className="flex items-center justify-between leading-snug py-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <PlayerAvatar
                photoUrl={match.player2?.photo_url || null}
                name={match.player2?.name || "TBD"}
              />
              <span
                className={cn(
                  "truncate",
                  isCompleted && match.winner_id === match.player2?.id && "font-semibold"
                )}
              >
                {match.player2?.name || "TBD"}
              </span>
            </div>
            <span
              className={cn(
                "font-medium ml-3 w-6 text-right",
                isCompleted && match.winner_id === match.player2?.id && "text-primary"
              )}
            >
              {isCompleted || isPendingConfirmation ? match.player2_score ?? "-" : ""}
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        className={cn(
          "px-3 flex items-center justify-center transition-colors",
          isFavorite
            ? "text-yellow-500"
            : "text-muted-foreground/40 hover:text-yellow-500"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(match.id);
        }}
      >
        <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
      </button>
    </div>
  );
}

function TournamentMatchesGroup({
  tournament,
  favorites,
  onToggleFavorite,
}: {
  tournament: FeedTournament;
  favorites: number[];
  onToggleFavorite: (matchId: number) => void;
}) {
  const matches = tournament.matches || [];

  if (matches.length === 0) return null;

  return (
    <div className="mb-3 bg-card rounded-lg overflow-hidden border">
      {/* Tournament Header */}
      <Link
        href={`/tournaments/${tournament.id}`}
        className="flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors border-b"
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <div>
            <span className="font-medium text-sm">{tournament.name}</span>
            {tournament.venue?.name && (
              <span className="text-xs text-muted-foreground ml-2">
                {tournament.venue.name}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {/* Matches */}
      <div>
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            tournamentId={tournament.id}
            isFavorite={favorites.includes(match.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

function TournamentSidebarItem({
  tournament,
  isSelected,
  onClick,
}: {
  tournament: Tournament;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isLive = tournament.status.value === "active";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
        isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
      )}
    >
      <Trophy className="h-3.5 w-3.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium truncate">{tournament.name}</span>
          {isLive && (
            <Circle className="h-1.5 w-1.5 fill-red-500 text-red-500 flex-shrink-0" />
          )}
        </div>
        {tournament.venue?.name && (
          <p className="text-[10px] text-muted-foreground truncate">
            {tournament.venue.name}
          </p>
        )}
      </div>
    </button>
  );
}

function TournamentsContent() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(
    null
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from cookies on mount
  useEffect(() => {
    setFavorites(getFavoriteMatches());
  }, []);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback((matchId: number) => {
    const newFavorites = toggleFavorite(matchId);
    setFavorites([...newFavorites]);
  }, []);

  // Format date for API
  const dateParam = currentDate.toISOString().split("T")[0];

  // Fetch all tournaments for sidebar
  const { data: tournamentsData, isLoading: loadingTournaments } = useSWR(
    "tournaments-list",
    () => tournamentApi.list({ per_page: "50" } as { status?: string; page?: number }),
    { revalidateOnFocus: false }
  );

  // Fetch matches feed with auto-refresh every 30 seconds
  const { data: feedData, isLoading: loadingFeed } = useSWR(
    ["matches-feed", dateParam, selectedTournamentId],
    () =>
      matchesApi.feed({
        date: dateParam,
        tournament_id: selectedTournamentId || undefined,
      }),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // Auto-refresh every 30 seconds
    }
  );

  const tournaments = tournamentsData?.data || [];
  const feedTournaments = feedData?.tournaments || [];
  const feedStats = feedData?.stats;

  // Filter tournaments for sidebar
  const filteredTournaments = tournaments.filter((t: Tournament) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !t.name.toLowerCase().includes(query) &&
        !t.venue?.name?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (statusFilter !== "all" && t.status.value !== statusFilter) {
      return false;
    }
    return true;
  });

  const liveTournaments = tournaments.filter(
    (t: Tournament) => t.status.value === "active"
  );
  const upcomingTournaments = tournaments.filter(
    (t: Tournament) => t.status.value === "registration"
  );
  const completedTournaments = tournaments.filter(
    (t: Tournament) => t.status.value === "completed"
  );

  // Date navigation
  const goToPreviousDay = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-5">
          {/* Left Sidebar - Narrower */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* My Tournaments */}
              <div>
                <button className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                  <span>My Tournaments</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to see your tournaments
                </p>
              </div>

              {/* Tournaments List */}
              <div>
                <button className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                  <span>Tournaments</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <div className="mt-1 space-y-0.5">
                  {loadingTournaments ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredTournaments.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      No tournaments found
                    </p>
                  ) : (
                    filteredTournaments.slice(0, 10).map((tournament: Tournament) => (
                      <TournamentSidebarItem
                        key={tournament.id}
                        tournament={tournament}
                        isSelected={selectedTournamentId === tournament.id}
                        onClick={() =>
                          setSelectedTournamentId(
                            selectedTournamentId === tournament.id
                              ? null
                              : tournament.id
                          )
                        }
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <button className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                  <span>Status</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                      statusFilter === "all"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <Circle className="h-2.5 w-2.5" />
                    <span className="text-xs">All</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {tournaments.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                      statusFilter === "active"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <Circle className="h-2.5 w-2.5 fill-red-500 text-red-500" />
                    <span className="text-xs">Live</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {liveTournaments.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("registration")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                      statusFilter === "registration"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <Calendar className="h-2.5 w-2.5 text-blue-500" />
                    <span className="text-xs">Upcoming</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {upcomingTournaments.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("completed")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                      statusFilter === "completed"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <Trophy className="h-2.5 w-2.5 text-green-500" />
                    <span className="text-xs">Completed</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {completedTournaments.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Matches Area */}
          <main className="flex-1 min-w-0">
            {/* Date Navigation Header */}
            <div className="flex items-center justify-between mb-4 bg-card rounded-lg p-2 border">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    feedStats?.live
                      ? "bg-red-500 text-white"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {feedStats?.live ? (
                      <>
                        <Circle className="h-2 w-2 fill-current animate-pulse" />
                        {feedStats.live} LIVE
                      </>
                    ) : (
                      "Today"
                    )}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousDay}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium px-4 min-w-[100px] text-center">
                  {formatDateNav(currentDate)}
                </span>
                <button
                  onClick={goToNextDay}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={goToToday}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>

            {/* Stats Bar */}
            {feedStats && feedStats.total_matches > 0 && (
              <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                <span>{feedStats.total_tournaments} tournaments</span>
                <span className="text-border">|</span>
                <span>{feedStats.total_matches} matches</span>
                {feedStats.live > 0 && (
                  <>
                    <span className="text-border">|</span>
                    <span className="text-red-500">{feedStats.live} live</span>
                  </>
                )}
                {feedStats.scheduled > 0 && (
                  <>
                    <span className="text-border">|</span>
                    <span>{feedStats.scheduled} scheduled</span>
                  </>
                )}
                {feedStats.completed > 0 && (
                  <>
                    <span className="text-border">|</span>
                    <span className="text-green-600">{feedStats.completed} completed</span>
                  </>
                )}
              </div>
            )}

            {/* Matches Content */}
            {loadingFeed ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : feedTournaments.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-lg border">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No matches</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {selectedTournamentId
                    ? "No matches for this tournament on this date."
                    : "There are no active tournament matches for this date. Check back later or browse upcoming tournaments."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {feedTournaments.map((tournament: FeedTournament) => (
                  <TournamentMatchesGroup
                    key={tournament.id}
                    tournament={tournament}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Mobile: Show tournament cards if no matches */}
            {feedTournaments.length === 0 && (
              <div className="lg:hidden mt-6">
                <h2 className="text-lg font-semibold mb-4">All Tournaments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredTournaments.map((tournament: Tournament) => (
                    <Link
                      key={tournament.id}
                      href={`/tournaments/${tournament.id}`}
                      className="bg-card rounded-lg border p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{tournament.name}</h3>
                        {tournament.status.value === "active" && (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <Circle className="h-2 w-2 fill-current" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{tournament.venue?.name || "Location TBD"}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <TournamentsContent />
    </Suspense>
  );
}
