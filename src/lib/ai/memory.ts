/**
 * AI Memory System — hybrid storage for collective AI learning
 *
 * Global Memory (Supabase):
 *   - Anonymized successful generations from ALL users
 *   - Only 4-5 star ratings are used as few-shot examples
 *   - Queried by category/style similarity for relevant examples
 *
 * Local Memory (localStorage):
 *   - Per-user preferences (colors, fonts, layouts)
 *   - User's own generation history
 *   - Used for personalization
 */
import { supabase } from "@/lib/supabase";
import type { BuilderPage } from "@/lib/builder/types";

// ─── Types ───────────────────────────────────────────

export interface AIUserPreference {
  /** Favorite background colors (hex) */
  bgColors: string[];
  /** Favorite accent colors (hex) */
  accentColors: string[];
  /** Favorite fonts */
  fonts: string[];
  /** Average section count */
  avgSectionCount: number;
  /** Preferred layout patterns */
  layoutPatterns: string[];
  /** Total generations completed */
  totalGenerations: number;
}

export interface AIMemoryEntry {
  id: string;
  prompt: string;
  category: string | null;
  style_tags: string[];
  section_count: number;
  /** Anonymized page structure — no user data */
  page_structure: any;
  rating: number;
  used_count: number;
  created_at: string;
}

export interface AIProjectMemory {
  id?: string;
  prompt: string;
  category?: string;
  styleTags?: string[];
  pageStructure: any;
  rating?: number;
  timestamp?: number;
}

// ─── Local Storage Keys ────────────────────────────

const LOCAL_MEMORY_KEY = "ai_local_memory";
const LOCAL_PREF_KEY = "ai_user_preferences";
const MAX_LOCAL_MEMORIES = 50;

function storageKey(userId: string | null): string {
  return userId ? `ai_local_memory_${userId}` : "ai_local_memory_anonymous";
}

function prefKey(userId: string | null): string {
  return userId ? `ai_user_prefs_${userId}` : "ai_user_prefs_anonymous";
}

// ─── Local Memory Operations ───────────────────────

export function loadLocalMemories(userId: string | null): AIProjectMemory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalMemory(
  userId: string | null,
  memory: AIProjectMemory
): void {
  if (typeof window === "undefined") return;
  try {
    const memories = loadLocalMemories(userId);
    memories.unshift(memory);
    // Keep only latest MAX_LOCAL_MEMORIES
    if (memories.length > MAX_LOCAL_MEMORIES) {
      memories.length = MAX_LOCAL_MEMORIES;
    }
    localStorage.setItem(storageKey(userId), JSON.stringify(memories));
  } catch {}
}

export function clearLocalMemories(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {}
}

// ─── User Preferences ──────────────────────────────

export function loadUserPreferences(
  userId: string | null
): AIUserPreference | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(prefKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserPreferences(
  userId: string | null,
  prefs: AIUserPreference
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(prefKey(userId), JSON.stringify(prefs));
  } catch {}
}

/**
 * Update user preferences based on a new generation
 */
export function updatePreferencesFromGeneration(
  userId: string | null,
  page: BuilderPage
): void {
  const existing = loadUserPreferences(userId) || {
    bgColors: [],
    accentColors: [],
    fonts: [],
    avgSectionCount: 0,
    layoutPatterns: [],
    totalGenerations: 0,
  };

  // Update counts
  existing.totalGenerations++;
  existing.avgSectionCount =
    (existing.avgSectionCount * (existing.totalGenerations - 1) +
      page.sections.length) /
    existing.totalGenerations;

  // Extract colors from sections
  for (const section of page.sections) {
    const bg = section.styles.backgroundColor;
    if (bg && bg !== "transparent" && !existing.bgColors.includes(bg)) {
      existing.bgColors.unshift(bg);
      if (existing.bgColors.length > 5) existing.bgColors.length = 5;
    }
  }

  // Extract fonts
  const font = page.globalStyles.fontFamily;
  if (font && !existing.fonts.includes(font)) {
    existing.fonts.unshift(font);
    if (existing.fonts.length > 3) existing.fonts.length = 3;
  }

  saveUserPreferences(userId, existing);
}

// ─── Global Memory (Supabase) Operations ─────────

/**
 * Save a successful generation to Supabase (anonymous)
 */
