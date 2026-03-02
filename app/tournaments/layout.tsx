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
    "upcoming pool tournaments",
    "register pool tournament",
    "tournament brackets",
    "M-Pesa tournament entry",
    "billiards competitions Africa",
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
