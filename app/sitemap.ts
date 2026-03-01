import { MetadataRoute } from "next";

const BASE_URL = "https://cuesports.africa";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/customers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/investors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Tournaments
    {
      url: `${BASE_URL}/tournaments`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tournaments/upcoming`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tournaments/live`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tournaments/results`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Rankings
    {
      url: `${BASE_URL}/rankings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/rankings/national`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/rankings/regional`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/rankings/rating-system`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Players
    {
      url: `${BASE_URL}/players`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // News
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // About
    {
      url: `${BASE_URL}/about/mission`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Legal
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // TODO: Fetch dynamic pages from API when available
  // const tournaments = await fetchTournaments();
  // const players = await fetchPlayers();
  // const dynamicPages = [
  //   ...tournaments.map(t => ({
  //     url: `${BASE_URL}/tournaments/${t.slug}`,
  //     lastModified: new Date(t.updated_at),
  //     changeFrequency: 'daily' as const,
  //     priority: 0.7,
  //   })),
  //   ...players.map(p => ({
  //     url: `${BASE_URL}/players/${p.slug}`,
  //     lastModified: new Date(p.updated_at),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   })),
  // ];

  return [...staticPages];
}
