"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function BuilderDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/builder/pages");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Mengarahkan...</p>
      </div>
    </div>
  );
}
