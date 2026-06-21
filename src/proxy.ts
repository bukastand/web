import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes: require admin_session AND user_role=admin cookies ──
  if (pathname.startsWith("/admin")) {
    // Login page is public; redirect if already authenticated
    if (pathname === "/admin/login") {
      const adminSession = request.cookies.get("admin_session");
      const userRole = request.cookies.get("user_role");
      if (adminSession?.value === "authenticated" && userRole?.value === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // API admin routes: check cookies OR x-admin-key header
    if (pathname.startsWith("/api/admin")) {
      const adminSession = request.cookies.get("admin_session");
      const userRole = request.cookies.get("user_role");
      const adminKey = request.headers.get("x-admin-key");
      // Allow if ADMIN_API_KEY header matches (for internal/service calls)
      if (adminKey === process.env.ADMIN_API_KEY) {
        return NextResponse.next();
      }
      // Require BOTH admin_session AND user_role=admin
      if (adminSession?.value === "authenticated" && userRole?.value === "admin") {
        return NextResponse.next();
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // All other /admin/* routes (dashboard, pages, etc.)
    const adminSession = request.cookies.get("admin_session");
    const userRole = request.cookies.get("user_role");
    if (adminSession?.value !== "authenticated" || userRole?.value !== "admin") {
      // If user is logged in as builder but not admin, redirect to builder
      const builderSession = request.cookies.get("builder_session");
      if (builderSession?.value === "authenticated") {
        return NextResponse.redirect(new URL("/builder", request.url));
      }
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
    const userRole = request.cookies.get("user_role");
    if (builderSession?.value === "authenticated") {
      // Admin users go to admin dashboard
      if (userRole?.value === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/builder", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/builder/:path*", "/auth/:path*"],
};
