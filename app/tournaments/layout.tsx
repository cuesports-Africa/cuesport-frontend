import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Tournaments — Today's Schedule",
  description:
    "Live 8-ball pool tournaments across Africa. Today's matches, upcoming events, results, live brackets. Updated every 30 seconds.",
  keywords: [
    "pool tournaments Africa",
    "8-ball tournaments Kenya",
    "live pool matches Africa",
    "pool tournament schedule",
    "8-ball tournament Nairobi",
    "Kirinyaga pool tournament",
    "upcoming pool tournaments",
    "register pool tournament",
    "live pool brackets",
    "pool tournament results",
    "M-Pesa tournament entry",
    "cue sport tournament Africa",
    "CueSports Africa tournaments",
    "pool events Kenya",
    "African pool calendar",
  ],
  openGraph: {
    title: "Tournaments — CueSports Africa",
    description:
      "Africa's 8-ball pool tournament schedule. Today's matches, upcoming events, live brackets.",
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
          name: "Tournaments — CueSports Africa",
          description:
            "Browse and register for 8-ball pool tournaments across Africa.",
          url: "https://cuesports.africa/tournaments",
          isPartOf: {
            "@type": "WebSite",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
          },
          about: {
            "@type": "Thing",
            name: "8-Ball Pool Tournaments in Africa",
          },
          provider: {
            "@type": "SportsOrganization",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
            sport: "8-Ball Pool",
          },
          mainEntity: {
            "@type": "ItemList",
            name: "Pool Tournaments in Africa",
            description:
              "Live and upcoming 8-ball pool tournaments across Africa on CueSports Africa.",
            itemListOrder: "https://schema.org/ItemListUnordered",
            itemListElement: {
              "@type": "ListItem",
              name: "SportsEvent",
            },
          },
        }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
