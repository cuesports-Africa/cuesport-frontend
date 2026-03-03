import { Metadata } from "next";
import { Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "System Status - Platform Health",
  description:
    "Real-time system status for CueSports Africa. Check API uptime, service health, and incident history.",
  openGraph: {
    title: "System Status — CueSports Africa",
    description: "Live platform health and incident history.",
    url: "https://cuesports.africa/status",
  },
  alternates: {
    canonical: "https://cuesports.africa/status",
  },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex justify-center">{children}</main>
    </>
  );
}
