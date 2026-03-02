import { MetadataRoute } from "next";
import { serverFetch } from "@/lib/api-server";

const BASE_URL = "https://cuesports.africa";

interface SitemapArticle {
  slug: string;
  updated_at: string;
}

interface SitemapPlayer {
  id: number;
  updated_at?: string;
}

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

  // Dynamic pages — fetch from API (gracefully degrade on failure)
  let articlePages: MetadataRoute.Sitemap = [];
  let playerPages: MetadataRoute.Sitemap = [];

  try {
    const articlesRes = await serverFetch<{
      data: SitemapArticle[];
    }>("/articles?per_page=100", { revalidate: 3600 });

    articlePages = articlesRes.data.map((article) => ({
      url: `${BASE_URL}/news/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // API unavailable — skip dynamic articles
  }

  try {
    const playersRes = await serverFetch<{
      data: SitemapPlayer[];
    }>("/players/rankings?per_page=200", { revalidate: 3600 });

    playerPages = playersRes.data.map((player) => ({
      url: `${BASE_URL}/players/${player.id}`,
      lastModified: player.updated_at
        ? new Date(player.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // API unavailable — skip dynamic players
  }

  return [...staticPages, ...articlePages, ...playerPages];
}
