"use client";

import { useEffect, useState } from "react";
import { tournamentApi, type Tournament } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Trophy } from "lucide-react";

interface BracketPlayer {
  id: number;
  name: string;
}

interface BracketMatch {
  id: number;
  bracket_position: number;
  player1: BracketPlayer | null;
  player2: BracketPlayer | null;
  player1_score: number | null;
  player2_score: number | null;
  winner_id: number | null;
  status: { value: string; label: string };
}

interface BracketRound {
  round_number: number;
  round_name: string;
  matches: BracketMatch[];
}

interface BracketData {
  rounds: BracketRound[];
}

const MATCH_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  walkover: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

function parseBracketData(raw: unknown): BracketData | null {
  try {
    if (!raw || typeof raw !== "object") return null;

    const obj = raw as Record<string, unknown>;

    // Handle if rounds is directly on bracket
    let rounds = obj.rounds;

    // If bracket is wrapped in another layer
    if (!rounds && obj.bracket && typeof obj.bracket === "object") {
      rounds = (obj.bracket as Record<string, unknown>).rounds;
    }

    if (!Array.isArray(rounds) || rounds.length === 0) return null;

    return {
      rounds: rounds.map((round: Record<string, unknown>) => ({
        round_number: Number(round.round_number ?? 0),
        round_name: String(round.round_name ?? `Round ${round.round_number ?? "?"}`),
        matches: Array.isArray(round.matches)
          ? round.matches.map((m: Record<string, unknown>) => ({
              id: Number(m.id ?? 0),
              bracket_position: Number(m.bracket_position ?? 0),
              player1: m.player1 && typeof m.player1 === "object"
                ? { id: Number((m.player1 as Record<string, unknown>).id ?? 0), name: String((m.player1 as Record<string, unknown>).name ?? "Unknown") }
                : null,
              player2: m.player2 && typeof m.player2 === "object"
                ? { id: Number((m.player2 as Record<string, unknown>).id ?? 0), name: String((m.player2 as Record<string, unknown>).name ?? "Unknown") }
                : null,
              player1_score: m.player1_score != null ? Number(m.player1_score) : null,
              player2_score: m.player2_score != null ? Number(m.player2_score) : null,
              winner_id: m.winner_id != null ? Number(m.winner_id) : null,
              status: m.status && typeof m.status === "object"
                ? { value: String((m.status as Record<string, unknown>).value ?? "pending"), label: String((m.status as Record<string, unknown>).label ?? "Pending") }
                : { value: "pending", label: "Pending" },
            }))
          : [],
      })),
    };
  } catch {
    return null;
  }
}

