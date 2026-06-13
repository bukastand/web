import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/users - List all users with their profiles
 * Uses service_role key to bypass RLS
 */
export async function GET() {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Service role key not configured" },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch profiles with auth.users email via a raw query
    const { data: users, error } = await adminClient
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch emails from auth.users for each user
    // We can only query auth.users via the Management API or auth admin
    // So let's use the service role key to call the Auth Admin API
    const authEmails: Record<string, string> = {};

    try {
      const authRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
          },
        }
      );

      if (authRes.ok) {
        const authData = await authRes.json();
        const userList = authData.users || [];
        for (const u of userList) {
          authEmails[u.id] = u.email;
        }
      }
    } catch {
      // Auth admin API might not be available, skip emails
    }

    // Merge emails into user data
    const result = (users || []).map((profile) => ({
      ...profile,
      email: authEmails[profile.id] || "—",
    }));

    return NextResponse.json({ users: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users - Update a user's role
 */
export async function PATCH(request: Request) {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Service role key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { error: "Role must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await adminClient
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId, role });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
