"use client";

import { useState, useEffect } from "react";
import type { AIProvider, AIConfig } from "@/lib/ai";
import { getAIConfig, saveAIConfig, clearAIConfig, testApiKey, getApiKeyUrl, generateSection, generateFullPage } from "@/lib/ai";
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
  const [step, setStep] = useState<"config" | "prompt">("config");
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
    const saved = getAIConfig();
    if (saved) {
      setProvider(saved.provider);
      setApiKey(saved.apiKey);
      setStep("prompt");
    } else {
      setStep("config");
    }
  }, [isOpen]);

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
      setTestResult("success");
      setTimeout(() => { setStep("prompt"); setTestResult("idle"); }, 1000);
    } else {
      setTestResult("error");
      setError("API Key tidak valid.");
    }
    setTesting(false);
  };

  const parseResultToSections = (raw: string): any[] => {
    try {
      // Remove markdown code blocks if present
      let cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      
      // Try parsing as array first (full page) or single object (section)
      let data = JSON.parse(cleaned);
      
      if (Array.isArray(data)) {
        // Full page: array of sections
        return data.filter((s: any) => s.styles && s.columns);
      } else if (data.sections && Array.isArray(data.sections)) {
        return data.sections;
      } else if (data.styles && data.columns) {
        // Single section
        return [data];
      }
      return [];
    } catch {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[0]);
          return Array.isArray(data) ? data : [data];
        } catch {}
      }
      const objMatch = raw.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try {
          const data = JSON.parse(objMatch[0]);
          return data.sections || (data.styles && data.columns ? [data] : []);
        } catch {}
      }
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
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Pilih Provider AI</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setProvider("gemini")}
                    className={`p-3 rounded-xl border text-left transition-all ${provider === "gemini" ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                    <span className="text-lg">🔮</span>
                    <p className="text-xs font-semibold text-white mt-1">Google Gemini</p>
                    <p className="text-[10px] text-gray-500">Gratis 1.500 req/hari</p>
                  </button>
                  <button onClick={() => setProvider("groq")}
                    className={`p-3 rounded-xl border text-left transition-all ${provider === "groq" ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                    <span className="text-lg">⚡</span>
                    <p className="text-xs font-semibold text-white mt-1">Groq</p>
                    <p className="text-[10px] text-gray-500">Sangat cepat, gratis</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">API Key</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === "gemini" ? "Masukkan Gemini API Key..." : "Masukkan Groq API Key..."}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <a href={getApiKeyUrl(provider)} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-1.5 text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline">
                  {provider === "gemini" ? "Dapatkan Gemini API Key gratis →" : "Dapatkan Groq API Key gratis →"}
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
                  <span className="text-sm">{provider === "gemini" ? "🔮" : "⚡"}</span>
                  <span className="text-xs text-gray-400">{provider === "gemini" ? "Google Gemini" : "Groq"}</span>
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
