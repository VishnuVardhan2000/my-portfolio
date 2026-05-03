"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { COMMANDS, NOT_FOUND, TERM_ACCENT, CHIP_COMMANDS } from "../lib/terminalCommands";

const TA = `rgba(${TERM_ACCENT},`;

const BOOT_LINES = [
  "> WELCOME TO MY PORTFOLIO...",
  "> SCANNING SKILL DATABASE...",
  "> LOADING DEVELOPER PROFILE: VARDHAN...",
  "> UNLOCKING PROJECT VAULT...",
  "> AI MODULES: ONLINE ⚡",
  "> AURA LEVEL: MAXIMUM 🔮",
  "> ALL SYSTEMS GO. LET'S BUILD SOMETHING. ▌",
];

// ── Boot Screen ──────────────────────────────────────────────
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
            style={{ color: i === lines.length - 1 ? "#c084fc" : "rgba(168,85,247,0.75)" }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── RPG Frame ────────────────────────────────────────────────
function RPGFrame({ children, title, accent = "168,85,247", className = "" }) {
  const ref = useRef(null);
  const c = `rgba(${accent},`;
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    ref.current.style.setProperty("--mo", "1");
  };
  const onLeave = () => ref.current?.style.setProperty("--mo", "0");
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`rpg-spotlight relative rounded-xl p-6 ${className}`}
      style={{
        border: `1px solid ${c}0.2)`,
        background: `${c}0.02)`,
        boxShadow: `0 0 40px ${c}0.04) inset`,
        "--accent-glow": `rgba(${accent},0.07)`,
        "--accent-border": `rgba(${accent},0.75)`,
      }}>
      <span className="absolute top-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderTop:`2px solid ${c}0.8)`, borderLeft:`2px solid ${c}0.8)`, borderRadius:"2px 0 0 0" }} />
      <span className="absolute top-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderTop:`2px solid ${c}0.8)`, borderRight:`2px solid ${c}0.8)`, borderRadius:"0 2px 0 0" }} />
      <span className="absolute bottom-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderBottom:`2px solid ${c}0.8)`, borderLeft:`2px solid ${c}0.8)`, borderRadius:"0 0 0 2px" }} />
      <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderBottom:`2px solid ${c}0.8)`, borderRight:`2px solid ${c}0.8)`, borderRadius:"0 0 2px 0" }} />
      {title && (
        <div className="absolute -top-3.5 left-6">
          <span className="font-mono text-[11px] font-bold tracking-widest px-3 py-0.5 rounded"
            style={{ color:`rgba(${accent},1)`, background:"#0a0a12", border:`1px solid ${c}0.25)` }}>
            // {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

// ── Stat XP Bar ──────────────────────────────────────────────
function StatXPBar({ stat, animate }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!animate) return;
    const isInfinity = stat.value === "∞";
    const steps = 22;
    const interval = 1300 / steps;
    if (isInfinity) {
      let i = 0;
      const chars = "0123456789∞★◆";
      const roll = setInterval(() => {
        setDisplay(chars[Math.floor(Math.random() * chars.length)]);
        i++;
        if (i >= steps) { clearInterval(roll); setDisplay("∞"); }
      }, interval);
      return () => clearInterval(roll);
    }
    const numTarget = parseInt(stat.value);
    let count = 0;
    const roll = setInterval(() => {
      count++;
      if (count < steps * 0.72) setDisplay(String(Math.floor(Math.random() * numTarget * 4)));
      else { clearInterval(roll); setDisplay(stat.value); }
    }, interval);
    return () => clearInterval(roll);
  }, [animate, stat.value]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">{stat.label}</span>
        <span className="font-mono text-lg font-black" style={{ color:`rgba(${stat.color},1)` }}>
          {display}{stat.value !== "∞" ? "+" : ""}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full" style={{
          width: animate ? `${stat.pct}%` : "0%",
          background: `linear-gradient(90deg,rgba(${stat.color},0.5),rgba(${stat.color},1))`,
          boxShadow: `0 0 10px rgba(${stat.color},0.55)`,
          transition: "width 1.3s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
      <p className="font-mono text-[10px] text-gray-600">{stat.xp}</p>
    </div>
  );
}

