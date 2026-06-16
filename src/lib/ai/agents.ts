/**
 * Multi-Agent AI Pipeline
 *
 * Agent flow:
 *   Planner → (Writer → Coder → Reviewer → Stylist) → Preview
 *
 * Each agent builds on the output of the previous one.
 * Results are streamed to the frontend via callbacks for live preview.
 */

import type { AIConfig } from "@/lib/ai";
import { buildPlannerPrompt, buildWriterPrompt, buildCoderPrompt, buildReviewerPrompt, buildStylistPrompt } from "./prompts";
import { queryBestMemories, loadUserPreferences, buildFewShotExamples, buildPreferenceString } from "./memory";

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

export type AgentType = "planner" | "writer" | "coder" | "reviewer" | "stylist";

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
}

// ─── AI Proxy Call ─────────────────────────────────

async function callAgent(
  config: AIConfig,
  prompt: string
): Promise<string> {
  const proxyUrl = "/api/ai/proxy";

  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: config.provider,
      apiKey: config.apiKey,
      prompt,
      action: "generate",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `AI request failed (${res.status})`);
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
  const { userId, userPrompt, category, enableWriter = true, enableStylist = true } = pipelineConfig;

  // ── Step 0: Gather context from memory ──
  let fewShotExamples = "";
  let userPrefString = "";

  try {
    const memories = await queryBestMemories(category, 3);
    fewShotExamples = buildFewShotExamples(memories);

    const prefs = loadUserPreferences(userId);
    userPrefString = buildPreferenceString(prefs);
  } catch (err) {
    // Memory failure shouldn't block the pipeline
    console.warn("Memory query failed, continuing without examples:", err);
  }

  // ── Step 1: Planner ──
  const plannerPrompt = buildPlannerPrompt(userPrompt, fewShotExamples, userPrefString);
  const planRaw = await runAgent(aiConfig, "planner", plannerPrompt, callbacks, signal);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // Update preview with plan
  const planJSON = extractJSON(planRaw);
  callbacks.onPreviewUpdate(planJSON);

  let currentJSON = planJSON;

  // ── Step 2: Writer & Curator (optional) ──
  if (enableWriter) {
    const writerPrompt = buildWriterPrompt(userPrompt, currentJSON);
    const writerRaw = await runAgent(aiConfig, "writer", writerPrompt, callbacks, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    currentJSON = extractJSON(writerRaw);
    callbacks.onPreviewUpdate(currentJSON);
  }

  // ── Step 3: Coder ──
  const coderPrompt = buildCoderPrompt(userPrompt, currentJSON);
  const coderRaw = await runAgent(aiConfig, "coder", coderPrompt, callbacks, signal);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  currentJSON = extractJSON(coderRaw);
  callbacks.onPreviewUpdate(currentJSON);

  // ── Step 4: Reviewer ──
  const reviewerPrompt = buildReviewerPrompt(userPrompt, currentJSON);
  const reviewerRaw = await runAgent(aiConfig, "reviewer", reviewerPrompt, callbacks, signal);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  currentJSON = extractJSON(reviewerRaw);
  callbacks.onPreviewUpdate(currentJSON);

  // ── Step 5: Stylist (optional) ──
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
