import { supabase } from "@/lib/supabase";

export interface Article {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

const emptyArticle: Article = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: null,
  author: "Admin",
  published: false,
};

export function getEmptyArticle(): Article {
  return { ...emptyArticle };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Auto-generate a unique slug from a title.
 * If slug exists, appends a number suffix.
 */
export async function generateSlug(title: string, excludeId?: number): Promise<string> {
  let base = slugify(title);
  if (!base) base = "artikel";
  let slug = base;
  let counter = 1;
  const maxIterations = 100;
  while (counter <= maxIterations) {
    const { data } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .single();
    if (!data || (excludeId && data.id === excludeId)) break;
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

/**
 * Fetch all published articles (public).
 */
export async function fetchPublishedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchPublishedArticles error:", error.message);
      return [];
    }
    return (data as Article[]) || [];
  } catch (err) {
    console.warn("fetchPublishedArticles exception:", err);
    return [];
  }
}

/**
 * Fetch a single published article by slug (public).
 */
export async function fetchPublishedArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      console.warn("fetchPublishedArticleBySlug error:", error.message);
      return null;
    }
    return data as Article;
  } catch (err) {
    console.warn("fetchPublishedArticleBySlug exception:", err);
    return null;
  }
}

/**
 * Fetch all articles for admin (including unpublished).
 */
export async function fetchAllArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchAllArticles error:", error.message);
      return [];
    }
    return (data as Article[]) || [];
  } catch (err) {
    console.warn("fetchAllArticles exception:", err);
    return [];
  }
}

/**
 * Save (insert or update) an article.
 */
export async function saveArticle(article: Article): Promise<boolean> {
  try {
    if (article.id) {
      const { error } = await supabase
        .from("articles")
        .update({ ...article, updated_at: new Date().toISOString() })
        .eq("id", article.id);
      if (error) {
        console.warn("saveArticle update error:", error.message);
        return false;
      }
    } else {
      const { error } = await supabase.from("articles").insert([article]);
      if (error) {
        console.warn("saveArticle insert error:", error.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn("saveArticle exception:", err);
    return false;
  }
}

/**
 * Delete an article by id.
 */
export async function deleteArticle(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.warn("deleteArticle error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("deleteArticle exception:", err);
    return false;
  }
}
