"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio ONCE on first render only
    if (!window.__bgm__) {
      window.__bgm__ = new Audio("/portfoliobg.m4a");
      window.__bgm__.loop = true;
      window.__bgm__.volume = 0.4;
      window.__bgm__._playing = false;
      window.__bgm__._vol = 0.4;
    }
    audioRef.current = window.__bgm__;
  }, []); // ← empty array = runs ONCE ever

  useEffect(() => {
    // On route change — if was playing, keep playing
    const audio = window.__bgm__;
    if (!audio || !audio._playing) return;

    // Re-trigger play after navigation suspense gap
    const resume = setTimeout(() => {
      if (audio._playing && audio.paused) {
        audio.play().catch(() => {});
      }
    }, 100); // small delay for suspense to settle

    return () => clearTimeout(resume);
  }, [pathname]); // ← runs on every page change

  return <>{children}</>;
}