"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBuilder } from "@/lib/builder/store";
import { getAIConfig, getProviderList, removeProviderEntry, moveProviderPriority, type ProviderEntry } from "@/lib/ai";
import { generateWebsite, parseResultToSections, type GenerateCallbacks } from "@/lib/ai/agents";
import { saveLocalMemory, saveGlobalMemory, updatePreferencesFromGeneration } from "@/lib/ai/memory";
import { aiSectionToBuilder, createDefaultPage } from "@/lib/builder/defaults";
import { generateFromPromptJSON } from "@/lib/builder/template-engine";
import type { BuilderPage } from "@/lib/builder/types";

// ─── Types ───────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  sectionCount?: number;
  sectionTypes?: string[];
}

function genMsgId() {
  return "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
}

// ─── Props ───────────────────────────────────────────

interface AIPanelProps {
  onGenerate: (title: string, sectionsJson: string) => void;
  onOpenConfig: () => void;
}

// ─── Component ──────────────────────────────────────

export function AIPanel({ onGenerate, onOpenConfig }: AIPanelProps) {
  const { user } = useAuth();
  const { currentPage, dispatch, state } = useBuilder();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedToPage, setSavedToPage] = useState(false);
  const [category, setCategory] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [providerList, setProviderList] = useState<ProviderEntry[]>([]);
  const [finalSections, setFinalSections] = useState<any[]>([]);
  const [lastResultJson, setLastResultJson] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const refreshProviders = useCallback(() => {
    setProviderList(getProviderList());
  }, []);

  // Load provider list when settings open
  useEffect(() => {
    if (showSettings) {
      refreshProviders();
    }
  }, [showSettings, refreshProviders]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("ai_chat_messages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }

      const savedLastResult = localStorage.getItem("ai_last_result_json");
      if (savedLastResult) {
        setLastResultJson(savedLastResult);
      }

      const savedFinalSections = localStorage.getItem("ai_final_sections");
      if (savedFinalSections) {
        const parsed = JSON.parse(savedFinalSections);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFinalSections(parsed);
        }
      }
    } catch {}
  }, []);

  // Restore preview on mount if saved data exists
  useEffect(() => {
    try {
      const savedLastResult = localStorage.getItem("ai_last_result_json");
      const savedTitle = localStorage.getItem("ai_last_title");
      if (savedLastResult && savedTitle) {
        const timer = setTimeout(() => {
          onGenerate(savedTitle!, savedLastResult);
        }, 100);
        return () => clearTimeout(timer);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save messages to localStorage on change (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (messages.length === 0) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
      } catch {}
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      try {
        localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
      } catch {}
    };
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // ─── Send Message ────────────────────────────────

  const handleSend = useCallback(async () => {
    const promptText = input.trim();
    if (!promptText) return;

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
    setSavedToPage(false);

    // Add user message
    const userMsg: ChatMessage = {
      id: genMsgId(),
      role: "user",
      content: promptText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const abortController = new AbortController();
    abortRef.current = abortController;

    // ── Generate Website ──
    let finalJSON: string;
    let usedFallback = false;

    try {
      const statusMsg: ChatMessage = {
        id: genMsgId(),
        role: "system",
        content: "🏗️ **Membangun website...**",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, statusMsg]);
      scrollToBottom();

      const isFollowUp = !!lastResultJson;

      const callbacks: GenerateCallbacks = {
        onStatus: (status) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === statusMsg.id
                ? { ...m, content: `🏗️ **${status}**` }
                : m
            )
          );
        },
        onPreviewUpdate: (jsonOutput) => {
          onGenerate(promptText, jsonOutput);
        },
        onError: (errorMsg) => {
          setError(errorMsg);
        },
      };

      finalJSON = await generateWebsite(
        config,
        promptText,
        callbacks,
        abortController.signal,
        isFollowUp ? lastResultJson : undefined
      );

      // Remove the status message on success
      setMessages((prev) => prev.filter((m) => m.id !== statusMsg.id));
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            id: genMsgId(),
            role: "assistant",
            content: "⏹️ Generate dibatalkan. Silakan coba lagi.",
            timestamp: Date.now(),
          },
        ]);
        setIsRunning(false);
        abortRef.current = null;
        return;
      }

      // ── AI Failed — Fall back to Template Engine (0 API call) ──
      try {
        finalJSON = generateFromPromptJSON(promptText, category || undefined);
        usedFallback = true;
        setMessages((prev) => [
          ...prev,
          {
            id: genMsgId(),
            role: "system",
            content: "⚠️ **Mode Offline:** AI provider sedang sibuk (rate limit). Website dibuat menggunakan template siap pakai. Hasil mungkin berbeda dari AI, tapi langsung bisa digunakan.",
            timestamp: Date.now(),
          },
        ]);
      } catch {
        const errorMsg = err.message || "Gagal generate website";
        setError(errorMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: genMsgId(),
            role: "assistant",
            content: `❌ **Error:** ${errorMsg}. Coba ganti provider AI atau periksa API Key Anda.`,
            timestamp: Date.now(),
          },
        ]);
        setIsRunning(false);
        abortRef.current = null;
        return;
      }
    }

    // ── Process Result ──
    const parsedSections = parseResultToSections(finalJSON);
    setFinalSections(parsedSections);

    try {
      localStorage.setItem("ai_final_sections", JSON.stringify(parsedSections));
    } catch {}

    setLastResultJson(finalJSON);

    try {
      localStorage.setItem("ai_last_result_json", finalJSON);
      localStorage.setItem("ai_last_title", promptText);
    } catch {}

    onGenerate(promptText, finalJSON);

    // Save to local memory
    if (parsedSections.length > 0) {
      saveLocalMemory(user?.id || null, {
        prompt: promptText,
        category: category || undefined,
        styleTags: [],
        pageStructure: parsedSections,
        rating: 5,
        timestamp: Date.now(),
      });
    }

    // Save to Supabase global memory
    if (user && parsedSections.length > 0 && currentPage) {
      try {
        const tempPage: BuilderPage = {
          id: "temp",
          title: promptText.substring(0, 50),
          slug: "",
          sections: parsedSections.map((s: any) => aiSectionToBuilder(s)),
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
        saveGlobalMemory(promptText, category || undefined, [], tempPage);
        updatePreferencesFromGeneration(user.id, tempPage);
      } catch {
        // Non-critical
      }
    }

    // Auto-save to page
    if (parsedSections.length > 0) {
      let pageId = currentPage?.id;
      // Jika tidak ada currentPage, buat halaman baru
      if (!pageId) {
        const existingSlugs = state.pages.map((p: any) => p.slug);
        const newPage = createDefaultPage(promptText.substring(0, 50), existingSlugs);
        pageId = newPage.id;
        dispatch({ type: "ADD_PAGE", page: newPage });
        dispatch({ type: "SET_CURRENT_PAGE", pageId: newPage.id });
      }
      try {
        for (const secData of parsedSections) {
          const builderSection = aiSectionToBuilder(secData);
          dispatch({
            type: "ADD_TEMPLATE_SECTION",
            pageId,
            section: builderSection,
          });
        }
        setSavedToPage(true);
        setTimeout(() => setSavedToPage(false), 3000);
      } catch (e) {
        console.warn("Auto-save failed, manual save available:", e);
      }
    }

    // Add final summary message
    if (parsedSections.length > 0) {
      const sectionTypes = parsedSections.map((s: any) => s.sectionType || "section").filter(Boolean);
      const fallbackNote = usedFallback
        ? "\n\n📋 *Mode offline — diedit dari template* (AI sedang sibuk).\n\n💡 Tambah API Key provider lain di pengaturan agar AI bisa dipakai lagi."
        : "";
      const summaryMsg: ChatMessage = {
        id: genMsgId(),
        role: "assistant",
        content: `✅ **Website berhasil dibuat!** Saya membuat **${parsedSections.length} section** dan **langsung menyimpannya ke halaman Anda**.${fallbackNote}`,
        timestamp: Date.now(),
        sectionCount: parsedSections.length,
        sectionTypes,
      };
      setMessages((prev) => [...prev, summaryMsg]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: genMsgId(),
          role: "assistant",
          content: "⚠️ Website berhasil di-generate, tapi tidak ada section yang bisa diparse. Coba generate ulang dengan deskripsi yang lebih detail.",
          timestamp: Date.now(),
        },
      ]);
    }

    scrollToBottom();
    setIsRunning(false);
    abortRef.current = null;
  }, [input, category, user, currentPage, onGenerate, onOpenConfig, scrollToBottom, lastResultJson, state]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );



  const handleSaveToPage = useCallback(() => {
    if (finalSections.length === 0) return;
    setSaving(true);
    try {
      let pageId = currentPage?.id;
      // Jika tidak ada currentPage, buat halaman baru
      if (!pageId) {
        const existingSlugs = state.pages.map((p: any) => p.slug);
        const newPage = createDefaultPage("AI Generated Page", existingSlugs);
        pageId = newPage.id;
        dispatch({ type: "ADD_PAGE", page: newPage });
        dispatch({ type: "SET_CURRENT_PAGE", pageId: newPage.id });
      }
      for (const secData of finalSections) {
        const builderSection = aiSectionToBuilder(secData);
        dispatch({
          type: "ADD_TEMPLATE_SECTION",
          pageId,
          section: builderSection,
        });
      }
      setSavedToPage(true);
      setTimeout(() => setSavedToPage(false), 3000);
    } catch (e) {
      setError("Gagal menyimpan ke halaman");
    }
    setSaving(false);
  }, [finalSections, currentPage, dispatch, state.pages]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setError("");
    setLastResultJson("");
    setFinalSections([]);
    setSavedToPage(false);
    try {
      localStorage.removeItem("ai_last_result_json");
      localStorage.removeItem("ai_last_title");
      localStorage.removeItem("ai_final_sections");
      localStorage.removeItem("ai_chat_messages");
    } catch {}
    inputRef.current?.focus();
  }, []);

  // ─── Render ──────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0f172a] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
            <span className="text-xs">🤖</span>
          </div>
          <span className="text-xs font-bold text-white">AI Chat</span>
          {isRunning && (
            <span className="text-[9px] text-purple-400 animate-pulse ml-2">Sedang membangun...</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && !isRunning && (
            <button onClick={handleClearChat} className="p-1.5 text-gray-600 hover:text-gray-400 rounded-lg transition-colors" title="Hapus chat">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded-lg transition-colors ${showSettings ? "bg-white/10 text-purple-400" : "text-gray-600 hover:text-gray-400"}`} title="Pengaturan">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Panel (compact dropdown) */}
      {showSettings && (
        <div className="px-4 py-3 bg-[#1e293b] border-b border-white/10 space-y-2.5 flex-shrink-0 max-h-[40vh] overflow-y-auto">
          {/* Category */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-gray-500 w-20">Kategori:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] focus:outline-none focus:border-purple-500/50"
              style={{ colorScheme: "dark" }}
            >
              <option value="" className="bg-[#1e293b]">Umum</option>
              <option value="Bisnis" className="bg-[#1e293b]">🏢 Bisnis</option>
              <option value="Kreatif" className="bg-[#1e293b]">🎨 Kreatif</option>
              <option value="Toko" className="bg-[#1e293b]">🛍️ Toko</option>
              <option value="Kesehatan" className="bg-[#1e293b]">🏥 Kesehatan</option>
            </select>
          </div>

          {/* Provider Priority Toggle */}
          <div>
            <button
              onClick={() => setShowProviders(!showProviders)}
              className="flex items-center justify-between w-full py-1.5 text-[10px] text-gray-500 hover:text-white transition-colors"
            >
              <span>⚙️ Urutan Provider AI ({providerList.length})</span>
              <svg className={`w-3 h-3 transition-transform ${showProviders ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProviders && (
              <div className="space-y-1 mt-1">
                {providerList.length === 0 ? (
                  <div className="text-[9px] text-gray-600 text-center py-2">
                    Belum ada provider. Tambah API Key dulu.
                  </div>
                ) : (
                  providerList.map((entry, idx) => {
                    const providerIcons: Record<string, string> = {
                      gemini: "🔮", groq: "⚡", openai: "🤖",
                      claude: "🧠", deepseek: "🐋", mistral: "🏔️",
                    };
                    return (
                      <div key={entry.provider}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#0f172a] border border-white/10"
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold ${
                          idx === 0
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/10 text-gray-500"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="text-[10px]">{providerIcons[entry.provider] || "🔮"}</span>
                        <span className="text-[9px] text-gray-300 flex-1 truncate">
                          {entry.provider}
                        </span>
                        <button
                          onClick={() => { moveProviderPriority(entry.provider, 'up'); refreshProviders(); }}
                          disabled={idx === 0}
                          className="p-0.5 text-gray-600 hover:text-white rounded disabled:opacity-30"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { moveProviderPriority(entry.provider, 'down'); refreshProviders(); }}
                          disabled={idx === providerList.length - 1}
                          className="p-0.5 text-gray-600 hover:text-white rounded disabled:opacity-30"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { removeProviderEntry(entry.provider); refreshProviders(); }}
                          className="p-0.5 text-gray-600 hover:text-red-400 rounded"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}

                <button
                  onClick={() => {
                    setShowSettings(false);
                    onOpenConfig();
                  }}
                  className="w-full py-1.5 text-[9px] text-gray-600 hover:text-purple-400 flex items-center justify-center gap-1 rounded-lg border border-dashed border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Provider
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Mulai Chat dengan AI</h3>
            <p className="text-[11px] text-gray-500 max-w-xs">
              Tulis deskripsi website yang Anda inginkan, dan AI akan membangunnya langsung untuk Anda.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5 justify-center">
              <span className="px-2 py-1 text-[9px] rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">📐 Template Engine</span>
              <span className="px-2 py-1 text-[9px] rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">✍️ AI Content</span>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5">
              {/* Avatar */}
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 text-[11px]">
                {msg.role === "user" ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-[12px]">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                ) : msg.role === "system" ? (
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                    <span className="text-xs">🤖</span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                    <span className="text-xs">🤖</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tr-sm"
                    : msg.role === "system"
                    ? "bg-purple-500/10 border border-purple-500/20 text-purple-200 rounded-tl-sm"
                    : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>

                {/* Section badges */}
                {msg.sectionCount && msg.sectionCount > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {msg.sectionCount} section
                    </span>
                    {msg.sectionTypes?.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400/70">
                        {t}
                      </span>
                    ))}
                    {(msg.sectionTypes?.length || 0) > 3 && (
                      <span className="text-[8px] text-gray-600">+{msg.sectionTypes!.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-[8px] text-gray-700 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Error bar */}
      {error && (
        <div className="mx-4 mb-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="hover:text-white ml-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Save to Page Bar */}
      {!savedToPage && !isRunning && messages.some((m) => m.role === "assistant" && m.sectionCount && m.sectionCount > 0) && (
        <div className="mx-4 mb-2">
          <button
            onClick={handleSaveToPage}
            disabled={saving}
            className={`w-full py-2 rounded-xl text-[10px] font-semibold transition-all ${
              "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {saving ? "Menyimpan..." : "💾 Simpan Hasil ke Halaman"}
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#0f172a] p-3">
        {isRunning ? (
          <button
            onClick={handleStop}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Hentikan
          </button>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis deskripsi website yang diinginkan..."
              rows={2}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              style={{ maxHeight: "80px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
        <p className="text-[8px] text-gray-700 text-center mt-1.5">
          Template engine + AI content. Preview muncul di sebelah kanan.
        </p>
      </div>
    </div>
  );
}
