"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Clock, User, ArrowRight, TrendingUp, Calendar, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articleApi, type Article, type ArticlesResponse } from "@/lib/api";

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

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-xl bg-muted mb-4" />
      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  );
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch articles
  const { data: articlesData, isLoading: isLoadingArticles } = useSWR(
    ["articles", selectedCategory, page],
    () => articleApi.list({
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      page,
      per_page: 12,
    }),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  // Fetch featured article
  const { data: featuredData } = useSWR(
    "featured-article",
    () => articleApi.featured(),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  // Fetch trending articles
  const { data: trendingData } = useSWR(
    "trending-articles",
    () => articleApi.trending(5),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const articles = articlesData?.data || [];
  const categories = articlesData?.categories || [];
  const meta = articlesData?.meta;
  const featuredArticle = featuredData?.data;
  const trendingArticles = trendingData?.data || [];

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              News & <span className="text-gold">Updates</span>
            </h1>
            <p className="text-lg opacity-90">
              Stay informed with the latest tournament coverage, player stories,
              and announcements from the world of African pool.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-background sticky top-16 lg:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 lg:py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured Article */}
            {featuredArticle && selectedCategory === "all" && page === 1 && (
              <article className="group">
                <Link href={`/news/${featuredArticle.slug}`} className="block">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted mb-6">
                    {featuredArticle.featured_image_url ? (
                      <img
                        src={featuredArticle.featured_image_url}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                      <CategoryBadge category={featuredArticle.category} />
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-3 mb-3 group-hover:text-gold transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {featuredArticle.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {featuredArticle.formatted_date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {featuredArticle.read_time}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Article Grid */}
            {isLoadingArticles ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <article key={article.id} className="group">
                    <Link href={`/news/${article.slug}`} className="block">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-4">
                        {article.featured_image_url ? (
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                        )}
                        <div className="absolute top-4 left-4">
                          <CategoryBadge category={article.category} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {article.author}
                        </span>
                        <span>•</span>
                        <span>{article.formatted_date}</span>
                        <span>•</span>
                        <span>{article.read_time}</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="lg"
                  disabled={page === meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Trending Section */}
            {trendingArticles.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <h3 className="font-semibold text-lg">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {trendingArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="group flex gap-4 items-start"
                    >
                      <span className="text-3xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.category.label}</span>
                          <span>•</span>
                          <span>{article.formatted_date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-sm opacity-80 mb-4">
                Get the latest news delivered to your inbox weekly.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <Button className="w-full bg-gold hover:bg-gold/90 text-black">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-xs opacity-60 mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "Tournament Calendar", href: "/tournaments" },
                  { label: "Player Rankings", href: "/rankings" },
                  { label: "Submit a Story", href: "/news/submit" },
                  { label: "Press & Media", href: "/press" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a Story to Share?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            We&apos;re always looking for contributors. Share your tournament experiences,
            player profiles, or analysis with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/news/submit">
              <Button size="lg" className="px-8">
                Submit a Story
              </Button>
            </Link>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="px-8">
                Contact Editorial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
