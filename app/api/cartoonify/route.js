export const runtime = "nodejs";

export async function POST(req) {
  try {
  let apiKey = process.env.OPENAI_API_KEY || "";
apiKey = apiKey.replace(/[^\x00-\xFF]/g, "").trim();

    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY missing in Vercel environment variables" },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("image");

    if (!file) {
      return Response.json({ error: "No image uploaded" }, { status: 400 });
    }

    const fd = new FormData();
    fd.append("model", "gpt-image-1.5");
    fd.append(
      "prompt",
      "Transform this photo into a realistic cartoon portrait. Keep facial features, skin tone, hairstyle, and expression recognizable. Clean outlines, subtle texture, not exaggerated."
    );
    fd.append("size", "1024x1024");

    // Convert to Blob with safe filename to avoid ByteString unicode errors
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = new Blob([bytes], { type: file.type || "image/jpeg" });
    fd.append("image", blob, "upload.jpg");

    const r = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: fd
    });

    const data = await r.json().catch(() => null);

    if (!r.ok) {
      const msg = data?.error?.message || `OpenAI request failed (${r.status})`;
      return Response.json({ error: msg }, { status: 502 });
    }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return Response.json({ error: "OpenAI returned no image data" }, { status: 502 });
    }

    return Response.json({ b64 });
  } catch (e) {
    return Response.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

