"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import ReactCountryFlag from "react-country-flag";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Loader2,
  RotateCcw,
  Users,
  Globe,
  Trophy,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  playerApi,
  locationApi,
  countryApi,
  RankedPlayer,
  RankingsResponse,
  RankingsParams,
  CountryRankingsResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type Tab = "players" | "countries";
type PlayerSortMetric = "rating" | "wins" | "tournaments_won" | "total_matches";

const playerSortOptions: { value: PlayerSortMetric; label: string; shortLabel: string }[] = [
  { value: "rating", label: "Rating", shortLabel: "Rating" },
  { value: "wins", label: "Wins", shortLabel: "Wins" },
  { value: "tournaments_won", label: "Tournaments Won", shortLabel: "Titles" },
  { value: "total_matches", label: "Total Matches", shortLabel: "Matches" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "pro", label: "Pro (2000+)" },
  { value: "advanced", label: "Advanced (1600-1999)" },
  { value: "intermediate", label: "Intermediate (1200-1599)" },
  { value: "beginner", label: "Beginner (<1200)" },
];

function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case "pro":
      return "bg-electric/20 text-electric border border-electric/30 font-bold";
    case "advanced":
      return "bg-primary/20 text-primary border border-primary/30 font-semibold";
    case "intermediate":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    default:
      return "bg-muted/50 text-muted-foreground border border-border/40";
  }
}