// ── Mini Terminal ────────────────────────────────────────────
function MiniTerminal() {
  const [history, setHistory] = useState([
    { type:"boot", text:"VARDHAN_OS v2.6 — ASK ME ANYTHING" },
    { type:"boot", text:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
    { type:"boot", text:'Type [ help ] to see all commands.' },
    { type:"gap",  text:"" },
  ]);
  const [input, setInput]           = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [history]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setCmdHistory((p) => [cmd, ...p]);
    setHistIdx(-1);
    if (cmd === "clear") { setHistory([]); return; }
    const output = COMMANDS[cmd] || NOT_FOUND(cmd);
    setHistory((p) => [
      ...p,
      { type:"input",  text:`vardhan@portfolio:~$ ${raw}` },
      ...output.map((line) => ({ type: cmd in COMMANDS ? "output" : "error", text: line })),
      { type:"gap", text:"" },
    ]);
  }, []);

  const handleKey = (e) => {
    if (e.key === "Enter") { runCommand(input); setInput(""); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next); setInput(cmdHistory[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next); setInput(next === -1 ? "" : cmdHistory[next]);
    }
  };

  const lineColor = (type) => {
    if (type === "boot")  return `${TA}0.6)`;
    if (type === "input") return `${TA}1)`;
    if (type === "error") return "rgba(255,80,80,0.85)";
    if (type === "gap")   return "transparent";
    return "rgba(209,213,219,0.9)";
  };

  return (
    <RPGFrame title="TERMINAL.EXE" accent={TERM_ACCENT}>
      <style>{`
        .rpg-spotlight { --mx:-999px; --my:-999px; --mo:0; }
        .rpg-spotlight::before {
          content:""; position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:0;
          background: radial-gradient(300px circle at var(--mx) var(--my),
            var(--accent-glow) 0%, transparent 70%);
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        .rpg-spotlight::after {
          content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
          pointer-events:none; z-index:2;
          background: radial-gradient(220px circle at var(--mx) var(--my),
            var(--accent-border), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        .rpg-spotlight > * { position:relative; z-index:1; }
      `}</style>

      <div className="pt-3 space-y-3">
        <p className="font-mono text-[11px] tracking-widest" style={{ color:`${TA}0.45)` }}>
          &gt; INTERACTIVE — ask about me, my projects, or how to hire me
        </p>

        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden"
          style={{
            border:`1px solid ${TA}0.2)`,
            background:"rgba(3,7,3,0.97)",
            boxShadow:`0 0 40px ${TA}0.08) inset, 0 0 80px ${TA}0.03)`,
          }}>

          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b"
            style={{ borderColor:`${TA}0.12)`, background:`${TA}0.04)` }}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="font-mono text-[10px] ml-2" style={{ color:`${TA}0.5)` }}>
              vardhan@portfolio:~ — bash
            </span>
          </div>

          {/* Output area */}
          <div className="terminal-scroll overflow-y-auto p-4 space-y-0.5 cursor-text"
            style={{ minHeight:"200px", maxHeight:"300px" }}
            onClick={() => inputRef.current?.focus()}>
            {history.map((line, i) => (
              <p key={i} className="font-mono text-xs leading-relaxed whitespace-pre"
                style={{ color: lineColor(line.type) }}>
                {line.text || "\u00A0"}
              </p>
            ))}
            {/* Input row */}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs shrink-0" style={{ color:`${TA}1)` }}>
                vardhan@portfolio:~$
              </span>
              <input ref={inputRef} value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent outline-none font-mono text-xs text-gray-200 caret-transparent min-w-0"
                spellCheck={false} autoComplete="off" />
              <span className="font-mono text-xs cursor-blink shrink-0" style={{ color:`${TA}1)` }}>▌</span>
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Keyboard key chips */}
        <div className="flex flex-wrap gap-2">
          {CHIP_COMMANDS.map((cmd) => (
            <button key={cmd} className="kbd-key"
              style={{ color:`${TA}0.8)`, fontSize:"11px" }}
              onClick={() => { runCommand(cmd); inputRef.current?.focus(); }}>
              {cmd}
            </button>
          ))}
        </div>

        <p className="font-mono text-[10px]" style={{ color:`${TA}0.2)` }}>
          ↑↓ arrow keys for history · click output to focus
        </p>
      </div>
    </RPGFrame>
  );
}

