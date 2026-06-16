"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBuilder } from "@/lib/builder/store";
import { getAIConfig } from "@/lib/ai";
import { runPipeline, parseResultToSections, type AgentType, type AgentResult } from "@/lib/ai/agents";
import { saveLocalMemory, saveGlobalMemory, updatePreferencesFromGeneration } from "@/lib/ai/memory";
import { aiSectionToBuilder } from "@/lib/builder/defaults";
import type { BuilderPage } from "@/lib/builder/types";

// ─── Chat History Types ─────────────────────────────

interface ChatHistoryEntry {
  prompt: string;
  category?: string;
  sectionsJson: string;
  sectionCount: number;
  sectionTypes: string[];
  timestamp: number;
  success: boolean;
  error?: string;
}

const CHAT_HISTORY_KEY = "ai_chat_history";
const MAX_CHAT_HISTORY = 50;

function loadChatHistory(userId: string | null): ChatHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const key = userId ? `${CHAT_HISTORY_KEY}_${userId}` : `${CHAT_HISTORY_KEY}_anonymous`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveChatHistoryEntry(userId: string | null, entry: ChatHistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${CHAT_HISTORY_KEY}_${userId}` : `${CHAT_HISTORY_KEY}_anonymous`;
    const history = loadChatHistory(userId);
    history.unshift(entry);
    if (history.length > MAX_CHAT_HISTORY) history.length = MAX_CHAT_HISTORY;
    localStorage.setItem(key, JSON.stringify(history));
  } catch {}
}

function clearChatHistory(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${CHAT_HISTORY_KEY}_${userId}` : `${CHAT_HISTORY_KEY}_anonymous`;
    localStorage.removeItem(key);
  } catch {}
}

// ─── Component ──────────────────────────────────────

interface AIPanelProps {
  onGenerate: (title: string, sectionsJson: string) => void;
  onOpenConfig: () => void;
}

const AGENT_LABELS: Record<AgentType, { label: string; desc: string; emoji: string }> = {
  planner: { label: "Planner", desc: "Merencanakan struktur halaman", emoji: "📐" },
  writer: { label: "Writer", desc: "Menulis konten kreatif", emoji: "✍️" },
  coder: { label: "Coder", desc: "Mengubah ke komponen", emoji: "⚡" },
  reviewer: { label: "Reviewer", desc: "Memeriksa kualitas", emoji: "✅" },
  stylist: { label: "Stylist", desc: "Memoles visual", emoji: "🎨" },
};

