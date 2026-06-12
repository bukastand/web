"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Stat {
  label: string;
  count: number;
  icon: string;
  href: string;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Layanan", count: 0, icon: "🛠️", href: "/admin/dashboard/services", color: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Paket Harga", count: 0, icon: "💰", href: "/admin/dashboard/pricing", color: "from-blue-500/20 to-blue-500/5" },
    { label: "Portfolio", count: 0, icon: "🖼️", href: "/admin/dashboard/portfolio", color: "from-purple-500/20 to-purple-500/5" },
    { label: "Keunggulan", count: 0, icon: "⭐", href: "/admin/dashboard/why-us", color: "from-yellow-500/20 to-yellow-500/5" },
  ]);

  useEffect(() => {
    async function loadCounts() {
      const [
        { count: servicesCount },
        { count: pricingCount },
        { count: portfolioCount },
        { count: whyUsCount },
      ] = await Promise.all([
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("pricing").select("*", { count: "exact", head: true }),
        supabase.from("portfolio").select("*", { count: "exact", head: true }),
        supabase.from("why_us").select("*", { count: "exact", head: true }),
      ]);

      setStats([
        { label: "Layanan", count: servicesCount ?? 0, icon: "🛠️", href: "/admin/dashboard/services", color: "from-emerald-500/20 to-emerald-500/5" },
        { label: "Paket Harga", count: pricingCount ?? 0, icon: "💰", href: "/admin/dashboard/pricing", color: "from-blue-500/20 to-blue-500/5" },
        { label: "Portfolio", count: portfolioCount ?? 0, icon: "🖼️", href: "/admin/dashboard/portfolio", color: "from-purple-500/20 to-purple-500/5" },
        { label: "Keunggulan", count: whyUsCount ?? 0, icon: "⭐", href: "/admin/dashboard/why-us", color: "from-yellow-500/20 to-yellow-500/5" },
      ]);
    }
    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Selamat datang di panel manajemen konten PAGODA STUDIO
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 p-6 hover:border-[#22c55e]/40 transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {stat.count}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
              <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">
                {stat.icon}
              </span>
            </div>
            <div className="mt-4 text-xs text-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity">
              Kelola →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Tautan Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Edit Hero Section", href: "/admin/dashboard/hero", desc: "Ubah teks utama dan tombol CTA" },
            { label: "Atur Layanan", href: "/admin/dashboard/services", desc: "Tambah/edit layanan yang ditawarkan" },
            { label: "Atur Paket Harga", href: "/admin/dashboard/pricing", desc: "Kelola paket dan fitur" },
            { label: "Tambah Portfolio", href: "/admin/dashboard/portfolio", desc: "Update galeri project" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#22c55e]/40 transition-all duration-300 group"
            >
              <h3 className="text-white font-medium group-hover:text-[#22c55e] transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
