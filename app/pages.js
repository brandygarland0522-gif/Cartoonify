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
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");

      setImgSrc(`data:image/png;base64,${json.b64}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "40px auto", fontFamily: "system-ui", padding: 16 }}>
      <h1>Cartoonify</h1>
      <p>Upload a photo. Get a realistic cartoon. Humans stay obsessed with becoming art.</p>

      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
        <button style={{ marginTop: 12 }} disabled={busy}>
          {busy ? "Processing..." : "Cartoonify"}
        </button>
      </form>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {imgSrc && (
        <>
          <h3 style={{ marginTop: 18 }}>Result</h3>
          <img src={imgSrc} alt="Result" style={{ width: "100%", borderRadius: 12 }} />
          <p style={{ marginTop: 10 }}>
            <a href={imgSrc} download="cartoon.png">Download image</a>
          </p>
        </>
      )}

      <p style={{ marginTop: 18, fontSize: 13, opacity: 0.75 }}>
        Upload only photos you have permission to use.
      </p>
    </main>
  );
}
