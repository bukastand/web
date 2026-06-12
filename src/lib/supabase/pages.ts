import { supabase } from "@/lib/supabase";
import type { BuilderPage } from "@/lib/builder/types";

/**
 * Fetch all builder pages for a specific user from Supabase.
 * Falls back to empty array on error.
 */
export async function fetchPages(userId: string): Promise<BuilderPage[]> {
  try {
    const { data, error } = await supabase
      .from("builder_pages")
      .select("data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchPages error:", error.message);
      return [];
    }

    // Extract and parse the page data from each row
    const pages = (data || [])
      .map((row: any) => row.data as BuilderPage)
      .filter(Boolean);

    return pages;
  } catch (err) {
    console.warn("Supabase fetchPages exception:", err);
    return [];
  }
}

/**
 * Save (upsert) a single builder page to Supabase.
 * Uses the page's internal id as the primary key.
 */
export async function savePage(userId: string, page: BuilderPage): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("builder_pages")
      .upsert(
        {
          id: page.id,
          user_id: userId,
          data: page,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id, user_id" }
      );

    if (error) {
      console.warn("Supabase savePage error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase savePage exception:", err);
    return false;
  }
}

/**
 * Save multiple pages to Supabase at once.
 * Useful for full sync after loading or bulk operations.
 */
export async function savePages(userId: string, pages: BuilderPage[]): Promise<boolean> {
  try {
    const records = pages.map((page) => ({
      id: page.id,
      user_id: userId,
      data: page,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("builder_pages")
      .upsert(records, { onConflict: "id, user_id" });

    if (error) {
      console.warn("Supabase savePages error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase savePages exception:", err);
    return false;
  }
}

/**
 * Delete a builder page from Supabase.
 */
export async function deletePage(userId: string, pageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("builder_pages")
      .delete()
      .eq("id", pageId)
      .eq("user_id", userId);

    if (error) {
      console.warn("Supabase deletePage error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase deletePage exception:", err);
    return false;
  }
}
