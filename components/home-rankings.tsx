"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeRankingRow } from "@/lib/home-data";

type Props = {
  men: HomeRankingRow[];
  women: HomeRankingRow[];
  updatedAt: string;
};

export function HomeRankings({ men, women, updatedAt }: Props) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const players = gender === "male" ? men : women;
  const hasData = players.length > 0;

  return (
    <section
      className="bg-ink py-20 text-white lg:py-28"
      aria-labelledby="home-rankings-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">

        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
            The Continental Top 10
          </p>
          <h2
            id="home-rankings-heading"
            className="text-[clamp(2.5rem,5.6vw,4.5rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-white"
          >
            Africa&rsquo;s best.
          </h2>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 tabular-nums">
            Updated weekly · {updatedAt}
          </p>
        </div>

        {/* Tabs — Men / Women */}
        <div
          role="tablist"
          aria-label="Rankings by gender"
          className="mb-8 flex items-center justify-between border-b border-white/10"
        >
          <div className="flex items-center gap-8">
            <button
              type="button"
              role="tab"
              aria-selected={gender === "male"}
              aria-controls="rankings-panel"
              onClick={() => setGender("male")}
              className={`relative pb-4 font-mono text-[12px] uppercase tracking-[0.22em] outline-none transition-colors focus-visible:text-white ${
                gender === "male"
                  ? "text-white"
                  : "text-white/35 hover:text-white/70"
              }`}
            >
              Men
              {gender === "male" && (
                <span className="absolute -bottom-px left-0 right-0 h-px bg-gold" />
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={gender === "female"}
              aria-controls="rankings-panel"
              onClick={() => setGender("female")}
              className={`relative pb-4 font-mono text-[12px] uppercase tracking-[0.22em] outline-none transition-colors focus-visible:text-white ${
                gender === "female"
                  ? "text-white"
                  : "text-white/35 hover:text-white/70"
              }`}
            >
              Women
              {gender === "female" && (
                <span className="absolute -bottom-px left-0 right-0 h-px bg-gold" />
              )}
            </button>
          </div>
          <span className="hidden pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 tabular-nums sm:block">
            {hasData ? `${players.length} players` : ""}
          </span>
        </div>

        {/* Panel */}
        <div id="rankings-panel" role="tabpanel">
          {hasData ? (
            <>
              {/* Top 3 — featured rows */}
              <div className="border-b border-white/10 divide-y divide-white/[0.06]">
                {players.slice(0, 3).map((p) => (
                  <Link
                    key={`${gender}-${p.rank}`}
                    href="/players"
                    className="group flex items-center gap-5 py-7 transition-colors hover:bg-white/[0.02] lg:gap-10 lg:py-9"
                  >
                    <span className="w-12 flex-shrink-0 text-[clamp(2rem,3.2vw,2.75rem)] font-extrabold tabular-nums text-gold lg:w-16">
                      {p.rank.toString().padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[clamp(1.4rem,2.8vw,2.25rem)] font-extrabold uppercase leading-none tracking-[-0.02em] text-white transition-colors group-hover:text-gold">
                        {p.name}
                      </h3>
                      <p className="mt-2.5 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                        {p.origin}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-baseline gap-1.5">
                      <span className="text-[clamp(1.1rem,1.8vw,1.4rem)] font-bold tabular-nums text-white">
                        {p.points.toLocaleString()}
                      </span>
                      <span className="font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-white/45">
                        pts
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 4–10 — tighter rows */}
              {players.length > 3 && (
                <div className="divide-y divide-white/[0.06]">
                  {players.slice(3).map((p) => (
                    <Link
                      key={`${gender}-${p.rank}`}
                      href="/players"
                      className="group flex items-center gap-4 py-4 transition-colors hover:bg-white/[0.02] lg:gap-8 lg:py-5"
                    >
                      <span className="w-10 flex-shrink-0 font-mono text-[13px] font-bold tabular-nums text-white/45 lg:w-14 lg:text-[14px]">
                        {p.rank.toString().padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[15px] font-semibold text-white transition-colors group-hover:text-gold lg:text-[17px]">
                          {p.name}
                        </h3>
                        <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                          {p.origin}
                        </p>
                      </div>
                      <span className="flex-shrink-0 font-mono text-[13px] font-semibold tabular-nums text-white/85 lg:text-[14px]">
                        {p.points.toLocaleString()}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Empty / error state — quiet, on-brand, never broken-looking.
            <div className="border-y border-white/10 py-16 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                Rankings warming up
              </p>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
                The full table will be here once enough matches are logged for this category.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
            Rankings · Pool · Snooker · 9-Ball · Carrom
          </p>
          <Link
            href={gender === "female" ? "/rankings?gender=female" : "/rankings"}
            className="group inline-flex items-center gap-2 text-[14px] font-medium text-gold transition-opacity hover:opacity-80"
          >
            See full rankings
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
