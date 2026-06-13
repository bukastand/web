import { supabase } from "@/lib/supabase";
import type { BuilderPage } from "@/lib/builder/types";

export interface CommunityTemplate {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  preview_color: string;
  data: BuilderPage;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Submit current page as a community template (user-initiated).
 */
export async function submitTemplate(
  userId: string,
  page: BuilderPage,
  options: {
    title?: string;
    description?: string;
    category?: string;
    icon?: string;
    previewColor?: string;
  } = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("community_templates").insert({
      user_id: userId,
      title: options.title || page.title,
      slug: page.slug,
      description: options.description || `Template dari ${page.title}`,
      category: options.category || "Lainnya",
      icon: options.icon || "📄",
      preview_color: options.previewColor || "from-gray-500 to-gray-600",
      data: JSON.parse(JSON.stringify(page)), // deep copy
      is_approved: false,
      is_active: true,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch approved community templates (for public gallery).
 */
export async function fetchApprovedTemplates(): Promise<CommunityTemplate[]> {
  try {
    const { data, error } = await supabase
      .from("community_templates")
      .select("*")
      .eq("is_approved", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchApprovedTemplates error:", error.message);
      return [];
    }
    return (data as CommunityTemplate[]) || [];
  } catch (err) {
    console.warn("fetchApprovedTemplates exception:", err);
    return [];
  }
}

/**
 * Fetch all templates (admin only - includes unapproved).
 */
export async function fetchAllTemplates(): Promise<CommunityTemplate[]> {
  try {
    const { data, error } = await supabase
      .from("community_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchAllTemplates error:", error.message);
      return [];
    }
    return (data as CommunityTemplate[]) || [];
  } catch (err) {
    console.warn("fetchAllTemplates exception:", err);
    return [];
  }
}

/**
 * Approve a template (admin action).
 */
export async function approveTemplate(templateId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("community_templates")
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq("id", templateId);

    if (error) {
      console.warn("approveTemplate error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("approveTemplate exception:", err);
    return false;
  }
}

/**
 * Reject/delete a template (admin action).
 */
export async function rejectTemplate(templateId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("community_templates")
      .delete()
      .eq("id", templateId);

    if (error) {
      console.warn("rejectTemplate error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("rejectTemplate exception:", err);
    return false;
  }
}

/**
 * Convert a CommunityTemplate to the Template format used by the gallery.
 */
export function communityToGalleryTemplate(ct: CommunityTemplate) {
  const pageData = ct.data;
  return {
    id: ct.id,
    title: ct.title,
    slug: ct.slug,
    description: ct.description,
    category: ct.category,
    previewColor: ct.preview_color,
    icon: ct.icon,
    isCommunity: true as const,
    sections: pageData.sections,
    globalStyles: pageData.globalStyles,
    createdAt: ct.created_at,
  };
}
