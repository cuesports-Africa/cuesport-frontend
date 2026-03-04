import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Cue Sport Tournaments — Browse & Register",
  description:
    "Browse upcoming pool, snooker, and billiards tournaments across Africa. Register online, view live brackets, and pay entry fees via M-Pesa or card.",
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
    "cuesport africa",
    "cuesports africa",
    "billiards africa",
    "snooker africa",
    "pool tournament africa",
    "African pool tournament",
    "cue sport tournament",
    "8 ball pool africa",
    "pool league africa",
    "African billiards",
    "pool player rankings africa",
    "cue sport events Kenya",
    "pool events Africa",
    "billiards tournament directory",
  ],
  openGraph: {
    title: "Cue Sport Tournaments — CueSports Africa",
    description:
      "Browse, register, and compete in pool, snooker, and billiards tournaments across Africa. Live brackets, M-Pesa payments, Elo ratings.",
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
          name: "Cue Sport Tournaments — CueSports Africa",
          description:
            "Browse and register for pool, snooker, and billiards tournaments across Africa.",
          url: "https://cuesports.africa/tournaments",
          isPartOf: {
            "@type": "WebSite",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
          },
          about: {
            "@type": "Thing",
            name: "Cue Sports Tournaments in Africa",
          },
          provider: {
            "@type": "SportsOrganization",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
            sport: "Billiards",
          },
          mainEntity: {
            "@type": "ItemList",
            name: "Cue Sport Tournaments in Africa",
            description:
              "Browse upcoming pool, snooker, and billiards tournaments across Africa on CueSports Africa.",
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
