/**
 * Home page data layer — server-side fetching for the marketing landing page.
 *
 * Uses `serverFetch` so the homepage stays a Server Component:
 *   - data is in initial HTML (great LCP, SEO-friendly)
 *   - Next.js handles caching via ISR (`next: { revalidate }`)
 *   - failures here MUST NOT crash the page — every fetch is wrapped and falls
 *     back to a safe empty shape.
 *
 * Cadences:
 *   - Pulse (live activity): 60s revalidate
 *   - Rankings (slower-moving): 600s revalidate
 */
import { serverFetch } from "@/lib/api-server";
import type {
  LeaderboardResponse,
  MatchesFeedResponse,
} from "@/lib/api";

// The "featured" country whose leaderboard we surface on the home page.
// Gender-split rankings only exist at country scope today — see TODO at file end.
const FEATURED_COUNTRY_ID = Number(
  process.env.NEXT_PUBLIC_FEATURED_COUNTRY_ID ?? 1,
);

export type HomePulse = {
  matchesLive: number;
  venues: number;
  countries: number;
};

export type HomeRankingRow = {
  rank: number;
  name: string;
  origin: string;
  points: number;
};

export type HomeData = {
  pulse: HomePulse;
  rankingsMen: HomeRankingRow[];
  rankingsWomen: HomeRankingRow[];
  rankingsUpdatedAt: string;
};

const EMPTY_PULSE: HomePulse = { matchesLive: 0, venues: 0, countries: 0 };

function uniqueCount<T>(items: T[], key: (item: T) => string | null | undefined): number {
  const set = new Set<string>();
  for (const item of items) {
    const value = key(item);
    if (value) set.add(value.trim().toLowerCase());
  }
  return set.size;
}

/** Derive aggregates from the matches feed until the backend exposes them directly. */
function derivePulse(feed: MatchesFeedResponse | null): HomePulse {
  if (!feed) return EMPTY_PULSE;
  const tournaments = feed.tournaments ?? [];
  return {
    matchesLive: feed.stats?.live ?? 0,
    venues: uniqueCount(tournaments, (t) => t.venue?.name),
    // No country field on FeedTournament.venue yet — fall back to address tail when available.
    // Best-effort until backend returns country code per tournament. Never fabricate.
    countries: uniqueCount(tournaments, (t) => t.venue?.address?.split(",").pop() ?? null),
  };
}

function mapLeaderboard(resp: LeaderboardResponse | null): HomeRankingRow[] {
  if (!resp?.data) return [];
  return resp.data.slice(0, 10).map((p, i) => ({
    // country_rank can be 0/undefined for very small datasets — fall back to array index.
    rank: p.country_rank && p.country_rank > 0 ? p.country_rank : i + 1,
    name: p.name,
    origin: p.location ?? p.country?.name ?? "—",
    points: Math.round(p.rating),
  }));
}

export async function getHomeData(): Promise<HomeData> {
  // Fire all three in parallel — no waterfall.
  const [feed, men, women] = await Promise.all([
    serverFetch<MatchesFeedResponse>("/matches/feed", { revalidate: 60 }).catch(
      () => null,
    ),
    serverFetch<LeaderboardResponse>(
      `/players/leaderboard?country_id=${FEATURED_COUNTRY_ID}&gender=male&per_page=10`,
      { revalidate: 600 },
    ).catch(() => null),
    serverFetch<LeaderboardResponse>(
      `/players/leaderboard?country_id=${FEATURED_COUNTRY_ID}&gender=female&per_page=10`,
      { revalidate: 600 },
    ).catch(() => null),
  ]);

  return {
    pulse: derivePulse(feed),
    rankingsMen: mapLeaderboard(men),
    rankingsWomen: mapLeaderboard(women),
    rankingsUpdatedAt: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

// TODO(backend): add `gender` param to `/players/rankings` so the homepage can show a
// truly continental Top 10 by gender. Also add `venues_active` + `countries_active`
// to `/matches/feed.stats` so the Pulse band doesn't have to derive them client-side.