// ── Page Data ────────────────────────────────────────────────
const stats = [
  { value:"4", label:"Projects Shipped", color:"168,85,247", pct:80, xp:"Lvl 4 · 4,000 XP — BUILDER CLASS" },
  { value:"3", label:"APIs Integrated",  color:"96,165,250",  pct:60, xp:"Lvl 3 · 3,000 XP — INTEGRATOR CLASS" },
  { value:"2", label:"Live AI Apps",     color:"45,212,191",  pct:50, xp:"Lvl 2 · 2,000 XP — AI MAGE CLASS" },
  { value:"∞", label:"Curiosity",        color:"250,204,21",  pct:99, xp:"MAX LEVEL · ∞ XP — OVERPOWERED ⚡" },
];

const stack = [
  "Next.js","React","Tailwind CSS","Node.js",
  "MongoDB","Groq AI","JavaScript","Git","Vercel","REST APIs",
];

const projects = [
  {
    name:"VibeBoard", thumb:"/vibeboard-thumb.png",
    tagline:"Describe your mood. Get an aesthetic universe.",
    desc:"AI-generated color palettes, anime matches, music vibes & Hinglish mood quotes — all from one mood input. Powered by Groq AI + Unsplash.",
    tags:["Next.js","Groq AI","Tailwind CSS","Unsplash API"],
    badge:"AI · Live", glow:"147,51,234",
    live:"https://vibeboard-woad.vercel.app",
    github:"https://github.com/VishnuVardhan2000/vibeboard",
  },
  {
    name:"Vish.AI", thumb:"/vish-ai-thumb.png",
    tagline:"Paste your resume. Get an ATS score instantly.",
    desc:"AI-powered resume analyzer — ATS score, section breakdown, keyword gaps, and actionable suggestions. Powered by Groq Llama 3.3 70B.",
    tags:["Next.js","Groq AI","React","Node.js"],
    badge:"AI · Live", glow:"45,212,191",
    live:"https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
    github:"https://github.com/VishnuVardhan2000/my-portfolio",
  },
];

