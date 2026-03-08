"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Swords,
} from "lucide-react";
import { tournamentApi, type MatchDetail, type Tournament } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Filter types ────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "in_progress" | "completed" | "disputed";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "disputed", label: "Disputed" },
];

// ── Status badge colours ────────────────────────────────────────

const MATCH_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  disputed: "bg-red-500/10 text-red-500 border-red-500/20",
  walkover: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

// ── Helpers ─────────────────────────────────────────────────────

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Sub-components ──────────────────────────────────────────────

function MatchStatusBadge({ status, label }: { status: string; label: string }) {
  const styles = MATCH_STATUS_STYLES[status] || MATCH_STATUS_STYLES.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        styles
      )}
    >
      {label}
    </span>
  );
}

function PlayerSlot({
  player,
  align,
}: {
  player: MatchDetail["player1"];
  align: "left" | "right";
}) {
  if (!player) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 flex-1 min-w-0",
          align === "right" && "flex-row-reverse text-right"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-muted-foreground">?</span>
        </div>
        <span className="text-sm text-muted-foreground italic truncate">
          TBD
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 flex-1 min-w-0",
        align === "right" && "flex-row-reverse text-right"
      )}
    >
      {/* Avatar */}
      {player.photo_url ? (
        <img
          src={player.photo_url}
          alt={player.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-electric">
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Name + winner indicator */}
      <span
        className={cn(
          "text-sm font-medium truncate",
          player.is_winner ? "text-electric" : "text-foreground"
        )}
      >
        {player.name}
      </span>
    </div>
  );
}

function MatchCard({ match }: { match: MatchDetail }) {
  const playedDate = match.timing.played_at;
  const scheduledDate = match.timing.scheduled_play_date;
  const dateLabel = playedDate
    ? `Played ${formatDate(playedDate)} at ${formatTime(playedDate)}`
    : scheduledDate
      ? `Scheduled ${formatDate(scheduledDate)}`
      : null;

  return (
    <div className="card-dark rounded-2xl p-4 border border-border/20">
      {/* Top row: round info + status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {match.round.name}
          </span>
          <span className="text-xs text-muted-foreground/50">
            Match #{match.bracket_position}
          </span>
        </div>
        <MatchStatusBadge status={match.status} label={match.status_label} />
      </div>

      {/* Players row */}
      <div className="flex items-center gap-2">
        {/* Player 1 */}
        <PlayerSlot player={match.player1} align="left" />

        {/* Score block */}
        <div className="flex items-center gap-1.5 px-3 flex-shrink-0">
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              match.player1?.is_winner ? "text-electric" : "text-foreground"
            )}
          >
            {match.player1 ? match.player1.score : "-"}
          </span>
          <span className="text-xs text-muted-foreground font-medium">vs</span>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              match.player2?.is_winner ? "text-electric" : "text-foreground"
            )}
          >
            {match.player2 ? match.player2.score : "-"}
          </span>
        </div>

        {/* Player 2 */}
        <PlayerSlot player={match.player2} align="right" />
      </div>

      {/* Date footer */}
      {dateLabel && (
        <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/10">
          {dateLabel}
        </p>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────

export default function TournamentMatchesPage() {
  const params = useParams();
  const id = Number(params.id);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<MatchDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roundFilter, setRoundFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  }>({ current_page: 1, last_page: 1, total: 0 });

  // Derive max rounds from tournament matches data
  const [maxRound, setMaxRound] = useState(0);

  // Fetch tournament details once
  useEffect(() => {
    if (!id) return;
    tournamentApi
      .get(id)
      .then((res) => setTournament(res.data))
      .catch(() => {
        // Tournament info is non-critical; matches will still load
      });
  }, [id]);

  const fetchMatches = useCallback(
    async (status: StatusFilter, round: number | "all", pageNum: number) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const apiParams: { round?: number; status?: string; page?: number } = {
          page: pageNum,
        };
        if (status !== "all") {
          apiParams.status = status;
        }
        if (round !== "all") {
          apiParams.round = round;
        }

        const res = await tournamentApi.matches(id, apiParams);
        setMatches(res.data);
        setMeta(res.meta);

        // Track highest round seen for the round dropdown
        if (res.data.length > 0) {
          const highest = Math.max(...res.data.map((m) => m.round.number));
          setMaxRound((prev) => Math.max(prev, highest));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load matches"
        );
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  // On first load, fetch with no filters to discover total rounds
  useEffect(() => {
    if (!id) return;
    tournamentApi
      .matches(id, { page: 1 })
      .then((res) => {
        if (res.data.length > 0) {
          const highest = Math.max(...res.data.map((m) => m.round.number));
          setMaxRound(highest);
        }
      })
      .catch(() => {
        // Non-critical
      });
  }, [id]);

  // Fetch matches whenever filters change
  useEffect(() => {
    fetchMatches(statusFilter, roundFilter, page);
  }, [statusFilter, roundFilter, page, fetchMatches]);

  function handleStatusChange(tab: StatusFilter) {
    setStatusFilter(tab);
    setPage(1);
  }

  function handleRoundChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setRoundFilter(value === "all" ? "all" : Number(value));
    setPage(1);
  }

  // Build round options array
  const roundOptions = Array.from({ length: maxRound }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href={`/organizer/tournaments/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tournament
      </Link>

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Matches</h1>
        {tournament && (
          <p className="text-sm text-muted-foreground mt-1">
            {tournament.name}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                statusFilter === tab.value
                  ? "bg-electric/10 text-electric"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Round dropdown */}
        {maxRound > 0 && (
          <select
            value={roundFilter}
            onChange={handleRoundChange}
            className="h-9 px-3 rounded-xl text-sm font-medium bg-transparent border border-border/30 text-foreground focus:outline-none focus:ring-2 focus:ring-electric/30 appearance-none cursor-pointer"
          >
            <option value="all">All Rounds</option>
            {roundOptions.map((r) => (
              <option key={r} value={r}>
                Round {r}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-electric" />
            <p className="text-sm text-muted-foreground">
              Loading matches...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="card-dark rounded-2xl p-8 border border-border/20 text-center">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <Button
            onClick={() => fetchMatches(statusFilter, roundFilter, page)}
            className="bg-electric text-white hover:bg-electric/90"
          >
            Try Again
          </Button>
        </div>
      ) : matches.length === 0 ? (
        <div className="card-dark rounded-2xl p-12 border border-border/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-electric/5 flex items-center justify-center">
              <Swords className="h-8 w-8 text-electric/40" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No matches found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {statusFilter !== "all" || roundFilter !== "all"
              ? "No matches match the current filters. Try adjusting your selection."
              : "There are no matches in this tournament yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Match cards */}
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() =>
                  setPage((p) => Math.min(meta.last_page, p + 1))
                }
                className="text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Summary */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Showing {matches.length} of {meta.total} match{meta.total !== 1 ? "es" : ""}
          </p>
        </>
      )}
    </div>
  );
}
