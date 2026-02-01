"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: number;
  name: string;
  photo_url?: string | null;
  rating?: number;
  score: number;
  is_winner: boolean;
}

interface PlayerVersusCardProps {
  player1: Player | null;
  player2: Player | null;
  status: string;
  tournamentName: string;
  roundName: string;
}

export function PlayerVersusCard({
  player1,
  player2,
  status,
  tournamentName,
  roundName,
}: PlayerVersusCardProps) {
  const showScores = status !== "scheduled";

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      {/* Tournament info */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Trophy className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{tournamentName}</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-sm text-muted-foreground">{roundName}</span>
      </div>

      {/* Players */}
      <div className="flex items-center justify-between gap-4">
        {/* Player 1 */}
        <div className="flex-1 flex flex-col items-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mb-2 border-2",
            player1?.is_winner ? "border-green-500" : "border-transparent",
            !player1?.photo_url && "bg-primary/10"
          )}>
            {player1?.photo_url ? (
              <Image
                src={player1.photo_url}
                alt={player1.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {player1?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-center truncate max-w-[100px]">
            {player1?.name || "TBD"}
          </span>
          {player1?.rating && (
            <span className="text-xs text-muted-foreground">
              {player1.rating} pts
            </span>
          )}
          {showScores && (
            <div className={cn(
              "mt-2 text-2xl font-bold",
              player1?.is_winner ? "text-green-500" : "text-foreground"
            )}>
              {player1?.score ?? 0}
            </div>
          )}
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">VS</span>
          </div>
          {showScores && (
            <div className="text-xs text-muted-foreground mt-2">-</div>
          )}
        </div>

        {/* Player 2 */}
        <div className="flex-1 flex flex-col items-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mb-2 border-2",
            player2?.is_winner ? "border-green-500" : "border-transparent",
            !player2?.photo_url && "bg-primary/10"
          )}>
            {player2?.photo_url ? (
              <Image
                src={player2.photo_url}
                alt={player2.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {player2?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-center truncate max-w-[100px]">
            {player2?.name || "TBD"}
          </span>
          {player2?.rating && (
            <span className="text-xs text-muted-foreground">
              {player2.rating} pts
            </span>
          )}
          {showScores && (
            <div className={cn(
              "mt-2 text-2xl font-bold",
              player2?.is_winner ? "text-green-500" : "text-foreground"
            )}>
              {player2?.score ?? 0}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
