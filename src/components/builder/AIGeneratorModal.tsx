"use client";

import { useState, useEffect, useCallback } from "react";
import type { AIProvider, AIConfig, ProviderEntry } from "@/lib/ai";
import { getAIConfig, saveAIConfig, clearAIConfig, testApiKey, getApiKeyUrl, getProviderList, saveProviderEntry, removeProviderEntry, moveProviderPriority, generateSection, generateFullPage } from "@/lib/ai";
import { genId } from "@/lib/builder/defaults";

type GenerationMode = "section" | "website";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: GenerationMode;
  onApplySection: (sectionJson: string) => void;
  onApplyWebsite: (sectionsJson: string) => void;
}

export default function AIGeneratorModal({
  isOpen,
  onClose,
  mode,
  onApplySection,
  onApplyWebsite,
}: AIGeneratorModalProps) {
  const providerInfo: Record<AIProvider, { icon: string; name: string; desc: string; color: string }> = {
    gemini: { icon: "🔮", name: "Google Gemini", desc: "Gratis 1.500 req/hari", color: "#4285F4" },
    groq: { icon: "⚡", name: "Groq", desc: "Sangat cepat, gratis", color: "#F55036" },
    openai: { icon: "🤖", name: "OpenAI", desc: "Premium, kualitas terbaik", color: "#10A37F" },
    claude: { icon: "🧠", name: "Claude (Anthropic)", desc: "Premium, reasoning kuat", color: "#CC7831" },
    deepseek: { icon: "🐋", name: "DeepSeek", desc: "Premium, harga murah", color: "#4F46E5" },
    mistral: { icon: "🏔️", name: "Mistral AI", desc: "Premium, Europe", color: "#7C3AED" },
  };

  const providerActiveColor: Record<AIProvider, string> = {
    gemini: "border-blue-500/50 bg-blue-500/10",
    groq: "border-purple-500/50 bg-purple-500/10",
    openai: "border-green-500/50 bg-green-500/10",
    claude: "border-orange-500/50 bg-orange-500/10",
    deepseek: "border-cyan-500/50 bg-cyan-500/10",
    mistral: "border-indigo-500/50 bg-indigo-500/10",
  };

  const [providerList, setProviderList] = useState<ProviderEntry[]>([]);
  const [step, setStep] = useState<"config" | "prompt" | "manage">("config");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [parsedSections, setParsedSections] = useState<any[]>([]);
  const [selectedSections, setSelectedSections] = useState<Set<number>>(new Set());
  const [resultStep, setResultStep] = useState<"generating" | "preview" | "applied">("generating");

  // Refresh provider list from localStorage
  const refreshProviderList = useCallback(() => {
    setProviderList(getProviderList());
  }, []);

  // Load saved config on mount
  useEffect(() => {
    if (!isOpen) {
      setStep("config");
      setPrompt("");
      setResult("");
      setParsedSections([]);
      setError("");
      setTestResult("idle");
      setResultStep("generating");
      return;
    }
    refreshProviderList();
    const saved = getAIConfig();
    if (saved) {
      setProvider(saved.provider);
      setApiKey(saved.apiKey);
      setStep("prompt");
    } else if (getProviderList().length > 0) {
      // Ada provider lain yang tersimpan, langsung ke prompt
      setStep("prompt");
    } else {
      setStep("config");
    }
  }, [isOpen, refreshProviderList]);

  if (!isOpen) return null;

  const handleSaveConfig = async () => {
    if (!apiKey.trim()) {
      setError("Masukkan API Key terlebih dahulu");
      return;
    }
    setTesting(true);
    setError("");
    setTestResult("idle");
    const config: AIConfig = { provider, apiKey: apiKey.trim() };
    const ok = await testApiKey(config);
    if (ok) {
      saveAIConfig(config);
      refreshProviderList();
      setTestResult("success");
      setApiKey("");
      setTimeout(() => { setTestResult("idle"); }, 1500);
    } else {
      setTestResult("error");
      setError("API Key tidak valid.");
    }
    setTesting(false);
  };

  const parseResultToSections = (raw: string): any[] => {
    try {
      // Step 1: Remove markdown code blocks (```json, ```, etc)
      let cleaned = raw
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .replace(/`+/g, "")
        .trim();

      // Step 2: Try direct JSON parse first
      const tryParse = (str: string): any | null => {
        try {
          return JSON.parse(str);
        } catch {
          return null;
        }
      };

      // Step 3: Try different extraction strategies
      // Strategy A: Direct parse
      let data = tryParse(cleaned);
      
      if (!data) {
        // Strategy B: Find array in text (most common for full page)
        const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
        if (arrayMatch) data = tryParse(arrayMatch[0]);
      }
      
      if (!data) {
        // Strategy C: Find object in text (common for single section)
        const objMatch = cleaned.match(/\{[\s\S]*\}(?!\s*[{\[])/);
        if (objMatch) data = tryParse(objMatch[0]);
      }
      
      if (!data) {
        // Strategy D: Try to find anything JSON-like with lenient extraction
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
          const jsonText = cleaned.substring(firstBrace, lastBrace + 1);
          data = tryParse(jsonText);
        }
      }
      
      if (!data) return [];

      // Step 4: Normalize to array of sections
      if (Array.isArray(data)) {
        return data.filter((s: any) =>
          s && typeof s === 'object' && (s.columns || s.styles)
        );
      }
      
      if (data.sections && Array.isArray(data.sections)) {
        return data.sections;
      }
      
      if (data.styles || data.columns || data.sectionType) {
        return [data];
      }
      
      // Step 5: If nothing matched, check if it's a page object containing a sections key
      const possibleSections = Object.values(data).find(v => Array.isArray(v));
      if (possibleSections) {
        return possibleSections.filter((s: any) => s && typeof s === 'object');
      }
      
      return [];
    } catch {
      return [];
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Masukkan deskripsi terlebih dahulu");
      return;
    }
    const config = getAIConfig();
    if (!config) { setStep("config"); return; }

    setLoading(true);
    setError("");
    setResult("");
    setParsedSections([]);
    setSelectedSections(new Set());
    setResultStep("generating");

    try {
      const fn = mode === "section" ? generateSection : generateFullPage;
      const raw = await fn(config, prompt.trim());
      setResult(raw);
      
      const sections = parseResultToSections(raw);
      setParsedSections(sections);
      
      if (sections.length > 0) {
        setSelectedSections(new Set(sections.map((_, i) => i)));
      }
      setResultStep("preview");
    } catch (err: any) {
      setError(err.message || "Gagal generate.");
    }
    setLoading(false);
  };

  const toggleSection = (idx: number) => {
    const next = new Set(selectedSections);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedSections(next);
  };

  const handleApply = () => {
    const selected = parsedSections.filter((_, i) => selectedSections.has(i));
    if (selected.length === 0) { setError("Pilih minimal satu section"); return; }
    
    const json = JSON.stringify(selected.length === 1 ? selected[0] : selected);
    
    if (mode === "section") {
      onApplySection(json);
    } else {
      onApplyWebsite(json);
    }
    setResultStep("applied");
    setTimeout(() => onClose(), 800);
  };

  const modeLabels: Record<GenerationMode, { title: string; desc: string; emoji: string; promptPlaceholder: string }> = {
    section: {
      title: "Generate Section dengan AI",
      desc: "Buat satu section website lengkap dengan konten",
      emoji: "🧩",
      promptPlaceholder: "Contoh: hero section untuk jasa desain interior, warna putih dan emas, dengan CTA hubungi WhatsApp",
    },
    website: {
      title: "Generate Website dengan AI",
      desc: "Buat halaman website lengkap dengan 4-6 section",
      emoji: "🌐",
      promptPlaceholder: "Contoh: landing page untuk klinik kecantikan, 5 section: hero, layanan, testimonial, harga, kontak. Warna pink dan putih.",
    },
  };

  const ml = modeLabels[mode];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-sm">{ml.emoji}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{ml.title}</h3>
              <p className="text-[10px] text-gray-500">{ml.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === "config" ? (
            <div className="space-y-4">
              {/* Existing Provider List with Priority */}
              {providerList.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400">
                      Urutan Provider ({providerList.length})
                    </label>
                    <span className="text-[9px] text-gray-600">Prioritas: 🔽 atas = utama</span>
                  </div>
                  <div className="space-y-1.5">
                    {providerList.map((entry, idx) => {
                      const info = providerInfo[entry.provider];
                      return (
                        <div key={entry.provider}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0f172a] border border-white/10"
                        >
                          {/* Priority badge */}
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${
                            idx === 0
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/10 text-gray-500 border border-white/20"
                          }`}>
                            {idx + 1}
                          </div>

                          {/* Provider info */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm">{info?.icon || "🔮"}</span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-white truncate">{info?.name || entry.provider}</p>
                              <p className="text-[8px] text-gray-600 truncate">{entry.apiKey.substring(0, 12)}...{entry.apiKey.slice(-4)}</p>
                            </div>
                          </div>

                          {/* Status indicator */}
                          {idx === 0 && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              UTAMA
                            </span>
                          )}

                          {/* Move Up */}
                          <button
                            onClick={() => { moveProviderPriority(entry.provider, 'up'); refreshProviderList(); }}
                            disabled={idx === 0}
                            className="p-1 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Prioritas naik"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>

                          {/* Move Down */}
                          <button
                            onClick={() => { moveProviderPriority(entry.provider, 'down'); refreshProviderList(); }}
                            disabled={idx === providerList.length - 1}
                            className="p-1 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Prioritas turun"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() => { removeProviderEntry(entry.provider); refreshProviderList(); }}
                            className="p-1 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Hapus provider"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add New Provider */}
              <div className="p-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => setStep("manage")}
                  className="w-full flex items-center justify-center gap-2 py-2 text-[10px] text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Provider AI Baru
                </button>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button onClick={() => { if (providerList.length > 0) setStep("prompt"); }}
                  disabled={providerList.length === 0}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lanjutkan ke Generate
                </button>
              </div>
            </div>
          ) : step === "manage" ? (
            <div className="space-y-4">
              <button onClick={() => { refreshProviderList(); setStep("config"); }} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke daftar provider
              </button>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Pilih Provider AI</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(Object.entries(providerInfo) as [AIProvider, typeof providerInfo[AIProvider]][]).map(([key, info]) => {
                    const alreadyAdded = providerList.some(e => e.provider === key);
                    return (
                      <button key={key} onClick={() => setProvider(key)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          provider === key
                            ? providerActiveColor[key]
                            : alreadyAdded
                            ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        disabled={alreadyAdded}
                      >
                        <span className="text-lg">{info.icon}</span>
                        <p className="text-xs font-semibold text-white mt-1">{info.name}</p>
                        <p className="text-[10px] text-gray-500">{info.desc}</p>
                        {alreadyAdded && (
                          <span className="text-[8px] text-emerald-400 mt-1 block">✓ Sudah ditambahkan</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">API Key</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Masukkan ${providerInfo[provider]?.name || ""} API Key...`}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <a href={getApiKeyUrl(provider)} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-1.5 text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline">
                  Dapatkan {providerInfo[provider]?.name || ""} API Key →
                </a>
              </div>
              {testResult === "success" && (
                <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  API Key valid!
                </div>
              )}
              {testResult === "error" && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">API Key tidak valid.</div>
              )}
              {error && <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
              <button onClick={handleSaveConfig} disabled={testing || !apiKey.trim()}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${testing ? "bg-emerald-500/50 text-emerald-300 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                {testing ? <><div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" /> Memverifikasi...</> : "Simpan & Lanjutkan"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Config indicator */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{providerInfo[provider]?.icon || "🔮"}</span>
                  <span className="text-xs text-gray-400">{providerInfo[provider]?.name || provider}</span>
                </div>
                <button onClick={() => { clearAIConfig(); setStep("config"); }} className="text-[10px] text-gray-500 hover:text-white transition-colors">Ganti API Key</button>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  {mode === "section" ? "Deskripsi section yang diinginkan" : "Deskripsi website yang diinginkan"}
                </label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder={ml.promptPlaceholder}
                  rows={4} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none" />
              </div>

              {error && <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}

              {resultStep === "generating" && (
                <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    loading ? "bg-gradient-to-r from-emerald-500/50 to-teal-500/50 text-emerald-300 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                  }`}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {mode === "section" ? "Mendesain section..." : "Mendesain website..."}</>
                  ) : (
                    <><span>{ml.emoji}</span> Generate dengan AI</>
                  )}
                </button>
              )}

              {/* Preview */}
              {resultStep === "preview" && parsedSections.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Ditemukan {parsedSections.length} section:
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => setResultStep("generating")} className="text-[10px] text-gray-500 hover:text-white transition-colors">Generate Ulang</button>
                    </div>
                  </div>

                  {/* Section list */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {parsedSections.map((sec, i) => {
                      const elTypes = sec.columns?.flatMap((c: any) => c.elements?.map((e: any) => e.type) || []) || [];
                      return (
                        <button key={i} onClick={() => toggleSection(i)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            selectedSections.has(i) ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            selectedSections.has(i) ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                          }`}>
                            {selectedSections.has(i) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{sec.sectionType || `Section ${i + 1}`}</p>
                            <p className="text-[10px] text-gray-500 truncate">{elTypes.join(", ") || "Kosong"}</p>
                          </div>
                          <span className="text-[10px] text-gray-600">{sec.styles?.backgroundColor || "transparan"}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Raw result toggle */}
                  <details className="text-[10px]">
                    <summary className="text-gray-500 hover:text-gray-400 cursor-pointer">Lihat JSON</summary>
                    <pre className="mt-1 p-2 rounded-lg bg-[#0f172a] border border-white/10 text-[10px] text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {JSON.stringify(parsedSections.filter((_, i) => selectedSections.has(i)), null, 2)}
                    </pre>
                  </details>

                  <button onClick={handleApply} disabled={selectedSections.size === 0}
                    className="w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Terapkan {selectedSections.size} Section ke Halaman
                  </button>
                </div>
              )}

              {/* Applied state */}
              {resultStep === "applied" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white">Berhasil Diterapkan!</p>
                  <p className="text-xs text-gray-500 mt-1">{parsedSections.length} section ditambahkan ke halaman</p>
                </div>
              )}

              {resultStep === "generating" && parsedSections.length === 0 && result && (
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400">AI merespon tapi format tidak sesuai. Coba generate ulang dengan deskripsi yang lebih jelas.</p>
                  <details className="mt-2">
                    <summary className="text-[10px] text-gray-500 cursor-pointer">Lihat respon mentah</summary>
                    <pre className="mt-1 text-[10px] text-gray-500 max-h-32 overflow-y-auto whitespace-pre-wrap">{result}</pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#1e293b]">
          <p className="text-[10px] text-gray-600 text-center">API Key disimpan di browser Anda. 🔒</p>
        </div>
      </div>
    </div>
  );
}
