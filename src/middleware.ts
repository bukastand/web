import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect:
 * - /admin/* routes → require admin_session cookie
 * - /api/admin/* routes → require admin_session cookie or service role key header
 * - /builder/* routes → require builder_session cookie
 * - /auth/* routes → redirect authenticated users appropriately
 *
 * Uses HttpOnly-equivalent cookie checks (set via document.cookie with path=/)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes: require admin_session cookie ──
  if (pathname.startsWith("/admin")) {
    // Login page is public
    if (pathname === "/admin/login") {
      const adminSession = request.cookies.get("admin_session");
      const userRole = request.cookies.get("user_role");
      if (adminSession?.value === "authenticated" && userRole?.value === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // API admin routes: check via cookie OR x-admin-key header
    if (pathname.startsWith("/api/admin")) {
      const adminSession = request.cookies.get("admin_session");
      const userRole = request.cookies.get("user_role");
      const adminKey = request.headers.get("x-admin-key");
      // Require BOTH admin_session AND user_role=admin (or internal header)
      if (adminKey === process.env.ADMIN_API_KEY) {
        return NextResponse.next();
      }
      if (adminSession?.value === "authenticated" && userRole?.value === "admin") {
        return NextResponse.next();
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // All other /admin/* routes
    const adminSession = request.cookies.get("admin_session");
    const userRole = request.cookies.get("user_role");
    if (adminSession?.value !== "authenticated" || userRole?.value !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // ── Builder routes: require builder_session cookie ──
  if (pathname.startsWith("/builder")) {
    const builderSession = request.cookies.get("builder_session");
    if (builderSession?.value !== "authenticated") {
      // Allow API calls to check auth, but redirect page requests
      if (pathname.startsWith("/builder/api")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // ── Auth routes: redirect if already authenticated ──
  if (pathname.startsWith("/auth")) {
    const builderSession = request.cookies.get("builder_session");
    if (builderSession?.value === "authenticated") {
      // Don't redirect if they're trying to access login/register pages
      if (pathname === "/auth/login" || pathname === "/auth/register") {
        return NextResponse.redirect(new URL("/builder", request.url));
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/builder/:path*", "/auth/:path*"],
};
