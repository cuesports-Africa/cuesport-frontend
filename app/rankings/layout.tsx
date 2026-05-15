import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "The Wall — Africa's Pool Rankings",
  description:
    "The continental ranking for 8-ball pool. Elo-based, updated weekly, filterable by country, region, and category. Africa's best, on the wall.",
  keywords: [
    "pool rankings Africa",
    "8 ball pool rankings",
    "pool rankings Kenya",
    "Elo rating leaderboard",
    "African pool leaderboard",
    "top pool players Africa",
    "best pool players Kenya",
    "pool player ratings",
    "pool leaderboard Kenya",
    "cue sport rankings Africa",
    "CueSports Africa rankings",
    "continental pool ranking",
    "pool federation Africa",
    "Kirinyaga pool",
    "Nairobi pool rankings",
  ],
  openGraph: {
    title: "The Wall — CueSports Africa",
    description:
      "Africa's continental pool ranking. Updated weekly. Filter by country, region, and category.",
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