// ── Main Export ──────────────────────────────────────────────
export default function Home() {
  const [booted, setBooted]             = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef   = useRef(null);
  const handleBoot = useCallback(() => setBooted(true), []);

  useEffect(() => {
    if (!booted || !statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [booted]);

  return (
    <>
      <BootScreen onDone={handleBoot} />
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />

      <div style={{ opacity: booted ? 1 : 0, transition:"opacity 0.8s ease" }}>
        <style>{`
          .neon-name {
            text-shadow: 0 0 10px rgba(168,85,247,0.24),0 0 24px rgba(168,85,247,0.08);
            transition: text-shadow 0.45s ease, color 0.45s ease;
            cursor: default; display: inline-block;
          }
          .neon-name:hover {
            color: #c084fc;
            text-shadow:
              0 0 5px rgba(255,255,255,0.9),
              0 0 12px rgba(168,85,247,1),
              0 0 28px rgba(168,85,247,0.7),
              0 0 56px rgba(168,85,247,0.4),
              0 0 90px rgba(147,51,234,0.3);
          }
          .neon-text-hover { transition: color 0.3s ease, text-shadow 0.3s ease; }
          .neon-text-hover:hover {
            color: #c084fc;
            text-shadow: 0 0 6px rgba(168,85,247,0.9),0 0 18px rgba(168,85,247,0.45);
          }
          .rect-btn {
            border-radius: 10px; padding: 10px 18px;
            font-size: 0.82rem; line-height: 1;
          }
          .scanlines::before {
            content:""; position:fixed; inset:0; z-index:20;
            background: repeating-linear-gradient(0deg,
              transparent, transparent 2px,
              rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
            pointer-events:none;
          }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.45} }
          .blink { animation: blink 2.2s ease-in-out infinite; }
          .proj-card { transition: transform 0.38s cubic-bezier(0.16,1,0.3,1); }
          .proj-card:hover { transform: scale(1.025) translateY(-3px); }
          .chip-bg {
            background-image:
              linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px),
              linear-gradient(90deg,rgba(168,85,247,0.04) 1px, transparent 1px);
            background-size: 22px 22px;
          }
        `}</style>

        <main className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">
          <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-purple-700/[0.07] rounded-full blur-[180px] pointer-events-none" />
          <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-purple-900/[0.06] rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 relative z-10">

            {/* Hero */}
            <section className="mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-medium mb-8 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 blink" />
                Open to work · Fresher Full Stack Developer
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                Hi, I&apos;m{" "}
                <span className="neon-name text-purple-400">Vardhan</span>
                <br />
                <span className="text-white/30 text-2xl md:text-4xl font-bold font-mono">
                  I build things for the web.
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10 font-mono">
                Full Stack Developer in progress — turning ideas into live web apps with
                React, Next.js &amp; a sprinkle of AI. Based in Lucknow.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/projects"
                  className="rect-btn neon-text-hover bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-200 font-mono">
                  View Projects ↗
                </Link>
                <Link href="/about"
                  className="rect-btn neon-text-hover bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-white font-semibold transition-all duration-200 font-mono">
                  About Me
                </Link>
                <a href="/resume.pdf" download
                  className="rect-btn neon-text-hover bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-gray-300 font-semibold transition-all duration-200 font-mono">
                  Resume ↓
                </a>
              </div>
            </section>

            {/* Stats XP */}
            <section ref={statsRef} className="mb-20">
              <RPGFrame title="PLAYER_STATS.EXE" accent="168,85,247">
                <div className="space-y-5 pt-3">
                  <p className="font-mono text-[11px] text-purple-400/60 tracking-widest">
                    &gt; LOADING ACHIEVEMENT DATA...
                  </p>
                  {stats.map((s, i) => <StatXPBar key={i} stat={s} animate={statsVisible} />)}
                </div>
              </RPGFrame>
            </section>

            {/* Selected Projects */}
            <section className="mb-20">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-6">
                &gt; SELECTED_PROJECTS.LOG
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((p, i) => (
                  <RPGFrame key={i} accent={p.glow}
                    className="proj-card chip-bg group overflow-hidden !p-0">
                    {p.thumb && (
                      <div className="overflow-hidden border-b border-white/[0.07]">
                        <img src={p.thumb} alt={`${p.name} preview`}
                          width={600} height={340} loading="lazy"
                          className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          style={{ aspectRatio:"16/9" }} />
                      </div>
                    )}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-0.5 font-mono">{p.name}</h3>
                          <p className="text-sm text-gray-400 leading-snug font-mono">{p.tagline}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap font-mono"
                          style={{ backgroundColor:`rgba(${p.glow},0.1)`, borderColor:`rgba(${p.glow},0.28)`, color:`rgb(${p.glow})` }}>
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed font-mono">{p.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t, j) => (
                          <span key={j} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-auto pt-1">
                        {p.live
                          ? <a href={p.live} target="_blank" rel="noreferrer"
                              className="text-[11px] px-4 py-2 rounded-md font-semibold neon-text-hover transition-all duration-200 font-mono"
                              style={{ backgroundColor:`rgba(${p.glow},0.14)`, color:`rgb(${p.glow})`, border:`1px solid rgba(${p.glow},0.28)` }}>
                              Live Demo ↗
                            </a>
                          : <span className="text-xs px-4 py-2 rounded-lg font-medium text-gray-600 bg-white/[0.025] border border-white/[0.05] cursor-default font-mono">
                              In Development...
                            </span>
                        }
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer"
                            className="text-xs px-4 py-2 rounded-lg font-semibold text-gray-400 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all duration-200 font-mono">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </RPGFrame>
                ))}
              </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-20">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-6">
                &gt; TECH_STACK.DAT
              </p>
              <div className="flex flex-wrap gap-2.5">
                {stack.map((t, i) => (
                  <div key={i} className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-purple-500/[0.15] hover:bg-purple-500/[0.06] hover:border-purple-500/30 transition-all duration-200 cursor-default">
                    <span className="text-gray-300 text-sm font-mono">{t}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Mini Terminal */}
            <section className="mb-20">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-6">
                &gt; ASK_ME_ANYTHING.EXE
              </p>
              <MiniTerminal />
            </section>

            {/* CTA — Available for Work */}
            <RPGFrame title="AVAILABLE_FOR.EXE" accent="45,212,191">
              <div className="pt-2 space-y-4">
                <p className="font-mono text-[11px] text-teal-400/60 tracking-widest">
                  &gt; STATUS: OPEN TO OPPORTUNITIES
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl p-4 space-y-2"
                    style={{ background:"rgba(45,212,191,0.05)", border:"1px solid rgba(45,212,191,0.18)" }}>
                    <p className="font-mono text-xs text-teal-300 font-bold tracking-widest">⚡ FREELANCE</p>
                    <p className="text-gray-400 text-xs font-mono leading-relaxed">
                      Need a landing page, web app or AI integration? Let&apos;s build it.
                    </p>
                    <a href="/contact"
                      className="block text-center font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
                      style={{ background:"rgba(45,212,191,0.12)", color:"rgb(45,212,191)", border:"1px solid rgba(45,212,191,0.3)" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(45,212,191,0.22)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(45,212,191,0.12)"}>
                      DM Me →
                    </a>
                  </div>
                  <div className="rounded-xl p-4 space-y-2"
                    style={{ background:"rgba(168,85,247,0.05)", border:"1px solid rgba(168,85,247,0.18)" }}>
                    <p className="font-mono text-xs text-purple-300 font-bold tracking-widest">🏢 FULL TIME</p>
                    <p className="text-gray-400 text-xs font-mono leading-relaxed">
                      Open to full-time roles in Full Stack or AI-focused teams.
                    </p>
                    <a href="/resume"
                      className="block text-center font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
                      style={{ background:"rgba(168,85,247,0.12)", color:"rgb(168,85,247)", border:"1px solid rgba(168,85,247,0.3)" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(168,85,247,0.22)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(168,85,247,0.12)"}>
                      View Resume →
                    </a>
                  </div>
                  <div className="rounded-xl p-4 space-y-2"
                    style={{ background:"rgba(250,204,21,0.05)", border:"1px solid rgba(250,204,21,0.18)" }}>
                    <p className="font-mono text-xs text-yellow-300 font-bold tracking-widest">📞 CALL BACK</p>
                    <p className="text-gray-400 text-xs font-mono leading-relaxed">
                      Want to discuss a project or role? Apply for a quick call.
                    </p>
                    <a href="mailto:vardhandoharey@gmail.com?subject=Callback Request"
                      className="block text-center font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
                      style={{ background:"rgba(250,204,21,0.12)", color:"rgb(250,204,21)", border:"1px solid rgba(250,204,21,0.3)" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(250,204,21,0.22)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(250,204,21,0.12)"}>
                      Request Call →
                    </a>
                  </div>
                </div>
                <p className="font-mono text-[10px] text-gray-600 text-center pt-1">
                  ▸ Currently grinding Full Stack + AI · Based in Lucknow · Available remotely
                </p>
              </div>
            </RPGFrame>

          </div>
        </main>
      </div>
    </>
  );
}