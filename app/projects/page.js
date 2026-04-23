"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext"; // ← ADDED

const BOOT_LINES = [
  "> INITIALIZING PROJECT VAULT...",
  "> SCANNING REPOSITORIES...",
  "> COMPILING BUILD LOGS...",
  "> ACHIEVEMENT DATA LOADED...",
  "> PROJECTS UNLOCKED 🔵",
  "> RENDERING PORTFOLIO... DONE. ▌",
];

function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    let i = 0;
    const tick = setInterval(() => {
      setLines((p) => [...p, BOOT_LINES[i]]);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(tick);
        setTimeout(() => { setFading(true); setTimeout(onDone, 600); }, 600);
      }
    }, 320);
    return () => clearInterval(tick);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a12]"
      style={{ transition:"opacity 0.6s ease", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "all" }}>
      <div className="space-y-2 px-8 max-w-lg w-full">
        {lines.map((line, i) => (
          <p key={i} className="font-mono text-sm"
            style={{ color: i === lines.length - 1 ? "#60a5fa" : "rgba(96,165,250,0.75)" }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const ref = useRef(null);
  const g = project.glow || "96,165,250";
  const c = `rgba(${g},`;

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${((y - cy) / cy) * -8}deg`);
    el.style.setProperty("--ry", `${((x - cx) / cx) * 8}deg`);
    el.style.setProperty("--mo", "1");
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "-999px");
    el.style.setProperty("--my", "-999px");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mo", "0");
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="rpg-proj-card"
      style={{
        "--mx":"-999px","--my":"-999px","--rx":"0deg","--ry":"0deg","--mo":"0",
        "--glow-color": g,
        "--accent-glow": `rgba(${g},0.07)`,
        "--accent-border": `rgba(${g},0.75)`,
        border:`1px solid ${c}0.18)`,
        background:`${c}0.025)`,
        boxShadow:`0 0 40px ${c}0.04) inset`,
      }}>
      {[
        { top:"-1px",left:"-1px",  borderTop:`2px solid ${c}0.8)`, borderLeft:`2px solid ${c}0.8)`,  borderRadius:"2px 0 0 0" },
        { top:"-1px",right:"-1px", borderTop:`2px solid ${c}0.8)`, borderRight:`2px solid ${c}0.8)`, borderRadius:"0 2px 0 0" },
        { bottom:"-1px",left:"-1px",  borderBottom:`2px solid ${c}0.8)`, borderLeft:`2px solid ${c}0.8)`,  borderRadius:"0 0 0 2px" },
        { bottom:"-1px",right:"-1px", borderBottom:`2px solid ${c}0.8)`, borderRight:`2px solid ${c}0.8)`, borderRadius:"0 0 2px 0" },
      ].map((s, i) => (
        <span key={i} style={{ position:"absolute", width:"12px", height:"12px", pointerEvents:"none", ...s }} />
      ))}
      {project.badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono z-10 tracking-wide"
          style={{ background:`rgba(${g},0.15)`, color:`rgb(${g})`, border:`1px solid rgba(${g},0.3)` }}>
          ⭐ {project.badge}
        </span>
      )}
      <div className="relative z-10 flex flex-col gap-4 h-full">
        <div>
          <p className="font-mono text-[10px] tracking-widest mb-1" style={{ color:`rgba(${g},0.6)` }}>
            &gt; PROJECT_ID_{String(project._idx + 1).padStart(2,"0")}
          </p>
          <h2 className="text-xl font-bold text-white font-mono">{project.title}</h2>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed font-mono flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-mono"
              style={{ background:`rgba(${g},0.08)`, color:`rgba(${g},0.9)`, border:`1px solid rgba(${g},0.2)` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <a href={project.github} target="_blank" rel="noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl font-mono transition-all duration-200"
            style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}>
            GitHub
          </a>
          <a href={project.live} target="_blank" rel="noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl font-mono transition-all duration-200"
            style={{ background:`rgba(${g},0.2)`, color:`rgb(${g})`, border:`1px solid rgba(${g},0.35)` }}
            onMouseEnter={e => { e.currentTarget.style.background=`rgba(${g},0.3)`; }}
            onMouseLeave={e => { e.currentTarget.style.background=`rgba(${g},0.2)`; }}>
            Live Demo ↗
          </a>
        </div>
      </div>
    </div>
  );
}

const projects = [
  {
    title:"Portfolio Website",
    description:"Personal developer portfolio built with Next.js 14 and Tailwind CSS. Features dark theme, responsive design, smooth animations, and deployed on Vercel.",
    tech:["Next.js","Tailwind CSS","Vercel"],
    github:"https://github.com/VishnuVardhan2000/my-portfolio",
    live:"https://my-portfolio-lemon-nine-24.vercel.app",
    glow:"99,102,241",
  },
  {
    title:"VibeBoard — Mood to Aesthetic",
    description:"Describe your mood and instantly get a full aesthetic universe — AI-generated color palette, anime match, music vibe, typography & a Hinglish mood quote. Powered by Groq AI + Unsplash.",
    tech:["Next.js","Groq AI","Tailwind CSS","Unsplash API"],
    github:"https://github.com/VishnuVardhan2000/vibeboard",
    live:"https://vibeboard-woad.vercel.app",
    badge:"Featured", glow:"236,72,153",
  },
  {
    title:"TaskFlow — Task Manager App",
    description:"Full-stack task management application with user authentication, real-time CRUD operations, priority tagging, and a responsive dashboard UI.",
    tech:["MongoDB","Express.js","Next.js","Tailwind CSS","JWT Auth"],
    github:"https://github.com/VishnuVardhan2000/taskflow",
    live:"https://taskflow-sand-gamma.vercel.app",
    badge:"Featured", glow:"34,211,238",
  },
  {
    title:"Vish.AI — Resume Analyzer",
    description:"AI-powered resume analyzer — paste your resume or upload a PDF and get an ATS score, section breakdown, keyword gaps, and actionable suggestions. Powered by Groq Llama 3.3 70B.",
    tech:["Next.js","Groq AI","React","Node.js"],
    github:"https://github.com/VishnuVardhan2000/my-portfolio",
    live:"https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
    badge:"Featured", glow:"74,222,128",
  },
];

export default function ProjectsPage() {
  const { setAccent } = useTheme(); // ← ADDED
  const [booted, setBooted] = useState(false);
  const handleBoot = useCallback(() => setBooted(true), []);

  // ← ADDED — set blue on mount
  useEffect(() => { setAccent("96,165,250"); }, [setAccent]);

  return (
    <>
      <BootScreen onDone={handleBoot} />
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />

      <style>{`
        .scanlines::before {
          content:""; position:fixed; inset:0; z-index:20;
          background: repeating-linear-gradient(0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
          pointer-events:none;
        }
        .projects-glow-word {
          color: #60a5fa;
          text-shadow: none;
          transition: text-shadow 0.35s ease, color 0.35s ease;
          cursor: default;
        }
        .projects-glow-word:hover {
          color: #93c5fd;
          text-shadow:
            0 0 8px rgba(96,165,250,1),
            0 0 20px rgba(96,165,250,0.8),
            0 0 40px rgba(96,165,250,0.5),
            0 0 80px rgba(96,165,250,0.25);
        }
        .rpg-proj-card {
          position: relative;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: visible;
          cursor: default;
          transform-style: preserve-3d;
          transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.15s ease, box-shadow 0.38s ease;
          will-change: transform;
        }
        .rpg-proj-card::before {
          content:""; position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:0;
          background: radial-gradient(300px circle at var(--mx) var(--my),
            var(--accent-glow) 0%, transparent 70%);
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        .rpg-proj-card::after {
          content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
          pointer-events:none; z-index:2;
          background: radial-gradient(220px circle at var(--mx) var(--my),
            var(--accent-border), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .blink { animation: blink 2.2s ease-in-out infinite; }
      `}</style>

      <section className="max-w-6xl mx-auto px-4 pt-8 pb-20"
        style={{ opacity: booted ? 1 : 0, transition:"opacity 0.8s ease" }}>
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 blink" />
            PROJECT_VAULT.EXE — LOADED
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-mono">
            My{" "}
            <span className="projects-glow-word">Projects</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl font-mono">
            &gt; A collection of things I&apos;ve built — from web apps to AI tools.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 pb-10 justify-center">
          {projects.map((project, index) => (
            <div key={index} style={{ width:"clamp(300px, 30%, 380px)" }}>
              <ProjectCard project={{ ...project, _idx: index }} />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-blue-700/[0.07] rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-blue-900/[0.06] rounded-full blur-[160px] pointer-events-none z-0" />
    </>
  );
}