"use client";

import { useState } from "react";
import { X, AlertTriangle, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; myScore?: number; opponentScore?: number }) => Promise<void>;
  raceTo: number;
  isLoading?: boolean;
}

export function DisputeModal({
  isOpen,
  onClose,
  onSubmit,
  raceTo,
  isLoading = false,
}: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const [includeScore, setIncludeScore] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError(null);

    if (reason.length < 10) {
      setError("Please provide a reason with at least 10 characters");
      return;
    }

    try {
      const data: { reason: string; myScore?: number; opponentScore?: number } = { reason };
      if (includeScore) {
        data.myScore = myScore;
        data.opponentScore = opponentScore;
      }
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit dispute");
    }
  };

  const incrementScore = (setter: (v: number) => void, current: number) => {
    if (current < raceTo) setter(current + 1);
  };

  const decrementScore = (setter: (v: number) => void, current: number) => {
    if (current > 0) setter(current - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-semibold">Dispute Result</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason for dispute <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you're disputing this result (min 10 characters)..."
              className={cn(
                "w-full h-24 px-3 py-2 rounded-lg border border-border bg-background",
                "text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {reason.length}/10 minimum characters
            </p>
          </div>

          {/* Optional counter score */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <input
                type="checkbox"
                checked={includeScore}
                onChange={(e) => setIncludeScore(e.target.checked)}
                className="w-4 h-4 rounded border-border"
                disabled={isLoading}
              />
              Include your claimed score (optional)
            </label>

            {includeScore && (
              <div className="flex items-center justify-around gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-2">Your Score</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementScore(setMyScore, myScore)}
                      disabled={myScore === 0 || isLoading}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                      <span className="text-xl font-bold">{myScore}</span>
                    </div>
                    <button
                      onClick={() => incrementScore(setMyScore, myScore)}
                      disabled={myScore === raceTo || isLoading}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <span className="text-muted-foreground">-</span>

                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-2">Opponent</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementScore(setOpponentScore, opponentScore)}
                      disabled={opponentScore === 0 || isLoading}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                      <span className="text-xl font-bold">{opponentScore}</span>
                    </div>
                    <button
                      onClick={() => incrementScore(setOpponentScore, opponentScore)}
                      disabled={opponentScore === raceTo || isLoading}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || reason.length < 10}
            className={cn(
              "w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2",
              "bg-red-500 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "active:scale-[0.98] transition-transform"
            )}
          >
            {isLoading ? "Submitting..." : "Submit Dispute"}
          </button>
        </div>
      </div>
    </div>
  );
}
