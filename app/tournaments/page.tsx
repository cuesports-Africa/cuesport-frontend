"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  MapPin,
  Calendar,
  Star,
  SlidersHorizontal,
  Trophy,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  tournamentApi,
  matchesApi,
  Tournament,
  FeedTournament,
  FeedMatch,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "registration" | "active" | "completed";

const FAVORITES_KEY = "cuesports_favorite_matches";

function getFavoriteMatches(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // invalid
  }
  return [];
}

function setFavoriteMatches(matches: number[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(matches));
  } catch {
    // disabled / full
  }
}

function toggleFavorite(matchId: number): number[] {
  const favorites = getFavoriteMatches();
  const i = favorites.indexOf(matchId);
  if (i > -1) favorites.splice(i, 1);
  else favorites.push(matchId);
  setFavoriteMatches(favorites);
  return favorites;
}

function formatTime(dateString: string | null): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDateNav(date: Date): string {
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

const labelClass =
  "block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2";

const filterButtonClass =
  "w-full text-left px-3 py-2 rounded-md text-[13.5px] transition-colors";

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Live" },
  { value: "registration", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

// ─────────────────────────────────────────────────────────
// Player avatar
// ─────────────────────────────────────────────────────────
function PlayerAvatar({
  photoUrl,
  name,
}: {
  photoUrl: string | null;
  name: string;
}) {
  const initial = name?.charAt(0).toUpperCase() || "?";
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={24}
        height={24}
        className="h-6 w-6 flex-shrink-0 rounded-full object-cover border border-rule"
      />
    );
  }
  return (
    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-rule bg-bone text-[10px] font-bold text-mute">
      {initial}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Match row
// ─────────────────────────────────────────────────────────
function MatchRow({
  match,
  tournamentId,
  isFavorite,
  onToggleFavorite,
}: {
  match: FeedMatch;
  tournamentId: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}) {
  const isLive = match.status.value === "in_progress";
  const isCompleted = match.status.value === "completed";
  const isScheduled = match.status.value === "scheduled";
  const isPending = match.status.value === "pending_confirmation";

  const showScores = isCompleted || isPending || isLive;
  const p1Won = isCompleted && match.winner_id === match.player1?.id;
  const p2Won = isCompleted && match.winner_id === match.player2?.id;

  return (
    <div className="group relative flex items-stretch border-b border-rule last:border-b-0">
      {/* Live accent strip */}
      <div
        aria-hidden
        className={cn(
          "w-[3px] flex-shrink-0 transition-colors",
          isLive && "bg-gold",
          isPending && "bg-mute-2",
          !isLive && !isPending && "bg-transparent group-hover:bg-rule",
        )}
      />

      <Link
        href={`/tournaments/${tournamentId}/matches/${match.id}`}
        className="flex flex-1 items-center px-3 py-3 transition-colors hover:bg-bone/60 sm:px-4 sm:py-3.5"
      >
        {/* Status / Time */}
        <div className="w-14 flex-shrink-0 sm:w-16">
          {isLive && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Live
            </span>
          )}
          {isPending && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Pend
            </span>
          )}
          {isScheduled && (
            <span className="font-mono text-[12px] tabular-nums text-ink/70">
              {match.scheduled_at ? formatTime(match.scheduled_at) : "—"}
            </span>
          )}
          {isCompleted && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-mute-2">
              FT
            </span>
          )}
        </div>

        {/* Players + scores */}
        <div className="min-w-0 flex-1">
          {/* Player 1 */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <PlayerAvatar
                photoUrl={match.player1?.photo_url || null}
                name={match.player1?.name || "TBD"}
              />
              <span
                className={cn(
                  "truncate text-[13.5px]",
                  p1Won ? "font-bold text-ink" : "text-ink/85",
                  !match.player1 && "italic text-mute",
                )}
              >
                {match.player1?.name || "TBD"}
              </span>
            </div>
            <span
              className={cn(
                "ml-3 w-6 text-right font-mono text-[14px] tabular-nums",
                p1Won && "font-bold text-ink",
                !p1Won && showScores && "text-ink/70",
                !showScores && "text-transparent",
              )}
            >
              {showScores ? (match.player1_score ?? "—") : ""}
            </span>
          </div>
          {/* Player 2 */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <PlayerAvatar
                photoUrl={match.player2?.photo_url || null}
                name={match.player2?.name || "TBD"}
              />
              <span
                className={cn(
                  "truncate text-[13.5px]",
                  p2Won ? "font-bold text-ink" : "text-ink/85",
                  !match.player2 && "italic text-mute",
                )}
              >
                {match.player2?.name || "TBD"}
              </span>
            </div>
            <span
              className={cn(
                "ml-3 w-6 text-right font-mono text-[14px] tabular-nums",
                p2Won && "font-bold text-ink",
                !p2Won && showScores && "text-ink/70",
                !showScores && "text-transparent",
              )}
            >
              {showScores ? (match.player2_score ?? "—") : ""}
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite */}
      <button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(match.id);
        }}
        className={cn(
          "flex flex-shrink-0 items-center justify-center px-3 transition-colors",
          isFavorite
            ? "text-gold"
            : "text-mute-2/60 hover:text-gold",
        )}
      >
        <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tournament group block
