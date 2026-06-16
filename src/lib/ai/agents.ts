/**
 * AI Agents — Simplified pipeline
 *
 * Previously had 6 agents (Researcher → Planner → Writer → Coder → Reviewer → Stylist).
 * Now simplified to:
 *   Template Engine → AI Content Fill (for initial generation)
 *   AI Modify JSON     (for follow-up requests)
 *
 * All logic lives in generator.ts. This file re-exports for backward compatibility.
 */

export { generateWebsite, parseResultToSections } from "./generator";
export type { GenerateCallbacks } from "./generator";
