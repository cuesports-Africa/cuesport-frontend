import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cuesports.africa";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/_next/"],
      },
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/_next/"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/_next/"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },
      {
        userAgent: "DuckAssistBot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
