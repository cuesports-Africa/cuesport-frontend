/**
 * Home page data layer — server-side fetching for the marketing landing page.
 *
 * Rankings: uses /players/africa-top (continental, gender-filterable).
 *   - The endpoint returns players ranked across the entire continent within
 *     the given gender filter; the `rank` field on each row is that continental
 *     gender-filtered position, which is exactly what we display.
 *   - Server-side cached on Railway (Redis hot), with our own 600s ISR layer
 *     on top — Vercel only re-fetches every 10 minutes.
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

function mapRankings(resp: RankingsResponse | null): HomeRankingRow[] {
  if (!resp?.data) return [];
  return resp.data.slice(0, 10).map((p, i) => {
    // /players/africa-top sets `rank` to the continental position within
    // the gender filter — display it directly. Fallback to index only as a
    // defensive guard against an unexpected payload shape.
    const rank = p.rank && p.rank > 0 ? p.rank : i + 1;
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
      `/players/africa-top?gender=male&limit=10`,
      { revalidate: 600 },
    ).catch(() => null),
    serverFetch<RankingsResponse>(
      `/players/africa-top?gender=female&limit=10`,
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
// Pulse band doesn't have to derive them client-side.
