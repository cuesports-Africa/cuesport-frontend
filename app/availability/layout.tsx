import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Availability | CueSports Africa",
  description:
    "See which African countries CueSports Africa is currently available in. We're expanding across the continent to bring professional pool tournaments to more players.",
};

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
