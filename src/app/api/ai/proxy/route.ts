import { NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash";
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

async function handleGemini(apiKey: string, prompt: string, action: string) {
  if (action === "test") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "OK" }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      }
    );
    return NextResponse.json({ ok: res.ok });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: `Gemini API error (${res.status}): ${err}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return NextResponse.json({ content: text.trim() });
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
        { role: "system", content: "Anda adalah copywriter profesional untuk website. Output harus sesuai permintaan." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
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
