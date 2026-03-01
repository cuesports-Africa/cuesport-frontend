"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TournamentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // /tournaments is always a public page with marketing layout
  // Authenticated users have /player/tournaments for their registered tournaments
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
