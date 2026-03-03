import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Availability - Countries & Regions",
  description:
    "See which African countries CueSports Africa is currently available in. We're expanding across the continent to bring professional pool tournaments to more players.",
  keywords: [
    "cuesports africa countries",
    "pool tournaments Kenya",
    "pool tournaments Africa",
    "cuesports availability",
    "African billiards platform",
  ],
  openGraph: {
    title: "Platform Availability — CueSports Africa",
    description:
      "CueSports Africa is live across multiple African countries. See where we're available.",
    url: "https://cuesports.africa/availability",
  },
  alternates: {
    canonical: "https://cuesports.africa/availability",
  },
};

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
