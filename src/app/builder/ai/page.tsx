"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBuilder } from "@/lib/builder/store";
import { getAIConfig, getApiKeyUrl, type AIProvider } from "@/lib/ai";
import { AIPanel } from "@/components/builder/ai/AIPanel";
import { SandboxPreview } from "@/components/builder/ai/SandboxPreview";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AIBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat...</p>
        </div>
      </div>
    }>
      <AIBuilderPageContent />
    </Suspense>
  );
}

function AIBuilderPageContent() {
  const { user, loading: authLoading } = useAuth();
  const { state, dispatch, currentPage, createNewPage } = useBuilder();
  const [pageCreated, setPageCreated] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Wait for client-side hydration to complete before acting on search params
  useEffect(() => { setMounted(true); }, []);

  const searchParams = useSearchParams();
  const pageIdParam = searchParams.get("pageId");

  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [generatedSectionsJson, setGeneratedSectionsJson] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [pendingPageTitle, setPendingPageTitle] = useState("");

  // Single effect to handle both cases without race condition:
  // - If pageId is provided → set existing page as current
  // - If no pageId → create a fresh new page
  useEffect(() => {
    if (!authLoading && user && !pageCreated && mounted) {
      if (pageIdParam) {
        const targetPage = state.pages.find(p => p.id === pageIdParam);
        if (targetPage) {
          dispatch({ type: "SET_CURRENT_PAGE", pageId: pageIdParam });
        }
      } else {
        createNewPage("AI Generated Page");
      }
      setPageCreated(true);
    }
  }, [pageIdParam, authLoading, user, pageCreated, mounted, state.pages, dispatch, createNewPage]);

  // Check if AI is configured
  useEffect(() => {
    const config = getAIConfig();
    if (!config) {
      setAiConfigOpen(true);
    }
  }, []);

  const handleGenerate = useCallback((title: string, sectionsJson: string) => {
    setPendingPageTitle(title);
    setGeneratedSectionsJson(sectionsJson);
    setShowPreview(true);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-white mb-3">Login Diperlukan</h1>
          <p className="text-gray-400 mb-8">Silakan login untuk menggunakan AI Builder</p>
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all"
          >
            Masuk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 bg-[#0f172a] border-b border-white/10 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/builder" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-bold tracking-wider text-[#22c55e] group-hover:text-[#22c55e]/80">PAGODASTUDIO</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <h1 className="text-sm font-semibold text-white">
            <span className="text-purple-400">AI</span> Website Builder
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiConfigOpen(!aiConfigOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            <span>🔑</span>
            <span>API Key</span>
          </button>
          <Link
            href="/builder/pages"
            className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Halaman Saya
          </Link>
        </div>
      </header>

      {/* AI Config Panel (dropdown) */}
      {aiConfigOpen && (
        <div className="absolute top-14 right-4 z-50 w-80 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Konfigurasi AI</h3>
            <button onClick={() => setAiConfigOpen(false)} className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <AIConfigPanel onClose={() => setAiConfigOpen(false)} />
        </div>
      )}

      {/* Main Content — 2 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: AI Panel */}
        <div className="w-[420px] min-w-[380px] border-r border-white/10 overflow-y-auto bg-[#0f172a]">
          <AIPanel
            onGenerate={handleGenerate}
            onOpenConfig={() => setAiConfigOpen(true)}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="flex-1 overflow-hidden bg-[#0a0f1a]">
          <SandboxPreview
            sectionsJson={generatedSectionsJson}
            showPreview={showPreview}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Inline AI Config Panel component
 */
function AIConfigPanel({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const config = getAIConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setSaved(true);
    }
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    try {
      const { testApiKey, saveAIConfig } = await import("@/lib/ai");
      const ok = await testApiKey({ provider, apiKey: apiKey.trim() });
      if (ok) {
        saveAIConfig({ provider, apiKey: apiKey.trim() });
        setSaved(true);
        onClose();
      } else {
        alert("API Key tidak valid. Silakan cek kembali.");
      }
    } catch (err) {
      alert("Gagal memverifikasi API Key: " + (err instanceof Error ? err.message : "Koneksi error") + "\nCoba periksa koneksi internet Anda.");
    }
  };

  const providerInfo: Record<AIProvider, { emoji: string; label: string; desc: string }> = {
    gemini: { emoji: "🔮", label: "Gemini", desc: "Gratis 1.500 req/hari" },
    groq: { emoji: "⚡", label: "Groq", desc: "Super cepat, gratis" },
    openai: { emoji: "🟢", label: "OpenAI", desc: "GPT-4o, premium" },
    claude: { emoji: "🟣", label: "Claude", desc: "Sonnet, premium" },
    deepseek: { emoji: "🔵", label: "DeepSeek", desc: "Murah, performa tinggi" },
    mistral: { emoji: "🔶", label: "Mistral", desc: "Open source, premium" },
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] text-gray-500 mb-1.5">Pilih Provider AI</label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(providerInfo).map(([key, info]) => {
            const isActive = provider === key;
            const borderColor = isActive
              ? key === "gemini" ? "border-blue-500/50"
                : key === "groq" ? "border-purple-500/50"
                : key === "openai" ? "border-emerald-500/50"
                : key === "claude" ? "border-orange-500/50"
                : key === "deepseek" ? "border-cyan-500/50"
                : "border-yellow-500/50"
              : "border-white/10";
            const bgColor = isActive
              ? key === "gemini" ? "bg-blue-500/10"
                : key === "groq" ? "bg-purple-500/10"
                : key === "openai" ? "bg-emerald-500/10"
                : key === "claude" ? "bg-orange-500/10"
                : key === "deepseek" ? "bg-cyan-500/10"
                : "bg-yellow-500/10"
              : "bg-white/5";
            return (
              <button
                key={key}
                onClick={() => setProvider(key as AIProvider)}
                className={`p-2 rounded-lg border text-left transition-all ${borderColor} ${bgColor}`}
              >
                <span className="text-xs">{info.emoji} {info.label}</span>
                <p className="text-[9px] text-gray-500 mt-0.5">{info.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder={`${providerInfo[provider]?.label || "AI"} API Key`}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
      />
      <a
        href={getApiKeyUrl(provider)}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[10px] text-purple-400 hover:text-purple-300"
      >
        Dapatkan API Key {providerInfo[provider]?.label} →
      </a>
      <button
        onClick={handleSave}
        disabled={!apiKey.trim()}
        className="w-full py-2 rounded-lg text-xs font-semibold bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saved ? "Update & Simpan" : "Simpan API Key"}
      </button>
    </div>
  );
}
