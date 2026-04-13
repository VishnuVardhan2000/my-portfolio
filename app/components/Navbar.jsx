"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home",     href: "/",        color: "168,85,247",  hex: "#c084fc" }, // purple
  { label: "About",    href: "/about",   color: "0,255,136",   hex: "#00ff88" }, // green
  { label: "Projects", href: "/projects",color: "96,165,250",  hex: "#60a5fa" }, // blue
  { label: "Resume",   href: "/resume",  color: "251,191,36",  hex: "#fbbf24" }, // gold
  { label: "Contact",  href: "/contact", color: "236,72,153",  hex: "#ec4899" }, // pink
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeLink = LINKS.find((l) => isActive(l.href)) || LINKS[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a12]/80 backdrop-blur-md border-b border-white/[0.06]">

      {/* ── VD. aurora logo ── */}
      <a href="/" className="vd-logo text-sm font-semibold tracking-wide">
        VD.
      </a>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {LINKS.map((item) => {
          const active = isActive(item.href);
          return (
            <a key={item.label} href={item.href} className="nav-word"
              style={active ? {
                color: item.hex,
                background: `rgba(${item.color},0.08)`,
                textShadow: `0 0 8px rgba(${item.color},0.8), 0 0 20px rgba(${item.color},0.35)`,
              } : {}}>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Mobile Hamburger */}
      <button className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition"
        onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
          style={open ? { transform:"translateY(8px) rotate(45deg)" } : {}} />
        <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
          style={open ? { opacity:0 } : {}} />
        <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
          style={open ? { transform:"translateY(-8px) rotate(-45deg)" } : {}} />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a12]/95 backdrop-blur-md border-b border-white/[0.06] flex flex-col py-3 md:hidden">
          {LINKS.map((item) => {
            const active = isActive(item.href);
            return (
              <a key={item.label} href={item.href}
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-sm font-medium transition-colors duration-200"
                style={active
                  ? { color: item.hex, textShadow:`0 0 8px rgba(${item.color},0.7)` }
                  : { color:"rgba(255,255,255,0.65)" }}>
                {active ? "▸ " : ""}{item.label}
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        /* ── VD. aurora prism glow ── */
        @keyframes aurora {
          0%   { color: #c084fc; text-shadow: 0 0 10px rgba(192,132,252,0.9), 0 0 25px rgba(192,132,252,0.5), 0 0 50px rgba(192,132,252,0.2); }
          20%  { color: #60a5fa; text-shadow: 0 0 10px rgba(96,165,250,0.9),  0 0 25px rgba(96,165,250,0.5),  0 0 50px rgba(96,165,250,0.2); }
          40%  { color: #34d399; text-shadow: 0 0 10px rgba(52,211,153,0.9),  0 0 25px rgba(52,211,153,0.5),  0 0 50px rgba(52,211,153,0.2); }
          60%  { color: #fbbf24; text-shadow: 0 0 10px rgba(251,191,36,0.9),  0 0 25px rgba(251,191,36,0.5),  0 0 50px rgba(251,191,36,0.2); }
          80%  { color: #f472b6; text-shadow: 0 0 10px rgba(244,114,182,0.9), 0 0 25px rgba(244,114,182,0.5), 0 0 50px rgba(244,114,182,0.2); }
          100% { color: #c084fc; text-shadow: 0 0 10px rgba(192,132,252,0.9), 0 0 25px rgba(192,132,252,0.5), 0 0 50px rgba(192,132,252,0.2); }
        }
        .vd-logo {
          animation: aurora 6s ease-in-out infinite;
          text-decoration: none;
          transition: none;
        }

        /* ── Nav links ── */
        .nav-word {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.28s ease, text-shadow 0.28s ease, background 0.28s ease;
        }
        .nav-word:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </header>
  );
}