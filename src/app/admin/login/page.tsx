"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const attemptsRef = useRef(0);
  const lastAttemptRef = useRef(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Rate limiting: max 5 attempts per 30 seconds
    const now = Date.now();
    if (now - lastAttemptRef.current < 30000) {
      attemptsRef.current++;
      if (attemptsRef.current > 5) {
        const waitSeconds = Math.ceil((30000 - (now - lastAttemptRef.current)) / 1000);
        setError(`Terlalu banyak percobaan. Coba lagi ${waitSeconds} detik lagi.`);
        setLoading(false);
        return;
      }
    } else {
      attemptsRef.current = 1;
      lastAttemptRef.current = now;
    }

    const { error: authError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Login gagal");
      setLoading(false);
      return;
    }

    // Verify user has admin role from profiles table
    // Verify user has admin role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile query error:", profileError);
      setError("Gagal verifikasi akun: " + profileError.message);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (!profile) {
      console.warn("No profile found for user:", data.user.id);
      setError("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.role !== "admin") {
      setError("Akses ditolak. Anda tidak memiliki izin admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Set cookies for middleware protection
    document.cookie = "admin_session=authenticated; path=/; max-age=86400; SameSite=Lax; Secure";
    document.cookie = "user_role=admin; path=/; max-age=86400; SameSite=Lax; Secure";
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">
            PAGODA<span className="text-[#22c55e]"> ADMIN</span>
          </h1>
          <p className="text-gray-400 mt-2">Login ke dashboard admin</p>
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
              placeholder="admin@example.com"
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
        </form>
      </div>
    </div>
  );
}
