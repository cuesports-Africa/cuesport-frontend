import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { serverFetch } from "@/lib/api-server";
import { type Article } from "@/lib/api";
import ArticleClient from "./article-client";

interface ArticleResponse {
  data: Article;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: article } = await serverFetch<ArticleResponse>(
      `/articles/${slug}`
    );

    return {
      title: article.meta?.title || article.title,
      description:
        article.meta?.description || article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: `https://cuesports.africa/news/${slug}`,
        type: "article",
        publishedTime: article.published_at || undefined,
        authors: [article.author],
        ...(article.featured_image_url && {
          images: [{ url: article.featured_image_url }],
        }),
      },
      alternates: {
        canonical: `https://cuesports.africa/news/${slug}`,
      },
    };
  } catch {
    return {
      title: "Article — CueSports Africa",
      description: "Read the latest news from CueSports Africa.",
    };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article: Article | null = null;
  try {
    const res = await serverFetch<ArticleResponse>(`/articles/${slug}`);
    article = res.data;
  } catch {
    // Article will be fetched client-side as fallback
  }

  return (
    <>
      {article && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: article.title,
              description: article.excerpt,
              author: {
                "@type": "Person",
                name: article.author,
              },
              publisher: {
                "@type": "Organization",
                name: "CueSports Africa",
                url: "https://cuesports.africa",
              },
              datePublished: article.published_at,
              dateModified: article.updated_at,
              url: `https://cuesports.africa/news/${slug}`,
              ...(article.featured_image_url && {
                image: article.featured_image_url,
              }),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://cuesports.africa/news/${slug}`,
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
                  name: "News",
                  item: "https://cuesports.africa/news",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: article.title,
                  item: `https://cuesports.africa/news/${slug}`,
                },
              ],
            }}
          />
        </>
      )}
      <ArticleClient params={params} />
    </>
  );
}
