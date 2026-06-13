import { supabase } from "@/lib/supabase";
import type { BuilderPage } from "@/lib/builder/types";

/**
 * Fetch a published page by its slug.
 * Anyone can view published pages (public access via RLS).
 */
export async function fetchPublishedPage(slug: string): Promise<BuilderPage | null> {
  try {
    const { data, error } = await supabase
      .from("published_pages")
      .select("data")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows
      console.warn("Supabase fetchPublishedPage error:", error.message);
      return null;
    }

    return (data?.data as BuilderPage) || null;
  } catch (err) {
    console.warn("Supabase fetchPublishedPage exception:", err);
    return null;
  }
}

/**
 * Publish or update a page snapshot in Supabase.
 */
export async function publishPage(
  userId: string,
  slug: string,
  title: string,
  pageData: BuilderPage
): Promise<boolean> {
  try {
    const { error } = await supabase.from("published_pages").upsert(
      {
        slug,
        user_id: userId,
        title,
        data: pageData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.warn("Supabase publishPage error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase publishPage exception:", err);
    return false;
  }
}

/**
 * Unpublish a page (delete from published_pages).
 */
export async function unpublishPage(userId: string, slug: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("published_pages")
      .delete()
      .eq("slug", slug)
      .eq("user_id", userId);

    if (error) {
      console.warn("Supabase unpublishPage error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase unpublishPage exception:", err);
    return false;
  }
}
