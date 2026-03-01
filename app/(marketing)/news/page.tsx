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
      <section className="relative overflow-hidden hero-gradient py-16 lg:py-24">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              News & <span className="text-electric text-glow">Updates</span>
            </h1>
            <p className="text-lg opacity-90 text-muted-foreground leading-relaxed">
              Stay informed with the latest tournament coverage, player stories,
              and announcements from the world of African pool.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.slug
                  ? "bg-electric text-[#030e10] glow-cyan"
                  : "bg-muted/50 text-foreground/80 hover:bg-muted"
                  }`}
              >
                {cat.name}
                <span className={`ml-2 text-xs ${selectedCategory === cat.slug ? "text-[#030e10]/70" : "text-muted-foreground"}`}>({cat.count})</span>
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
              <article className="group card-hover">
                <Link href={`/news/${featuredArticle.slug}`} className="block">
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-muted mb-6 border border-border/20 shadow-xl">
                    {featuredArticle.featured_image_url ? (
                      <img
                        src={featuredArticle.featured_image_url}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 max-bg-gradient" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                      <CategoryBadge category={featuredArticle.category} />
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 mb-3 drop-shadow-md group-hover:text-electric transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-5 max-w-2xl drop-shadow-sm font-medium">
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
                  <article key={article.id} className="group card-dark p-4 rounded-2xl card-hover flex flex-col h-full">
                    <Link href={`/news/${article.slug}`} className="block flex-1 flex flex-col">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-5 border border-border/10">
                        {article.featured_image_url ? (
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 max-bg-gradient transition-colors" />
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <CategoryBadge category={article.category} />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-3 leading-snug text-foreground group-hover:text-electric transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/20">
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
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
              <div className="card-dark rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-electric/15 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-electric" />
                  </div>
                  <h3 className="font-bold text-xl">Trending Now</h3>
                </div>
                <div className="space-y-6">
                  {trendingArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="group flex gap-5 items-start"
                    >
                      <span className="text-4xl font-extrabold font-mono text-muted/30 group-hover:text-electric transition-colors pt-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-snug text-foreground/90 group-hover:text-electric transition-colors line-clamp-2 mb-2">
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
            <div className="rounded-3xl p-6 lg:p-8 gradient-border relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-electric/10 to-transparent pointer-events-none" />
              <h3 className="font-bold text-xl mb-2 relative z-10 text-foreground">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-6 relative z-10 leading-relaxed">
                Get the latest news delivered to your inbox weekly.
              </p>
              <div className="space-y-3 relative z-10">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="search-input-dark w-full px-4 py-3 rounded-xl text-sm"
                />
                <Button className="w-full bg-electric hover:bg-electric/90 text-[#030e10] font-semibold h-11 rounded-xl glow-cyan">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-4 text-center relative z-10">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Quick Links */}
            <div className="card-dark rounded-3xl p-6 lg:p-8">
              <h3 className="font-bold text-xl mb-6">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { label: "Tournament Calendar", href: "/tournaments" },
                  { label: "Player Rankings", href: "/rankings" },
                  { label: "Submit a Story", href: "/news/submit" },
                  { label: "Press & Media", href: "/press" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-electric hover:bg-white/5 transition-all group"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-electric opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-muted/30 border-t border-border/10 py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Have a Story to Share?
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-2xl mx-auto mb-10">
            We&apos;re always looking for contributors. Share your tournament experiences,
            player profiles, or analysis with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/news/submit">
              <Button size="lg" className="bg-electric text-[#030e10] hover:bg-electric/90 font-semibold px-8 rounded-full h-12 glow-cyan">
                Submit a Story
              </Button>
            </Link>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="px-8 rounded-full h-12 border-border/60 hover:border-primary/40">
                Contact Editorial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
