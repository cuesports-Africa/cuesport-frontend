"use client";

import { Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationActionsProps {
  myScore: number;
  opponentScore: number;
  isSubmitter: boolean;
  timeRemaining: string | null;
  onConfirm: () => Promise<void>;
  onDispute: () => void;
  isLoading?: boolean;
}

export function ConfirmationActions({
  myScore,
  opponentScore,
  isSubmitter,
  timeRemaining,
  onConfirm,
  onDispute,
  isLoading = false,
}: ConfirmationActionsProps) {
  if (isSubmitter) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-4">
        <div className="flex items-center justify-center gap-2 text-amber-500 mb-3">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Waiting for Confirmation</span>
        </div>
        <p className="text-sm text-center text-muted-foreground mb-2">
          You submitted: You {myScore} - {opponentScore} Opponent
        </p>
        {timeRemaining && (
          <p className="text-xs text-center text-muted-foreground">
            Confirmation deadline: {timeRemaining}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      <h3 className="text-sm font-semibold text-center mb-3">
        Opponent submitted result
      </h3>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{opponentScore}</div>
          <div className="text-xs text-muted-foreground">Opponent</div>
        </div>
        <div className="text-2xl text-muted-foreground">-</div>
        <div className="text-center">
          <div className="text-3xl font-bold">{myScore}</div>
          <div className="text-xs text-muted-foreground">You</div>
        </div>
      </div>

      {timeRemaining && (
        <p className="text-xs text-center text-muted-foreground mb-4">
          Deadline: {timeRemaining}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2",
            "bg-green-500 text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:scale-[0.98] transition-transform"
          )}
        >
          <Check className="h-4 w-4" />
          {isLoading ? "Confirming..." : "Confirm"}
        </button>

        <button
          onClick={onDispute}
          disabled={isLoading}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2",
            "bg-red-500 text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:scale-[0.98] transition-transform"
          )}
        >
          <X className="h-4 w-4" />
          Dispute
        </button>
      </div>
    </div>
  );
}