export async function saveGlobalMemory(
  prompt: string,
  category: string | undefined,
  styleTags: string[],
  page: BuilderPage,
  rating?: number
): Promise<boolean> {
  try {
    // Anonymize: strip any user-specific data
    const anonymized = {
      sections: page.sections.map((s) => ({
        sectionType: s.styles.containerWidth || "boxed",
        styles: {
          backgroundColor: s.styles.backgroundColor,
          containerWidth: s.styles.containerWidth,
          padding: s.styles.padding,
        },
        columnCount: s.columns.length,
        elementTypes: s.columns.flatMap((c) =>
          c.elements.map((e) => e.type)
        ),
      })),
      globalStyles: {
        fontFamily: page.globalStyles.fontFamily,
        containerWidth: page.globalStyles.containerWidth,
      },
      style_tags: styleTags,
    };

    const { error } = await supabase.from("ai_memory").insert({
      prompt,
      category: category || null,
      style_tags: styleTags,
      section_count: page.sections.length,
      page_structure: anonymized,
      rating: rating || 0,
      used_count: 0,
    });

    if (error) {
      console.warn("saveGlobalMemory error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("saveGlobalMemory exception:", err);
    return false;
  }
}

/**
 * Query best memories from Supabase for few-shot prompting
 * Returns top-rated, most relevant memories
 */
export async function queryBestMemories(
  category?: string,
  limit: number = 3
): Promise<AIMemoryEntry[]> {
  try {
    let query = supabase
      .from("ai_memory")
      .select("*")
      .gte("rating", 4) // Only 4+ star memories
      .order("rating", { ascending: false })
      .order("used_count", { ascending: true })
      .limit(limit);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("queryBestMemories error:", error.message);
      return [];
    }

    // Increment used_count for returned memories (fire & forget)
    if (data && data.length > 0) {
      for (const mem of data) {
        supabase
          .from("ai_memory")
          .update({ used_count: (mem.used_count || 0) + 1 })
          .eq("id", mem.id)
          .then(() => {}, () => {}); // Swallow errors — non-critical
      }
    }

    return (data as AIMemoryEntry[]) || [];
  } catch (err) {
    console.warn("queryBestMemories exception:", err);
    return [];
  }
}

/**
 * Search memories by prompt similarity
 */
export async function searchMemories(
  searchText: string,
  limit: number = 5
): Promise<AIMemoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from("ai_memory")
      .select("*")
      .gte("rating", 3)
      .textSearch("prompt", searchText, {
        type: "plain",
        config: "simple",
      })
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("searchMemories error:", error.message);
      return [];
    }
    return (data as AIMemoryEntry[]) || [];
  } catch (err) {
    console.warn("searchMemories exception:", err);
    return [];
  }
}

/**
 * Update rating for a memory
 */
export async function rateMemory(
  memoryId: string,
  rating: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("ai_memory")
      .update({ rating })
      .eq("id", memoryId);

    if (error) {
      console.warn("rateMemory error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("rateMemory exception:", err);
    return false;
  }
}

// ─── Helper: Build few-shot examples string for prompts ───

/**
 * Build a few-shot examples block from memories for prompt injection
 */
export function buildFewShotExamples(memories: AIMemoryEntry[]): string {
  if (memories.length === 0) return "";

  let result =
    "\n\n--- REFERENSI PROYEK SEBELUMNYA (gunakan sebagai inspirasi) ---\n";

  for (let i = 0; i < memories.length; i++) {
    const mem = memories[i];
    const structure = mem.page_structure;

    result += `\nContoh ${i + 1} (rating: ${mem.rating}/5, kategori: ${
      mem.category || "umum"
    }):\n`;
    result += `Prompt asli: "${mem.prompt.substring(0, 100)}"\n`;
    result += `Jumlah section: ${mem.section_count}\n`;

    if (structure?.sections) {
      result += `Struktur: `;
      const types = structure.sections.map(
        (s: any) => s.sectionType || "section"
      );
      result += types.join(" → ");
      result += "\n";
    }

    if (structure?.globalStyles) {
      const gs = structure.globalStyles;
      result += `Style: font=${gs.fontFamily || "Inter"}, container=${
        gs.containerWidth || 1200
      }px\n`;
    }
  }

  result +=
    "\n--- GAYA DI ATAS HANYA REFERENSI. BUAT DESAIN YANG SEGAR DAN UNIK! ---\n";
  return result;
}

/**
 * Build user preference string for prompt injection
 */
export function buildPreferenceString(
  prefs: AIUserPreference | null
): string {
  if (!prefs) return "";

  const parts: string[] = [];

  if (prefs.bgColors.length > 0) {
    parts.push(
      `Warna favorit: ${prefs.bgColors.slice(0, 3).join(", ")}`
    );
  }
  if (prefs.fonts.length > 0) {
    parts.push(`Font favorit: ${prefs.fonts[0]}`);
  }
  if (prefs.totalGenerations > 0) {
    parts.push(
      `Pengalaman: sudah membuat ${prefs.totalGenerations} website sebelumnya`
    );
  }

  if (parts.length === 0) return "";

  return `\n--- PREFERENSI USER ---\n${parts.join("\n")}\n`;
}
