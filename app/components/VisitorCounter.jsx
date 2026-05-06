"use client";
import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Skip counting on localhost (your local previews)
    const isLocal = window.location.hostname === "localhost" ||
                    window.location.hostname === "127.0.0.1";

    if (isLocal) {
      // Just fetch the count without incrementing
      fetch("https://api.counterapi.dev/v1/vardhan-portfolio/visits")
        .then((r) => r.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount(null));
    } else {
      // Increment only on real visits (Vercel deployment)
      fetch("https://api.counterapi.dev/v1/vardhan-portfolio/visits/up")
        .then((r) => r.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount(null));
    }
  }, []);

  if (!count) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1.5 rounded-lg"
      style={{
        background: "rgba(10,10,18,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(156,163,175,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span style={{ fontSize: "11px" }}>👁</span>
      <span>{count.toLocaleString()}</span>
    </div>
  );
}