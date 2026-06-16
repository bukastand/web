import { NextResponse } from "next/server";

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
    defaultTemperature: 1.0,
    maxTokens: 4096,
    openaiCompatible: false,
    anthropicFormat: false,
  },
  groq: {
    models: ["llama-3.3-70b-versatile"],
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    defaultTemperature: 1.0,
    maxTokens: 4096,
    openaiCompatible: true,
    anthropicFormat: false,
  },
  openai: {
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1"],
    baseUrl: "https://api.openai.com/v1/chat/completions",
    defaultTemperature: 1.0,
    maxTokens: 4096,
    openaiCompatible: true,
    anthropicFormat: false,
  },
  claude: {
    models: ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
    baseUrl: "https://api.anthropic.com/v1/messages",
    defaultTemperature: 1.0,
    maxTokens: 4096,
    openaiCompatible: false,
    anthropicFormat: true,
  },
  deepseek: {
    models: ["deepseek-v4-flash", "deepseek-v4-pro", "deepseek-chat"],
    baseUrl: "https://api.deepseek.com/chat/completions",
    defaultTemperature: 1.0,
    maxTokens: 4096,
    openaiCompatible: true,
    anthropicFormat: false,
  },
  mistral: {
    models: ["mistral-large-3", "mistral-small-4"],
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    defaultTemperature: 1.0,
    maxTokens: 4096,
    openaiCompatible: true,
    anthropicFormat: false,
  },
};

const SYSTEM_PROMPT = "Anda adalah seniman web visioner dan copywriter puitis. Bebas total — tidak ada template, tidak ada batasan. Ciptakan desain yang orisinil, konten yang bermakna, dan layout yang belum pernah dilihat orang sebelumnya. Beranilah berbeda. Output JSON saja, tanpa markdown atau backticks.";

// ─── Main Handler ──────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey, prompt, action, model } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider dan API Key wajib diisi" },
        { status: 400 }
      );
    }

    if (action === "generate" && !prompt) {
      return NextResponse.json(
        { error: "Prompt wajib diisi" },
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
      return handleTest(provider, apiKey, config);
    }

    // Generate action
    const selectedModel = model || config.models[0];

    if (provider === "gemini") {
      return handleGemini(apiKey, prompt, config, selectedModel);
    } else if (config.anthropicFormat) {
      return handleAnthropic(apiKey, prompt, config, selectedModel);
    } else if (config.openaiCompatible) {
      return handleOpenAICompatible(provider, apiKey, prompt, config, selectedModel);
    }

    return NextResponse.json(
      { error: `Unhandled provider: ${provider}` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("AI Proxy error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── Test Handler ─────────────────────────────────

async function handleTest(provider: string, apiKey: string, config: typeof PROVIDER_CONFIGS['gemini']) {
  const selectedModel = config.models[0];

  try {
    let ok = false;

    if (provider === "gemini") {
      const res = await fetch(
        `${config.baseUrl}/${selectedModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "OK" }] }],
            generationConfig: { maxOutputTokens: 5, temperature: 0.5 },
          }),
        }
      );
      ok = res.ok;
    } else if (config.anthropicFormat) {
      const res = await fetch(config.baseUrl, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 5,
          messages: [{ role: "user", content: "OK" }],
        }),
      });
      ok = res.ok;
    } else if (config.openaiCompatible) {
      const res = await fetch(config.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: "OK" }],
          max_tokens: 5,
        }),
      });
      ok = res.ok;
    }

    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

// ─── Gemini Handler ─────────────────────────────

async function handleGemini(apiKey: string, prompt: string, config: typeof PROVIDER_CONFIGS['gemini'], model: string) {
  const result = await callGeminiWithFallback(apiKey, prompt, config, config.models);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Gemini API error" },
      { status: 500 }
    );
  }
  return NextResponse.json({ content: result.content || "" });
}

async function callGeminiWithFallback(
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['gemini'],
  models: string[]
): Promise<{ ok: boolean; content?: string; error?: string }> {
  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

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
        return { ok: true, content: text.trim() };
      }

      if (res.status >= 400 && res.status < 500) {
        const err = await res.text();
        console.warn(`Gemini ${model} failed (${res.status}): ${err.substring(0, 200)}`);
        continue;
      }

      const err = await res.text();
      return { ok: false, error: `Gemini error (${res.status}): ${err.substring(0, 300)}` };
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn(`Gemini ${model} timed out`);
        continue;
      }
      return { ok: false, error: `Gemini error: ${err.message}` };
    }
  }
  return { ok: false, error: "Semua model Gemini tidak tersedia. Coba ganti provider atau cek kuota API Key Anda." };
}

// ─── OpenAI-Compatible Handler ──────────────────

async function handleOpenAICompatible(
  provider: string,
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['openai'],
  model: string
) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

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

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `${provider} API error (${res.status}): ${err.substring(0, 300)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    return NextResponse.json({ content: text.trim() });
  } catch (err: any) {
    return NextResponse.json(
      { error: `${provider} API error: ${err.message}` },
      { status: 500 }
    );
  }
}

// ─── Anthropic Claude Handler ─────────────────────

async function handleAnthropic(
  apiKey: string,
  prompt: string,
  config: typeof PROVIDER_CONFIGS['claude'],
  model: string
) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

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
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: config.defaultTemperature,
        top_p: 0.95,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `Claude API error (${res.status}): ${err.substring(0, 300)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text || "";
    return NextResponse.json({ content: text.trim() });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Claude API error: ${err.message}` },
      { status: 500 }
    );
  }
}
