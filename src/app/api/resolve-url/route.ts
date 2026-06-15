import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  try {
    // Follow redirects and get the final URL
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GoogleMapsResolver/1.0)",
      },
    });

    clearTimeout(timeout);
    return NextResponse.json({ url: response.url, status: response.status });
  } catch (error: any) {
    // If HEAD fails, try GET as fallback
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GoogleMapsResolver/1.0)",
        },
      });

      clearTimeout(timeout);
      return NextResponse.json({ url: response.url, status: response.status });
    } catch (fallbackError: any) {
      return NextResponse.json(
        { error: "Gagal meresolve URL", detail: fallbackError?.message || "Unknown error" },
        { status: 500 }
      );
    }
  }
}