// ─────────────────────────────────────────────────────────
function TournamentBlock({
  tournament,
  favorites,
  onToggleFavorite,
}: {
  tournament: FeedTournament;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const matches = tournament.matches || [];
  if (matches.length === 0) return null;

  return (
    <div className="border border-rule rounded-md overflow-hidden">
      <Link
        href={`/tournaments/${tournament.id}`}
        className="group flex items-center justify-between border-b border-rule bg-bone/60 px-4 py-3 transition-colors hover:bg-bone"
      >
        <div className="min-w-0">
          <h3 className="truncate text-[14.5px] font-semibold text-ink group-hover:text-navy">
            {tournament.name}
          </h3>
          {tournament.venue?.name && (
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2">
              {tournament.venue.name}
            </p>
          )}
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-mute-2 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
      </Link>

      <div>
        {matches.map((match) => (
          <MatchRow
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

// ─────────────────────────────────────────────────────────
// Tournament sidebar item
// ─────────────────────────────────────────────────────────
function TournamentNavItem({
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
        "group w-full text-left px-3 py-2 rounded-md transition-colors",
        isSelected ? "bg-ink text-white" : "text-ink/80 hover:bg-bone",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full",
            isLive ? "bg-gold animate-pulse" : "bg-rule",
            isSelected && !isLive && "bg-white/50",
          )}
        />
        <span className="truncate text-[13px] font-medium">{tournament.name}</span>
      </div>
      {tournament.venue?.name && (
        <p
          className={cn(
            "ml-3.5 mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.15em]",
            isSelected ? "text-white/55" : "text-mute-2",
          )}
        >
          {tournament.venue.name}
        </p>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────
function TournamentsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setFavorites(getFavoriteMatches());
  }, []);

  const handleToggleFavorite = useCallback((matchId: number) => {
    const next = toggleFavorite(matchId);
    setFavorites([...next]);
  }, []);

  const dateParam = currentDate.toISOString().split("T")[0];

  const { data: tournamentsData, isLoading: loadingTournaments } = useSWR(
    "tournaments-list",
    () =>
      tournamentApi.list({ per_page: "50" } as { status?: string; page?: number }),
    { revalidateOnFocus: false },
  );

  const { data: feedData, isLoading: loadingFeed } = useSWR(
    ["matches-feed", dateParam, selectedTournamentId],
    () =>
      matchesApi.feed({
        date: dateParam,
        tournament_id: selectedTournamentId || undefined,
      }),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    },
  );

  const tournaments: Tournament[] = tournamentsData?.data || [];
  const feedTournaments: FeedTournament[] = feedData?.tournaments || [];
  const feedStats = feedData?.stats;

  const filteredTournaments = tournaments.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !t.name.toLowerCase().includes(q) &&
        !t.venue?.name?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter !== "all" && t.status.value !== statusFilter) return false;
    return true;
  });

  const counts = {
    all: tournaments.length,
    active: tournaments.filter((t) => t.status.value === "active").length,
    registration: tournaments.filter((t) => t.status.value === "registration").length,
    completed: tournaments.filter((t) => t.status.value === "completed").length,
  };

  const goToPreviousDay = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  }, []);
  const goToNextDay = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  }, []);
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // ─────────────────────────────────────────────────────────
  // Shared filter panel (sidebar + mobile sheet)
  // ─────────────────────────────────────────────────────────
  function FilterPanel({ inSheet = false }: { inSheet?: boolean }) {
    return (
      <div className={cn("space-y-6", inSheet && "pb-6")}>
        <div>
          <p className={labelClass}>Search</p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute-2" />
            <input
              type="search"
              placeholder="Tournament or venue…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-md border border-rule bg-canvas pl-10 pr-3 text-[14.5px] text-ink transition-colors placeholder:text-mute-2 focus:border-ink focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--gold)]"
            />
          </div>
        </div>

        <div>
          <p className={labelClass}>Status</p>
          <div className="space-y-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  filterButtonClass,
                  "flex items-center justify-between",
                  statusFilter === opt.value
                    ? "bg-ink text-white"
                    : "text-ink/80 hover:bg-bone",
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    statusFilter === opt.value ? "text-white/55" : "text-mute-2",
                  )}
                >
                  {counts[opt.value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClass}>Tournaments</p>
          {loadingTournaments ? (
            <div className="flex items-center gap-2 px-3 py-2 text-[12px] text-mute">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading
            </div>
          ) : filteredTournaments.length === 0 ? (
            <p className="px-3 py-2 text-[12px] text-mute">No tournaments.</p>
          ) : (
            <div className="space-y-1">
              {selectedTournamentId !== null && (
                <button
                  onClick={() => {
                    setSelectedTournamentId(null);
                    if (inSheet) setSheetOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-[13px] text-mute hover:bg-bone transition-colors"
                >
                  ← Show all tournaments
                </button>
              )}
              {filteredTournaments.slice(0, 15).map((t) => (
                <TournamentNavItem
                  key={t.id}
                  tournament={t}
                  isSelected={selectedTournamentId === t.id}
                  onClick={() => {
                    setSelectedTournamentId(
                      selectedTournamentId === t.id ? null : t.id,
                    );
                    if (inSheet) setSheetOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (selectedTournamentId !== null ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <article className="bg-canvas">
      <h1 className="sr-only">Tournaments — Today&rsquo;s Schedule</h1>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <main className="min-w-0">
            {/* Date navigator */}
            <div className="flex items-center justify-between border-b border-rule pb-4 sm:pb-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className={cn(
                    "inline-flex h-10 items-center rounded-md border px-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
                    feedStats?.live
                      ? "border-ink bg-ink text-white"
                      : "border-rule bg-canvas text-ink hover:bg-bone",
                  )}
                >
                  {feedStats?.live ? (
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                      {feedStats.live} live
                    </span>
                  ) : (
                    "Today"
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToPreviousDay}
                  aria-label="Previous day"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink/80 transition-colors hover:bg-bone"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[100px] text-center font-mono text-[12px] uppercase tracking-[0.18em] text-ink tabular-nums">
                  {formatDateNav(currentDate)}
                </span>
                <button
                  onClick={goToNextDay}
                  aria-label="Next day"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink/80 transition-colors hover:bg-bone"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile filters trigger */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Open filters"
                    className="relative inline-flex h-10 items-center gap-2 rounded-md border border-rule bg-canvas px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone lg:hidden"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[10px] font-bold text-white tabular-nums">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-canvas">
                  <SheetHeader className="pb-2">
                    <SheetTitle className="text-[18px] font-bold tracking-[-0.01em] text-ink">
                      Filter tournaments
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6">
                    <FilterPanel inSheet />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Stats strip */}
            {feedStats && feedStats.total_matches > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2 tabular-nums">
                <span>{feedStats.total_tournaments} tournaments</span>
                <span aria-hidden>·</span>
                <span>{feedStats.total_matches} matches</span>
                {feedStats.scheduled > 0 && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{feedStats.scheduled} scheduled</span>
                  </>
                )}
                {feedStats.completed > 0 && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{feedStats.completed} completed</span>
                  </>
                )}
              </div>
            )}

            {/* Matches */}
            <div className="mt-6">
              {loadingFeed && feedTournaments.length === 0 ? (
                <MatchesSkeleton />
              ) : feedTournaments.length > 0 ? (
                <div className="space-y-4">
                  {feedTournaments.map((t) => (
                    <TournamentBlock
                      key={t.id}
                      tournament={t}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <EmptyMatches
                  hasSelection={selectedTournamentId !== null}
                  fallbackTournaments={filteredTournaments}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Back link */}
      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
        >
          ← Back to home
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
// Empty state — shows fallback tournament cards if available
// ─────────────────────────────────────────────────────────
function EmptyMatches({
  hasSelection,
  fallbackTournaments,
}: {
  hasSelection: boolean;
  fallbackTournaments: Tournament[];
}) {
  return (
    <div>
      <div className="border-y border-rule py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
          No matches today
        </p>
        <p className="mx-auto mt-4 max-w-[44ch] text-[14px] leading-relaxed text-mute">
          {hasSelection
            ? "No matches for this tournament on the selected date."
            : "No live or scheduled matches on this date. Browse upcoming tournaments below."}
        </p>
      </div>

      {!hasSelection && fallbackTournaments.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute mb-4">
            All tournaments
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fallbackTournaments.slice(0, 12).map((t) => (
              <Link
                key={t.id}
                href={`/tournaments/${t.id}`}
                className="group border border-rule rounded-md p-4 transition-colors hover:bg-bone/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14.5px] font-semibold leading-tight text-ink group-hover:text-navy">
                    {t.name}
                  </h3>
                  {t.status.value === "active" && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink whitespace-nowrap">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2">
                  <MapPin className="h-3 w-3" />
                  {t.venue?.name || "Location TBD"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────
function MatchesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, gi) => (
        <div key={gi} className="border border-rule rounded-md overflow-hidden">
          <div className="border-b border-rule bg-bone/60 px-4 py-3">
            <div className="h-4 w-40 rounded bg-bone animate-pulse" />
            <div className="mt-1.5 h-2.5 w-24 rounded bg-bone animate-pulse" />
          </div>
          {Array.from({ length: 3 }).map((_, mi) => (
            <div
              key={mi}
              className="flex items-center gap-3 border-b border-rule px-4 py-3 last:border-b-0"
            >
              <div className="h-3 w-10 rounded bg-bone animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-bone animate-pulse" />
                  <div className="h-3 w-32 rounded bg-bone animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-bone animate-pulse" />
                  <div className="h-3 w-28 rounded bg-bone animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function TournamentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink/50" />
        </div>
      }
    >
      <TournamentsContent />
    </Suspense>
  );
}
