"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  Swords,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  AlertCircle,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { profileApi, matchesApi, ActiveMatch, MyMatchesResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MatchHistoryItem {
  id: number;
  opponent: {
    id: number;
    name: string;
    photo_url?: string;
  };
  tournament: {
    id: number;
    name: string;
  };
  stage?: string;
  result: "win" | "loss";
  score: string;
  rating_change: number;
  played_at: string;
}

interface MatchStats {
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
}

interface MatchesResponse {
  data: MatchHistoryItem[];
  stats: MatchStats;
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

type MatchStatus = "scheduled" | "pending_confirmation" | "disputed" | "completed" | "expired" | "cancelled";

const statusConfig: Record<MatchStatus, { color: string; bgColor: string; label: string }> = {
  scheduled: { color: "text-blue-600", bgColor: "bg-blue-500", label: "Scheduled" },
  pending_confirmation: { color: "text-amber-600", bgColor: "bg-amber-500", label: "Pending" },
  disputed: { color: "text-red-600", bgColor: "bg-red-500", label: "Disputed" },
  completed: { color: "text-green-600", bgColor: "bg-green-500", label: "Completed" },
  expired: { color: "text-gray-600", bgColor: "bg-gray-500", label: "Expired" },
  cancelled: { color: "text-gray-600", bgColor: "bg-gray-500", label: "Cancelled" },
};

// Format phone number for WhatsApp (remove leading 0, add country code if needed)
const formatWhatsAppNumber = (phone: string): string => {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, "");
  // If starts with 0, assume Kenya and replace with 254
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  }
  return cleaned;
};

// Open WhatsApp with opponent
const openWhatsApp = (phoneNumber: string, opponentName: string) => {
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  const message = encodeURIComponent(`Hi ${opponentName}, regarding our match...`);
  window.open(`https://wa.me/${formattedNumber}?text=${message}`, "_blank");
};

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// SWR fetcher functions
const fetchMatchHistory = async (key: string) => {
  const [, page] = key.split("-");
  const limit = 20;
  const offset = (parseInt(page) - 1) * limit;
  return profileApi.getMatches({ offset: String(offset), limit: String(limit) }) as Promise<MatchesResponse>;
};

const fetchActiveMatches = () => matchesApi.myMatches();

