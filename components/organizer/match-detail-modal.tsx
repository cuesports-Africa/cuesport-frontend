"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trophy,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "@/lib/api";

interface Player {
  id: number;
  name: string;
  rating: number;
  score: number;
  is_winner: boolean;
}

interface Match {
  id: number;
  tournament_id: number;
  round: {
    number: number;
    name: string;
  };
  match_type: string;
  player1: Player | null;
  player2: Player | null;
  player1_id: number | null;
  player2_id: number | null;
  status: string;
  deadline_at: string | null;
  dispute_reason: string | null;
  forfeit_type: string | null;
}

interface Evidence {
  id: number;
  type: string;
  url: string;
  description: string | null;
  uploaded_by: { id: number; name: string };
  created_at: string;
}

interface MatchDetailModalProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolved: () => void;
}

export function MatchDetailModal({
  match,
  open,
  onOpenChange,
  onResolved,
}: MatchDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  // Resolution form
  const [winnerId, setWinnerId] = useState<string>("");
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const loadEvidence = async () => {
    if (!match) return;
    setLoadingEvidence(true);
    try {
      const response = await api.get<{ evidence: Evidence[] }>(`/matches/${match.id}/evidence`);
      setEvidence(response.evidence || []);
    } catch (err) {
      console.error("Failed to load evidence:", err);
    } finally {
      setLoadingEvidence(false);
    }
  };

  const handleResolve = async () => {
    if (!match || !winnerId) return;
    setIsLoading(true);
    setError("");

    try {
      await api.post(`/matches/${match.id}/resolve-dispute`, {
        winner_id: parseInt(winnerId),
        player1_score: parseInt(player1Score) || 0,
        player2_score: parseInt(player2Score) || 0,
        resolution_notes: resolutionNotes,
      });
      onResolved();
      onOpenChange(false);
      // Reset form
      setWinnerId("");
      setPlayer1Score("");
      setPlayer2Score("");
      setResolutionNotes("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resolve dispute";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalkover = async (winnerParticipantId: number) => {
    if (!match) return;
    setIsLoading(true);
    setError("");

    try {
      await api.post(`/matches/${match.id}/award-walkover`, {
        winner_id: winnerParticipantId,
        reason: resolutionNotes || "No-show walkover",
      });
      onResolved();
      onOpenChange(false);
      // Reset form
      setWinnerId("");
      setPlayer1Score("");
      setPlayer2Score("");
      setResolutionNotes("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to award walkover";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load evidence when modal opens with a disputed match
  useEffect(() => {
    if (open && match?.status === "disputed") {
      loadEvidence();
      // Reset form state when opening modal
      setWinnerId("");
      setPlayer1Score("");
      setPlayer2Score("");
      setResolutionNotes("");
      setError("");
    }
  }, [open, match?.id, match?.status]);

  if (!match) return null;

  const isDisputed = match.status === "disputed";
  const hasNoShowReport =
    match.forfeit_type === "no_show" ||
    match.dispute_reason?.toLowerCase().includes("no-show");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDisputed && <AlertTriangle className="h-5 w-5 text-red-600" />}
            {match.round.name} - Match #{match.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Info */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {match.player1?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{match.player1?.name || "TBD"}</p>
                <p className="text-sm text-muted-foreground">
                  Rating: {match.player1?.rating}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {match.player1?.score ?? "-"} : {match.player2?.score ?? "-"}
              </p>
              <Badge variant={isDisputed ? "destructive" : "secondary"}>
                {match.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{match.player2?.name || "TBD"}</p>
                <p className="text-sm text-muted-foreground">
                  Rating: {match.player2?.rating}
                </p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {match.player2?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Deadline */}
          {match.deadline_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Deadline: {new Date(match.deadline_at).toLocaleString()}
            </div>
          )}

          {/* Dispute Reason */}
          {isDisputed && match.dispute_reason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Dispute Reason:</p>
              <p className="text-sm text-red-700">{match.dispute_reason}</p>
            </div>
          )}

          {/* Evidence */}
          {isDisputed && (
            <div>
              <Label className="text-sm font-medium">Evidence</Label>
              {loadingEvidence ? (
                <div className="py-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </div>
              ) : evidence.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {evidence.map((e) => (
                    <a
                      key={e.id}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{e.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        By: {e.uploaded_by.name}
                      </p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  No evidence uploaded
                </p>
              )}
            </div>
          )}

          {/* Resolution Form */}
          {isDisputed && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Resolve Dispute</h3>

              {/* Quick Walkover Buttons */}
              {hasNoShowReport && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      match.player1_id && handleWalkover(match.player1_id)
                    }
                    disabled={isLoading}
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Walkover to {match.player1?.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      match.player2_id && handleWalkover(match.player2_id)
                    }
                    disabled={isLoading}
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Walkover to {match.player2?.name}
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Winner</Label>
                  <Select value={winnerId} onValueChange={setWinnerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select winner" />
                    </SelectTrigger>
                    <SelectContent>
                      {match.player1_id && (
                        <SelectItem value={String(match.player1_id)}>
                          {match.player1?.name}
                        </SelectItem>
                      )}
                      {match.player2_id && (
                        <SelectItem value={String(match.player2_id)}>
                          {match.player2?.name}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{match.player1?.name} Score</Label>
                  <Input
                    type="number"
                    min="0"
                    value={player1Score}
                    onChange={(e) => setPlayer1Score(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>{match.player2?.name} Score</Label>
                  <Input
                    type="number"
                    min="0"
                    value={player2Score}
                    onChange={(e) => setPlayer2Score(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Resolution Notes</Label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Optional notes about the resolution..."
                  rows={2}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleResolve}
                  disabled={!winnerId || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Resolve & Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
