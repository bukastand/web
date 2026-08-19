import { createClient, type SupportedStorage } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ejyqtuzlcdnuuzgqfweo.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXF0dXpsY2RudXV6Z3Fmd2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDQzMDAsImV4cCI6MjA5NjgyMDMwMH0.x8lX4hFsvOAbkUx0PHou-DsIKJ4nWNfD_2QFBGmgwYQ";

// Fallback in-memory storage so auth never hangs when localStorage
// is unavailable (e.g. mobile private browsing / blocked storage).
const memoryStorage = new Map<string, string>();

const safeStorage: SupportedStorage = {
  getItem: (key: string) => {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch {}
    return memoryStorage.get(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    memoryStorage.set(key, value);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string) => {
    memoryStorage.delete(key);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch {}
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    persistSession: true,
  },
});