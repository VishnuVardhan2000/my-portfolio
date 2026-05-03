"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MusicPlayer from "./MusicPlayer";

const LINKS = [
  { label: "Home",     href: "/",         color: "168,85,247",  hex: "#c084fc" },
  { label: "About",    href: "/about",    color: "0,255,136",   hex: "#00ff88" },
  { label: "Projects", href: "/projects", color: "96,165,250",  hex: "#60a5fa" },
  { label: "Resume",   href: "/resume",   color: "251,191,36",  hex: "#fbbf24" },
  { label: "Contact",  href: "/contact",  color: "236,72,153",  hex: "#f85acd" },
  { label: "Terminal", href: "/terminal", color: "74,222,128",  hex: "#4ade80" },
];

// ── Animated Terminal Label ─────────────────────────────────
function TerminalLabel({ active }) {
  return (
    <span className="terminal-nav-label font-mono text-sm font-medium tracking-wide">
      <span className="ter-text">ter</span>
      <span className="ter-m">m</span>
      <span className="ter-i">i</span>
      <span className="ter-na">na</span>
      <span className="ter-l neon-l">l</span>
      <span className="ter-cursor">▌</span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a12]/80 backdrop-blur-md border-b border-white/[0.06]">

      {/* VD. aurora logo */}
      <a href="/" className="vd-logo text-sm font-semibold tracking-wide">VD.</a>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {LINKS.map((item) => {
          const active = isActive(item.href);
          const isTerminal = item.href === "/terminal";
          return (
            <a key={item.label} href={item.href}
              className="nav-word"
              style={active ? {
                color: item.hex,
                background: `rgba(${item.color},0.08)`,
                textShadow: `0 0 8px rgba(${item.color},0.8), 0 0 20px rgba(${item.color},0.35)`,
              } : {}}>
              {isTerminal ? <TerminalLabel active={active} /> : item.label}
            </a>
          );
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <MusicPlayer />
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
            style={open ? { transform: "translateY(8px) rotate(45deg)" } : {}} />
          <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
            style={open ? { opacity: 0 } : {}} />
          <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
            style={open ? { transform: "translateY(-8px) rotate(-45deg)" } : {}} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a12]/95 backdrop-blur-md border-b border-white/[0.06] flex flex-col py-3 md:hidden">
          {LINKS.map((item) => {
            const active = isActive(item.href);
            const isTerminal = item.href === "/terminal";
            return (
              <a key={item.label} href={item.href}
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-sm font-medium transition-colors duration-200"
                style={active
                  ? { color: item.hex, textShadow: `0 0 8px rgba(${item.color},0.7)` }
                  : { color: "rgba(255,255,255,0.65)" }}>
                {active ? "▸ " : ""}
                {isTerminal ? <TerminalLabel active={active} /> : item.label}
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        /* Aurora logo */
        @keyframes aurora {
          0%   { color:#c084fc; text-shadow:0 0 10px rgba(192,132,252,0.9),0 0 25px rgba(192,132,252,0.5),0 0 50px rgba(192,132,252,0.2); }
          20%  { color:#60a5fa; text-shadow:0 0 10px rgba(96,165,250,0.9), 0 0 25px rgba(96,165,250,0.5), 0 0 50px rgba(96,165,250,0.2); }
          40%  { color:#34d399; text-shadow:0 0 10px rgba(52,211,153,0.9), 0 0 25px rgba(52,211,153,0.5), 0 0 50px rgba(52,211,153,0.2); }
          60%  { color:#fbbf24; text-shadow:0 0 10px rgba(251,191,36,0.9), 0 0 25px rgba(251,191,36,0.5), 0 0 50px rgba(251,191,36,0.2); }
          80%  { color:#f472b6; text-shadow:0 0 10px rgba(244,114,182,0.9),0 0 25px rgba(244,114,182,0.5),0 0 50px rgba(244,114,182,0.2); }
          100% { color:#c084fc; text-shadow:0 0 10px rgba(192,132,252,0.9),0 0 25px rgba(192,132,252,0.5),0 0 50px rgba(192,132,252,0.2); }
        }
        .vd-logo { animation:aurora 6s ease-in-out infinite; text-decoration:none; }

        /* Nav base */
        .nav-word {
          padding:8px 12px; border-radius:8px; font-size:0.875rem;
          font-weight:500; color:rgba(255,255,255,0.65); text-decoration:none;
          transition:color 0.28s ease, text-shadow 0.28s ease, background 0.28s ease;
        }
        .nav-word:hover { color:rgba(255,255,255,0.9); background:rgba(255,255,255,0.05); }

        /* ── Terminal nav label ── */

        /* The bright neon-l */
        .neon-l {
          color: #4ade80;
          text-shadow:
            0 0 4px rgba(74,222,128,1),
            0 0 10px rgba(74,222,128,0.8),
            0 0 22px rgba(74,222,128,0.5);
        }

        /* Blinking cursor next to l */
        .ter-cursor {
          color: #4ade80;
          text-shadow: 0 0 6px rgba(74,222,128,1), 0 0 14px rgba(74,222,128,0.6);
          animation: cursor-blink 1s step-end infinite;
          margin-left: 1px;
        }

        /* Typewriter delete-retype animation on the whole word */
        @keyframes retype {
           0%   { width: 7ch; }   /* fully typed: "termina" + l */
          35%   { width: 7ch; }
          50%   { width: 0ch; }   /* fully deleted */
          65%   { width: 0ch; }   /* pause before retyping */
          100%  { width: 7ch; }   /* retyped */
        }
        .terminal-nav-label {
          display: inline-flex;
          align-items: center;
          overflow: hidden;
          white-space: nowrap;
          /* runs the delete+retype every 4 seconds */
          animation: retype 4s steps(7, end) infinite;
          /* Make sure "ter" rest letters are gray/white */
          color: rgba(255,255,255,0.65);
        }
        .nav-word:hover .terminal-nav-label {
          color: rgba(255,255,255,0.9);
          animation-play-state: paused; /* pause on hover so user can click */
        }
        /* active state overrides */
        .nav-word[style] .neon-l {
          text-shadow:
            0 0 6px rgba(74,222,128,1),
            0 0 16px rgba(74,222,128,0.9),
            0 0 32px rgba(74,222,128,0.5);
        }
      `}</style>
    </header>
  );
}