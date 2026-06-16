/**
 * Multi-Agent AI Pipeline
 *
 * Agent flow:
 *   Researcher → Planner → (Writer → Coder → Reviewer → Stylist) → Preview
 *
 * Each agent builds on the output of the previous one.
 * Results are streamed to the frontend via callbacks for live preview.
 * 
 * CREATIVE FREEDOM:
 * - Researcher mencari referensi dari training knowledge AI
 * - Planner bebas berimajinasi, tidak terikat template
 * - Writer & Coder mengubah visi jadi kenyataan
 * - Reviewer & Stylist memoles hasil akhir
 */

import type { AIConfig, AIProvider } from "@/lib/ai";
import { getAllAIConfigs } from "@/lib/ai";
import { buildResearcherPrompt, buildPlannerPrompt, buildWriterPrompt, buildCoderPrompt, buildReviewerPrompt, buildStylistPrompt } from "./prompts";
import { queryBestMemories, loadUserPreferences, buildFewShotExamples, buildPreferenceString } from "./memory";

// ─── Fallback Provider Types ───────────────────────

interface ProviderEntry {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

// ─── Types ───────────────────────────────────────────

export interface AgentResult {
  agent: AgentType;
  status: "running" | "success" | "error";
  output: string;
  error?: string;
  /** Timestamp in ms for progress tracking */
  startedAt: number;
  completedAt?: number;
}

export type AgentType = "researcher" | "planner" | "writer" | "coder" | "reviewer" | "stylist";

export interface PipelineCallbacks {
  onAgentStart: (agent: AgentType) => void;
  onAgentComplete: (result: AgentResult) => void;
  onAgentError: (agent: AgentType, error: string) => void;
  onPreviewUpdate: (jsonOutput: string) => void;
}

export interface PipelineConfig {
  userId: string | null;
  userPrompt: string;
  category?: string;
  enableWriter?: boolean;
  enableStylist?: boolean;
  enableResearcher?: boolean;
  /** JSON dari hasil generate sebelumnya — untuk follow-up prompt */
  previousResult?: string;
}

// ─── AI Proxy Call ─────────────────────────────────

/**
 * Get the list of all available provider configs for fallback
 * Primary config comes first, then other providers
 */
function getFallbackProviders(config: AIConfig): ProviderEntry[] {
  const allConfigs = getAllAIConfigs();
  const providers: ProviderEntry[] = [];
  const added = new Set<string>();

  // Primary provider first (explicitly passed)
  providers.push({
    provider: config.provider,
    apiKey: config.apiKey,
  });
  added.add(config.provider);

  // Then all others from storage
  for (const cfg of allConfigs) {
    if (!added.has(cfg.provider) && cfg.apiKey) {
      providers.push({
        provider: cfg.provider,
        apiKey: cfg.apiKey,
      });
      added.add(cfg.provider);
    }
  }

  return providers;
}

async function callAgent(
  config: AIConfig,
  prompt: string
): Promise<string> {
  const proxyUrl = "/api/ai/proxy";

  // Build fallback provider list from all stored keys
  const providers = getFallbackProviders(config);

  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      providers,
      prompt,
      action: "generate",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Include fallback errors in the message
    const errorMsg = data.error || `AI request failed (${res.status})`;
    const fallbackInfo = data.fallbackErrors
      ? `\n\nFallback details:\n${data.fallbackErrors.join("\n")}`
      : "";
    throw new Error(errorMsg + fallbackInfo);
  }

  return data.content || "";
}

// ─── Extract JSON from AI response ────────────────

