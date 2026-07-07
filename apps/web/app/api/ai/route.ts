import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { task, payload } = await req.json();
    
    // §8: The proxy reads the API key securely on the server
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("OPENAI_API_KEY missing, falling back to mock layer on the client side.");
      return NextResponse.json({ error: "No API key" }, { status: 503 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using mini for fast/cheap demo, adjust if needed
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a civic AI assistant. Always return valid JSON." },
          { role: "user", content: JSON.stringify({ task, payload }) }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;

    let resultJson;
    try {
      resultJson = JSON.parse(resultText);
    } catch {
      resultJson = { raw: resultText };
    }

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("AI proxy error:", error);
    return NextResponse.json({ error: "AI proxy failed" }, { status: 500 });
  }
}
