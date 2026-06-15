import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ejyqtuzlcdnuuzgqfweo.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeXF0dXpsY2RudXV6Z3Fmd2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDQzMDAsImV4cCI6MjA5NjgyMDMwMH0.x8lX4hFsvOAbkUx0PHou-DsIKJ4nWNfD_2QFBGmgwYQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