function extractJSON(text: string): string {
  // Remove markdown code blocks
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/`+/g, "")
    .trim();

  // Try to find JSON array or object
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];

  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];

  return cleaned;
}

// ─── Pipeline Runner ──────────────────────────────

async function runAgent(
  config: AIConfig,
  agentType: AgentType,
  prompt: string,
  callbacks: PipelineCallbacks,
  signal?: AbortSignal
): Promise<string> {
  callbacks.onAgentStart(agentType);

  const startedAt = Date.now();

  try {
    const raw = await callAgent(config, prompt);

    // Check if aborted
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const result: AgentResult = {
      agent: agentType,
      status: "success",
      output: raw,
      startedAt,
      completedAt: Date.now(),
    };

    callbacks.onAgentComplete(result);
    return raw;
  } catch (err: any) {
    if (err.name === "AbortError") throw err;

    const errorMsg = err.message || "Unknown error";
    const result: AgentResult = {
      agent: agentType,
      status: "error",
      output: "",
      error: errorMsg,
      startedAt,
      completedAt: Date.now(),
    };

    callbacks.onAgentError(agentType, errorMsg);
    throw err;
  }
}

// ─── Main Pipeline ────────────────────────────────

export async function runPipeline(
  aiConfig: AIConfig,
  pipelineConfig: PipelineConfig,
  callbacks: PipelineCallbacks,
  signal?: AbortSignal
): Promise<string> {
  const { userId, userPrompt, category, enableWriter = true, enableStylist = true, enableResearcher = true, previousResult } = pipelineConfig;

  // ── Step 0: Gather context from memory ──
  let fewShotExamples = "";
  let userPrefString = "";
  const isFollowUp = !!previousResult;

  try {
    const memories = await queryBestMemories(category, 3);
    fewShotExamples = buildFewShotExamples(memories);

    const prefs = loadUserPreferences(userId);
    userPrefString = buildPreferenceString(prefs);
  } catch (err) {
    // Memory failure shouldn't block the pipeline
    console.warn("Memory query failed, continuing without examples:", err);
  }

  let currentJSON = "";

  if (isFollowUp && previousResult) {
    // ── FOLLOW-UP MODE: Skip Researcher & Planner ──
    // Langsung ke Coder dengan existing JSON + prompt user
    const coderPrompt = buildCoderPrompt(userPrompt, previousResult, true, previousResult);
    const coderRaw = await runAgent(aiConfig, "coder", coderPrompt, callbacks, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    currentJSON = extractJSON(coderRaw);
    callbacks.onPreviewUpdate(currentJSON);
  } else {
    // ── FRESH GENERATION MODE: Full pipeline ──
    let researchResult = "";

    // Step 1: Researcher
    if (enableResearcher) {
      const researcherPrompt = buildResearcherPrompt(userPrompt);
      const researcherRaw = await runAgent(aiConfig, "researcher", researcherPrompt, callbacks, signal);
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      researchResult = researcherRaw;
    }

    // Step 2: Planner
    const plannerPrompt = buildPlannerPrompt(userPrompt, researchResult, fewShotExamples, userPrefString, false, undefined);
    const planRaw = await runAgent(aiConfig, "planner", plannerPrompt, callbacks, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const planJSON = extractJSON(planRaw);
    callbacks.onPreviewUpdate(planJSON);
    currentJSON = planJSON;

    // Step 3: Writer (optional)
    if (enableWriter) {
      const writerPrompt = buildWriterPrompt(userPrompt, currentJSON);
      const writerRaw = await runAgent(aiConfig, "writer", writerPrompt, callbacks, signal);
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      currentJSON = extractJSON(writerRaw);
      callbacks.onPreviewUpdate(currentJSON);
    }

    // Step 4: Coder
    const coderPrompt = buildCoderPrompt(userPrompt, currentJSON, false, undefined);
    const coderRaw = await runAgent(aiConfig, "coder", coderPrompt, callbacks, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    currentJSON = extractJSON(coderRaw);
    callbacks.onPreviewUpdate(currentJSON);
  }

  // ── Step 5: Reviewer ──
  const reviewerPrompt = buildReviewerPrompt(userPrompt, currentJSON);
  const reviewerRaw = await runAgent(aiConfig, "reviewer", reviewerPrompt, callbacks, signal);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  currentJSON = extractJSON(reviewerRaw);
  callbacks.onPreviewUpdate(currentJSON);

  // ── Step 6: Stylist (optional) ──
  if (enableStylist) {
    const stylistPrompt = buildStylistPrompt(userPrompt, currentJSON);
    const stylistRaw = await runAgent(aiConfig, "stylist", stylistPrompt, callbacks, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    currentJSON = extractJSON(stylistRaw);
    callbacks.onPreviewUpdate(currentJSON);
  }

  return currentJSON;
}

// ─── Parse final result into sections ────────────

export function parseResultToSections(rawJSON: string): any[] {
  try {
    const cleaned = extractJSON(rawJSON);
    let data = JSON.parse(cleaned);

    if (Array.isArray(data)) {
      return data.filter((s: any) => s && typeof s === "object" && (s.columns || s.styles));
    }

    if (data.sections && Array.isArray(data.sections)) {
      return data.sections;
    }

    if (data.styles || data.columns || data.sectionType) {
      return [data];
    }

    return [];
  } catch {
    return [];
  }
}
