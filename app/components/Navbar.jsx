"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Resume",   href: "/resume" },
  { label: "Contact",  href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a12]/80 backdrop-blur-md border-b border-white/[0.06]">
      <a href="/" className="text-sm font-semibold text-white/80 tracking-wide hover:text-white transition-colors duration-200">
        VD.
      </a>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="nav-word"
            style={
              isActive(item.href)
                ? {
                    color: "#7db4ff",
                    background: "rgba(96,165,250,0.08)",
                    textShadow:
                      "0 0 8px rgba(96,165,250,0.7), 0 0 20px rgba(96,165,250,0.3)",
                  }
                : {}
            }
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span
          className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
          style={open ? { transform: "translateY(8px) rotate(45deg)" } : {}}
        />
        <span
          className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
          style={open ? { opacity: 0 } : {}}
        />
        <span
          className="block w-5 h-0.5 bg-white/70 transition-all duration-300 origin-center"
          style={open ? { transform: "translateY(-8px) rotate(-45deg)" } : {}}
        />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a12]/95 backdrop-blur-md border-b border-white/[0.06] flex flex-col py-3 md:hidden">
          {LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-sm font-medium transition-colors duration-200"
              style={
                isActive(item.href)
                  ? { color: "#7db4ff" }
                  : { color: "rgba(255,255,255,0.65)" }
              }
            >
              {isActive(item.href) ? "▸ " : ""}{item.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
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
          color: #7db4ff;
          background: rgba(96,165,250,0.06);
          text-shadow: 0 0 8px rgba(96,165,250,0.7), 0 0 20px rgba(96,165,250,0.3);
        }
      `}</style>
    </header>
  );
}