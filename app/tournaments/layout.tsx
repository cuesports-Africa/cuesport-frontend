import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Tournaments - Browse & Register",
  description:
    "Browse upcoming pool tournaments across Africa. Filter by format, location, and entry fee. Register and pay online via M-Pesa or card.",
  keywords: [
    "pool tournaments Africa",
    "snooker tournaments Africa",
    "pool tournaments Kenya",
    "snooker tournaments Kenya",
    "pool tournaments Nairobi",
    "upcoming pool tournaments",
    "upcoming snooker tournaments",
    "register pool tournament",
    "register snooker tournament online",
    "tournament brackets",
    "8-ball tournament",
    "9-ball tournament",
    "M-Pesa tournament entry",
    "billiards competitions Africa",
    "pool competition near me",
    "snooker competition Kenya",
    "pool tournament schedule Africa",
    "pool tournament results",
    "live pool tournament",
    "cue sport tournament Africa",
    "cue sport competition",
  ],
  openGraph: {
    title: "Pool Tournaments — CueSports Africa",
    description:
      "Browse, register, and compete in pool tournaments across Africa. Live brackets, M-Pesa payments, Elo ratings.",
    url: "https://cuesports.africa/tournaments",
  },
  alternates: {
    canonical: "https://cuesports.africa/tournaments",
  },
};

export default function TournamentsLayout({
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
          name: "Pool Tournaments — CueSports Africa",
          description:
            "Browse and register for pool tournaments across Africa.",
          url: "https://cuesports.africa/tournaments",
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
