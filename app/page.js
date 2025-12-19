"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setImgSrc("");

    if (!file) return setErr("Pick a photo first.");

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/cartoonify", { method: "POST", body: fd });

      // Read as text first so we can handle non-JSON responses safely
      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON (${res.status}). First 200 chars: ${text.slice(0, 200)}`);
      }

      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);

      setImgSrc(`data:image/png;base64,${json.b64}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Cartoonify</h1>
      <p>Upload a photo and turn it into a realistic cartoon.</p>

      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
        <br />
        <button style={{ marginTop: 12 }} disabled={busy}>
          {busy ? "Working..." : "Cartoonify"}
        </button>
      </form>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {imgSrc && (
        <>
          <h3>Result</h3>
          <img src={imgSrc} alt="Result" style={{ width: "100%", borderRadius: 12 }} />
          <p><a href={imgSrc} download="cartoon.png">Download</a></p>
        </>
      )}
    </main>
  );
}


