import { NextRequest, NextResponse } from "next/server";

/**
 * Allowed hostnames for URL resolution.
 * Only Google Maps URLs are permitted to prevent SSRF.
 */
const ALLOWED_HOSTS = [
  "google.com",
  "www.google.com",
  "maps.google.com",
  "maps.googleapis.com",
  "share.google.com",
  "share.google",
];

/**
 * Validate that a URL is safe to resolve (no SSRF).
 * Only allows Google Maps URLs.
 */
function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    // Only allow http/https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    // Check against allowed hosts
    const allowed = ALLOWED_HOSTS.some((host) => hostname === host || hostname.endsWith("." + host));
    return allowed;
  } catch {
    return false;
  }
}

/**
 * Try to extract a redirect URL from HTML content.
 * share.google links often use JavaScript redirects (location.replace),
 * not HTTP redirects, so a plain fetch won't follow them.
 */
function extractRedirectFromHtml(html: string): string | null {
  // <meta http-equiv="refresh" content="0;url=..." />
  const metaMatch = html.match(
    /<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;\s*url=([^"'>\s]+)["']/i
  );
  if (metaMatch) return metaMatch[1];

  // <meta ... content="0;url=..." http-equiv="refresh" />
  const metaMatch2 = html.match(
    /content=["']\d+;\s*url=([^"'>\s]+)["'][^>]+http-equiv=["']refresh["']/i
  );
  if (metaMatch2) return metaMatch2[1];

  // window.location.href = "..." or location.replace("...")
  const jsMatch = html.match(
    /(?:window\.)?location\.(?:href|replace)\s*=\s*["']([^"']+)["']/
  );
  if (jsMatch) return jsMatch[1];

  // location.assign("...") or window.location.assign("...")
  const assignMatch = html.match(
    /(?:window\.)?location\.assign\s*\(\s*["']([^"']+)["']\s*\)/
  );
  if (assignMatch) return assignMatch[1];

  return null;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  // ── SSRF Protection: validate URL before fetching ──
  if (!isAllowedUrl(rawUrl)) {
    return NextResponse.json(
      { error: "URL tidak diizinkan. Hanya Google Maps URLs yang diperbolehkan." },
      { status: 403 }
    );
  }

  const isShareGoogle = rawUrl.includes("share.google");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // For share.google links, use GET directly (HEAD may not follow JS redirects)
    const method = isShareGoogle ? "GET" : "HEAD";
    const response = await fetch(rawUrl, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    let finalUrl = response.url;

    // If the URL hasn't changed, the redirect might be JavaScript-based
    // Parse the HTML to find the actual redirect URL
    if (finalUrl === rawUrl && response.ok) {
      const text = await response.text();
      const extracted = extractRedirectFromHtml(text);
      if (extracted) {
        finalUrl = extracted;
      }
    }

    clearTimeout(timeout);
    return NextResponse.json({ url: finalUrl, status: response.status });
  } catch (error: any) {
    // If the preferred method failed, try the other method
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const fallbackMethod = isShareGoogle ? "HEAD" : "GET";
      const response = await fetch(rawUrl, {
        method: fallbackMethod,
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
      });

      let finalUrl = response.url;

      // Try to parse HTML for JS redirect if URL didn't change
      if (finalUrl === rawUrl && response.ok) {
        const text = await response.text();
        const extracted = extractRedirectFromHtml(text);
        if (extracted) {
          finalUrl = extracted;
        }
      }

      clearTimeout(timeout);
      return NextResponse.json({ url: finalUrl, status: response.status });
    } catch (fallbackError: any) {
      return NextResponse.json(
        { error: "Gagal meresolve URL", detail: fallbackError?.message || "Unknown error" },
        { status: 500 }
      );
    }
  }
}
