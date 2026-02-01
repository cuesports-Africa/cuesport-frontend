import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Rankings | CueSports Africa",
  description: "View player rankings, statistics, and leaderboards across Africa. Filter by country, region, rating category, and more.",
  openGraph: {
    title: "Rankings | CueSports Africa",
    description: "View player rankings, statistics, and leaderboards across Africa.",
    type: "website",
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
