import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Verify that the request is from an authenticated admin.
 */
function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  if (cookieHeader.includes("admin_session=authenticated")) {
    return true;
  }
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    return true;
  }
  return false;
}

/**
 * POST /api/admin/users/builder-pages
 * Get all builder pages for a specific user
 */
export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch builder pages
    const { data: pages, error } = await adminClient
      .from("builder_pages")
      .select("id, data, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also fetch published pages
    const { data: published } = await adminClient
      .from("published_pages")
      .select("slug, title, updated_at")
      .eq("user_id", userId);

    const publishedSlugs = new Set((published || []).map((p) => p.slug));

    // Parse data and build response
    const result = (pages || []).map((page: any) => {
      const pageData = typeof page.data === "string" ? JSON.parse(page.data) : page.data;
      return {
        id: page.id,
        title: pageData?.title || "Untitled",
        slug: pageData?.slug || null,
        sections_count: pageData?.sections?.length || 0,
        published: publishedSlugs.has(pageData?.slug) || pageData?.published || false,
        updated_at: page.updated_at,
      };
    });

    return NextResponse.json({ pages: result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
