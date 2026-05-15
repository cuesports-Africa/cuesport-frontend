import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "8-Ball Rules, Plainly Told — The WPA Standard",
  description:
    "Official 8-ball pool rules for CueSports Africa, drawn from the World Pool-Billiard Association (WPA) standard. The rack, the break, fouls, the eight ball — every rule worth remembering, in plain language.",
  keywords: [
    "8 ball rules",
    "8-ball pool rules",
    "WPA 8-ball rules",
    "pool rules Africa",
    "pool rules Kenya",
    "eight ball rules",
    "pool rules explained",
    "tournament 8-ball rules",
    "official pool rules",
    "cue sports rules",
    "how to play 8-ball pool",
    "pool foul rules",
    "8-ball break rules",
    "scratch on 8-ball",
    "CueSports Africa rules",
  ],
  openGraph: {
    title: "8-Ball Rules, Plainly Told — CueSports Africa",
    description:
      "8-ball pool rules drawn from the WPA standard. The rack, the break, the fouls, the eight — in plain language.",
    url: "https://cuesports.africa/rules",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "8-Ball Rules, Plainly Told — CueSports Africa",
    description:
      "8-ball pool rules drawn from the WPA standard. In plain language.",
  },
  alternates: {
    canonical: "https://cuesports.africa/rules",
  },
};

type Chapter = {
  numeral: string;
  title: string;
  preface?: string;
  verses: string[];
};

const chapters: Chapter[] = [
  {
    numeral: "Chapter I",
    title: "On The Object",
    verses: [
      "Fifteen object balls and a cue ball. Two players. One winner.",
      "Your balls are either the solids (one through seven) or the stripes (nine through fifteen). Clear them all, then call the eight ball into a chosen pocket. That is the game.",
      "He who pockets the eight ball at the wrong time, or in the wrong pocket, loses.",
    ],
  },
  {
    numeral: "Chapter II",
    title: "On The Rack",
    verses: [
      "Rack the balls tight in the triangle. No gaps.",
      "The apex ball sits on the foot spot. The eight ball sits in the middle of the rack.",
      "One solid and one stripe stand at the back two corners. The rest is at random.",
    ],
  },
  {
    numeral: "Chapter III",
    title: "On The Break",
    verses: [
      "The player who wins the lag chooses to break, or to receive.",
      "Place the cue ball anywhere behind the head string, then strike.",
      "A legal break pockets a ball, or drives at least four numbered balls to a rail. Anything less, and the rack is forfeited to the other player.",
      "If a ball is pocketed on a clean break, the table is open and play continues.",
      "If the cue ball jumps the table, or no ball reaches a rail, the breaker has fouled. The other player takes ball in hand behind the head string, or chooses to re-rack.",
      "The eight ball pocketed on a legal break wins the game.",
      "The eight ball pocketed together with a scratch on the break — the other player chooses: re-spot the eight and play on, or re-rack and break again.",
    ],
  },
  {
    numeral: "Chapter IV",
    title: "On The Open Table",
    verses: [
      "After the break, the table is open. Neither solids nor stripes belong to you yet.",
      "On an open table, you may strike any ball first, except the eight.",
      "Call your ball and your pocket. When you legally pocket the called ball, your group is chosen — and the same group is your opponent's, the other one.",
      "Once chosen, the group is yours for the rest of the game.",
    ],
  },
  {
    numeral: "Chapter V",
    title: "On The Legal Shot",
    preface:
      "Every shot, from the moment groups are chosen, must obey three laws.",
    verses: [
      "First, the cue ball must strike a ball of your own group.",
      "Then, after contact, a ball must drop into a pocket, or any ball must reach a rail.",
      "And the cue must stay on the table. Drive it off, and you have fouled.",
      "Call your ball and your pocket on bank shots, kick shots, and combinations. The obvious you need not call.",
      "A combination cannot pocket the eight ball.",
    ],
  },
  {
    numeral: "Chapter VI",
    title: "On Fouls",
    preface:
      "A foul gives your opponent the cue ball in hand — to place anywhere on the table.",
    verses: [
      "Pocket the cue ball — foul.",
      "Drive the cue ball off the table — foul.",
      "Strike a ball not in your group first — foul.",
      "Pocket no ball and drive no ball to a rail after contact — foul.",
      "Touch any ball with your hand, your cue, or your sleeve — foul.",
      "A foot lifted from the floor when you strike — foul.",
      "Push the cue ball, instead of striking it cleanly — foul.",
      "Strike the cue ball twice in one stroke — foul.",
      "Shoot while any ball is still moving — foul.",
      "Shoot out of turn — foul.",
    ],
  },
  {
    numeral: "Chapter VII",
    title: "On The Eight Ball",
    preface: "The eight is the last guest. Treat her with care.",
    verses: [
      "Only when your group is gone may you call the eight.",
      "Call the pocket before the shot.",
      "The eight in your called pocket wins the game.",
      "The eight in any other pocket — you lose.",
      "Pocket the eight while balls of your group remain on the table — you lose.",
      "Pocket the eight and scratch the cue ball on the same stroke — you lose.",
      "Drive the eight off the table — you lose.",
      "If you only foul while shooting at the eight, and the eight stays on the table, it is not a loss — only ball in hand to your opponent.",
    ],
  },
  {
    numeral: "Chapter VIII",
    title: "On Endings",
    verses: [
      "Win the game by legally pocketing the eight ball in the pocket you called.",
      "Lose the game by pocketing the eight before its time, or in the wrong pocket, or off the table, or by fouling on the stroke that pockets it.",
      "To play a defensive shot that ends your turn, declare “safety” before you strike.",
      "If three innings pass and neither player will risk a real shot, the rack is dead. Re-rack and the same player breaks again.",
      "Unsportsmanlike conduct is decided by the referee, who may award the rack — or the match — to your opponent.",
    ],
  },
];

