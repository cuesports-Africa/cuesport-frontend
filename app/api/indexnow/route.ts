import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "5b0ec9f9c45f02326439f7ff0bdfeb8c";
const SITE_HOST = "cuesports.africa";
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

// POST /api/indexnow — notify Bing, Yandex, DuckDuckGo of updated URLs
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: string[];
  try {
    const body = await request.json();
    urls = body.urls;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "urls array is required" }, { status: 400 });
  }

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls.slice(0, 10000),
  };

  try {
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      status: response.status,
      message: response.statusText,
      submitted: urls.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit to IndexNow" },
      { status: 500 }
    );
  }
}

// GET /api/indexnow — submit all sitemap URLs (for manual trigger)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sitemapRes = await fetch(`https://${SITE_HOST}/sitemap.xml`);
    const xml = await sitemapRes.text();

    // Extract URLs from sitemap XML
    const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (!urlMatches) {
      return NextResponse.json({ error: "No URLs found in sitemap" }, { status: 404 });
    }

    const urls = urlMatches.map((match) => match.replace(/<\/?loc>/g, ""));

    const payload = {
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls.slice(0, 10000),
    };

    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      status: response.status,
      message: response.statusText,
      submitted: urls.length,
      urls,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit sitemap to IndexNow" },
      { status: 500 }
    );
  }
}
