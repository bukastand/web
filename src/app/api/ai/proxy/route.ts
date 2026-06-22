import { NextResponse } from "next/server";

// ── Rate Limiter ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 300_000);

// ─── Model Configuration ────────────────────────────

const PROVIDER_CONFIGS: Record<string, {
  models: string[];
  baseUrl: string;
  defaultTemperature: number;
  maxTokens: number;
  /** If true, uses OpenAI-compatible format */
  openaiCompatible: boolean;
  /** If true, uses Anthropic Messages API format */
  anthropicFormat: boolean;
}> = {
  gemini: {
    models: ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"],
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    defaultTemperature: 1.2,
    maxTokens: 8192,
    openaiCompatible: false,
    anthropicFormat: false,
  },
  groq: {
    models: ["llama-3.3-70b-versatile"],
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    defaultTemperature: 1.2,
    maxTokens: 8192,
    openaiCompatible: true,
    anthropicFormat: false,
  },
  openai: {
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1"],
    baseUrl: "https://api.openai.com/v1/chat/completions",
    defaultTemperature: 1.2,
    maxTokens: 8192,
    openaiCompatible: true,
    anthropicFormat: false,
  },
  claude: {
    models: ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
    baseUrl: "https://api.anthropic.com/v1/messages",
    defaultTemperature: 1.2,
    maxTokens: 8192,
    openaiCompatible: false,
    anthropicFormat: true,
  },
  deepseek: {
    models: ["deepseek-v4-flash", "deepseek-v4-pro", "deepseek-chat"],
    baseUrl: "https://api.deepseek.com/chat/completions",
    defaultTemperature: 1.2,
    maxTokens: 8192,
    openaiCompatible: true,
    anthropicFormat: false,
  },
  mistral: {
    models: ["mistral-large-3", "mistral-small-4"],
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    defaultTemperature: 1.2,
    maxTokens: 8192,
    openaiCompatible: true,
    anthropicFormat: false,
  },
};

const SYSTEM_PROMPT = "Anda adalah desainer web profesional dan copywriter bisnis. Tulis konten yang lugas, jelas, dan profesional — seperti website bisnis pada umumnya. Hindari bahasa puitis, metafora, atau kata-kata bombastis. Output JSON saja, tanpa markdown atau backticks.";

