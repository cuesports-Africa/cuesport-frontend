"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import ReactCountryFlag from "react-country-flag";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  playerApi,
  locationApi,
  countryApi,
  RankedPlayer,
  RankingsResponse,
  RankingsParams,
  CountryRankingsResponse,
  LeaderboardPlayer,
  LeaderboardResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type Tab = "players" | "countries";
type Gender = "male" | "female";
type PlayerSortMetric = "rating" | "wins" | "tournaments_won" | "total_matches";

const sortOptions: { value: PlayerSortMetric; label: string; short: string }[] = [
  { value: "rating", label: "Rating", short: "Rating" },
  { value: "wins", label: "Wins", short: "Wins" },
  { value: "tournaments_won", label: "Tournaments won", short: "Titles" },
  { value: "total_matches", label: "Total matches", short: "Matches" },
];

const categoryOptions = [
  { value: "all", label: "All categories" },
  { value: "pro", label: "Pro (2000+)" },
  { value: "advanced", label: "Advanced (1600–1999)" },
  { value: "intermediate", label: "Intermediate (1200–1599)" },
  { value: "beginner", label: "Beginner (<1200)" },
];

function getStatValue(p: RankedPlayer, sortBy: PlayerSortMetric): number {
  switch (sortBy) {
    case "rating":
      return p.rating;
    case "wins":
      return p.wins;
    case "tournaments_won":
      return p.tournaments_won;
    case "total_matches":
      return p.total_matches;
  }
}

const labelClass =
  "block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2";

