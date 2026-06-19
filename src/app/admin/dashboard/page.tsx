"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface ExtendedStats {
  totalUsers: number;
  totalAdmins: number;
  totalPages: number;
  totalPublished: number;
  totalTemplates: number;
  totalContacts: number;
  newUsersThisMonth: number;
  newUsersByMonth: { month: string; count: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    services: 0, pricing: 0, portfolio: 0, whyUs: 0,
  });
  const [extended, setExtended] = useState<ExtendedStats>({
    totalUsers: 0, totalAdmins: 0, totalPages: 0, totalPublished: 0,
    totalTemplates: 0, totalContacts: 0, newUsersThisMonth: 0,
    newUsersByMonth: [],
  });

  const newUsersThisMonth = extended.newUsersThisMonth;

  useEffect(() => {
    async function load() {
      const [
        { count: servicesCount },
        { count: pricingCount },
        { count: portfolioCount },
        { count: whyUsCount },
        usersRes,
        pagesRes,
        templatesRes,
      ] = await Promise.all([
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("pricing").select("*", { count: "exact", head: true }),
        supabase.from("portfolio").select("*", { count: "exact", head: true }),
        supabase.from("why_us").select("*", { count: "exact", head: true }),
        fetch("/api/admin/users"),
        supabase.from("builder_pages").select("*", { count: "exact", head: true }),
        supabase.from("community_templates").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        services: servicesCount ?? 0,
        pricing: pricingCount ?? 0,
        portfolio: portfolioCount ?? 0,
        whyUs: whyUsCount ?? 0,
      });

      const usersData = await usersRes.json();
      const users = usersData.users || [];

      // Count new users this month
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newThisMonth = users.filter((u: any) => new Date(u.created_at) >= firstOfMonth).length;

      // Group by month for chart
      const byMonth: Record<string, number> = {};
      users.forEach((u: any) => {
        const d = new Date(u.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        byMonth[key] = (byMonth[key] || 0) + 1;
      });

      setExtended({
        totalUsers: users.length,
        totalAdmins: users.filter((u: any) => u.role === "admin").length,
        totalPages: pagesRes.count ?? 0,
        totalPublished: 0,
        totalTemplates: templatesRes.count ?? 0,
        totalContacts: 0,
        newUsersThisMonth,
        newUsersByMonth: Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, count]) => ({ month, count })),
      });
    }
    load();
  }, []);

  const statCards = [
    { label: "Total User", count: extended.totalUsers, icon: "👥", href: "/admin/dashboard/users", color: "from-blue-500/20 to-blue-500/5" },
    { label: "Total Halaman", count: extended.totalPages, icon: "📄", href: "/admin/dashboard/pages", color: "from-purple-500/20 to-purple-500/5" },
    { label: "User Baru (Bln Ini)", count: extended.newUsersThisMonth, icon: "🎉", href: "/admin/dashboard/users", color: "from-green-500/20 to-green-500/5" },
    { label: "Template", count: extended.totalTemplates, icon: "📦", href: "/admin/dashboard/templates", color: "from-orange-500/20 to-orange-500/5" },
    { label: "Layanan", count: stats.services, icon: "🛠️", href: "/admin/dashboard/services", color: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Paket Harga", count: stats.pricing, icon: "💰", href: "/admin/dashboard/pricing", color: "from-blue-500/20 to-blue-500/5" },
    { label: "Portfolio", count: stats.portfolio, icon: "🖼️", href: "/admin/dashboard/portfolio", color: "from-purple-500/20 to-purple-500/5" },
    { label: "Keunggulan", count: stats.whyUs, icon: "⭐", href: "/admin/dashboard/why-us", color: "from-yellow-500/20 to-yellow-500/5" },
  ];

  const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const maxChartCount = Math.max(...extended.newUsersByMonth.map(m => m.count), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-gray-400 mb-8">Selamat datang di panel admin PAGODA STUDIO</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 p-5 hover:border-[#22c55e]/40 transition-all duration-300 group`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-white mb-0.5">{stat.count}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
              <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Registration Chart */}
      {extended.newUsersByMonth.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">📈 Pendaftaran User per Bulan</h2>
          <div className="flex items-end gap-2 h-32">
            {extended.newUsersByMonth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">{m.count}</span>
                <div
                  className="w-full bg-[#22c55e]/30 rounded-t hover:bg-[#22c55e]/50 transition-all"
                  style={{ height: `${(m.count / maxChartCount) * 100}%`, minHeight: m.count > 0 ? "8px" : "0" }}
                />
                <span className="text-[9px] text-gray-600">{monthNames[parseInt(m.month.split("-")[1]) - 1] || m.month.split("-")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">⚡ Tautan Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Manajemen User", href: "/admin/dashboard/users", desc: "Lihat, edit, hapus user" },
            { label: "Semua Halaman", href: "/admin/dashboard/pages", desc: "Kelola semua halaman builder" },
            { label: "Template Komunitas", href: "/admin/dashboard/templates", desc: "Setujui/tolak template" },
            { label: "Pengaturan", href: "/admin/dashboard/settings", desc: "Site name, kontak, dll" },
            { label: "Pesan Masuk", href: "/admin/dashboard/contacts", desc: "Lihat pesan dari pengunjung" },
            { label: "Sistem", href: "/admin/dashboard/system", desc: "Storage, migrasi, log" },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#22c55e]/40 transition-all duration-300 group">
              <h3 className="text-white font-medium text-sm group-hover:text-[#22c55e] transition-colors">{action.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
