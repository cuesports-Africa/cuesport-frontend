"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { matchesApi, authApi } from "@/lib/api";
import type { MatchDetail, MatchEvidence } from "@/lib/api";
import { useMatchChannel } from "@/hooks/use-echo";
import { cn } from "@/lib/utils";

import { PlayerVersusCard } from "./components/player-versus-card";
import { ScoreSubmissionForm } from "./components/score-submission-form";
import { ConfirmationActions } from "./components/confirmation-actions";
import { DisputeModal } from "./components/dispute-modal";
import { EvidenceSection } from "./components/evidence-section";

type MatchStatus = "scheduled" | "pending_confirmation" | "disputed" | "completed" | "expired" | "cancelled";

const statusConfig: Record<MatchStatus, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  scheduled: { icon: Clock, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Scheduled" },
  pending_confirmation: { icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500/10", label: "Pending Confirmation" },
  disputed: { icon: AlertCircle, color: "text-red-500", bgColor: "bg-red-500/10", label: "Disputed" },
  completed: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10", label: "Completed" },
  expired: { icon: XCircle, color: "text-gray-500", bgColor: "bg-gray-500/10", label: "Expired" },
  cancelled: { icon: XCircle, color: "text-gray-500", bgColor: "bg-gray-500/10", label: "Cancelled" },
};

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [evidence, setEvidence] = useState<MatchEvidence[]>([]);

  // Fetch current user
  const { data: userData } = useSWR("current-user", () => authApi.me());
  const currentUser = userData?.user;

  // Fetch match details
  const {
    data: match,
    mutate: mutateMatch,
    isLoading: matchLoading,
    error: matchError,
  } = useSWR<MatchDetail>(
    matchId ? `match-${matchId}` : null,
    () => matchesApi.get(matchId),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );

  // Fetch evidence
  const { data: evidenceData } = useSWR(
    matchId ? `match-${matchId}-evidence` : null,
    () => matchesApi.getEvidence(matchId),
    { revalidateOnFocus: false }
  );

  // Update local state when data loads
  useEffect(() => {
    if (evidenceData?.evidence) {
      setEvidence(evidenceData.evidence);
    }
  }, [evidenceData]);

  // Real-time handlers
  const handleResultSubmitted = useCallback(() => {
    mutateMatch();
  }, [mutateMatch]);

  const handleResultConfirmed = useCallback(() => {
    mutateMatch();
  }, [mutateMatch]);

  const handleDisputed = useCallback(() => {
    mutateMatch();
  }, [mutateMatch]);

  const handleResolved = useCallback(() => {
    mutateMatch();
  }, [mutateMatch]);

  // Subscribe to match channel for real-time updates
  useMatchChannel({
    matchId,
    onResultSubmitted: handleResultSubmitted,
    onResultConfirmed: handleResultConfirmed,
    onDisputed: handleDisputed,
    onResolved: handleResolved,
  });

  // Determine user's tournament participant ID
  const getMyParticipantId = (): number | null => {
    if (!currentUser?.player_profile || !match) return null;
    const playerProfileId = currentUser.player_profile.id;
    // Compare player_profile_id (from API) with current user's profile id
    if (match.player1?.player_profile_id === playerProfileId) {
      return match.player1.id;
    }
    if (match.player2?.player_profile_id === playerProfileId) {
      return match.player2.id;
    }
    return null;
  };

  const myParticipantId = getMyParticipantId();
  const isSubmitter = match?.submission?.submitted_by === myParticipantId;
  const status = (match?.status || "scheduled") as MatchStatus;

  // Determine if current user is player1 or player2
  const isPlayer1 = match?.player1?.player_profile_id === currentUser?.player_profile?.id;
  const isPlayer2 = match?.player2?.player_profile_id === currentUser?.player_profile?.id;

  // Calculate scores from current user's perspective
  const currentUserScore = isPlayer1 ? (match?.player1?.score ?? 0) : (match?.player2?.score ?? 0);
  const opponentUserScore = isPlayer1 ? (match?.player2?.score ?? 0) : (match?.player1?.score ?? 0);
  const statusInfo = statusConfig[status] || statusConfig.scheduled;

  // Action handlers
  const handleSubmitResult = async (myScore: number, opponentScore: number) => {
    setActionLoading(true);
    try {
      await matchesApi.submitResult(matchId, { my_score: myScore, opponent_score: opponentScore });
      await mutateMatch();
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmResult = async () => {
    setActionLoading(true);
    try {
      await matchesApi.confirmResult(matchId);
      await mutateMatch();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisputeResult = async (data: { reason: string; myScore?: number; opponentScore?: number }) => {
    setActionLoading(true);
    try {
      await matchesApi.disputeResult(matchId, {
        reason: data.reason,
        my_score: data.myScore,
        opponent_score: data.opponentScore,
      });
      await mutateMatch();
      setIsDisputeModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadEvidence = async (file: File, type: "image" | "video", description?: string) => {
    const result = await matchesApi.uploadEvidence(matchId, file, type, description);
    setEvidence((prev) => [...prev, result.evidence]);
  };

  const handleAddVideoLink = async (url: string, description?: string) => {
    const result = await matchesApi.addVideoLink(matchId, url, description);
    setEvidence((prev) => [...prev, result.evidence]);
  };

  const handleDeleteEvidence = async (evidenceId: number) => {
    await matchesApi.deleteEvidence(matchId, evidenceId);
    setEvidence((prev) => prev.filter((e) => e.id !== evidenceId));
  };

  if (matchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (matchError || !match || !match.round) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-lg font-semibold mb-2">Match not found</h1>
        <p className="text-muted-foreground text-sm mb-4">
          The match you're looking for doesn't exist or you don't have access.
        </p>
        <Link
          href="/player/matches"
          className="text-primary font-medium"
        >
          Back to matches
        </Link>
      </div>
    );
  }

  const raceTo = match.match_type === "final" || match.match_type === "semi_final"
    ? (match.tournament?.finals_race_to || match.tournament?.race_to || 3)
    : (match.tournament?.race_to || 3);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{match.round.name}</h1>
            <p className="text-xs text-muted-foreground">{match.tournament?.name || "Tournament"}</p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full flex items-center gap-1.5",
            statusInfo.bgColor
          )}>
            <statusInfo.icon className={cn("h-3.5 w-3.5", statusInfo.color)} />
            <span className={cn("text-xs font-medium", statusInfo.color)}>
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Player Versus Card */}
        <PlayerVersusCard
          player1={match.player1}
          player2={match.player2}
          status={status}
          tournamentName={match.tournament?.name || "Tournament"}
          roundName={match.round.name}
        />

        {/* Status-based content */}
        {status === "scheduled" && (
          <ScoreSubmissionForm
            raceTo={raceTo}
            onSubmit={handleSubmitResult}
            isLoading={actionLoading}
          />
        )}

        {status === "pending_confirmation" && (
          <ConfirmationActions
            myScore={currentUserScore}
            opponentScore={opponentUserScore}
            isSubmitter={isSubmitter}
            timeRemaining={match.timing.time_remaining}
            onConfirm={handleConfirmResult}
            onDispute={() => setIsDisputeModalOpen(true)}
            isLoading={actionLoading}
          />
        )}

        {status === "disputed" && (
          <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Match Disputed</span>
            </div>
            {match.dispute?.reason && (
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">Reason:</span> {match.dispute.reason}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This match is under review. Please upload evidence to support your case.
            </p>
          </div>
        )}

        {status === "completed" && (
          <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-4">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Match Completed</span>
            </div>
            {match.timing.played_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Played on {new Date(match.timing.played_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Evidence section - show for disputed matches */}
        {(status === "disputed" || status === "pending_confirmation") && myParticipantId && (
          <EvidenceSection
            evidence={evidence}
            currentUserId={myParticipantId}
            onUpload={handleUploadEvidence}
            onAddVideoLink={handleAddVideoLink}
            onDelete={handleDeleteEvidence}
            isLoading={actionLoading}
          />
        )}
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmit={handleDisputeResult}
        raceTo={raceTo}
        isLoading={actionLoading}
      />
    </div>
  );
}