export default function PlayerMatchesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allMatches, setAllMatches] = useState<MatchHistoryItem[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const PULL_THRESHOLD = 80;

  // SWR for active matches - refreshes every 30 seconds, revalidates on focus
  const {
    data: activeMatches,
    mutate: mutateActive,
    isLoading: activeLoading,
  } = useSWR<MyMatchesResponse>(
    "my-matches",
    fetchActiveMatches,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // 30 seconds for action-required matches
      dedupingInterval: 5000,
    }
  );

  // SWR for match history - cache for 2 minutes, no refetch on focus
  const {
    data: historyData,
    mutate: mutateHistory,
    isLoading: historyLoading,
  } = useSWR<MatchesResponse>(
    `match-history-${currentPage}`,
    fetchMatchHistory,
    {
      revalidateOnFocus: false, // Don't refetch on focus - prevents blinking
      dedupingInterval: 120000, // 2 minutes cache
      onSuccess: (data) => {
        if (currentPage === 1) {
          setAllMatches(data.data || []);
        } else {
          setAllMatches(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMatches = (data.data || []).filter(m => !existingIds.has(m.id));
            return [...prev, ...newMatches];
          });
        }
      },
    }
  );

  const stats = historyData?.stats;
  const hasMore = currentPage < (historyData?.meta?.last_page || 1);

  // Pull to refresh handlers
  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    setCurrentPage(1);
    setAllMatches([]);
    await Promise.all([
      mutateActive(),
      mutateHistory(),
    ]);
    setIsManualRefreshing(false);
    setPullDistance(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isManualRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      const resistance = 0.4;
      setPullDistance(Math.min(diff * resistance, PULL_THRESHOLD * 1.5));
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullDistance >= PULL_THRESHOLD && !isManualRefreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const loadMore = () => {
    if (!hasMore || historyLoading) return;
    setCurrentPage(prev => prev + 1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const handleConfirm = async (matchId: number) => {
    setActionLoading(matchId);
    try {
      await matchesApi.confirmResult(matchId);
      // Revalidate both caches after action
      await Promise.all([mutateActive(), mutateHistory()]);
    } catch (error) {
      console.error("Failed to confirm:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Combine pending and requiring_action matches
  const actionRequiredMatches = [
    ...(activeMatches?.requiring_action || []),
    ...(activeMatches?.pending || []),
  ].filter((match, index, self) => self.findIndex(m => m.id === match.id) === index);

  const actionCount = actionRequiredMatches.length;
  const matches = allMatches.length > 0 ? allMatches : (historyData?.data || []);

  return (
    <div
      ref={containerRef}
      className="min-h-full bg-background overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{
          height: pullDistance > 0 || isManualRefreshing ? Math.max(pullDistance, isManualRefreshing ? 60 : 0) : 0,
        }}
      >
        <div className={cn(
          "flex items-center gap-2",
          pullDistance >= PULL_THRESHOLD || isManualRefreshing ? "text-primary" : "text-muted-foreground"
        )}>
          <RefreshCw
            className={cn("h-5 w-5 transition-transform duration-200", isManualRefreshing && "animate-spin")}
            style={{ transform: !isManualRefreshing ? `rotate(${(pullDistance / PULL_THRESHOLD) * 180}deg)` : undefined }}
          />
          <span className="text-sm font-medium">
            {isManualRefreshing ? "Refreshing..." : pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-4 flex items-center justify-around border-b border-border/30">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats?.total_matches ?? 0}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Played</div>
        </div>
        <div className="w-px h-8 bg-border/50" />
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.wins ?? 0}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Won</div>
        </div>
        <div className="w-px h-8 bg-border/50" />
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.losses ?? 0}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Lost</div>
        </div>
        <div className="w-px h-8 bg-border/50" />
        <div className="text-center">
          <div className="text-2xl font-bold">{stats?.win_rate ?? 0}%</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Win Rate</div>
        </div>
      </div>

      {/* Content - no skeleton loading to prevent blinking */}
      <>
          {/* Action Required Section */}
          {actionCount > 0 && (
            <>
              <div className="px-4 py-3 flex items-center gap-2 border-b border-border/30">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Action Required ({actionCount})
                </span>
              </div>

              <div className="divide-y divide-border/30">
                {actionRequiredMatches.map((match) => {
                  const status = match.status.value as MatchStatus;
                  const config = statusConfig[status] || statusConfig.scheduled;
                  const isSubmitter = match.result_submitted_by !== undefined;
                  const needsConfirmation = status === "pending_confirmation" && !isSubmitter;
                  const needsToSubmit = status === "scheduled";

                  return (
                    <div key={match.id} className="px-4 py-3">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold text-white",
                          config.bgColor
                        )}>
                          {config.label}
                        </span>
                        {match.scheduled_at && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(match.scheduled_at)}
                          </span>
                        )}
                      </div>

                      {/* Opponent Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {match.player2?.photo_url ? (
                            <Image
                              src={match.player2.photo_url}
                              alt={match.player2.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-primary">
                              {match.player2?.name?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            vs {match.player2?.name || "TBD"}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Trophy className="h-3 w-3" />
                            <span className="truncate">{match.tournament.name}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{match.round_name}</span>
                          </div>
                          {status === "pending_confirmation" && match.player1_score !== null && (
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              Submitted: {match.player1_score} - {match.player2_score}
                            </div>
                          )}
                        </div>

                        {/* WhatsApp Button - Only show for non-completed matches with opponent phone */}
                        {match.player2?.phone_number && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openWhatsApp(match.player2!.phone_number!, match.player2!.name);
                            }}
                            className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                            title={`Chat with ${match.player2.name} on WhatsApp`}
                          >
                            <WhatsAppIcon className="h-4 w-4" />
                          </button>
                        )}

                        <Link href={`/player/matches/${match.id}`}>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        </Link>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 flex gap-2">
                        {needsToSubmit && (
                          <Link
                            href={`/player/matches/${match.id}`}
                            className="flex-1 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold text-center active:scale-95 transition-transform"
                          >
                            Submit Result
                          </Link>
                        )}

                        {needsConfirmation && (
                          <>
                            <button
                              onClick={() => handleConfirm(match.id)}
                              disabled={actionLoading === match.id}
                              className="flex-1 py-2 px-3 rounded-lg bg-green-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Confirm
                            </button>
                            <Link
                              href={`/player/matches/${match.id}?dispute=1`}
                              className="flex-1 py-2 px-3 rounded-lg bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                            >
                              <X className="h-3.5 w-3.5" />
                              Dispute
                            </Link>
                          </>
                        )}

                        {status === "disputed" && (
                          <div className="flex-1 py-2 px-3 rounded-lg bg-muted text-muted-foreground text-xs font-medium text-center flex items-center justify-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Under Review
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Recent Form */}
          {matches.length > 0 && (
            <div className="px-4 py-3 flex items-center gap-3 border-y border-border/30">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Form</span>
              <div className="flex gap-1.5">
                {matches.slice(0, 5).map((match) => (
                  <div
                    key={match.id}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                      match.result === "win" ? "bg-green-500" : "bg-red-500"
                    )}
                  >
                    {match.result === "win" ? "W" : "L"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match History Section */}
          <div className="px-4 py-3 bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Match History</h2>
          </div>

          {matches.length > 0 ? (
            <div className="divide-y divide-border/30">
              {matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/tournaments/${match.tournament.id}`}
                  className="flex items-center gap-3 px-4 py-3 active:bg-muted/50 transition-colors"
                >
                  {/* Opponent Avatar with Result Badge */}
                  <div className="relative flex-shrink-0">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden",
                      match.opponent.photo_url ? "" : "bg-primary/10"
                    )}>
                      {match.opponent.photo_url ? (
                        <Image
                          src={match.opponent.photo_url}
                          alt={match.opponent.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary">
                          {match.opponent.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow",
                      match.result === "win" ? "bg-green-500" : "bg-red-500"
                    )}>
                      {match.result === "win" ? "W" : "L"}
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{match.opponent.name}</span>
                      <span className={cn(
                        "text-xs font-semibold",
                        match.result === "win" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {match.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      <span className="truncate">{match.tournament.name}</span>
                      {match.stage && (
                        <>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{match.stage}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating & Date */}
                  <div className="text-right flex-shrink-0">
                    <div className={cn(
                      "flex items-center justify-end gap-0.5 text-sm font-semibold",
                      match.rating_change > 0 ? "text-green-600 dark:text-green-400"
                        : match.rating_change < 0 ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                    )}>
                      {match.rating_change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : match.rating_change < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      {match.rating_change > 0 ? "+" : ""}{match.rating_change}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatDate(match.played_at)}
                    </div>
                  </div>
                </Link>
              ))}

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={historyLoading}
                  className="w-full py-3 text-xs font-medium text-primary active:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  {historyLoading ? "Loading..." : "Load more matches"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-8 py-12">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Swords className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">No matches yet</h3>
              <p className="text-xs text-muted-foreground text-center mb-4 max-w-[220px]">
                Register for a tournament to start playing and building your match history
              </p>
              <Link
                href="/player/tournaments"
                className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm active:scale-95 transition-transform"
              >
                Browse Tournaments
              </Link>
            </div>
          )}
        </>

      {/* Bottom safe area */}
      <div className="h-4" />
    </div>
  );
}