export default function RulesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "8-Ball Rules, Plainly Told",
          alternativeHeadline: "The WPA 8-Ball Pool Standard",
          description:
            "Official 8-ball pool rules for CueSports Africa, drawn from the World Pool-Billiard Association (WPA) standard. The rack, the break, fouls, the eight ball — every rule worth remembering, in plain language.",
          about: [
            { "@type": "Thing", name: "Eight-ball pool" },
            { "@type": "Thing", name: "Cue sports rules" },
            { "@type": "Thing", name: "WPA pool rules" },
          ],
          inLanguage: "en",
          isAccessibleForFree: true,
          articleSection: chapters.map((c) => c.title),
          author: {
            "@type": "Organization",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
          },
          publisher: {
            "@type": "Organization",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
            logo: {
              "@type": "ImageObject",
              url: "https://cuesports.africa/logo.svg",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://cuesports.africa/rules",
          },
          citation: {
            "@type": "CreativeWork",
            name: "WPA Official Rules of Pool",
            url: "https://wpapool.com/rules/",
            publisher: {
              "@type": "Organization",
              name: "World Pool-Billiard Association",
            },
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
              name: "Rules",
              item: "https://cuesports.africa/rules",
            },
          ],
        }}
      />

      <article className="bg-canvas">
      {/* ─── Hero band ─── */}
      <header className="mx-auto max-w-5xl px-5 pt-20 pb-12 sm:px-8 sm:pt-24 sm:pb-16 lg:px-12 lg:pt-32 lg:pb-20">
        <div className="kicker">
          <span className="kicker-rule" />
          The Rules
        </div>

        <h1 className="mt-7 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink">
          Eight-ball,
          <br className="hidden sm:block" />{" "}
          <span className="text-ink/55">plainly told.</span>
        </h1>

        <p className="mt-8 max-w-[62ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.5] text-ink/75">
          How the game is played on CueSports Africa. From the rack to the eight,
          every rule worth remembering &mdash; in plain language, in the order
          they happen. Drawn from the World Pool-Billiard Association standard.
        </p>
      </header>

      {/* ─── Chapters ─── */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        {chapters.map((c) => (
          <div
            key={c.numeral}
            className="border-t border-rule pt-12 pb-14 sm:pt-14 sm:pb-16"
          >
            <div className="kicker">
              <span className="kicker-rule" />
              {c.numeral}
            </div>

            <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
              {c.title}.
            </h2>

            {c.preface && (
              <p className="mt-5 text-[15.5px] leading-[1.65] text-ink/75 italic">
                {c.preface}
              </p>
            )}

            <ol className="mt-8 space-y-5">
              {c.verses.map((verse, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2.25rem_1fr] gap-4 sm:grid-cols-[2.75rem_1fr] sm:gap-5"
                >
                  <span className="pt-[7px] font-mono text-[12px] tabular-nums text-mute-2 tracking-[0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[16.5px] leading-[1.7] text-ink/85">
                    {verse}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      {/* ─── Outro / source ─── */}
      <section className="border-t border-rule bg-bone/60">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="kicker">
            <span className="kicker-rule" />
            The source
          </div>
          <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
            These rules are not ours alone.
          </h2>
          <p className="mt-6 max-w-[58ch] text-[15px] leading-[1.65] text-ink/75">
            The 8-ball rules followed by CueSports Africa are drawn from the{" "}
            <a
              href="https://wpapool.com/rules/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
            >
              World Pool-Billiard Association
            </a>{" "}
            standard &mdash; the international rules used by every serious cue
            sports federation. When in doubt, the WPA text is authoritative.
            What you read here is the same rules, told in plain language.
          </p>

          <a
            href="https://wpapool.com/rules/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
          >
            Read the full WPA Official Rules
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>

          <p className="mt-10 text-[13px] leading-[1.6] text-mute">
            Disputes during a CueSports Africa tournament are decided by the
            organizer, with reference to the WPA text. If you believe a ruling
            was wrong, write to{" "}
            <a
              href="mailto:support@cuesports.africa"
              className="text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
            >
              support@cuesports.africa
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─── Back link ─── */}
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink"
        >
          ← Back to home
        </Link>
      </div>
    </article>
    </>
  );
}
