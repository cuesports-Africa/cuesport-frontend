import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/player", "/organizer"];

// Routes that require player role
const playerRoutes = ["/player"];

// Routes that require organizer role
const organizerRoutes = ["/organizer"];

// Public routes (no auth required)
const publicRoutes = ["/", "/auth", "/tournaments", "/players", "/rankings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files with extensions
  ) {
    return NextResponse.next();
  }

  // Note: Since we use localStorage for auth (client-side only),
  // actual authentication checks happen in layout components.
  // This middleware sets up the routing structure and can be enhanced
  // to use cookies for server-side auth checks in the future.

  // For now, we rely on client-side layout protection
  // The layouts check localStorage and redirect if needed

  // Legacy route redirects
  if (pathname === "/home" || pathname.startsWith("/home/")) {
    // Redirect old /home routes to /player
    const newPath = pathname.replace("/home", "/player");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    // Redirect old /profile routes to /player/profile
    const newPath = pathname.replace("/profile", "/player/profile");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
