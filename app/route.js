import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured" }),
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const form = await req.formData();
    const file = form.get("image");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No image uploaded" }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await client.images.edits({
      model: "gpt-image-1.5",
      image: buffer,
      prompt:
        "Transform this photo into a realistic cartoon portrait. Keep facial features, skin tone, hairstyle, and expression recognizable. Clean outlines, subtle texture, not exaggerated.",
      size: "1024x1024"
    });

    return new Response(
      JSON.stringify({ b64: result.data[0].b64_json }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || "Server error" }),
      { status: 500 }
    );
  }
}
