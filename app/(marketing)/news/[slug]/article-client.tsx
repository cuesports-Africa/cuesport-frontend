"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Clock, User, Calendar, ArrowLeft, Share2, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articleApi, type Article } from "@/lib/api";

function CategoryBadge({ category }: { category: Article["category"] }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-yellow-500/10 text-yellow-600",
    green: "bg-green-500/10 text-green-600",
    purple: "bg-purple-500/10 text-purple-600",
    blue: "bg-blue-500/10 text-blue-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[category.color] || "bg-muted text-muted-foreground"}`}>
      {category.label}
    </span>
  );
}

function ArticleContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-muted rounded w-1/4" />
      <div className="h-12 bg-muted rounded w-3/4" />
      <div className="flex gap-4">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-4 bg-muted rounded w-24" />
      </div>
      <div className="aspect-video bg-muted rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-muted rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ArticleClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  // Fetch article
  const { data: articleData, error, isLoading } = useSWR(
    slug ? `article-${slug}` : null,
    () => articleApi.get(slug),
    { revalidateOnFocus: false }
  );

  // Fetch related articles
  const { data: relatedData } = useSWR(
    slug ? `related-${slug}` : null,
    () => articleApi.related(slug, 4),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  // Fetch trending for sidebar
  const { data: trendingData } = useSWR(
    "trending-articles",
    () => articleApi.trending(5),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const article = articleData?.data;
  const relatedArticles = relatedData?.data || [];
  const trendingArticles = trendingData?.data || [];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/news" className="hover:text-primary">News</Link>
            {article && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/news?category=${article.category.value}`} className="hover:text-primary">
                  {article.category.label}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {isLoading ? (
              <ArticleContentSkeleton />
            ) : article ? (
              <>
                {/* Header */}
                <header className="mb-8">
                  <CategoryBadge category={article.category} />
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                    {article.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {article.formatted_date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {article.read_time}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </header>

                {/* Featured Image */}
                {article.featured_image_url && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                    prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />

                {/* Share Footer */}
                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Share this article</p>
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Article
                      </Button>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/news">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to News
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/news/${related.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      {related.featured_image_url ? (
                        <img
                          src={related.featured_image_url}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover bg-muted shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {related.formatted_date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            {trendingArticles.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <h3 className="font-semibold text-lg">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {trendingArticles.slice(0, 4).map((trending, index) => (
                    <Link
                      key={trending.id}
                      href={`/news/${trending.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <span className="text-2xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {trending.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {trending.category.label} · {trending.read_time}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to News */}
            <div className="bg-primary/5 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Explore more stories from CueSports Africa
              </p>
              <Button asChild>
                <Link href="/news">
                  Browse All Articles
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