function getPlayerStatValue(player: RankedPlayer, sortBy: PlayerSortMetric): number {
  switch (sortBy) {
    case "rating": return player.rating;
    case "wins": return player.wins;
    case "tournaments_won": return player.tournaments_won;
    case "total_matches": return player.total_matches;
    default: return player.rating;
  }
}

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>(
    (searchParams.get("tab") as Tab) || "players"
  );

  // Player filters
  const [playerSortBy, setPlayerSortBy] = useState<PlayerSortMetric>(
    (searchParams.get("sort_by") as PlayerSortMetric) || "rating"
  );
  const [countryId, setCountryId] = useState<number | undefined>(
    searchParams.get("country_id") ? parseInt(searchParams.get("country_id")!) : undefined
  );
  const [regionId, setRegionId] = useState<number | undefined>(
    searchParams.get("region_id") ? parseInt(searchParams.get("region_id")!) : undefined
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [currentPage, setCurrentPage] = useState<number>(
    searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Countries list for filter dropdown
  const { data: countriesData } = useSWR("countries", () => locationApi.countries());
  const countries = countriesData?.countries || [];

  // Regions data (children of selected country)
  const { data: regionsData } = useSWR(
    countryId ? `regions-${countryId}` : null,
    () => (countryId ? locationApi.children(countryId) : null)
  );
  const regions = regionsData?.children || [];

  // Player rankings params
  const playerParams: RankingsParams = {
    sort_by: playerSortBy,
    page: currentPage,
    per_page: 25,
  };
  if (countryId) playerParams.country_id = countryId;
  if (regionId) playerParams.region_id = regionId;
  if (category && category !== "all") playerParams.category = category;

  // Player rankings data
  const {
    data: playersData,
    error: playersError,
    isLoading: playersLoading,
    mutate: mutatePlayer,
  } = useSWR<RankingsResponse>(
    activeTab === "players" ? `rankings-${JSON.stringify(playerParams)}` : null,
    () => playerApi.rankings(playerParams),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  // Country rankings data (always sorted by top_10_avg)
  const {
    data: countriesRankingData,
    error: countriesError,
    isLoading: countriesLoading,
    mutate: mutateCountries,
  } = useSWR<CountryRankingsResponse>(
    activeTab === "countries" ? "country-rankings" : null,
    () => countryApi.rankings(),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const players = playersData?.data || [];
  const playersMeta = playersData?.meta;
  const playersTotal = playersMeta?.total || 0;
  const playersLastPage = playersMeta?.last_page || 1;

  const rankedCountries = countriesRankingData?.data || [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== "players") params.set("tab", activeTab);

    if (activeTab === "players") {
      if (playerSortBy !== "rating") params.set("sort_by", playerSortBy);
      if (countryId) params.set("country_id", String(countryId));
      if (regionId) params.set("region_id", String(regionId));
      if (category !== "all") params.set("category", category);
      if (currentPage > 1) params.set("page", String(currentPage));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/rankings?${queryString}` : "/rankings";
    router.replace(newUrl, { scroll: false });
  }, [activeTab, playerSortBy, countryId, regionId, category, currentPage, router]);

  // Reset region when country changes
  useEffect(() => {
    if (!countryId) setRegionId(undefined);
  }, [countryId]);

  const handlePlayerReset = () => {
    setPlayerSortBy("rating");
    setCountryId(undefined);
    setRegionId(undefined);
    setCategory("all");
    setCurrentPage(1);
  };

  const hasPlayerActiveFilters =
    playerSortBy !== "rating" || countryId || regionId || category !== "all";

  // Filter players by search query (client-side)
  const filteredPlayers = searchQuery
    ? players.filter(p =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : players;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-5">
          {/* Left Sidebar - Fixed on scroll */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm search-input-dark rounded-xl border-border/20"
                />
              </div>

              {/* Tabs */}
              <div>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rankings
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => { setActiveTab("players"); setCurrentPage(1); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                      activeTab === "players" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Players</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("countries")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                      activeTab === "countries" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Countries</span>
                  </button>
                </div>
              </div>

              {/* Filters (Players only) */}
              {activeTab === "players" && (
                <>
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Sort By
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {playerSortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setPlayerSortBy(opt.value); setCurrentPage(1); }}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                            playerSortBy === opt.value ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          )}
                        >
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {categoryOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setCategory(opt.value); setCurrentPage(1); }}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded transition-colors",
                            category === opt.value ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          )}
                        >
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasPlayerActiveFilters && (
                    <button
                      onClick={handlePlayerReset}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset filters
                    </button>
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Filter Row with Country dropdown and count */}
            {activeTab === "players" && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={countryId ? String(countryId) : "all"}
                    onValueChange={(v) => { setCountryId(v === "all" ? undefined : parseInt(v)); setRegionId(undefined); setCurrentPage(1); }}
                  >
                    <SelectTrigger className="w-[140px] h-10 text-xs search-input-dark rounded-xl border-border/20">
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent className="card-dark border-border/20">
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          <div className="flex items-center gap-2">
                            {c.code && <ReactCountryFlag countryCode={c.code} svg style={{ width: "1em", height: "1em" }} />}
                            <span className="text-xs">{c.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {countryId && regions.length > 0 && (
                    <Select
                      value={regionId ? String(regionId) : "all"}
                      onValueChange={(v) => { setRegionId(v === "all" ? undefined : parseInt(v)); setCurrentPage(1); }}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {regions.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            <span className="text-xs">{r.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Mobile sort filter */}
                  <div className="lg:hidden">
                    <Select value={playerSortBy} onValueChange={(v) => { setPlayerSortBy(v as PlayerSortMetric); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {playerSortOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.shortLabel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {playersTotal.toLocaleString()} players
                </span>
              </div>
            )}

            {/* Countries count */}
            {activeTab === "countries" && (
              <div className="flex items-center justify-end mb-3">
                <span className="text-xs text-muted-foreground">
                  {rankedCountries.length} countries
                </span>
              </div>
            )}

            {/* Players Content */}
            {activeTab === "players" && (
              <>
                {playersError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs mb-4">
                    {playersError instanceof Error ? playersError.message : "Failed to load rankings"}
                    <button className="ml-2 underline" onClick={() => mutatePlayer()}>Try again</button>
                  </div>
                )}

                {playersLoading && !playersData ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredPlayers.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-lg border">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium text-sm mb-1">No players found</h3>
                    <p className="text-muted-foreground text-xs">
                      No players match your current filters.
                    </p>
                  </div>
                ) : (
                  <div className="card-dark rounded-2xl border border-border/20 overflow-hidden shadow-sm">
                    {filteredPlayers.map((player, idx) => (
                      <div
                        key={player.id}
                        className={cn(
                          "flex items-center px-4 py-3 hover:bg-muted/30 transition-colors group",
                          idx !== filteredPlayers.length - 1 && "border-b border-border/20 hover:border-border/30"
                        )}
                      >
                        {/* Rank */}
                        <div className="w-10 text-center flex-shrink-0">
                          <span className={cn(
                            "text-sm font-bold",
                            player.rank <= 3 ? "text-electric glow-text text-lg" : "text-foreground"
                          )}>
                            {player.rank}
                          </span>
                        </div>

                        {/* Avatar */}
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mx-3 border shadow-sm",
                          player.rank <= 3 ? "border-electric/50 bg-electric/10" : "bg-primary/10 border-border/30"
                        )}>
                          {player.photo_url ? (
                            <Image src={player.photo_url} alt={player.full_name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <span className={cn(
                              "text-[11px] font-bold",
                              player.rank <= 3 ? "text-electric transition-colors group-hover:text-electric" : "text-primary"
                            )}>
                              {player.first_name.charAt(0)}{player.last_name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-semibold truncate transition-colors",
                              player.rank <= 3 ? "text-foreground" : "text-foreground group-hover:text-electric"
                            )}>
                              {player.full_name}
                            </span>
                            <span className={cn("px-1.5 py-0.5 rounded text-[10px] uppercase flex-shrink-0", getCategoryBadgeClass(player.rating_category.value))}>
                              {player.rating_category.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
                            {player.community && <span>{player.community}</span>}
                            {player.community && player.county && <span><Circle className="h-0.5 w-0.5 fill-current" /></span>}
                            {player.county && <span>{player.county}</span>}
                            {player.country?.code && (
                              <ReactCountryFlag
                                countryCode={player.country.code}
                                svg
                                style={{ width: "1.2em", height: "1.2em", marginLeft: "4px" }}
                                title={player.country.name}
                              />
                            )}
                          </div>
                        </div>

                        {/* Stat Value */}
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className={cn(
                            "font-bold font-mono",
                            player.rank <= 3 ? "text-electric text-lg" : "text-[15px] text-foreground"
                          )}>
                            {getPlayerStatValue(player, playerSortBy).toLocaleString()}
                          </span>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{playerSortOptions.find((s) => s.value === playerSortBy)?.shortLabel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {playersLastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className="p-2 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-muted-foreground px-3">
                      Page {currentPage} of {playersLastPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === playersLastPage}
                      className="p-2 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Countries Content */}
            {activeTab === "countries" && (
              <>
                {countriesError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs mb-4">
                    {countriesError instanceof Error ? countriesError.message : "Failed to load country rankings"}
                    <button className="ml-2 underline" onClick={() => mutateCountries()}>Try again</button>
                  </div>
                )}

                {countriesLoading && !countriesRankingData ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : rankedCountries.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-lg border">
                    <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium text-sm mb-1">No countries found</h3>
                    <p className="text-muted-foreground text-xs">No country data available yet.</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-lg border overflow-hidden">
                    {rankedCountries.map((country, idx) => (
                      <div
                        key={country.country.id}
                        className={cn(
                          "flex items-center px-3 py-2.5 hover:bg-muted/30 transition-colors",
                          idx !== rankedCountries.length - 1 && "border-b border-border/20"
                        )}
                      >
                        {/* Rank */}
                        <div className="w-8 text-center flex-shrink-0">
                          <span className="text-[13px] font-bold">{country.rank}</span>
                        </div>

                        {/* Flag */}
                        <div className="mx-2 flex-shrink-0">
                          <ReactCountryFlag
                            countryCode={country.country.code}
                            svg
                            style={{ width: "1.5em", height: "1.5em" }}
                            title={country.country.name}
                          />
                        </div>

                        {/* Country Info */}
                        <div className="flex-1 min-w-0 ml-3">
                          <span className={cn(
                            "text-sm font-bold",
                            country.rank <= 3 ? "text-foreground group-hover:text-electric transition-colors" : "text-foreground"
                          )}>
                            {country.country.name}
                          </span>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            <Users className="inline-block h-3 w-3 mr-1" />
                            {country.total_players} players
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden sm:flex items-center gap-6 text-[11px] text-muted-foreground mr-6">
                          <div className="text-center font-mono bg-muted/20 px-3 py-1.5 rounded-lg border border-border/10">
                            <div className="font-bold text-sm text-foreground">{country.pro_count}</div>
                            <div className="uppercase tracking-wider text-[9px] mt-0.5">Pros</div>
                          </div>
                          <div className="text-center font-mono bg-muted/20 px-3 py-1.5 rounded-lg border border-border/10">
                            <div className="font-bold text-sm text-foreground">{country.avg_rating}</div>
                            <div className="uppercase tracking-wider text-[9px] mt-0.5">Avg</div>
                          </div>
                          <div className="text-center font-mono bg-muted/20 px-3 py-1.5 rounded-lg border border-border/10">
                            <div className="font-bold text-sm text-foreground">{country.tournaments_won}</div>
                            <div className="uppercase tracking-wider text-[9px] mt-0.5">Titles</div>
                          </div>
                        </div>

                        {/* Top 10 Avg */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-[13px] font-bold text-primary">{country.top_10_avg.toLocaleString()}</span>
                          <div className="text-[10px] text-muted-foreground">Top 10 Avg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function RankingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <RankingsContent />
    </Suspense>
  );
}
