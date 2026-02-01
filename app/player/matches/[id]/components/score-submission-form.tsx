"use client";

import { useState } from "react";
import { Send, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreSubmissionFormProps {
  raceTo: number;
  onSubmit: (myScore: number, opponentScore: number) => Promise<void>;
  isLoading?: boolean;
}

export function ScoreSubmissionForm({
  raceTo,
  onSubmit,
  isLoading = false,
}: ScoreSubmissionFormProps) {
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateScore = (score1: number, score2: number): boolean => {
    // One player must have exactly the race_to score (the winner)
    if (score1 !== raceTo && score2 !== raceTo) {
      return false;
    }

    // The other player must have less than race_to (the loser)
    if (score1 === raceTo && score2 >= raceTo) {
      return false;
    }

    if (score2 === raceTo && score1 >= raceTo) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateScore(myScore, opponentScore)) {
      setError(`Invalid score. One player must reach exactly ${raceTo} to win.`);
      return;
    }

    try {
      await onSubmit(myScore, opponentScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit result");
    }
  };

  const incrementScore = (setter: (v: number) => void, current: number) => {
    if (current < raceTo) {
      setter(current + 1);
    }
  };

  const decrementScore = (setter: (v: number) => void, current: number) => {
    if (current > 0) {
      setter(current - 1);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      <h3 className="text-sm font-semibold mb-4 text-center">Submit Result</h3>

      <div className="flex items-center justify-around gap-4 mb-4">
        {/* My Score */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-2">Your Score</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrementScore(setMyScore, myScore)}
              disabled={myScore === 0 || isLoading}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold">{myScore}</span>
            </div>
            <button
              onClick={() => incrementScore(setMyScore, myScore)}
              disabled={myScore === raceTo || isLoading}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-muted-foreground text-lg font-medium">-</div>

        {/* Opponent Score */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-2">Opponent</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrementScore(setOpponentScore, opponentScore)}
              disabled={opponentScore === 0 || isLoading}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold">{opponentScore}</span>
            </div>
            <button
              onClick={() => incrementScore(setOpponentScore, opponentScore)}
              disabled={opponentScore === raceTo || isLoading}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground mb-4">
        Race to {raceTo} - Winner must reach exactly {raceTo}
      </p>

      {error && (
        <div className="text-sm text-red-500 text-center mb-4">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || (myScore === 0 && opponentScore === 0)}
        className={cn(
          "w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors",
          "bg-primary text-primary-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]"
        )}
      >
        <Send className="h-4 w-4" />
        {isLoading ? "Submitting..." : "Submit Result"}
      </button>
    </div>
  );
}
