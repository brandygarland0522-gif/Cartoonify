import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY missing in Vercel environment variables" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const form = await req.formData();
    const file = form.get("image");

    if (!file) {
      return Response.json(
        { error: "No image uploaded" },
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

    const b64 = result?.data?.[0]?.b64_json;
    if (!b64) {
      return Response.json(
        { error: "OpenAI returned no image data" },
        { status: 502 }
      );
    }

    return Response.json({ b64 });
  } catch (e) {
    console.e

