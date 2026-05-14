/**
 * Home page data layer — server-side fetching for the marketing landing page.
 *
 * Why /players/leaderboard (and not /players/rankings):
 *   - /players/rankings silently SWALLOWS `?gender=` and returns the same
 *     mixed roster for both calls (verified live against api.cuesports.africa).
 *   - /players/leaderboard requires a country_id but properly honours the
 *     gender filter and returns RankedPlayer-shaped rows (despite the older
 *     LeaderboardPlayer type in lib/api.ts).
 *   - We anchor to Kenya (country_id=2) because that's where the data lives
 *     today. Override via NEXT_PUBLIC_FEATURED_COUNTRY_ID if needed.
 *
 * Cadences:
 *   - Pulse (live activity): 60s revalidate
 *   - Rankings (slower-moving): 600s revalidate
 *
 * Failures MUST NOT crash the page — every fetch is wrapped and falls back
 * to a safe empty shape.
 */
import { serverFetch } from "@/lib/api-server";
import type {
  MatchesFeedResponse,
  RankedPlayer,
  RankingsResponse,
} from "@/lib/api";

// Kenya = 2 (verified via /api/locations/countries).
const FEATURED_COUNTRY_ID = Number(
  process.env.NEXT_PUBLIC_FEATURED_COUNTRY_ID ?? 2,
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

function composeOrigin(p: RankedPlayer): string {
  const locality = p.county || p.community;
  const country = p.country?.name;
  if (locality && country) return `${locality} · ${country}`;
  return locality || country || "—";
}

// The live API returns a few fields the older TS interface doesn't capture.
type LiveRankedPlayer = RankedPlayer & {
  gender_country_rank?: number;
  country_rank?: number;
};

function mapRankings(resp: RankingsResponse | null): HomeRankingRow[] {
  if (!resp?.data) return [];
  return resp.data.slice(0, 10).map((p, i) => {
    const live = p as LiveRankedPlayer;
    // Prefer gender_country_rank when present (it's the position within the
    // currently-filtered gender bucket). Fall back to overall rank, then index.
    const rank =
      (live.gender_country_rank && live.gender_country_rank > 0
        ? live.gender_country_rank
        : null) ??
      (live.rank && live.rank > 0 ? live.rank : null) ??
      i + 1;
    return {
      rank,
      name: p.full_name || `${p.first_name} ${p.last_name}`.trim(),
      origin: composeOrigin(p),
      points: Math.round(p.rating),
    };
  });
}

export async function getHomeData(): Promise<HomeData> {
  // Fire all three in parallel — no waterfall.
  const [feed, men, women] = await Promise.all([
    serverFetch<MatchesFeedResponse>("/matches/feed", { revalidate: 60 }).catch(
      () => null,
    ),
    serverFetch<RankingsResponse>(
      `/players/leaderboard?country_id=${FEATURED_COUNTRY_ID}&gender=male&per_page=10`,
      { revalidate: 600 },
    ).catch(() => null),
    serverFetch<RankingsResponse>(
      `/players/leaderboard?country_id=${FEATURED_COUNTRY_ID}&gender=female&per_page=10`,
      { revalidate: 600 },
    ).catch(() => null),
  ]);

  return {
    pulse: derivePulse(feed),
    rankingsMen: mapRankings(men),
    rankingsWomen: mapRankings(women),
    rankingsUpdatedAt: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

// TODO(backend): add `venues_active` + `countries_active` to /matches/feed.stats so the
// Pulse band doesn't have to derive them client-side. Also formally expose `gender` on
// the /players/rankings TypeScript client (it works at the API level already).
