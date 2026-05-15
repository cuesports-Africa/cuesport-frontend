import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { serverFetch } from "@/lib/api-server";
import type { Article, ArticlesResponse } from "@/lib/api";
import NewsClient from "./news-client";

export const revalidate = 300; // 5 min — articles change slowly

export const metadata: Metadata = {
  title: "The Magazine · CueSports Africa",
  description:
    "Stories from African cue sports — match reports, player profiles, analysis, and the halls behind the names.",
  keywords: [
    "cuesports africa magazine",
    "african pool news",
    "pool player stories africa",
    "pool match reports kenya",
    "cuesports africa editorial",
    "african pool tournament",
    "cuesports magazine",
    "pool stories africa",
    "8 ball pool africa",
    "pool player profiles",
  ],
  openGraph: {
    title: "The Magazine · CueSports Africa",
    description:
      "Stories from African cue sports — match reports, player profiles, analysis, and the halls behind the names.",
    url: "https://cuesports.africa/news",
    type: "website",
  },
  alternates: {
    canonical: "https://cuesports.africa/news",
  },
};

async function getNewsData() {
  const [list, featured] = await Promise.all([
    serverFetch<ArticlesResponse>("/articles?per_page=24", {
      revalidate: 300,
    }).catch(() => null),
    serverFetch<{ data: Article | null }>("/articles/featured", {
      revalidate: 300,
    }).catch(() => null),
  ]);

  return {
    articles: list?.data ?? [],
    categories: list?.categories ?? [],
    featured: featured?.data ?? null,
  };
}

export default async function NewsPage() {
  const { articles, categories, featured } = await getNewsData();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "CueSports Africa Magazine",
          description:
            "Stories from African cue sports — match reports, player profiles, analysis.",
          url: "https://cuesports.africa/news",
          publisher: {
            "@type": "Organization",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://cuesports.africa",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Magazine",
              item: "https://cuesports.africa/news",
            },
          ],
        }}
      />
      <NewsClient
        articles={articles}
        categories={categories}
        featured={featured}
      />
    </>
  );
}
