"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Login gagal");
      setLoading(false);
      return;
    }

    // Get user role from profiles table
    let role = "user";
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      role = profile.role;
    } else {
      // Existing user without profile — create one (e.g. before the DB trigger existed)
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || null,
        role: "user",
        updated_at: new Date().toISOString(),
      });
    }

    // Set cookies for middleware protection (30 days)
    document.cookie = "builder_session=authenticated; path=/; max-age=2592000; SameSite=Lax; Secure";
    document.cookie = `user_role=${role}; path=/; max-age=2592000; SameSite=Lax; Secure`;
    router.push("/builder");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">
              PAGODA<span className="text-[#22c55e]"> BUILDER</span>
            </h1>
          </Link>
          <p className="text-gray-400 mt-2">Login untuk mengakses website builder</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-[#22c55e] hover:underline">
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
