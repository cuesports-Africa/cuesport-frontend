"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  Pencil,
  Play,
  Pause,
  Trophy,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
  XCircle,
  Calendar,
  Swords,
  Medal,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditTournamentSheet } from "@/components/organizer/edit-tournament-sheet";
import { MatchDetailModal } from "@/components/organizer/match-detail-modal";
import { tournamentApi, type Tournament, type TournamentParticipant } from "@/lib/api";

interface Match {
  id: number;
  tournament_id: number;
  round: {
    number: number;
    name: string;
  };
  match_type: string;
  match_type_label: string;
  bracket_position: number;
  player1: {
    id: number;
    name: string;
    rating: number;
    score: number;
    is_winner: boolean;
  } | null;
  player2: {
    id: number;
    name: string;
    rating: number;
    score: number;
    is_winner: boolean;
  } | null;
  player1_id: number | null;
  player2_id: number | null;
  score: string;
  status: string;
  status_label: string;
  winner_id: number | null;
  deadline_at: string | null;
  dispute_reason: string | null;
  forfeit_type: string | null;
}

// Smart ordering: Active round first, then needs action, upcoming, completed
function sortMatchesByRelevance(matches: Match[]): Match[] {
  // Find current round (lowest round with non-completed, non-bye matches)
  const activeRounds = matches
    .filter(m => m.status !== "completed" && m.match_type !== "bye")
    .map(m => m.round.number);
  const currentRound = activeRounds.length > 0 ? Math.min(...activeRounds) : null;

  return [...matches].sort((a, b) => {
    // Priority scoring (lower = higher priority)
    const getPriority = (m: Match): number => {
      // BYE matches always at bottom
      if (m.match_type === "bye") return 100;

      // 1. Current round active matches (scheduled with both players, or in_progress)
      if (m.round.number === currentRound) {
        if (m.status === "in_progress") return 1;
        if (m.status === "scheduled" && m.player1 && m.player2) return 2;
        if (m.status === "pending_confirmation") return 3;
      }

      // 2. Needs action (any round)
      if (m.status === "disputed") return 10;
      if (m.status === "pending_confirmation") return 11;
      if (m.status === "expired") return 12;

      // 3. Current round waiting
      if (m.round.number === currentRound && m.status === "scheduled") return 20;

      // 4. Future rounds (TBD)
      if (m.status === "scheduled" && (!m.player1 || !m.player2)) return 30 + m.round.number;

      // 5. Completed (newest round first)
      if (m.status === "completed") return 50 - m.round.number;

      return 40;
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Same priority: sort by round then bracket position
    if (a.round.number !== b.round.number) return a.round.number - b.round.number;
    return a.bracket_position - b.bracket_position;
  });
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case "in_progress":
      return <Circle className="w-4 h-4 text-blue-600 fill-current" />;
    case "scheduled":
      return <Clock className="w-4 h-4 text-gray-400" />;
    case "pending_confirmation":
      return <Timer className="w-4 h-4 text-yellow-600" />;
    case "disputed":
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case "expired":
      return <XCircle className="w-4 h-4 text-gray-400" />;
    default:
      return <Circle className="w-4 h-4 text-gray-400" />;
  }
}

