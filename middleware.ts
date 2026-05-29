import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Rewrite organizer.cuesports.africa/* → /organizer/*
  if (hostname.startsWith("organizer.")) {
    const url = request.nextUrl.clone();
    url.pathname = `/organizer${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|logo.svg|og-image.png|.*\\.txt$|.*\\.xml$|.*\\.html$).*)",
  ],
};
