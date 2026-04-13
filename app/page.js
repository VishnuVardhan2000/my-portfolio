"use client";
import { useRef } from "react";
import Link from "next/link";

/* ── Neon Spotlight Card ── */
function NeonCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    ref.current.style.setProperty("--mo", "1");
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mo", "0");
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`neon-card ${className}`} style={style}>
      {children}
    </div>
  );
}

const techStack = [
  "Next.js","React","Tailwind CSS","Node.js",
  "MongoDB","Groq AI","JavaScript","Git","Vercel","REST APIs",
];

const stats = [
  { value: "3+", label: "Projects Shipped" },
  { value: "3",  label: "APIs Integrated" },
  { value: "2",  label: "Live AI Apps" },
  { value: "∞",  label: "Curiosity" },
];

const projects = [
  {
    title: "VibeBoad",
    badge: "AI · Live",
    tagline: "Describe your mood. Get an aesthetic universe.",
    desc: "AI-generated color palettes, anime matches, music vibes & Hinglish mood quotes — all from one mood input. Powered by Groq AI + Unsplash.",
    tags: ["Next.js", "Groq AI", "Tailwind CSS", "Unsplash API"],
    img: "/vibeboard-thumb.png",// ← keep your existing image path
    href: "https://vibeboard-woad.vercel.app/",//<project link
  },
  {
    title: "Vish.AI",
    badge: "AI · Live",
    tagline: "Paste your resume. Get an ATS score instantly.",
    desc: "AI-powered resume analyzer — get an ATS score, section breakdown, keyword gaps, and actionable suggestions. Upload PDF or paste text. Powered by Groq Llama 3.3 70B.",
    tags: ["Next.js", "Groq AI", "React", "Node.js"],
    img: "/vish-ai-thumb.png",//← keep your existing image path
    href: "https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",// your existing project link
  },
];

export default function Home() {
  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">

        {/* ── Status Badge ── */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 border border-white/[0.1] bg-white/[0.03] text-xs text-gray-400 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
          Open to work · Fresher Full Stack Developer
        </div>

        {/* ── Hero ── */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5 leading-tight">
          Hi, I'm{" "}
          <span className="name-glow">Vardhan</span>
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-6 tracking-tight">
          I build things for the web.
        </p>
        <p className="text-gray-400 text-base max-w-xl leading-relaxed mb-10">
          Full Stack Developer in progress — turning ideas into live web apps
          with React, Next.js &amp; a sprinkle of AI. Based in Lucknow.
        </p>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-wrap gap-3 mb-20">
          <Link href="/projects"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors duration-200">
            View Projects ↗
          </Link>
          <Link href="/about"
            className="px-5 py-2.5 border border-white/[0.12] hover:border-white/25 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 bg-white/[0.03]">
            About Me
          </Link>
          <a href="/Vardhan-Doharey-Resume.pdf" download
            className="px-5 py-2.5 border border-white/[0.12] hover:border-white/25 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 bg-white/[0.03]">
            Resume ↓
          </a>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20">
          {stats.map((s) => (
            <NeonCard key={s.label} className="p-6 flex flex-col gap-1">
              <span className="text-3xl font-bold text-white">{s.value}</span>
              <span className="text-xs text-gray-500 tracking-wide">{s.label}</span>
            </NeonCard>
          ))}
        </div>

        {/* ── Selected Projects ── */}
        <div className="mb-20">
          <p className="text-xs text-gray-600 tracking-[0.15em] uppercase mb-5">
            Selected Projects
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <NeonCard key={p.title} className="overflow-hidden">
                <div className="w-full aspect-[16/9] bg-white/[0.03] border-b border-white/[0.06] overflow-hidden">
                  <img src={p.img} alt={p.title}
                    className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-base">{p.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 border border-blue-500/25 text-blue-400 font-medium">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{p.tagline}</p>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t}
                        className="text-[10px] px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] text-gray-500">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div className="mb-20">
          <p className="text-xs text-gray-600 tracking-[0.15em] uppercase mb-5">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <span key={t}
                className="px-3 py-1.5 border border-white/[0.08] bg-white/[0.03] text-gray-400 text-sm
                           hover:border-blue-500/30 hover:text-gray-200 transition-colors duration-200">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Currently ── */}
        <NeonCard className="p-6 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] text-gray-600 tracking-[0.15em] uppercase mb-2">
              Currently
            </p>
            <p className="text-white font-medium text-sm mb-1">
              Shipped Vish.AI — deepening Full Stack &amp; AI skills
            </p>
            <p className="text-gray-500 text-xs">
              Physics Wallah Skills — Full Stack Development Specialization
            </p>
          </div>
          <Link href="/projects"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors duration-200 whitespace-nowrap">
            All Projects →
          </Link>
        </NeonCard>

      </section>

      {/* ── Global card styles ── */}
      <style>{`
        /* Name glow — preserved */
        .name-glow {
          color: #50005c;
          text-shadow:
            0 0 20px rgba(214, 126, 255, 0.75),
            0 0 45px rgba(219, 96, 250, 0.45),
            0 0 90px rgba(201, 96, 250, 0.2);
        }

        /* Base card — static neon border always visible */
        .neon-card {
          position: relative;
          border-radius: 0;
          border: 1px solid rgba(96,165,250,0.18);
          background: rgba(255,255,255,0.025);
          overflow: hidden;
          --mx: -999px; --my: -999px; --mo: 0;
        }

        /* Background spotlight (fills card on hover) */
        .neon-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            360px circle at var(--mx) var(--my),
            rgba(96,165,250,0.08) 0%,
            transparent 65%
          );
          opacity: var(--mo);
          transition: opacity 0.4s ease;
        }

        /* Border spotlight — follows cursor along edges */
        .neon-card::after {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          pointer-events: none;
          z-index: 2;
          background: radial-gradient(
            220px circle at var(--mx) var(--my),
            rgba(96,165,250,0.75),
            transparent 60%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: var(--mo);
          transition: opacity 0.4s ease;
        }

        /* Keep all children above overlays */
        .neon-card > * { position: relative; z-index: 1; }
      `}</style>
    </>
  );
}