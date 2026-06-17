import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes (not login)
  if (pathname.startsWith("/admin/dashboard")) {
    const adminSession = request.cookies.get("admin_session");
    const userRole = request.cookies.get("user_role");

    if (!adminSession || adminSession.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify role cookie says admin
    if (!userRole || userRole.value !== "admin") {
      // If user is logged in but not admin, redirect to builder
      const builderSession = request.cookies.get("builder_session");
      if (builderSession?.value === "authenticated") {
        return NextResponse.redirect(new URL("/builder", request.url));
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect builder editor routes (not the builder home page)
  if (pathname.startsWith("/builder/")) {
    const builderSession = request.cookies.get("builder_session");
    if (!builderSession || builderSession.value !== "authenticated") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Redirect admin users trying to access builder login/auth pages
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    const userRole = request.cookies.get("user_role");
    const builderSession = request.cookies.get("builder_session");
    if (userRole?.value === "admin" && builderSession?.value === "authenticated") {
      // Admin is already logged in, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/builder/:path*", "/auth/:path*"],
};
