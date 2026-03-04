import { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightsClient from "./insights-client";

export interface InsightsData {
  ad: {
    title: string;
    advertiser_name: string;
    status: string;
    placement: string;
  };
  stats: {
    total_impressions: number;
    total_clicks: number;
    ctr: number;
  };
  daily_breakdown: Array<{
    date: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
}

async function getInsights(token: string): Promise<InsightsData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ads/insights/${token}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const data = await getInsights(token);

  return {
    title: data
      ? `${data.ad.title} — Ad Performance Report`
      : "Ad Insights — CueSports Africa",
    description: data
      ? `Performance report for ${data.ad.title} by ${data.ad.advertiser_name}`
      : "Ad performance insights",
    robots: { index: false, follow: false },
  };
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getInsights(token);

  if (!data) notFound();

  return <InsightsClient data={data} />;
}
