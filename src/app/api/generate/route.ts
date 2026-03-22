import { NextRequest, NextResponse } from "next/server";

function getClient() {
  const OpenAI = require("openai");
  return new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY });
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) return NextResponse.json({ error: "Input is required" }, { status: 400 });
    const client = getClient();
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: `You are an expert UX/CRO specialist and landing page analyst. Analyze the provided landing page content and deliver actionable optimization recommendations.\n\nProvide:\n1. Predicted user behavior: estimated scroll depth, click probability by element, attention heatmap description, friction points\n2. Specific copy improvements: headline variations, subheadline suggestions, CTA button copy optimization, social proof placement\n3. Layout recommendations: section ordering, visual hierarchy, trust signal placement\n4. Predicted conversion impact of each change\n5. Quick wins (changes that take <1 hour)\n\nBe specific and actionable — tell exactly what to change.` },
        { role: "user", content: `Analyze this landing page:\n\n${input}` },
      ],
      temperature: 0.7, max_tokens: 2500,
    });
    return NextResponse.json({ result: response.choices[0]?.message?.content || "No result generated." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