const filterButtonClass =
  "w-full text-left px-3 py-2 rounded-md text-[13.5px] transition-colors";

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Tab + filter state (URL-synced) ──
  const [tab, setTab] = useState<Tab>(
    (searchParams.get("tab") as Tab) || "players",
  );
  const [sortBy, setSortBy] = useState<PlayerSortMetric>(
    (searchParams.get("sort_by") as PlayerSortMetric) || "rating",
  );
  const [countryId, setCountryId] = useState<number | undefined>(
    searchParams.get("country_id")
      ? parseInt(searchParams.get("country_id")!)
      : undefined,
  );
  const [regionId, setRegionId] = useState<number | undefined>(
    searchParams.get("region_id")
      ? parseInt(searchParams.get("region_id")!)
      : undefined,
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
  );
  const [gender, setGender] = useState<Gender>(
    (searchParams.get("gender") as Gender) || "male",
  );
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // ── Leaderboard cursor state ──
  const [lbPlayers, setLbPlayers] = useState<LeaderboardPlayer[]>([]);
  const [lbCursor, setLbCursor] = useState<number | null>(null);
  const [lbHasMore, setLbHasMore] = useState(false);
  const [lbLoadingMore, setLbLoadingMore] = useState(false);

  const useLeaderboard = tab === "players" && !!countryId;

  // ── Countries (for filter dropdown + chip row) ──
  const { data: countriesData } = useSWR("countries", () =>
    locationApi.countries(),
  );
  const countries = countriesData?.countries || [];

  const { data: regionsData } = useSWR(
    countryId ? `regions-${countryId}` : null,
    () => (countryId ? locationApi.children(countryId) : null),
  );
  const regions = regionsData?.children || [];

  // ── Player rankings (used when no country filter) ──
  const playerParams: RankingsParams = {
    sort_by: sortBy,
    page,
    per_page: 25,
  };
  if (countryId) playerParams.country_id = countryId;
  if (regionId) playerParams.region_id = regionId;
  if (category && category !== "all") playerParams.category = category;

  const {
    data: playersData,
    error: playersError,
    isLoading: playersLoading,
    mutate: mutatePlayers,
  } = useSWR<RankingsResponse>(
    tab === "players" && !useLeaderboard
      ? `rankings-${JSON.stringify(playerParams)}`
      : null,
    () => playerApi.rankings(playerParams),
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  // ── Leaderboard (used when a country is selected) ──
  const {
    data: leaderboardData,
    error: leaderboardError,
    isLoading: leaderboardLoading,
    mutate: mutateLeaderboard,
  } = useSWR<LeaderboardResponse>(
    useLeaderboard ? `leaderboard-${countryId}-${gender}` : null,
    () => playerApi.leaderboard({ country_id: countryId!, gender, per_page: 25 }),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setLbPlayers(data.data);
        setLbCursor(data.meta.next_cursor);
        setLbHasMore(data.meta.has_more);
      },
    },
  );

  // ── Countries ranking ──
  const {
    data: countriesRankingData,
    error: countriesError,
    isLoading: countriesLoading,
    mutate: mutateCountries,
  } = useSWR<CountryRankingsResponse>(
    tab === "countries" ? "country-rankings" : null,
    () => countryApi.rankings(),
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const players = playersData?.data || [];
  const playersMeta = playersData?.meta;
  const playersTotal = playersMeta?.total || 0;
  const playersLastPage = playersMeta?.last_page || 1;
  const rankedCountries = countriesRankingData?.data || [];

  // ── Load more on leaderboard cursor ──
  async function handleLoadMore() {
    if (!countryId || !lbCursor || lbLoadingMore) return;
    setLbLoadingMore(true);
    try {
      const data = await playerApi.leaderboard({
        country_id: countryId,
        gender,
        per_page: 25,
        after: lbCursor,
      });
      setLbPlayers((prev) => [...prev, ...data.data]);
      setLbCursor(data.meta.next_cursor);
      setLbHasMore(data.meta.has_more);
    } catch {
      // silent — user can retry by tapping again
    } finally {
      setLbLoadingMore(false);
    }
  }

  // ── Reset leaderboard cursor when country/gender changes ──
  useEffect(() => {
    setLbPlayers([]);
    setLbCursor(null);
    setLbHasMore(false);
  }, [gender, countryId]);

  // ── URL state sync ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (tab !== "players") params.set("tab", tab);
    if (tab === "players") {
      if (sortBy !== "rating") params.set("sort_by", sortBy);
      if (countryId) params.set("country_id", String(countryId));
      if (regionId) params.set("region_id", String(regionId));
      if (category !== "all") params.set("category", category);
      if (page > 1) params.set("page", String(page));
      if (countryId && gender !== "male") params.set("gender", gender);
    }
    const qs = params.toString();
    router.replace(qs ? `/rankings?${qs}` : "/rankings", { scroll: false });
  }, [tab, sortBy, countryId, regionId, category, page, gender, router]);

  // ── Drop region when country clears ──
  useEffect(() => {
    if (!countryId) setRegionId(undefined);
  }, [countryId]);

  function resetFilters() {
    setSortBy("rating");
    setCountryId(undefined);
    setRegionId(undefined);
    setCategory("all");
    setPage(1);
    setGender("male");
  }

  const hasActiveFilters =
    sortBy !== "rating" ||
    countryId !== undefined ||
    regionId !== undefined ||
    category !== "all";
  const activeFilterCount = [
    sortBy !== "rating",
    countryId !== undefined,
    regionId !== undefined,
    category !== "all",
  ].filter(Boolean).length;

  // ── Top 5 countries by player count (for the mobile chip row) ──
  const topCountries = rankedCountries.slice(0, 5).map((rc) => rc.country);
  const popularCountryChips =
    topCountries.length > 0
      ? topCountries
      : countries
          .filter((c) => [2, 15, 27, 83, 84].includes(c.id))
          .slice(0, 5);

  // ── Search filter (client-side, current page only) ──
  function filterByQuery<T extends { full_name?: string; nickname?: string | null; name?: string }>(
    rows: T[],
  ): T[] {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        (r.full_name || "").toLowerCase().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.nickname || "").toLowerCase().includes(q),
    );
  }

  const filteredPlayers = filterByQuery(players);
  const filteredLbPlayers = filterByQuery(lbPlayers);

  // ─────────────────────────────────────────────────────────
  // Shared filter panel (used by sidebar AND mobile sheet)
  // ─────────────────────────────────────────────────────────
  function FilterPanel({ inSheet = false }: { inSheet?: boolean }) {
    return (
      <div className={cn("space-y-6", inSheet && "pb-6")}>
        <div>
          <p className={labelClass}>Sort by</p>
          <div className="space-y-1">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSortBy(opt.value);
                  setPage(1);
                }}
                className={cn(
                  filterButtonClass,
                  sortBy === opt.value
                    ? "bg-ink text-white"
                    : "text-ink/80 hover:bg-bone",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClass}>Country</p>
          <select
            value={countryId ? String(countryId) : "all"}
            onChange={(e) => {
              setCountryId(
                e.target.value === "all"
                  ? undefined
                  : parseInt(e.target.value),
              );
              setRegionId(undefined);
              setPage(1);
            }}
            className="h-11 w-full rounded-md border border-rule bg-canvas px-3 text-[14.5px] text-ink transition-colors focus:border-ink focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--gold)]"
          >
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag ? `${c.flag} ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </div>

        {countryId && regions.length > 0 && (
          <div>
            <p className={labelClass}>Region</p>
            <select
              value={regionId ? String(regionId) : "all"}
              onChange={(e) => {
                setRegionId(
                  e.target.value === "all"
                    ? undefined
                    : parseInt(e.target.value),
                );
                setPage(1);
              }}
              className="h-11 w-full rounded-md border border-rule bg-canvas px-3 text-[14.5px] text-ink transition-colors focus:border-ink focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--gold)]"
            >
              <option value="all">All regions</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <p className={labelClass}>Category</p>
          <div className="space-y-1">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setCategory(opt.value);
                  setPage(1);
                }}
                className={cn(
                  filterButtonClass,
                  category === opt.value
                    ? "bg-ink text-white"
                    : "text-ink/80 hover:bg-bone",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              resetFilters();
              if (inSheet) setSheetOpen(false);
            }}
            className="w-full font-mono text-[10px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
          >
            Reset filters
          </button>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <article className="bg-canvas">
      {/* ─── Tabs ─── */}
      <div className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-8 lg:px-12 lg:pt-10">
          <div role="tablist" aria-label="Rankings tabs" className="flex gap-8">
            {[
              { id: "players", label: "Players" },
              { id: "countries", label: "Countries" },
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setTab(t.id as Tab);
                    setPage(1);
                  }}
                  className={cn(
                    "relative py-5 font-mono text-[12px] uppercase tracking-[0.22em] outline-none transition-colors",
                    active
                      ? "text-ink"
                      : "text-mute-2 hover:text-ink/70",
                  )}
                >
                  {t.label}
                  {active && (
                    <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-gold" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Players tab content ─── */}
      {tab === "players" && (
        <div>
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
              {/* Sidebar (desktop only) */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <FilterPanel />
                </div>
              </aside>

              <main className="min-w-0">
                {/* Mobile + tablet toolbar: search, filter sheet button, country chip row */}
                <div className="lg:hidden">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute-2" />
                      <input
                        type="search"
                        placeholder="Search players…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-11 w-full rounded-md border border-rule bg-canvas pl-10 pr-3 text-[14.5px] text-ink transition-colors placeholder:text-mute-2 focus:border-ink focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--gold)]"
                      />
                    </div>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                      <SheetTrigger asChild>
                        <button
                          aria-label="Open filters"
                          className="relative inline-flex h-11 items-center gap-2 rounded-md border border-rule bg-canvas px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone"
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                          Filters
                          {activeFilterCount > 0 && (
                            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[10px] font-bold text-white tabular-nums">
                              {activeFilterCount}
                            </span>
                          )}
                        </button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="bg-canvas">
                        <SheetHeader className="pb-2">
                          <SheetTitle className="text-[18px] font-bold tracking-[-0.01em] text-ink">
                            Filter rankings
                          </SheetTitle>
                        </SheetHeader>
                        <div className="px-4 pb-6">
                          <FilterPanel inSheet />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Quick country chips */}
                  <div className="mt-4 -mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
                    <div className="flex w-max items-center gap-2">
                      <button
                        onClick={() => {
                          setCountryId(undefined);
                          setRegionId(undefined);
                          setPage(1);
                        }}
                        className={cn(
                          "inline-flex h-8 items-center rounded-full border px-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                          countryId === undefined
                            ? "border-ink bg-ink text-white"
                            : "border-rule bg-canvas text-ink/75 hover:bg-bone",
                        )}
                      >
                        All
                      </button>
                      {popularCountryChips.map((c) => {
                        const active = countryId === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCountryId(c.id);
                              setRegionId(undefined);
                              setPage(1);
                            }}
                            className={cn(
                              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                              active
                                ? "border-ink bg-ink text-white"
                                : "border-rule bg-canvas text-ink/75 hover:bg-bone",
                            )}
                          >
                            {c.code && (
                              <ReactCountryFlag
                                countryCode={c.code}
                                svg
                                style={{ width: "0.9em", height: "0.9em" }}
                              />
                            )}
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Desktop search */}
                <div className="hidden lg:block">
                  <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute-2" />
                    <input
                      type="search"
                      placeholder="Search players by name or nickname…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="h-11 w-full rounded-md border border-rule bg-canvas pl-10 pr-3 text-[14.5px] text-ink transition-colors placeholder:text-mute-2 focus:border-ink focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--gold)]"
                    />
                  </div>
                </div>

                {/* Gender toggle (only when a country is selected) */}
                {useLeaderboard && (
                  <div className="mt-6 inline-flex items-center gap-6 border-b border-rule">
                    {(["male", "female"] as const).map((g) => {
                      const active = gender === g;
                      return (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={cn(
                            "relative pb-3 font-mono text-[11px] uppercase tracking-[0.22em] outline-none transition-colors",
                            active ? "text-ink" : "text-mute-2 hover:text-ink/70",
                          )}
                        >
                          {g === "male" ? "Men" : "Women"}
                          {active && (
                            <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Count strip */}
                <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-mute tabular-nums">
                  <span>
                    {useLeaderboard
                      ? `${filteredLbPlayers.length}${lbHasMore ? "+" : ""} players`
                      : `${playersTotal.toLocaleString()} players`}
                  </span>
                  <span className="hidden sm:inline">
                    Sorted by {sortOptions.find((s) => s.value === sortBy)?.short}
                  </span>
                </div>

                {/* ── Players list ── */}
                <div className="mt-4">
                  {useLeaderboard ? (
                    <PlayersListLeaderboard
                      players={filteredLbPlayers}
                      loading={leaderboardLoading && lbPlayers.length === 0}
                      error={leaderboardError}
                      onRetry={() => mutateLeaderboard()}
                      hasMore={lbHasMore}
                      loadingMore={lbLoadingMore}
                      onLoadMore={handleLoadMore}
                      gender={gender}
                    />
                  ) : (
                    <PlayersListRankings
                      players={filteredPlayers}
                      sortBy={sortBy}
                      loading={playersLoading && !playersData}
                      error={playersError}
                      onRetry={() => mutatePlayers()}
                      page={page}
                      lastPage={playersLastPage}
                      onPage={setPage}
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

      {/* ─── Countries tab content ─── */}
      {tab === "countries" && (
        <div>
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute tabular-nums">
              {rankedCountries.length} countries
            </div>

            <div className="mt-4">
              <CountriesList
                rows={rankedCountries}
                loading={countriesLoading && !countriesRankingData}
                error={countriesError}
                onRetry={() => mutateCountries()}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Back link ─── */}
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
        >
          ← Back to home
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
// Player list — Rankings endpoint (paginated, "all countries")
// ─────────────────────────────────────────────────────────
function PlayersListRankings({
  players,
  sortBy,
  loading,
  error,
  onRetry,
  page,
  lastPage,
  onPage,
}: {
  players: RankedPlayer[];
  sortBy: PlayerSortMetric;
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  page: number;
  lastPage: number;
  onPage: (p: number) => void;
}) {
  if (loading) return <SkeletonList />;

  if (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Failed to load rankings"
        }
        onRetry={onRetry}
      />
    );
  }

  if (players.length === 0) return <EmptyState />;

  const featured = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <>
      {featured.length > 0 && (
        <div className="divide-y divide-rule border-y border-rule">
          {featured.map((p) => (
            <PlayerRowFeatured
              key={p.id}
              rank={p.rank}
              name={p.full_name}
              firstName={p.first_name}
              lastName={p.last_name}
              photoUrl={p.photo_url}
              location={[p.community, p.county].filter(Boolean).join(" · ")}
              countryCode={p.country?.code}
              countryName={p.country?.name}
              category={p.rating_category.label}
              statValue={getStatValue(p, sortBy)}
              statLabel={sortOptions.find((s) => s.value === sortBy)?.short || ""}
              href={`/players/${p.id}`}
            />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="divide-y divide-rule border-b border-rule">
          {rest.map((p) => (
            <PlayerRowCompact
              key={p.id}
              rank={p.rank}
              name={p.full_name}
              firstName={p.first_name}
              lastName={p.last_name}
              photoUrl={p.photo_url}
              location={[p.community, p.county].filter(Boolean).join(" · ")}
              countryCode={p.country?.code}
              countryName={p.country?.name}
              statValue={getStatValue(p, sortBy)}
              statLabel={sortOptions.find((s) => s.value === sortBy)?.short || ""}
              href={`/players/${p.id}`}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-rule bg-canvas text-ink transition-colors hover:bg-bone disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute tabular-nums">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={() => onPage(page + 1)}
            disabled={page === lastPage}
            aria-label="Next page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-rule bg-canvas text-ink transition-colors hover:bg-bone disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Player list — Leaderboard endpoint (country selected, cursor)
// ─────────────────────────────────────────────────────────
function PlayersListLeaderboard({
  players,
  loading,
  error,
  onRetry,
  hasMore,
  loadingMore,
  onLoadMore,
  gender,
}: {
  players: LeaderboardPlayer[];
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  gender: Gender;
}) {
  if (loading) return <SkeletonList />;

  if (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Failed to load leaderboard"
        }
        onRetry={onRetry}
      />
    );
  }

  if (players.length === 0) {
    return (
      <EmptyState
        message={`No ${gender === "female" ? "women" : "men"} players match this view.`}
      />
    );
  }

  const featured = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <>
      {featured.length > 0 && (
        <div className="divide-y divide-rule border-y border-rule">
          {featured.map((p) => (
            <PlayerRowFeatured
              key={p.id}
              rank={p.country_rank}
              name={p.name || p.nickname || "Unknown player"}
              photoUrl={p.photo_url}
              location={p.location || ""}
              countryCode={p.country?.code}
              countryName={p.country?.name}
              category={
                typeof p.rating_category === "object"
                  ? p.rating_category.label
                  : p.rating_category
              }
              statValue={p.rating}
              statLabel="Rating"
              href={`/players/${p.id}`}
            />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="divide-y divide-rule border-b border-rule">
          {rest.map((p) => (
            <PlayerRowCompact
              key={p.id}
              rank={p.country_rank}
              name={p.name || p.nickname || "Unknown player"}
              photoUrl={p.photo_url}
              location={p.location || ""}
              countryCode={p.country?.code}
              countryName={p.country?.name}
              statValue={p.rating}
              statLabel="Rating"
              href={`/players/${p.id}`}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex h-11 items-center gap-2 rounded-pill border border-rule bg-canvas px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone disabled:opacity-60"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Player row — Featured (top 3)
// ─────────────────────────────────────────────────────────
function PlayerRowFeatured({
  rank,
  name,
  firstName,
  lastName,
  photoUrl,
  location,
  countryCode,
  countryName,
  category,
  statValue,
  statLabel,
  href,
}: {
  rank: number;
  name: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string | null;
  location: string;
  countryCode?: string | null;
  countryName?: string | null;
  category?: string;
  statValue: number;
  statLabel: string;
  href: string;
}) {
  const initials =
    firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`
      : name
          .split(" ")
          .map((n) => n.charAt(0))
          .slice(0, 2)
          .join("");

  return (
    <Link
      href={href}
      className="group grid grid-cols-[3.25rem_3rem_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-bone/60 sm:grid-cols-[4rem_3.5rem_1fr_auto] sm:gap-5 sm:py-7 lg:py-8"
    >
      <span className="font-mono text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-none tabular-nums text-gold">
        {rank.toString().padStart(2, "0")}
      </span>

      <div className="h-12 w-12 overflow-hidden rounded-full border border-rule bg-bone sm:h-14 sm:w-14">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[12px] font-bold tracking-wide text-mute">
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[clamp(1.05rem,1.8vw,1.4rem)] font-bold leading-tight tracking-[-0.01em] text-ink group-hover:text-navy">
            {name}
          </h3>
          {countryCode && (
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{ width: "1em", height: "1em" }}
              title={countryName || ""}
              aria-label={countryName || ""}
            />
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
          {location && <span className="truncate">{location}</span>}
          {category && (
            <>
              {location && <span aria-hidden>·</span>}
              <span className="shrink-0">{category}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-right">
        <div className="text-[clamp(1.15rem,1.8vw,1.5rem)] font-bold tabular-nums tracking-[-0.01em] text-ink">
          {statValue.toLocaleString()}
        </div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-mute-2">
          {statLabel}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────
// Player row — Compact (4+)
// ─────────────────────────────────────────────────────────
function PlayerRowCompact({
  rank,
  name,
  firstName,
  lastName,
  photoUrl,
  location,
  countryCode,
  countryName,
  statValue,
  statLabel,
  href,
}: {
  rank: number;
  name: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string | null;
  location: string;
  countryCode?: string | null;
  countryName?: string | null;
  statValue: number;
  statLabel: string;
  href: string;
}) {
  const initials =
    firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`
      : name
          .split(" ")
          .map((n) => n.charAt(0))
          .slice(0, 2)
          .join("");

  return (
    <Link
      href={href}
      className="group grid grid-cols-[2.5rem_2.25rem_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-bone/60 sm:grid-cols-[3rem_2.5rem_1fr_auto] sm:gap-4 sm:py-4"
    >
      <span className="font-mono text-[13px] font-bold tabular-nums text-mute-2 sm:text-[14px]">
        {rank.toString().padStart(2, "0")}
      </span>

      <div className="h-9 w-9 overflow-hidden rounded-full border border-rule bg-bone sm:h-10 sm:w-10">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-wide text-mute">
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[14px] font-semibold leading-tight text-ink group-hover:text-navy sm:text-[15px]">
            {name}
          </h3>
          {countryCode && (
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{ width: "0.85em", height: "0.85em" }}
              title={countryName || ""}
              aria-label={countryName || ""}
            />
          )}
        </div>
        {location && (
          <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2">
            {location}
          </p>
        )}
      </div>

      <div className="text-right">
        <span className="font-mono text-[13.5px] font-semibold tabular-nums text-ink sm:text-[14.5px]">
          {statValue.toLocaleString()}
        </span>
        <span className="sr-only"> {statLabel}</span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────
// Countries list (table)
// ─────────────────────────────────────────────────────────
function CountriesList({
  rows,
  loading,
  error,
  onRetry,
}: {
  rows: CountryRankingsResponse["data"];
  loading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  if (loading) return <SkeletonList />;
  if (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Failed to load country rankings"
        }
        onRetry={onRetry}
      />
    );
  }
  if (rows.length === 0)
    return <EmptyState message="No country data available yet." />;

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {rows.map((row) => {
        const featured = row.rank <= 3;
        return (
          <div
            key={row.country.id}
            className={cn(
              "grid grid-cols-[2.5rem_2rem_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[3.5rem_2.5rem_1fr_auto] sm:gap-5",
              featured && "sm:py-6",
            )}
          >
            <span
              className={cn(
                "font-mono tabular-nums",
                featured
                  ? "text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold text-gold leading-none"
                  : "text-[14px] font-bold text-mute-2",
              )}
            >
              {row.rank.toString().padStart(2, "0")}
            </span>

            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-sm sm:h-9 sm:w-9">
              <ReactCountryFlag
                countryCode={row.country.code}
                svg
                style={{ width: "100%", height: "100%" }}
                title={row.country.name}
              />
            </div>

            <div className="min-w-0">
              <h3
                className={cn(
                  "truncate font-bold text-ink",
                  featured
                    ? "text-[clamp(1.05rem,1.7vw,1.35rem)] leading-tight"
                    : "text-[15px]",
                )}
              >
                {row.country.name}
              </h3>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2 tabular-nums">
                {row.total_players} players
                <span aria-hidden> · </span>
                {row.pro_count} pro
                <span aria-hidden> · </span>
                {row.tournaments_won} titles
              </p>
            </div>

            <div className="text-right">
              <div
                className={cn(
                  "font-bold tabular-nums text-ink",
                  featured ? "text-[clamp(1.15rem,1.8vw,1.4rem)]" : "text-[14.5px]",
                )}
              >
                {row.top_10_avg.toLocaleString()}
              </div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-mute-2">
                Top 10 avg
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// States: skeleton / empty / error
// ─────────────────────────────────────────────────────────
function SkeletonList() {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[2.5rem_2.25rem_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[3rem_2.5rem_1fr_auto] sm:gap-4"
        >
          <div className="h-5 w-8 rounded bg-bone animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-bone animate-pulse sm:h-10 sm:w-10" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-bone animate-pulse" />
            <div className="h-2.5 w-24 rounded bg-bone animate-pulse" />
          </div>
          <div className="h-4 w-12 rounded bg-bone animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="border-y border-rule py-20 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
        Rankings warming up
      </p>
      <p className="mx-auto mt-4 max-w-[44ch] text-[14px] leading-relaxed text-mute">
        {message ||
          "The full table appears here once enough matches are played for this group."}
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="border-y border-rule py-16 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-destructive">
        Something went wrong
      </p>
      <p className="mx-auto mt-4 max-w-[44ch] text-[14px] leading-relaxed text-mute">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
      >
        Try again
        <X className="h-3 w-3 rotate-45" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function RankingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink/50" />
        </div>
      }
    >
      <RankingsContent />
    </Suspense>
  );
}
