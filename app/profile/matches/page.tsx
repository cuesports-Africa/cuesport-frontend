"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Trophy,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileApi } from "@/lib/api";

interface MatchHistory {
  id: number;
  tournament: {
    id: number;
    name: string;
    type: string;
  };
  opponent: {
    id: number;
    name: string;
    rating_at_time: number;
  };
  result: string;
  won: boolean;
  score: string;
  match_type: string;
  round: {
    number: number;
    name: string;
  };
  rating: {
    before: number;
    after: number;
    change: number;
    formatted_change: string;
  };
  played_at: string;
}

interface MatchesResponse {
  matches: MatchHistory[];
  pagination: {
    offset: number;
    limit: number;
    has_more: boolean;
  };
}

type ResultFilter = "all" | "wins" | "losses";

const fetcher = async (key: string): Promise<MatchesResponse> => {
  const [, offset, filter] = key.split("|");
  const params: Record<string, string> = {
    offset,
    limit: "20"
  };
  if (filter === "wins") {
    params.result = "win";
  } else if (filter === "losses") {
    params.result = "loss";
  }
  const response = await profileApi.getMatches(params);
  return response as unknown as MatchesResponse;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MatchesPage() {
  const [offset, setOffset] = useState(0);
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, error, isLoading } = useSWR(
    `matches|${offset}|${resultFilter}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const matches = data?.matches || [];
  const pagination = data?.pagination;

  // Client-side search filtering
  const filteredMatches = matches.filter((match) => {
    if (!searchQuery) return true;
    return (
      match.opponent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleFilterChange = (filter: ResultFilter) => {
    setResultFilter(filter);
    setOffset(0);
  };

  const handleNextPage = () => {
    if (pagination?.has_more) {
      setOffset(offset + 20);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - 20));
    }
  };

  // Calculate summary stats from current page
  const pageWins = matches.filter((m) => m.won).length;
  const pageLosses = matches.filter((m) => !m.won).length;
  const pageRatingChange = matches.reduce((sum, m) => sum + (m.rating?.change || 0), 0);

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load match history</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Match History</h2>
          <p className="text-muted-foreground text-sm">
            Your complete match record
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl border p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opponent or tournament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden md:flex"}`}>
          {(["all", "wins", "losses"] as ResultFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                resultFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter === "all" ? "All Matches" : filter === "wins" ? "Wins" : "Losses"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      {matches.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{pageWins}</div>
            <div className="text-xs text-muted-foreground">Wins (this page)</div>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{pageLosses}</div>
            <div className="text-xs text-muted-foreground">Losses (this page)</div>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div
              className={`text-2xl font-bold ${
                pageRatingChange > 0
                  ? "text-green-600"
                  : pageRatingChange < 0
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {pageRatingChange > 0 ? "+" : ""}
              {pageRatingChange}
            </div>
            <div className="text-xs text-muted-foreground">Rating change</div>
          </div>
        </div>
      )}

      {/* Match List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No matches found</h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery
              ? `No matches match "${searchQuery}"`
              : "You haven't played any matches yet. Register for a tournament to start playing!"}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border divide-y">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Result Indicator */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                    match.won
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {match.won ? "W" : "L"}
                </div>

                {/* Match Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">vs {match.opponent.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({match.opponent.rating_at_time} rating)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <Link
                        href={`/tournaments/${match.tournament.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {match.tournament.name}
                      </Link>
                    </span>
                    {match.round?.name && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        {match.round.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(match.played_at)} at {formatTime(match.played_at)}
                  </div>
                </div>

                {/* Score & Rating */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold">{match.score}</div>
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${
                      (match.rating?.change || 0) > 0
                        ? "text-green-600"
                        : (match.rating?.change || 0) < 0
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {(match.rating?.change || 0) > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (match.rating?.change || 0) < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : null}
                    {match.rating?.formatted_change || `${match.rating?.change || 0}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {match.rating?.before} → {match.rating?.after}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={offset === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground px-4">
          Showing {offset + 1} - {offset + matches.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!pagination?.has_more}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
