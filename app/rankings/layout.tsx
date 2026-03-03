import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Player Rankings & Leaderboards",
  description:
    "View player rankings, Elo ratings, statistics, and leaderboards across Africa. Filter by country, region, rating category, and more.",
  keywords: [
    "pool player rankings Africa",
    "snooker player rankings Africa",
    "pool rankings Kenya",
    "snooker rankings Kenya",
    "Elo rating leaderboard",
    "Elo rating pool players",
    "cuesports rankings",
    "pool player statistics",
    "African pool leaderboard",
    "billiards rankings Africa",
    "top pool players Africa",
    "top snooker players Kenya",
    "best pool players Kenya",
    "pool player ratings",
    "snooker player ratings Africa",
    "pool leaderboard Kenya",
  ],
  openGraph: {
    title: "Player Rankings — CueSports Africa",
    description:
      "Live player rankings and Elo leaderboards across Africa. See who's on top.",
    url: "https://cuesports.africa/rankings",
    type: "website",
  },
  alternates: {
    canonical: "https://cuesports.africa/rankings",
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "CueSports Africa Player Rankings",
          description:
            "Player rankings, Elo ratings, and leaderboards for pool players across Africa.",
          url: "https://cuesports.africa/rankings",
          isPartOf: {
            "@type": "WebSite",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
          },
        }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