function MatchCard({ match, isLastRound }: { match: BracketMatch; isLastRound: boolean }) {
  const isPlayer1Winner = match.winner_id != null && match.player1?.id === match.winner_id;
  const isPlayer2Winner = match.winner_id != null && match.player2?.id === match.winner_id;
  const statusColor = MATCH_STATUS_COLORS[match.status.value] || MATCH_STATUS_COLORS.pending;

  return (
    <div className="bg-muted/30 rounded-xl p-3 border border-border/20 min-w-[200px] relative">
      {/* Player 1 */}
      <div
        className={`flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg transition-colors ${
          isPlayer1Winner ? "bg-electric/5" : ""
        }`}
      >
        <span
          className={`text-sm truncate ${
            match.player1
              ? isPlayer1Winner
                ? "text-electric font-semibold"
                : "text-foreground"
              : "text-muted-foreground italic"
          }`}
        >
          {match.player1?.name ?? "TBD"}
        </span>
        <span
          className={`text-sm font-bold shrink-0 ${
            isPlayer1Winner ? "text-electric" : "text-muted-foreground"
          }`}
        >
          {match.player1_score ?? "-"}
        </span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 my-1">
        <div className="flex-1 border-t border-border/20" />
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          vs
        </span>
        <div className="flex-1 border-t border-border/20" />
      </div>

      {/* Player 2 */}
      <div
        className={`flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg transition-colors ${
          isPlayer2Winner ? "bg-electric/5" : ""
        }`}
      >
        <span
          className={`text-sm truncate ${
            match.player2
              ? isPlayer2Winner
                ? "text-electric font-semibold"
                : "text-foreground"
              : "text-muted-foreground italic"
          }`}
        >
          {match.player2?.name ?? "TBD"}
        </span>
        <span
          className={`text-sm font-bold shrink-0 ${
            isPlayer2Winner ? "text-electric" : "text-muted-foreground"
          }`}
        >
          {match.player2_score ?? "-"}
        </span>
      </div>

      {/* Status badge */}
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColor}`}
        >
          {match.status.label}
        </span>
        {isLastRound && match.winner_id != null && (
          <Trophy className="h-3.5 w-3.5 text-yellow-400" />
        )}
      </div>

      {/* Connector line (right side) — not on last round */}
      {!isLastRound && (
        <div className="absolute top-1/2 -right-[17px] w-4 border-t border-border/40" />
      )}
    </div>
  );
}

export default function BracketPage() {
  const params = useParams();
  const id = Number(params.id);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("Invalid tournament ID.");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [tournamentRes, bracketRes] = await Promise.all([
          tournamentApi.get(id),
          tournamentApi.bracket(id),
        ]);

        setTournament(tournamentRes.data);

        const parsed = parseBracketData(bracketRes.bracket ?? bracketRes);
        setBracketData(parsed);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bracket data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
          <p className="text-sm text-muted-foreground">Loading bracket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link
            href={`/organizer/tournaments/${id}`}
            className="text-sm text-electric hover:underline"
          >
            &larr; Back to Tournament
          </Link>
        </div>
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
        </div>
      </div>
    );
  }

  const isDraftOrRegistration =
    tournament?.status.value === "draft" ||
    tournament?.status.value === "registration" ||
    tournament?.status.value === "pending_review";

  return (
    <div className="max-w-full mx-auto px-4 py-8 space-y-6">
      {/* Back link */}
      <div>
        <Link
          href={`/organizer/tournaments/${id}`}
          className="text-sm text-electric hover:underline"
        >
          &larr; Back to Tournament
        </Link>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {tournament?.name ?? "Tournament"} &mdash; Bracket
        </h1>
        {tournament && (
          <p className="text-sm text-muted-foreground mt-1">
            {tournament.status.label}
            {tournament.format ? ` \u00B7 ${tournament.format.label}` : ""}
          </p>
        )}
      </div>

      {/* Pre-bracket states */}
      {isDraftOrRegistration ? (
        <div className="card-dark rounded-2xl p-10 border border-border/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-electric/5 flex items-center justify-center">
              <Trophy className="h-7 w-7 text-electric/40" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No bracket yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Bracket will be generated when the tournament starts.
          </p>
        </div>
      ) : !bracketData || bracketData.rounds.length === 0 ? (
        <div className="card-dark rounded-2xl p-10 border border-border/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            Bracket unavailable
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            No bracket data is available for this tournament. The bracket may
            still be generating, or this tournament format may not use a bracket
            view.
          </p>
        </div>
      ) : (
        /* Bracket view */
        <div className="card-dark rounded-2xl border border-border/20 p-6 overflow-hidden">
          <div className="flex gap-8 overflow-x-auto pb-4">
            {bracketData.rounds
              .sort((a, b) => a.round_number - b.round_number)
              .map((round, roundIndex) => {
                const isLastRound = roundIndex === bracketData.rounds.length - 1;
                const matchGap = roundIndex === 0 ? "gap-4" : "gap-8";

                return (
                  <div key={round.round_number} className={`flex flex-col shrink-0`}>
                    {/* Round header */}
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
                      {round.round_name}
                    </h3>

                    {/* Matches — vertically centered with increasing spacing for later rounds */}
                    <div className={`flex flex-col ${matchGap} justify-center flex-1`}>
                      {round.matches
                        .sort((a, b) => a.bracket_position - b.bracket_position)
                        .map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            isLastRound={isLastRound}
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
