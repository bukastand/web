"use client";

import { useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import { useParams, useRouter } from "next/navigation";
import BuilderEditor from "@/components/builder/BuilderEditor";

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = useBuilder();
  const pageId = params.pageId as string;

  useEffect(() => {
    if (pageId) {
      dispatch({ type: "SET_CURRENT_PAGE", pageId });
    }
  }, [pageId, dispatch]);

  const pageExists = state.pages.some((p) => p.id === pageId);

  if (!pageExists) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h1>
          <button onClick={() => router.push("/builder")} className="text-[#22c55e] hover:underline">
            Kembali ke Builder
          </button>
        </div>
      </div>
    );
  }

  return <BuilderEditor />;
}
