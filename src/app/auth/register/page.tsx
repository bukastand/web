"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { templates, createPageFromTemplate } from "@/lib/builder/templates";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Read template param from URL (client-side only, avoids Suspense boundary issue)
  const getSelectedTemplate = () => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get("template");
    if (!templateId) return null;
    return templates.find((t) => t.id === templateId) || null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // If Supabase requires email confirmation (user already exists)
    if (data?.user?.identities?.length === 0) {
      setSuccess("Email ini sudah terdaftar. Silakan login.");
      setLoading(false);
      return;
    }

    // Profile akan auto-created via database trigger (handle_new_user)
    // Tapi jika trigger belum jalan, kita buat manual
    if (data.session?.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.session.user.id,
          full_name: name,
          role: "user",
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Trigger seharusnya sudah handle ini
      }

      setSuccess("Akun berhasil dibuat! Mengarahkan ke builder...");
      document.cookie = "builder_session=authenticated; path=/; max-age=86400";
      document.cookie = "user_role=user; path=/; max-age=86400";
      
      // If user came from a template, create the page from template first
      const selectedTemplate = getSelectedTemplate();
      if (selectedTemplate) {
        try {
          const page = createPageFromTemplate(selectedTemplate);
          await supabase.from("builder_pages").insert({
            id: page.id,
            user_id: data.session.user.id,
            data: page,
            created_at: page.createdAt,
            updated_at: page.updatedAt,
          });
          setTimeout(() => {
            router.push(`/builder/${page.id}`);
          }, 1500);
        } catch {
          setTimeout(() => {
            router.push("/builder");
          }, 1500);
        }
      } else {
        setTimeout(() => {
          router.push("/builder");
        }, 1500);
      }
    } else {
      // Email confirmation required
      setSuccess("Pendaftaran berhasil! Cek email Anda untuk konfirmasi, lalu login.");
      setLoading(false);
    }
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
          <p className="text-gray-400 mt-2">Daftar akun baru untuk membuat website</p>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleRegister}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30 transition-colors"
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-[#22c55e] hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
