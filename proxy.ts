import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Legacy route redirects
  if (pathname === "/home" || pathname.startsWith("/home/")) {
    const newPath = pathname.replace("/home", "/player");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    const newPath = pathname.replace("/profile", "/player/profile");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
