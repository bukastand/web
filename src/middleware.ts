import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes (not login)
  if (pathname.startsWith("/admin/dashboard")) {
    const adminSession = request.cookies.get("admin_session");
    if (!adminSession || adminSession.value !== "authenticated") {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/builder/:path*"],
};
