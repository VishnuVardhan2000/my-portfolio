"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MusicPlayer from "./MusicPlayer";

const LINKS = [
  { label: "Home",     href: "/",         color: "168,85,247", hex: "#c084fc" },
  { label: "About",    href: "/about",    color: "0,255,136",  hex: "#00ff88" },
  { label: "Projects", href: "/projects", color: "96,165,250", hex: "#60a5fa" },
  { label: "Resume",   href: "/resume",   color: "251,191,36", hex: "#fbbf24" },
  { label: "Contact",  href: "/contact",  color: "236,72,153", hex: "#f85acd" },
  { label: "Terminal", href: "/terminal", color: "74,222,128", hex: "#4ade80" },
];

function TerminalLabel() {
  const full = "terminal";
  const [text, setText] = useState(full);
  const timerRef = useRef(null);

  useEffect(() => {
    const deleteThenRetype = () => {
      let i = full.length;
      const delInterval = setInterval(() => {
        i--;
        setText(full.slice(0, i));
        if (i <= 0) {
          clearInterval(delInterval);
          let j = 0;
          const typeInterval = setInterval(() => {
            j++;
            setText(full.slice(0, j));
            if (j >= full.length) {
              clearInterval(typeInterval);
              timerRef.current = setTimeout(deleteThenRetype, 3000);
            }
          }, 80);
        }
      }, 60);
    };

    timerRef.current = setTimeout(deleteThenRetype, 3000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const body = text.slice(0, -1);
  const last = text.slice(-1);

  return (
    <span className="font-mono text-sm font-medium tracking-wide inline-flex items-center gap-0" aria-label="terminal">
      <span style={{ color: "rgba(255,255,255,0.65)" }}>{body}</span>
      {last && (
        <span style={{
          color: "#4ade80",
          textShadow: "0 0 4px rgba(74,222,128,1), 0 0 10px rgba(74,222,128,0.8), 0 0 22px rgba(74,222,128,0.5)",
        }}>
          {last}
        </span>
      )}
      <span
        aria-hidden="true"
        style={{
          color: "#4ade80",
          marginLeft: "1px",
          animation: "cursor-blink 1s step-end infinite",
          textShadow: "0 0 6px rgba(74,222,128,1), 0 0 14px rgba(74,222,128,0.6)",
        }}
      >
        ▌
      </span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Skip to content — accessibility + SEO */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0a0a12] focus:text-white focus:border focus:border-white/20 focus:text-sm focus:font-mono"
      >
        Skip to content
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">

          {/* VD. aurora logo */}
          <Link href="/" className="vd-logo text-sm font-semibold tracking-wide" aria-label="Vardhan Doharey — Home">
            VD.
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {LINKS.map((item) => {
              const active = isActive(item.href);
              const isTerm = item.href === "/terminal";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-word"
                  aria-current={active ? "page" : undefined}
                  style={active ? {
                    color:      item.hex,
                    background: `rgba(${item.color},0.08)`,
                    textShadow: `0 0 8px rgba(${item.color},0.8), 0 0 20px rgba(${item.color},0.35)`,
                  } : {}}
                >
                  {isTerm ? <TerminalLabel /> : item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <MusicPlayer />

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
                style={open ? { transform: "translateY(8px) rotate(45deg)" } : {}} />
              <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
                style={open ? { opacity: 0 } : {}} />
              <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
                style={open ? { transform: "translateY(-8px) rotate(-45deg)" } : {}} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          aria-hidden={!open}
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? "400px" : "0px" }}
        >
          <nav
            aria-label="Mobile navigation"
            className="bg-[#0a0a12]/95 backdrop-blur-md border-t border-white/[0.06] flex flex-col py-3"
          >
            {LINKS.map((item) => {
              const active = isActive(item.href);
              const isTerm = item.href === "/terminal";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  style={active
                    ? { color: item.hex, textShadow: `0 0 8px rgba(${item.color},0.7)` }
                    : { color: "rgba(255,255,255,0.65)" }}
                >
                  {active && <span aria-hidden="true">▸</span>}
                  {isTerm ? <TerminalLabel /> : item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <style>{`
        @keyframes aurora {
          0%   { color:#c084fc; text-shadow:0 0 10px rgba(192,132,252,0.9),0 0 25px rgba(192,132,252,0.5),0 0 50px rgba(192,132,252,0.2); }
          20%  { color:#60a5fa; text-shadow:0 0 10px rgba(96,165,250,0.9), 0 0 25px rgba(96,165,250,0.5), 0 0 50px rgba(96,165,250,0.2); }
          40%  { color:#34d399; text-shadow:0 0 10px rgba(52,211,153,0.9), 0 0 25px rgba(52,211,153,0.5), 0 0 50px rgba(52,211,153,0.2); }
          60%  { color:#fbbf24; text-shadow:0 0 10px rgba(251,191,36,0.9), 0 0 25px rgba(251,191,36,0.5), 0 0 50px rgba(251,191,36,0.2); }
          80%  { color:#f472b6; text-shadow:0 0 10px rgba(244,114,182,0.9),0 0 25px rgba(244,114,182,0.5),0 0 50px rgba(244,114,182,0.2); }
          100% { color:#c084fc; text-shadow:0 0 10px rgba(192,132,252,0.9),0 0 25px rgba(192,132,252,0.5),0 0 50px rgba(192,132,252,0.2); }
        }
        .vd-logo {
          animation: aurora 6s ease-in-out infinite;
          text-decoration: none;
        }
        .nav-word {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.28s ease, text-shadow 0.28s ease, background 0.28s ease;
          display: inline-flex;
          align-items: center;
        }
        .nav-word:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
        }
        .focus\\:not-sr-only:focus {
          position: fixed; width: auto; height: auto;
          padding: inherit; margin: 0; overflow: visible;
          clip: auto; white-space: normal;
        }
      `}</style>
    </>
  );
}