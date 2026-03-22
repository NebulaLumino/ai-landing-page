import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert UX/CRO specialist and landing page analyst. Analyze the provided landing page content and deliver actionable optimization recommendations.\n\nProvide:\n1. Predicted user behavior analysis:\n   - Estimated scroll depth (% who will read each section)\n   - Click probability by element\n   - Attention heatmap description (above fold, mid-page, CTA areas)\n   - Friction points\n\n2. Specific copy improvements:\n   - Headline variations to test\n   - Subheadline suggestions\n   - CTA button copy optimization\n   - Social proof placement recommendations\n\n3. Layout recommendations:\n   - Section ordering improvements\n   - Visual hierarchy suggestions\n   - Trust signal placement\n\n4. Predicted conversion impact of each change\n5. Quick wins (changes that take &lt;1 hour)\n\nBe specific and actionable — tell exactly what to change.`,
        },
        { role: "user", content: `Analyze this landing page:\n\n${input}` },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
