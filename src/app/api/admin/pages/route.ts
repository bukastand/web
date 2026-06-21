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
 * GET /api/admin/pages - Get all builder pages from all users
 */
export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all builder pages
    const { data: pages, error } = await adminClient
      .from("builder_pages")
      .select("id, user_id, data, updated_at, created_at")
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get all user IDs to fetch emails
    const userIds = [...new Set((pages || []).map((p: any) => p.user_id))];

    // Fetch auth users for emails
    const authEmails: Record<string, string> = {};
    try {
      const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        headers: { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey },
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        for (const u of authData.users || []) {
          authEmails[u.id] = u.email;
        }
      }
    } catch {}

    // Fetch published pages to determine which are published
    const { data: published } = await adminClient
      .from("published_pages")
      .select("slug, user_id");

    const publishedSet = new Set((published || []).map((p: any) => `${p.user_id}:${p.slug}`));

    // Parse data and build response
    const result = (pages || []).map((page: any) => {
      const pageData = typeof page.data === "string" ? JSON.parse(page.data) : page.data;
      const slug = pageData?.slug || "";
      return {
        id: page.id,
        userId: page.user_id,
        userEmail: authEmails[page.user_id] || "—",
        title: pageData?.title || "Untitled",
        slug,
        sections: pageData?.sections?.length || 0,
        published: publishedSet.has(`${page.user_id}:${slug}`),
        created_at: page.created_at,
        updated_at: page.updated_at,
      };
    });

    return NextResponse.json({ pages: result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/pages - Delete a builder page
 */
export async function DELETE(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { pageId, userId } = body;

    if (!pageId || !userId) {
      return NextResponse.json({ error: "pageId and userId are required" }, { status: 400 });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Delete from builder_pages
    const { error } = await adminClient
      .from("builder_pages")
      .delete()
      .eq("id", pageId)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Halaman berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
