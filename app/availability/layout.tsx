import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Availability - Countries & Regions",
  description:
    "See which African countries CueSports Africa is currently available in. We're expanding across the continent to bring professional pool tournaments to more players.",
  keywords: [
    "cuesports africa countries",
    "pool tournaments Kenya",
    "pool tournaments Africa",
    "snooker tournaments Africa",
    "pool Africa countries",
    "snooker Africa countries",
    "cuesports availability",
    "African billiards platform",
    "pool Tanzania",
    "pool Uganda",
    "pool Nigeria",
    "pool South Africa",
    "snooker East Africa",
    "pool West Africa",
    "cue sport availability Africa",
    "cue sport countries",
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
