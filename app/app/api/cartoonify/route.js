import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("image");

    if (!file) {
      return new Response(JSON.stringify({ error: "Missing image" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const prompt =
      "Transform this photo into a realistic cartoon portrait. Keep the person's facial features, skin tone, hairstyle, and expression recognizable. Keep lighting similar. Clean outlines, subtle texture, not exaggerated. Background simplified slightly. High detail.";

    const result = await client.images.edits({
      model: "gpt-image-1.5",
      image: buffer,
      prompt,
      size: "1024x1024"
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return new Response(JSON.stringify({ error: "No image returned" }), { status: 500 });
    }

    return new Response(JSON.stringify({ b64 }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? "Server error" }), { status: 500 });
  }
}
