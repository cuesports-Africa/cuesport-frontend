"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import type { Article } from "@/lib/api";

type CategoryMeta = { name: string; slug: string; count: number };

type Props = {
  articles: Article[];
  categories: CategoryMeta[];
  featured: Article | null;
};

const BRAND_NAVY = "#004E86";

export default function NewsClient({ articles, categories, featured }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Normalise categories — make sure "All" sits at the front, and only show
  // categories that actually have articles + the always-on "All".
  const filterTabs = useMemo<CategoryMeta[]>(() => {
    if (!categories.length) return [{ name: "All", slug: "all", count: articles.length }];
    const seen = new Set<string>();
    const list: CategoryMeta[] = [];
    for (const c of categories) {
      if (seen.has(c.slug)) continue;
      seen.add(c.slug);
      if (c.slug === "all" || c.count > 0) list.push(c);
    }
    // Move "all" to the front if present, otherwise add it.
    const allIdx = list.findIndex((c) => c.slug === "all");
    if (allIdx > 0) {
      const [all] = list.splice(allIdx, 1);
      list.unshift(all);
    } else if (allIdx === -1) {
      list.unshift({ name: "All", slug: "all", count: articles.length });
    }
    return list;
  }, [categories, articles.length]);

  // Filter the article list against active category + search query.
  const visible = useMemo(() => {
    let list = articles;
    if (activeSlug !== "all") {
      list = list.filter((a) => a.category?.value === activeSlug);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.author?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [articles, activeSlug, query]);

  const hasContent = articles.length > 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-100 text-ink">
      {/* Subtle film grain — same paper texture as the homepage's light sections */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* ─── Page header — editorial magazine masthead ─── */}
      <header className="relative pt-24 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            The Magazine
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,7.2vw,5.25rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-ink">
            Stories from
            <br className="hidden sm:block" /> the table.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal leading-[1.55] text-zinc-700">
            The week in African pool — matches, players, and the halls behind
            the names. Reading optimised for the back of a long evening.
          </p>
        </div>
      </header>

      {/* ─── Featured story (when present) ─── */}
      {featured && (
        <section className="relative mt-12 lg:mt-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <Link
              href={`/news/${featured.slug}`}
              className="group relative block overflow-hidden rounded-2xl ring-1 ring-zinc-900/5 shadow-[0_40px_80px_-40px_rgba(0,78,134,0.35)]"
            >
              <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/9]">
                {featured.featured_image_url ? (
                  <Image
                    src={featured.featured_image_url}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-ink" />
                )}
                {/* Mobile bottom-up scrim */}
                <div
                  aria-hidden
                  className="absolute inset-0 sm:hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,22,40,0.30) 0%, rgba(10,22,40,0.55) 45%, rgba(10,22,40,0.92) 100%)",
                  }}
                />
                {/* Desktop left-to-right scrim */}
                <div
                  aria-hidden
                  className="absolute inset-0 hidden sm:block"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.72) 35%, rgba(10,22,40,0.30) 65%, rgba(10,22,40,0.10) 100%)",
                  }}
                />
                <div className="absolute inset-0 flex items-end sm:items-center">
                  <div className="w-full p-6 text-white sm:max-w-xl sm:p-10 lg:max-w-2xl lg:p-14">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
                      Featured · {featured.category?.label ?? "Story"}
                    </p>
                    <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] transition-colors group-hover:text-gold">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="mt-4 max-w-[55ch] text-[clamp(0.95rem,1.2vw,1.1rem)] font-light leading-[1.5] text-white/85">
                        {featured.excerpt}
                      </p>
                    )}
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65">
                      {[featured.author, featured.formatted_date, featured.read_time]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ─── Filters + Search ─── */}
      {hasContent && (
        <section className="relative mt-12 lg:mt-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-5 border-b border-zinc-300 pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              {/* Filter pills — horizontal scroll on mobile to avoid wrap */}
              <div
                role="tablist"
                aria-label="Filter by category"
                className="-mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {filterTabs.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    role="tab"
                    aria-selected={activeSlug === cat.slug}
                    onClick={() => setActiveSlug(cat.slug)}
                    className={`shrink-0 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      activeSlug === cat.slug
                        ? "bg-ink text-white"
                        : "text-zinc-600 hover:bg-zinc-200 hover:text-ink"
                    }`}
                  >
                    {cat.name}
                    {cat.slug !== "all" && cat.count > 0 && (
                      <span className="ml-1.5 tabular-nums text-zinc-400">
                        {cat.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <label className="group relative flex w-full items-center gap-2 rounded-full border border-zinc-300 bg-white/60 px-4 py-2 transition-colors focus-within:border-zinc-500 sm:w-72">
                <Search className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden />
                <input
                  type="search"
                  placeholder="Search stories"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-zinc-500"
                  aria-label="Search stories"
                />
              </label>
            </div>
          </div>
        </section>
      )}

      {/* ─── Article grid OR Empty state ─── */}
      <section className="relative mt-10 pb-24 lg:mt-14 lg:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          {hasContent ? (
            visible.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
                {visible.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <NoMatchEmpty
                onReset={() => {
                  setActiveSlug("all");
                  setQuery("");
                }}
              />
            )
          ) : (
            <ColdStartEmpty />
          )}
        </div>
      </section>
    </main>
  );
}

/* ─── Article card — the magazine teaser ─── */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-300 ring-1 ring-zinc-900/5 shadow-[0_20px_40px_-25px_rgba(0,78,134,0.25)]">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300" />
        )}
      </div>
      <div className="mt-5">
        <p
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: BRAND_NAVY }}
        >
          {article.category?.label ?? "Story"}
        </p>
        <h3 className="mt-2.5 text-[clamp(1.1rem,1.5vw,1.35rem)] font-extrabold leading-[1.18] tracking-[-0.015em] text-ink transition-colors group-hover:text-[#004E86]">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-[14px] leading-[1.5] text-zinc-600">
            {article.excerpt}
          </p>
        )}
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {[article.author, article.formatted_date, article.read_time]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}

/* ─── Empty states ─── */
function ColdStartEmpty() {
  return (
    <div className="mx-auto max-w-xl border-y border-zinc-300 py-16 text-center sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
        First issue · Coming soon
      </p>
      <h2 className="mt-5 text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
        The magazine is warming up.
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.55] text-zinc-700">
        Match reports, player profiles, and analysis from across the continent —
        the first stories drop soon. Come back, or follow the action live.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link
          href="/tournaments"
          className="group inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: BRAND_NAVY }}
        >
          Tournaments today
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/rankings"
          className="group inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: BRAND_NAVY }}
        >
          The continental top 10
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function NoMatchEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="border-y border-zinc-300 py-16 text-center sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
        No matches
      </p>
      <p className="mt-4 text-[clamp(1.15rem,2vw,1.5rem)] font-semibold text-ink">
        Nothing here under those filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold transition-opacity hover:opacity-80"
        style={{ color: BRAND_NAVY }}
      >
        Clear filters
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}
