import { NextResponse } from "next/server";

// Model names — fallback jika model utama error/timeout
const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey, prompt, action } = body;

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

    if (provider === "gemini") {
      return handleGemini(apiKey, prompt, action);
    } else if (provider === "groq") {
      return handleGroq(apiKey, prompt, action);
    } else {
      return NextResponse.json(
        { error: `Unknown provider: ${provider}` },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error("AI Proxy error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Try each Gemini model in order until one works
 */
async function callGeminiWithFallback(apiKey: string, prompt: string, maxTokens: number, temperature: number = 0.8): Promise<{ ok: boolean; content?: string; error?: string }> {
  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout per model

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens,
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

      // If model returns 4xx (not found, not allowed), try next model
      if (res.status >= 400 && res.status < 500) {
        const err = await res.text();
        console.warn(`Gemini model ${model} failed (${res.status}): ${err.substring(0, 200)}`);
        continue; // Try next model
      }

      // Server errors — return error immediately
      const err = await res.text();
      return { ok: false, error: `Gemini ${model} error (${res.status}): ${err.substring(0, 300)}` };
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn(`Gemini model ${model} timed out, trying next...`);
        continue; // Timeout, try next model
      }
      return { ok: false, error: `Gemini ${model} error: ${err.message}` };
    }
  }

  return { ok: false, error: "Semua model Gemini tidak tersedia. Coba lagi nanti atau ganti provider." };
}

async function handleGemini(apiKey: string, prompt: string, action: string) {
  if (action === "test") {
    const result = await callGeminiWithFallback(apiKey, "OK", 5, 0.5);
    return NextResponse.json({ ok: result.ok });
  }

  const result = await callGeminiWithFallback(apiKey, prompt, 2048, 0.8);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Gemini API error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ content: result.content || "" });
}

async function handleGroq(apiKey: string, prompt: string, action: string) {
  if (action === "test") {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: "OK" }],
        max_tokens: 5,
      }),
    });
    return NextResponse.json({ ok: res.ok });
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "Anda adalah copywriter kreatif kelas dunia. Output harus kreatif, engaging, dan orisinil." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2048,
      top_p: 0.95,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: `Groq API error (${res.status}): ${err}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return NextResponse.json({ content: text.trim() });
}
