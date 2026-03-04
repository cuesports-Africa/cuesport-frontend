import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import NewsClient from "./news-client";

export const metadata: Metadata = {
  title: "News & Updates - Tournament Coverage & Player Stories",
  description:
    "Latest cue sport news from Africa — tournament results, player profiles, and community updates. Stay informed on pool, snooker, and billiards events.",
  keywords: [
    "pool tournament news Africa",
    "snooker tournament news Africa",
    "pool news Kenya",
    "snooker news Kenya",
    "cuesports news",
    "African pool results",
    "African snooker results",
    "billiards news Africa",
    "pool player stories",
    "snooker player interviews",
    "tournament coverage Africa",
    "pool tournament highlights",
    "8-ball tournament results",
    "9-ball tournament news",
    "cue sport news Africa",
    "cue sport tournament results",
    "cuesport africa",
    "cuesports africa",
    "billiards africa",
    "snooker africa",
    "pool tournament africa",
    "8 ball pool africa",
    "African pool tournament",
    "African billiards",
    "cue sport tournament",
    "pool player rankings africa",
    "pool league africa",
  ],
  openGraph: {
    title: "News & Updates — CueSports Africa",
    description:
      "Latest tournament coverage, player stories, and announcements from African pool.",
    url: "https://cuesports.africa/news",
  },
  alternates: {
    canonical: "https://cuesports.africa/news",
  },
};

export default function NewsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "CueSports Africa News & Updates",
          description:
            "Latest tournament coverage, player stories, and announcements from African pool.",
          url: "https://cuesports.africa/news",
          isPartOf: {
            "@type": "WebSite",
            name: "CueSports Africa",
            url: "https://cuesports.africa",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://cuesports.africa",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "News",
              item: "https://cuesports.africa/news",
            },
          ],
        }}
      />
      <NewsClient />
    </>
  );
}
