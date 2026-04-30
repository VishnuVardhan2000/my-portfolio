"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "../context/ThemeContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // On route change — if was playing, keep playing
    // MusicPlayer owns window.__bgm__ creation, we just resume it
    const audio = window.__bgm__;
    if (!audio || !audio._playing) return;

    const resume = setTimeout(() => {
      if (audio._playing && audio.paused) {
        audio.play().catch(() => {});
      }
    }, 100);

    return () => clearTimeout(resume);
  }, [pathname]);

  return <ThemeProvider>{children}</ThemeProvider>;
}