// ─── Main Handler ──────────────────────────────────

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi dalam 60 detik." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { provider, apiKey, prompt, action, model, providers } = body;

    if (action === "generate" && !prompt) {
      return NextResponse.json(
        { error: "Prompt wajib diisi" },
        { status: 400 }
      );
    }

    // ── New format: array of providers (with auto-fallback) ──
    if (providers && Array.isArray(providers) && providers.length > 0) {
      return handleWithFallback(providers, prompt, action);
    }

    // ── Old format: single provider ──
    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider dan API Key wajib diisi" },
        { status: 400 }
      );
    }

    const config = PROVIDER_CONFIGS[provider];
    if (!config) {
      return NextResponse.json(
        { error: `Unknown provider: ${provider}` },
        { status: 400 }
      );
    }

    // Test action: simple call to verify API key
    if (action === "test") {
      const ok = await testSingleProvider(provider, apiKey, config);
      return NextResponse.json({ ok });
    }

    // Generate action with single provider
    const selectedModel = model || config.models[0];
    return callProviderAndRespond(provider, apiKey, prompt, config, selectedModel);
  } catch (err: any) {
    console.error("AI Proxy error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── Auto-Fallback Handler ────────────────────────

interface ProviderEntry {
  provider: string;
  apiKey: string;
  model?: string;
}

async function handleWithFallback(
  providers: ProviderEntry[],
  prompt: string,
  action: string
) {
  const errors: string[] = [];

  for (const entry of providers) {
    const config = PROVIDER_CONFIGS[entry.provider];
    if (!config) {
      errors.push(`${entry.provider}: unknown provider`);
      continue;
    }

    if (action === "test") {
      const ok = await testSingleProvider(entry.provider, entry.apiKey, config);
      if (ok) {
        return NextResponse.json({ ok: true, provider: entry.provider });
      }
      errors.push(`${entry.provider}: invalid key`);
      continue;
    }

    try {
      const selectedModel = entry.model || config.models[0];
      const result = await callSingleProvider(
        entry.provider,
        entry.apiKey,
        prompt,
        config,
        selectedModel
      );

      if (result.ok && result.content) {
        return NextResponse.json({
          content: result.content,
          provider: entry.provider,
          model: selectedModel,
        });
      }

      // Check if we should try next provider
      if (result.shouldRetry) {
        errors.push(`${entry.provider}: ${result.error || "rate limited"}`);
        console.warn(`[AutoFallback] ${entry.provider} failed, trying next...`);
        continue;
      }

      // Fatal error (not rate limit) — return immediately
      return NextResponse.json(
        { error: `${entry.provider} API error: ${result.error}` },
        { status: 500 }
      );
    } catch (err: any) {
      errors.push(`${entry.provider}: ${err.message}`);
      console.warn(`[AutoFallback] ${entry.provider} threw, trying next...`);
      continue;
    }
  }

  // All providers failed
  return NextResponse.json(
    {
      error: `Semua provider gagal.\n\n${errors.join("\n")}\n\nCoba tambah API Key provider lain atau tunggu rate limit reset.`,
      fallbackErrors: errors,
    },
    { status: 429 }
  );
}

async function testSingleProvider(
  provider: string,
  apiKey: string,
  config: typeof PROVIDER_CONFIGS['groq']
): Promise<boolean> {
  try {
    const model = config.models[0];
    if (provider === "gemini") {
      const res = await fetch(
        `${config.baseUrl}/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "OK" }] }],
            generationConfig: { maxOutputTokens: 5, temperature: 0.5 },
          }),
        }
      );
      return res.ok;
    } else if (config.anthropicFormat) {
      const res = await fetch(config.baseUrl, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 5,
          messages: [{ role: "user", content: "OK" }],
        }),
      });
      return res.ok;
    } else {
      const res = await fetch(config.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "OK" }],
          max_tokens: 5,
        }),
      });
      return res.ok;
    }
  } catch {
    return false;
  }
}

interface ProviderCallResult {
  ok: boolean;
  content?: string;
  error?: string;
  shouldRetry: boolean;
}

async function callSingleProvider(
  provider: string,
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['groq'],
  model: string
): Promise<ProviderCallResult> {
  try {
    if (provider === "gemini") {
      return await callGeminiProvider(apiKey, prompt, config, model);
    } else if (config.anthropicFormat) {
      return await callAnthropicProvider(apiKey, prompt, config, model);
    } else if (config.openaiCompatible) {
      return await callOpenAICompatibleProvider(provider, apiKey, prompt, config, model);
    }
    return { ok: false, error: `Unhandled provider: ${provider}`, shouldRetry: false };
  } catch (err: any) {
    return { ok: false, error: err.message, shouldRetry: true };
  }
}

/**
 * Check if an error response indicates we should retry with another provider
 */
function isRateLimitError(status: number, errorText: string): boolean {
  if (status === 429) return true;
  if (status === 403) {
    const lower = errorText.toLowerCase();
    if (lower.includes("rate limit") || lower.includes("quota") || lower.includes("insufficient") || lower.includes("resource exhausted")) return true;
  }
  return false;
}

// ─── Gemini Provider Call ───────────────────────

async function callGeminiProvider(
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['gemini'],
  model: string
): Promise<ProviderCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(
      `${config.baseUrl}/${model}:generateContent?key=${apiKey}`,
      {
        signal: controller.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: config.defaultTemperature,
            maxOutputTokens: config.maxTokens,
            topP: 0.95,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          ],
        }),
      }
    );

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return { ok: true, content: text.trim(), shouldRetry: false };
    }

    const errText = await res.text();
    if (isRateLimitError(res.status, errText)) {
      return { ok: false, error: errText.substring(0, 200), shouldRetry: true };
    }
    return { ok: false, error: errText.substring(0, 300), shouldRetry: false };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { ok: false, error: "Timeout", shouldRetry: true };
    }
    return { ok: false, error: err.message, shouldRetry: true };
  }
}

// ─── OpenAI-Compatible Provider Call ────────────

async function callOpenAICompatibleProvider(
  provider: string,
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['openai'],
  model: string
): Promise<ProviderCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(config.baseUrl, {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: config.defaultTemperature,
        max_tokens: config.maxTokens,
        top_p: 0.95,
      }),
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || "";
      return { ok: true, content: text.trim(), shouldRetry: false };
    }

    const errText = await res.text();
    if (isRateLimitError(res.status, errText)) {
      return { ok: false, error: errText.substring(0, 200), shouldRetry: true };
    }
    return { ok: false, error: errText.substring(0, 300), shouldRetry: false };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { ok: false, error: "Timeout", shouldRetry: true };
    }
    return { ok: false, error: err.message, shouldRetry: true };
  }
}

// ─── Anthropic Provider Call ────────────────────

async function callAnthropicProvider(
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['claude'],
  model: string
): Promise<ProviderCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout (Claude lebih lambat)

  try {
    const res = await fetch(config.baseUrl, {
      signal: controller.signal,
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: config.maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
        temperature: config.defaultTemperature,
        top_p: 0.95,
      }),
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const text = data?.content?.[0]?.text || "";
      return { ok: true, content: text.trim(), shouldRetry: false };
    }

    const errText = await res.text();
    if (isRateLimitError(res.status, errText)) {
      return { ok: false, error: errText.substring(0, 200), shouldRetry: true };
    }
    return { ok: false, error: errText.substring(0, 300), shouldRetry: false };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { ok: false, error: "Timeout", shouldRetry: true };
    }
    return { ok: false, error: err.message, shouldRetry: true };
  }
}

/**
 * Legacy: call single provider and return NextResponse
 */
async function callProviderAndRespond(
  provider: string,
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['groq'],
  model: string
) {
  const result = await callSingleProvider(provider, apiKey, prompt, config, model);
  if (!result.ok) {
    return NextResponse.json(
      { error: `${provider} API error: ${result.error}` },
      { status: 500 }
    );
  }
  return NextResponse.json({ content: result.content || "" });
}