export function AIPanel({ onGenerate, onOpenConfig }: AIPanelProps) {
  const { user } = useAuth();
  const { currentPage, dispatch, createNewPage } = useBuilder();
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(null);
  const [error, setError] = useState("");
  const [enableWriter, setEnableWriter] = useState(true);
  const [enableStylist, setEnableStylist] = useState(true);
  const [category, setCategory] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [finalSections, setFinalSections] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToPage, setSavedToPage] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);

  // Load chat history on mount
  useEffect(() => {
    setChatHistory(loadChatHistory(user?.id || null));
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleStart = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Masukkan deskripsi website terlebih dahulu");
      return;
    }

    const config = getAIConfig();
    if (!config) {
      onOpenConfig();
      setError("Konfigurasi API Key terlebih dahulu");
      return;
    }

    // Cancel any previous run
    if (abortRef.current) {
      abortRef.current.abort();
    }

    // Reset state
    setIsRunning(true);
    setError("");
    setAgentResults([]);
    setCurrentAgent(null);
    setFinalSections([]);
    setShowResult(false);
    setSavedToPage(false);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const finalJSON = await runPipeline(
        config,
        {
          userId: user?.id || null,
          userPrompt: prompt.trim(),
          category: category || undefined,
          enableWriter,
          enableStylist,
        },
        {
          onAgentStart: (agent) => {
            setCurrentAgent(agent);
            setAgentResults((prev) => [
              ...prev,
              {
                agent,
                status: "running",
                output: "",
                startedAt: Date.now(),
              },
            ]);
          },
          onAgentComplete: (result) => {
            setAgentResults((prev) =>
              prev.map((r) => (r.agent === result.agent ? result : r))
            );
            setCurrentAgent(null);
          },
          onAgentError: (agent, errorMsg) => {
            setAgentResults((prev) =>
              prev.map((r) =>
                r.agent === agent ? { ...r, status: "error", error: errorMsg } : r
              )
            );
          },
          onPreviewUpdate: (jsonOutput) => {
            // Real-time preview update
            onGenerate(prompt.trim(), jsonOutput);
          },
        },
        abortController.signal
      );

      // Parse final result
      const sections = parseResultToSections(finalJSON);
      setFinalSections(sections);
      setShowResult(true);

      // Update preview with final result
      onGenerate(prompt.trim(), finalJSON);

      // Save to chat history (success)
      const sectionTypes = sections.map((s: any) => s.sectionType || "section").filter(Boolean);
      saveChatHistoryEntry(user?.id || null, {
        prompt: prompt.trim(),
        category: category || undefined,
        sectionsJson: finalJSON,
        sectionCount: sections.length,
        sectionTypes,
        timestamp: Date.now(),
        success: true,
      });

      // Save to local memory
      if (sections.length > 0) {
        saveLocalMemory(user?.id || null, {
          prompt: prompt.trim(),
          category: category || undefined,
          styleTags: [],
          pageStructure: sections,
          rating: 5,
          timestamp: Date.now(),
        });
      }

      // Try to save to Supabase global memory
      if (user && sections.length > 0 && currentPage) {
        try {
          // Create a temporary page to save structure
          const tempPage: BuilderPage = {
            id: "temp",
            title: prompt.trim().substring(0, 50),
            slug: "",
            sections: sections.map((s: any) => aiSectionToBuilder(s)),
            globalStyles: {
              fontFamily: "Inter, sans-serif",
              primaryColor: "#22c55e",
              backgroundColor: "#0f172a",
              textColor: "#f8fafc",
              containerWidth: 1200,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            published: false,
            publishedSnapshot: null,
          };

          // Save to Supabase memory
          saveGlobalMemory(
            prompt.trim(),
            category || undefined,
            [],
            tempPage
          );

          // Update user preferences
          updatePreferencesFromGeneration(user.id, tempPage);
        } catch {
          // Non-critical, don't block
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Generate dibatalkan");
      }
      // Save failed attempt to history
      saveChatHistoryEntry(user?.id || null, {
        prompt: prompt.trim(),
        category: category || undefined,
        sectionsJson: "",
        sectionCount: 0,
        sectionTypes: [],
        timestamp: Date.now(),
        success: false,
        error: err.name === "AbortError" ? "Dibatalkan" : (err.message || "Gagal generate"),
      });
    }

    // Reload chat history
    setChatHistory(loadChatHistory(user?.id || null));

    setIsRunning(false);
    abortRef.current = null;
  }, [prompt, category, enableWriter, enableStylist, user, currentPage, onGenerate, onOpenConfig]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleSaveToPage = useCallback(() => {
    if (finalSections.length === 0 || !currentPage) return;
    setSaving(true);
    try {
      for (const secData of finalSections) {
        const builderSection = aiSectionToBuilder(secData);
        dispatch({
          type: "ADD_TEMPLATE_SECTION",
          pageId: currentPage.id,
          section: builderSection,
        });
      }
      setSavedToPage(true);
      setTimeout(() => setSavedToPage(false), 3000);
    } catch (e) {
      setError("Gagal menyimpan ke halaman");
    }
    setSaving(false);
  }, [finalSections, currentPage, dispatch]);

  const handleTryAgain = useCallback(() => {
    setShowResult(false);
    setFinalSections([]);
    setPrompt("");
  }, []);

  const handleRestoreHistory = useCallback((entry: ChatHistoryEntry) => {
    setPrompt(entry.prompt);
    if (entry.success && entry.sectionsJson) {
      const sections = parseResultToSections(entry.sectionsJson);
      setFinalSections(sections);
      setShowResult(true);
      onGenerate(entry.prompt, entry.sectionsJson);
    }
    setShowHistory(false);
  }, [onGenerate]);

  const handleDeleteHistory = useCallback((index: number) => {
    const updated = [...chatHistory];
    updated.splice(index, 1);
    setChatHistory(updated);
    if (typeof window !== "undefined") {
      const key = user?.id ? `${CHAT_HISTORY_KEY}_${user.id}` : `${CHAT_HISTORY_KEY}_anonymous`;
      localStorage.setItem(key, JSON.stringify(updated));
    }
  }, [chatHistory, user]);

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span>🤖</span>
          AI Agent Pipeline
        </h2>
        <p className="text-[10px] text-gray-500 mt-0.5">
          5 agent AI bekerja sama membangun website Anda
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
            Deskripsi Website
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Landing page untuk klinik kecantikan di Jakarta. 6 section: hero, layanan, testimonial, harga, kontak, footer. Warna pink dan putih, tampilan elegan."
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            disabled={isRunning}
          />
        </div>

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gray-400 transition-colors"
        >
          <svg className={`w-3 h-3 transition-transform ${showSettings ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Pengaturan Agent
        </button>

        {/* Settings */}
        {showSettings && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1.5">Kategori Website</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
                style={{ colorScheme: "dark" }}
              >
                <option value="" className="bg-[#1e293b]">Umum</option>
                <option value="Bisnis" className="bg-[#1e293b]">🏢 Bisnis</option>
                <option value="Kreatif" className="bg-[#1e293b]">🎨 Kreatif / Portfolio</option>
                <option value="Event" className="bg-[#1e293b]">📅 Event</option>
                <option value="Toko" className="bg-[#1e293b]">🛍️ Toko Online</option>
                <option value="Kesehatan" className="bg-[#1e293b]">🏥 Kesehatan</option>
                <option value="Pendidikan" className="bg-[#1e293b]">📚 Pendidikan</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">✍️ Writer Agent</span>
              <button
                onClick={() => setEnableWriter(!enableWriter)}
                className={`relative w-8 h-4 rounded-full transition-colors ${enableWriter ? "bg-purple-500" : "bg-white/20"}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${enableWriter ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">🎨 Stylist Agent</span>
              <button
                onClick={() => setEnableStylist(!enableStylist)}
                className={`relative w-8 h-4 rounded-full transition-colors ${enableStylist ? "bg-purple-500" : "bg-white/20"}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${enableStylist ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Chat History Toggle */}
        {chatHistory.length > 0 && !isRunning && (
          <>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gray-400 transition-colors"
            >
              <svg className={`w-3 h-3 transition-transform ${showHistory ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Riwayat Chat ({chatHistory.length})
            </button>

            {/* History Panel */}
            {showHistory && (
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {chatHistory.length === 0 ? (
                  <p className="text-[10px] text-gray-600 text-center py-4">Belum ada riwayat chat</p>
                ) : (
                  chatHistory.map((entry, i) => (
                    <div
                      key={entry.timestamp + "_" + i}
                      className={`group flex items-start gap-2 p-2.5 rounded-lg border transition-all cursor-pointer ${
                        entry.success
                          ? "border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-purple-500/5"
                          : "border-red-500/10 bg-red-500/5 hover:border-red-500/20"
                      }`}
                      onClick={() => handleRestoreHistory(entry)}
                    >
                      {/* Status indicator */}
                      <div className="flex-shrink-0 mt-0.5">
                        {entry.success ? (
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white truncate font-medium">
                          {entry.prompt.substring(0, 80)}
                          {entry.prompt.length > 80 ? "..." : ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {entry.success ? (
                            <span className="text-[9px] text-emerald-500/70">
                              {entry.sectionCount} section
                            </span>
                          ) : (
                            <span className="text-[9px] text-red-500/70">
                              {entry.error || "Gagal"}
                            </span>
                          )}
                          <span className="text-[8px] text-gray-600">
                            {new Date(entry.timestamp).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                        {entry.success && entry.sectionTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.sectionTypes.slice(0, 4).map((t, ti) => (
                              <span key={ti} className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400/70">
                                {t}
                              </span>
                            ))}
                            {entry.sectionTypes.length > 4 && (
                              <span className="text-[8px] text-gray-600">+{entry.sectionTypes.length - 4}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteHistory(i); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all"
                        title="Hapus"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}

                {/* Clear all button */}
                {chatHistory.length > 0 && (
                  <button
                    onClick={() => {
                      clearChatHistory(user?.id || null);
                      setChatHistory([]);
                    }}
                    className="w-full py-1.5 text-[9px] text-gray-600 hover:text-red-400 transition-colors"
                  >
                    Hapus semua riwayat
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Generate Button */}
        {!isRunning && !showResult && (
          <button
            onClick={handleStart}
            disabled={!prompt.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>✨</span>
            Generate Website dengan AI
          </button>
        )}

        {/* Stop Button */}
        {isRunning && (
          <button
            onClick={handleStop}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Hentikan Generate
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Agent Pipeline Progress */}
        {agentResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Pipeline Progress:</p>
            {(Object.keys(AGENT_LABELS) as AgentType[]).map((agentType) => {
              const result = agentResults.find((r) => r.agent === agentType);
              const isActive = currentAgent === agentType;
              const isDone = result?.status === "success";
              const isError = result?.status === "error";
              const isWaiting = !result && !isActive;

              const info = AGENT_LABELS[agentType];

              return (
                <div
                  key={agentType}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                    isActive
                      ? "border-purple-500/50 bg-purple-500/10"
                      : isDone
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : isError
                      ? "border-red-500/30 bg-red-500/10"
                      : "border-white/5 bg-white/5 opacity-50"
                  }`}
                >
                  {/* Status icon */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                    {isActive ? (
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    ) : isDone ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isError ? (
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <span className="text-sm text-gray-600">{info.emoji}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isActive ? "text-purple-300" : isDone ? "text-emerald-300" : "text-gray-500"}`}>
                        {info.emoji} {info.label}
                      </span>
                      {isActive && (
                        <span className="text-[9px] text-purple-500 animate-pulse">Sedang bekerja...</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">{info.desc}</p>
                  </div>

                  {/* Duration */}
                  {result?.completedAt && (
                    <span className="text-[9px] text-gray-600 flex-shrink-0">
                      {((result.completedAt - result.startedAt) / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Result */}
        {showResult && finalSections.length > 0 && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-semibold text-emerald-300">Generate Berhasil!</span>
              </div>
              <p className="text-[10px] text-emerald-400/70">
                Ditemukan {finalSections.length} section
              </p>
            </div>

            {/* Section List */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {finalSections.map((sec, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-600 w-5 text-right">{i + 1}.</span>
                  <span className="text-xs font-medium text-white truncate flex-1">
                    {sec.sectionType || `Section ${i + 1}`}
                  </span>
                  <span className="text-[9px] text-gray-500">
                    {(sec.columns?.length || 0)} kolom
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {currentPage && (
                <button
                  onClick={handleSaveToPage}
                  disabled={saving || savedToPage}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    savedToPage
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {savedToPage ? "✓ Tersimpan!" : saving ? "Menyimpan..." : "Simpan ke Halaman"}
                </button>
              )}
              <button
                onClick={handleTryAgain}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-all"
              >
                Buat Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