export default function OrganizerTournamentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatchesLoading, setIsMatchesLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(searchParams.get("edit") === "true");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const fetchTournament = async () => {
    try {
      const [tournamentRes, participantsRes] = await Promise.all([
        tournamentApi.get(Number(tournamentId)),
        tournamentApi.getParticipants(Number(tournamentId)),
      ]);
      setTournament(tournamentRes.data);
      setParticipants(participantsRes.participants || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tournament");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatches = async () => {
    if (!tournament || !["active", "completed"].includes(tournament.status.value)) return;

    setIsMatchesLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}/api/tournaments/${tournamentId}/matches`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setIsMatchesLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
  }, [tournamentId]);

  useEffect(() => {
    if (tournament && ["active", "completed"].includes(tournament.status.value)) {
      fetchMatches();
      // Auto-refresh matches every 10 seconds for active tournaments
      if (tournament.status.value === "active") {
        const interval = setInterval(fetchMatches, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [tournament?.status.value]);

  const handleOpenRegistration = async () => {
    if (!tournament) return;
    setIsActionLoading(true);
    setError("");
    try {
      const res = await tournamentApi.openRegistration(tournament.id);
      setTournament(res.tournament);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open registration");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCloseRegistration = async () => {
    if (!tournament) return;
    setIsActionLoading(true);
    setError("");
    try {
      const res = await tournamentApi.closeRegistration(tournament.id);
      setTournament(res.tournament);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close registration");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStartTournament = async () => {
    if (!tournament) return;

    // Double-check conditions before starting
    const playerCount = participants.length;
    if (playerCount < 2) {
      setError(`Cannot start tournament: Need at least 2 players (currently ${playerCount})`);
      return;
    }
    if (!tournament.dates.is_start_date_reached) {
      setError(`Cannot start tournament: Start date not reached yet`);
      return;
    }

    setIsActionLoading(true);
    setError("");
    try {
      const res = await tournamentApi.start(tournament.id);
      setTournament(res.tournament);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start tournament");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelTournament = async () => {
    if (!tournament) return;
    setIsActionLoading(true);
    setError("");
    try {
      const res = await tournamentApi.cancel(tournament.id);
      setTournament(res.tournament);
      setShowCancelDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel tournament");
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-medium mb-2">Something went wrong</p>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={() => router.push("/organizer/tournaments")}>
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  if (!tournament) return null;

  const showStartButton = tournament.status.value === "registration";
  const actualPlayerCount = participants.length;
  const canStart = actualPlayerCount >= 2 && tournament.dates.is_start_date_reached;
  const canEdit = !["active", "completed", "cancelled"].includes(tournament.status.value);
  const isPending = tournament.status.value === "pending_review";
  const isDraft = tournament.status.value === "draft";
  const isRegistration = tournament.status.value === "registration";
  const canOpenRegistration = isDraft && tournament.verification?.is_verified;
  const showMatchesTab = ["active", "completed"].includes(tournament.status.value);
  const showStandingsTab = tournament.status.value === "completed";

  const sortedMatches = sortMatchesByRelevance(matches);

  // Count matches by status for tab badge
  const needsActionCount = matches.filter(m =>
    ["disputed", "pending_confirmation"].includes(m.status)
  ).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b sticky top-0 z-10 bg-background">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/organizer/tournaments")}
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Tournaments</span>
          </Button>

          <div className="flex items-center gap-1">
            {showStartButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartTournament}
                disabled={!canStart || isActionLoading}
                className={`gap-2 ${canStart ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-muted-foreground opacity-50"}`}
                title={
                  canStart
                    ? "Start Tournament"
                    : actualPlayerCount < 2
                      ? `Need ${2 - actualPlayerCount} more player(s)`
                      : `Starts on ${new Date(tournament.dates.starts_at || "").toLocaleDateString()}`
                }
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                <span className="hidden sm:inline">Start</span>
              </Button>
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowEditSheet(true)}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* View Actions */}
                <DropdownMenuItem asChild>
                  <Link href={`/tournaments/${tournament.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Page
                  </Link>
                </DropdownMenuItem>
                {showMatchesTab && (
                  <DropdownMenuItem asChild>
                    <Link href={`/bracket/${tournament.id}`}>
                      <Swords className="h-4 w-4 mr-2" />
                      View Bracket
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* Edit Action */}
                {canEdit && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Tournament
                    </DropdownMenuItem>
                  </>
                )}

                {/* Draft Tournament Actions */}
                {canOpenRegistration && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleOpenRegistration}
                      disabled={isActionLoading}
                      className="text-green-600 focus:text-green-600"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Open Registration
                    </DropdownMenuItem>
                  </>
                )}

                {/* Registration Status Actions */}
                {isRegistration && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleCloseRegistration}
                      disabled={isActionLoading}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Close Registration
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => canStart && handleStartTournament()}
                      disabled={!canStart || isActionLoading}
                      className={canStart ? "text-green-600 focus:text-green-600" : "opacity-50"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {canStart
                        ? "Start Tournament"
                        : actualPlayerCount < 2
                          ? `Need ${2 - actualPlayerCount} more player(s)`
                          : `Starts ${new Date(tournament.dates.starts_at || "").toLocaleDateString()}`}
                    </DropdownMenuItem>
                  </>
                )}

                {/* Cancel Action */}
                {canEdit && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowCancelDialog(true)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Tournament
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Status Banner */}
        {isPending && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 -mx-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-700">Under Review</p>
              <p className="text-xs text-amber-600">Usually takes 24-48 hours</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3 -mx-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Tournament Header */}
        <div className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <Trophy className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold truncate">{tournament.name}</h1>
                <Badge variant={tournament.status.value === "active" ? "default" : "secondary"}>
                  {tournament.status.label}
                </Badge>
              </div>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(tournament.dates.starts_at) || "Date TBD"}
                </span>
                <span>•</span>
                <span>Race to {tournament.settings?.race_to || 3}</span>
                <span>•</span>
                <span>{tournament.entry_fee?.is_free ? "Free Entry" : tournament.entry_fee?.formatted}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            {showMatchesTab && (
              <TabsTrigger value="matches" className="gap-2">
                <Swords className="h-4 w-4" />
                Matches
                {needsActionCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {needsActionCount}
                  </Badge>
                )}
              </TabsTrigger>
            )}
            {showStandingsTab && (
              <TabsTrigger value="standings" className="gap-2">
                <Medal className="h-4 w-4" />
                Standings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {participants.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="hidden sm:table-cell">Location</TableHead>
                      <TableHead className="text-center hidden md:table-cell">Win%</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => {
                      const player = participant.player;
                      const winRate = player?.stats?.total_matches && player.stats.total_matches > 0
                        ? Math.round((player.stats.wins / player.stats.total_matches) * 100)
                        : null;

                      return (
                        <TableRow key={participant.id}>
                          <TableCell className="text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={player?.photo_url} />
                                <AvatarFallback className="text-xs">
                                  {player?.full_name?.[0] || "P"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{player?.full_name || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {player?.location?.name || "—"}
                          </TableCell>
                          <TableCell className="text-center tabular-nums hidden md:table-cell">
                            {winRate !== null ? `${winRate}%` : "—"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium">
                            {player?.rating?.toLocaleString() || "1,500"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No players yet</h3>
                <p className="text-sm text-muted-foreground">
                  Players will appear here once they register
                </p>
              </div>
            )}
          </TabsContent>

          {/* Matches Tab */}
          {showMatchesTab && (
            <TabsContent value="matches">
              {isMatchesLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">Loading matches...</p>
                </div>
              ) : sortedMatches.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Round</TableHead>
                        <TableHead>Player 1</TableHead>
                        <TableHead className="text-center w-[70px]">Score</TableHead>
                        <TableHead>Player 2</TableHead>
                        <TableHead className="w-[50px] text-center"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedMatches
                        .filter(m => m.match_type !== "bye")
                        .map((match) => (
                          <TableRow
                            key={match.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => {
                              setSelectedMatch(match);
                              setShowMatchModal(true);
                            }}
                          >
                            <TableCell className="font-medium">
                              {match.round.name}
                            </TableCell>
                            <TableCell>
                              <span className={match.player1?.is_winner ? "font-medium text-green-600" : ""}>
                                {match.player1?.name || <span className="text-muted-foreground">TBD</span>}
                              </span>
                            </TableCell>
                            <TableCell className="text-center tabular-nums font-medium">
                              {match.status === "completed" ? (
                                <span>
                                  {match.player1?.score ?? 0} - {match.player2?.score ?? 0}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">vs</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={match.player2?.is_winner ? "font-medium text-green-600" : ""}>
                                {match.player2?.name || <span className="text-muted-foreground">TBD</span>}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusIcon(match.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Swords className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No matches yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Matches will appear here once the tournament starts
                  </p>
                </div>
              )}

              {tournament.status.value === "active" && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Auto-refreshes every 10 seconds
                </p>
              )}
            </TabsContent>
          )}

          {/* Standings Tab */}
          {showStandingsTab && (
            <TabsContent value="standings">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Pos</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-center">Played</TableHead>
                      <TableHead className="text-center">Won</TableHead>
                      <TableHead className="text-center">Lost</TableHead>
                      <TableHead className="text-center">FD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants
                      .filter(p => p.final_position)
                      .sort((a, b) => (a.final_position || 999) - (b.final_position || 999))
                      .map((participant) => {
                        const player = participant.player;
                        return (
                          <TableRow key={participant.id}>
                            <TableCell className="font-bold">
                              {participant.final_position === 1 && <span>🥇</span>}
                              {participant.final_position === 2 && <span>🥈</span>}
                              {participant.final_position === 3 && <span>🥉</span>}
                              {participant.final_position && participant.final_position > 3 && `#${participant.final_position}`}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={player?.photo_url} />
                                  <AvatarFallback className="text-xs">
                                    {player?.full_name?.[0] || "P"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{player?.full_name || "Unknown"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center tabular-nums">
                              {participant.stats?.matches_played ?? 0}
                            </TableCell>
                            <TableCell className="text-center tabular-nums text-green-600">
                              {participant.stats?.matches_won ?? 0}
                            </TableCell>
                            <TableCell className="text-center tabular-nums text-red-600">
                              {participant.stats?.matches_lost ?? 0}
                            </TableCell>
                            <TableCell className="text-center tabular-nums">
                              {(participant.stats?.frame_difference ?? 0) > 0 ? "+" : ""}
                              {participant.stats?.frame_difference ?? 0}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Tournament?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All registered players will be notified
              that the tournament has been cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Tournament</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelTournament}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Cancel Tournament"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Sheet */}
      {tournament && (
        <EditTournamentSheet
          tournament={tournament}
          open={showEditSheet}
          onOpenChange={setShowEditSheet}
          onSuccess={(updated) => setTournament(updated)}
        />
      )}

      {/* Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatch}
        open={showMatchModal}
        onOpenChange={setShowMatchModal}
        onResolved={() => {
          fetchMatches();
          fetchTournament();
        }}
      />
    </div>
  );
}
