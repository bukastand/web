"use client";

import { useState, useEffect, useMemo } from "react";
import type { AIProvider, AIConfig, AIGenerateOptions } from "@/lib/ai";
import { getAIConfig, saveAIConfig, clearAIConfig, testApiKey, getApiKeyUrl, generateContent } from "@/lib/ai";

export interface AIEditResult {
  content: string;
  styles?: Record<string, string>;
}

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: string;
  currentContent?: string;
  currentStyles?: Record<string, string>;
  onApply: (result: AIEditResult) => void;
  /** Konteks section & halaman agar AI paham konteks */
  sectionContext?: AIGenerateOptions['sectionContext'];
}

export default function AIPromptModal({
  isOpen,
  onClose,
  elementType,
  currentContent,
  currentStyles,
  onApply,
  sectionContext,
}: AIPromptModalProps) {
  const [step, setStep] = useState<"config" | "prompt">("config");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load saved config on mount
  useEffect(() => {
    if (!isOpen) {
      // Reset when closed
      setStep("config");
      setPrompt("");
      setResult("");
      setError("");
      setTestResult("idle");
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
      setTimeout(() => {
        setStep("prompt");
        setTestResult("idle");
      }, 1000);
    } else {
      setTestResult("error");
      setError("API Key tidak valid. Pastikan Anda sudah copy key yang benar.");
    }
    setTesting(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Masukkan prompt terlebih dahulu");
      return;
    }

    const config = getAIConfig();
    if (!config) {
      setStep("config");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const text = await generateContent(config, {
        prompt: prompt.trim(),
        elementType,
        currentContent,
        currentStyles,
        sectionContext,
      });
      setResult(text);
    } catch (err: any) {
      setError(err.message || "Gagal generate konten. Coba lagi.");
    }
    setLoading(false);
  };

  // Parse AI result — bisa JSON {content, styles} atau plain text
  const parsedResult = useMemo((): AIEditResult => {
    if (!result) return { content: '' };
    try {
      // Coba parse JSON
      const cleaned = result.replace(/```json\s*/gi, '').replace(/```\s*/g, '').replace(/`/g, '').trim();
      const json = JSON.parse(cleaned);
      if (json && typeof json === 'object') {
        return {
          content: json.content || json.text || '',
          styles: json.styles || undefined,
        };
      }
    } catch {
      // Bukan JSON — treat as plain text content
    }
    return { content: result };
  }, [result]);

  const handleApply = () => {
    const hasContent = !!parsedResult.content;
    const hasStyles = parsedResult.styles && Object.keys(parsedResult.styles).length > 0;
    if (result && (hasContent || hasStyles)) {
      onApply(parsedResult);
      onClose();
    }
  };

  // Preview styles untuk ditampilkan
  const previewStyle = useMemo(() => {
    if (!parsedResult.styles || Object.keys(parsedResult.styles).length === 0) return undefined;
    return parsedResult.styles as React.CSSProperties;
  }, [parsedResult.styles]);

  const elementLabels: Record<string, string> = {
    heading: "Heading",
    text: "Teks",
    button: "Tombol",
  };

  const elementEmojis: Record<string, string> = {
    heading: "📝",
    text: "📄",
    button: "🔘",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <span className="text-sm">✨</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tulis dengan AI</h3>
              <p className="text-[10px] text-gray-500">
                {elementEmojis[elementType] || "✨"} {elementLabels[elementType] || elementType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === "config" ? (
            /* ── STEP 1: Configure API Key ── */
            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Pilih Provider AI</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setProvider("gemini")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      provider === "gemini"
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-lg">🔮</span>
                    <p className="text-xs font-semibold text-white mt-1">Google Gemini</p>
                    <p className="text-[10px] text-gray-500">Gratis 1.500 req/hari</p>
                  </button>
                  <button
                    onClick={() => setProvider("groq")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      provider === "groq"
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-lg">⚡</span>
                    <p className="text-xs font-semibold text-white mt-1">Groq</p>
                    <p className="text-[10px] text-gray-500">Sangat cepat, gratis</p>
                  </button>
                </div>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  API Key {provider === "gemini" ? "Gemini" : "Groq"}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === "gemini" ? "Masukkan Gemini API Key..." : "Masukkan Groq API Key..."}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <a
                  href={getApiKeyUrl(provider)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1.5 text-[10px] text-purple-400 hover:text-purple-300 hover:underline"
                >
                  {provider === "gemini" ? "Dapatkan Gemini API Key gratis →" : "Dapatkan Groq API Key gratis →"}
                </a>
              </div>

              {/* Test Result */}
              {testResult === "success" && (
                <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API Key valid! Mengalihkan...
                </div>
              )}
              {testResult === "error" && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  API Key tidak valid. Pastikan Anda copy key yang benar dari halaman {provider === "gemini" ? "Google AI Studio" : "Groq Console"}.
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveConfig}
                disabled={testing || !apiKey.trim()}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  testing
                    ? "bg-purple-500/50 text-purple-300 cursor-not-allowed"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                {testing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Simpan & Lanjutkan"
                )}
              </button>
            </div>
          ) : (
            /* ── STEP 2: Write Prompt & Generate ── */
            <div className="space-y-4">
              {/* Current config indicator */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{provider === "gemini" ? "🔮" : "⚡"}</span>
                  <span className="text-xs text-gray-400">
                    {provider === "gemini" ? "Google Gemini" : "Groq"}
                  </span>
                </div>
                <button
                  onClick={() => { clearAIConfig(); setStep("config"); }}
                  className="text-[10px] text-gray-500 hover:text-white transition-colors"
                >
                  Ganti API Key
                </button>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Tulis perintah untuk AI
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    elementType === "heading"
                      ? "Contoh: heading untuk jasa desain grafis profesional dengan warna hijau"
                      : elementType === "text"
                      ? "Contoh: deskripsi tentang layanan pembuatan website yang profesional dan terpercaya"
                      : elementType === "button"
                      ? "Contoh: tombol CTA untuk konsultasi gratis via WhatsApp"
                      : "Tulis perintah untuk konten yang diinginkan..."
                  }
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                />
              </div>

              {/* Current content reference */}
              {currentContent && (
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[10px] text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showAdvanced ? "Sembunyikan" : "Tampilkan"} konten saat ini sebagai referensi
                  </button>
                  {showAdvanced && (
                    <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-500 max-h-20 overflow-y-auto">
                      {currentContent.substring(0, 300)}
                      {currentContent.length > 300 ? "..." : ""}
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-purple-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                    Menulis...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Generate Konten
                  </>
                )}
              </button>

              {/* Result */}
              {result && (
                <div className="space-y-3">
                  {/* Preview konten dengan style */}
                  <div className="p-4 rounded-xl bg-white/5 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider">Hasil:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(result)}
                        className="ml-auto text-[10px] text-gray-500 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Konten preview */}
                    <div 
                      className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
                      style={previewStyle}
                    >
                      <p className="text-sm whitespace-pre-wrap">{parsedResult.content}</p>
                    </div>
                    
                    {/* Style changes badge */}
                    {parsedResult.styles && Object.keys(parsedResult.styles).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-emerald-400 font-medium">🎨 Desain diubah:</span>
                        {Object.entries(parsedResult.styles).map(([key, val]) => (
                          <span key={key} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Raw JSON toggle */}
                  <details className="text-[10px]">
                    <summary className="text-gray-500 hover:text-gray-400 cursor-pointer">Lihat JSON mentah</summary>
                    <pre className="mt-1 p-2 rounded-lg bg-[#0f172a] border border-white/10 text-[10px] text-gray-400 max-h-24 overflow-y-auto whitespace-pre-wrap">
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse(result.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()), null, 2);
                        } catch {
                          return result;
                        }
                      })()}
                    </pre>
                  </details>

                  {/* Apply Button */}
                  <button
                    onClick={handleApply}
                    disabled={!parsedResult.content}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#22c55e] text-white hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {parsedResult.styles && Object.keys(parsedResult.styles).length > 0
                      ? 'Terapkan Konten & Desain'
                      : 'Terapkan ke Element'}
                  </button>
                </div>
              )}

              {/* Regenerate hint */}
              {result && (
                <p className="text-[10px] text-gray-600 text-center">
                  Kurang sesuai? Ubah prompt dan generate lagi
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#1e293b]">
          <p className="text-[10px] text-gray-600 text-center">
            API Key disimpan di browser Anda. Tidak dikirim ke server manapun. 🔒
          </p>
        </div>
      </div>
    </div>
  );
}
