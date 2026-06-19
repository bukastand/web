import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey);
}

async function fetchAuthUsers(): Promise<Record<string, string>> {
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
  return authEmails;
}

/**
 * GET /api/admin/users - List all users with their profiles
 */
export async function GET() {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const adminClient = getAdminClient();
    const { data: users, error } = await adminClient
      .from("profiles")
      .select(`id, full_name, role, created_at, updated_at`)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const authEmails = await fetchAuthUsers();
    const result = (users || []).map((profile) => ({
      ...profile,
      email: authEmails[profile.id] || "—",
    }));

    return NextResponse.json({ users: result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users - Update a user's role
 */
export async function PATCH(request: Request) {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
    if (role !== "admin" && role !== "user") return NextResponse.json({ error: "Role must be 'admin' or 'user'" }, { status: 400 });

    const adminClient = getAdminClient();
    const { error } = await adminClient
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, userId, role });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users - Delete a user and all their data
 */
export async function DELETE(request: Request) {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const adminClient = getAdminClient();

    // Step 1: Delete user's published pages
    await adminClient.from("published_pages").delete().eq("user_id", userId);

    // Step 2: Delete user's builder pages
    await adminClient.from("builder_pages").delete().eq("user_id", userId);

    // Step 3: Delete user's community templates
    await adminClient.from("community_templates").delete().eq("user_id", userId);

    // Step 4: Delete user's profile
    await adminClient.from("profiles").delete().eq("id", userId);

    // Step 5: Delete auth user via Admin API
    const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey },
    });

    if (!deleteRes.ok) {
      const errText = await deleteRes.text();
      return NextResponse.json({ error: `Gagal hapus auth user: ${errText}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User dan semua data berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
