"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { COMMANDS, NOT_FOUND, TERM_ACCENT, CHIP_COMMANDS } from "../../lib/terminalCommands";

const TA = `rgba(${TERM_ACCENT},`;

const BOOT = [
  "VARDHAN_OS v2.6 — PORTFOLIO TERMINAL",
  "VARDHAN_OS v2.6 — PORTFOLIO TERMINAL",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "Initializing knowledge base...",
  "Loading player data: VARDHAN DOHAREY",
  "All systems nominal. ✓",
  "",
  "Type [ help ] to see available commands.",
  "Type [ hire ] if you're looking to work with me.",
  "",
];

const COMMANDS = {
  help: [
    "┌─────────────────────────────────────────┐",
    "│          AVAILABLE COMMANDS             │",
    "├─────────────────────────────────────────┤",
    "│  whoami     →  Who is Vardhan?          │",
    "│  skills     →  Tech stack & expertise   │",
    "│  projects   →  All projects + links     │",
    "│  vish       →  About Vish.AI            │",
    "│  vibeboard  →  About VibeBoard          │",
    "│  taskflow   →  About TaskFlow           │",
    "│  portfolio  →  About this site          │",
    "│  hire       →  Why work with me?        │",
    "│  contact    →  Get in touch             │",
    "│  status     →  Current availability     │",
    "│  clear      →  Clear terminal           │",
    "└─────────────────────────────────────────┘",
  ],

  whoami: [
    "▸ NAME      : Vardhan Doharey",
    "▸ CLASS     : Full Stack Developer",
    "▸ SUBCLASS  : AI Enthusiast · Problem Solver",
    "▸ LEVEL     : 22",
    "▸ LOCATION  : Lucknow, Uttar Pradesh, India",
    "▸ STATUS    : Open to Work · Fresher",
    "",
    "I'm a Full Stack Developer who builds real, live web apps",
    "using React, Next.js, Node.js, and AI integrations.",
    "",
    "I shipped 4 projects including 2 live AI apps —",
    "Vish.AI (AI resume analyzer) and VibeBoard (mood → aesthetic).",
    "",
    "I learn fast, ship things, and care about quality.",
    "Currently deepening my Full Stack + AI skills daily.",
  ],

  skills: [
    "┌─ SKILL TREE ─────────────────────────────┐",
    "│",
    "│  FRONTEND",
    "│  ▸ React.js       ████████░░  85%",
    "│  ▸ Next.js 14     ████████░░  85%",
    "│  ▸ Tailwind CSS   █████████░  90%",
    "│  ▸ HTML5 / CSS3   █████████░  92%",
    "│",
    "│  BACKEND",
    "│  ▸ Node.js        ███████░░░  75%",
    "│  ▸ Express.js     ███████░░░  72%",
    "│  ▸ MongoDB        ███████░░░  70%",
    "│  ▸ REST APIs      ████████░░  80%",
    "│",
    "│  AI / TOOLS",
    "│  ▸ Groq AI        ███████░░░  72%",
    "│  ▸ Llama 3.3 70B  ███████░░░  70%",
    "│  ▸ Git / GitHub   ████████░░  82%",
    "│  ▸ Vercel         █████████░  88%",
    "│",
    "└──────────────────────────────────────────┘",
  ],

  projects: [
    "┌─ PROJECT VAULT ──────────────────────────┐",
    "│",
    "│  [01] Vish.AI — Resume Analyzer         ",
    "│       AI-powered ATS scorer using Groq  ",
    "│       Live → my-portfolio...vercel.app/vish-ai",
    "│",
    "│  [02] VibeBoard — Mood to Aesthetic     ",
    "│       AI + Unsplash mood universe        ",
    "│       Live → vibeboard-woad.vercel.app  ",
    "│",
    "│  [03] TaskFlow — Task Manager           ",
    "│       Full stack CRUD with JWT auth     ",
    "│       Live → taskflow-sand-gamma.vercel.app",
    "│",
    "│  [04] This Portfolio                    ",
    "│       RPG-themed Next.js portfolio      ",
    "│       Live → vardhan.is-a.dev           ",
    "│",
    "│  Type [ vish ] [ vibeboard ] [ taskflow ]",
    "│  for deep dives on each project.        ",
    "└──────────────────────────────────────────┘",
  ],

  vish: [
    "▸ PROJECT  : Vish.AI — AI Resume Analyzer",
    "▸ STACK    : Next.js · Groq AI · React · Node.js",
    "▸ AI MODEL : Groq Llama 3.3 70B",
    "",
    "What it does:",
    "  → Paste your resume or upload a PDF",
    "  → Get an ATS score out of 100",
    "  → Section-by-section breakdown",
    "  → Keyword gap analysis",
    "  → Actionable improvement suggestions",
    "",
    "How I built it:",
    "  → Next.js API route calls Groq with structured prompt",
    "  → pdf.js handles PDF parsing client-side",
    "  → Response parsed and rendered as scored sections",
    "  → Sub 3s response times with Llama 3.3 70B",
    "",
    "▸ Live    : https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
    "▸ GitHub  : https://github.com/VishnuVardhan2000/my-portfolio",
  ],

  vibeboard: [
    "▸ PROJECT  : VibeBoard — Mood to Aesthetic Universe",
    "▸ STACK    : Next.js · Groq AI · Tailwind CSS · Unsplash API",
    "",
    "What it does:",
    "  → Type your mood (e.g. 'sad rainy evening')",
    "  → Get an AI-generated color palette",
    "  → Anime match for your mood",
    "  → Music vibe recommendation",
    "  → Hinglish mood quote",
    "  → Dynamic aesthetic images from Unsplash",
    "",
    "How I built it:",
    "  → Groq AI generates structured JSON with all vibe data",
    "  → Unsplash API fetches mood-matching images",
    "  → All rendered in a single aesthetic card",
    "  → Fully responsive, deployed on Vercel",
    "",
    "▸ Live    : https://vibeboard-woad.vercel.app",
    "▸ GitHub  : https://github.com/VishnuVardhan2000/vibeboard",
  ],

  taskflow: [
    "▸ PROJECT  : TaskFlow — Full Stack Task Manager",
    "▸ STACK    : MongoDB · Express.js · Next.js · Tailwind · JWT",
    "",
    "What it does:",
    "  → Full user authentication (JWT)",
    "  → Create, read, update, delete tasks",
    "  → Priority tagging (High / Medium / Low)",
    "  → Responsive dashboard UI",
    "  → Persistent data with MongoDB Atlas",
    "",
    "How I built it:",
    "  → Express.js REST API with JWT middleware",
    "  → MongoDB Atlas for cloud storage",
    "  → Next.js frontend with real-time UI updates",
    "  → Deployed on Vercel (frontend) + Railway (backend)",
    "",
    "▸ Live    : https://taskflow-sand-gamma.vercel.app",
    "▸ GitHub  : https://github.com/VishnuVardhan2000/taskflow",
  ],

  portfolio: [
    "▸ PROJECT  : This Portfolio — vardhan.is-a.dev",
    "▸ STACK    : Next.js 14 · Tailwind CSS · Web Audio API · Canvas",
    "",
    "What's inside:",
    "  → RPG / isekai theme across all pages",
    "  → Music player with Web Audio API analyser",
    "  → Matrix rain effect reacting to bass beats",
    "  → Photo glitch effect synced to music",
    "  → Floating particles + aura glow on canvas",
    "  → Cursor spotlight on every card",
    "  → Boot screen animation on every page",
    "  → Fully custom domain: vardhan.is-a.dev",
    "",
    "Built entirely from scratch — no templates used.",
  ],

  hire: [
    "╔═══════════════════════════════════════════╗",
    "║         WHY WORK WITH VARDHAN?            ║",
    "╠═══════════════════════════════════════════╣",
    "║                                           ║",
    "║  ✓ Ships real, live apps — not just       ║",
    "║    tutorials or practice projects         ║",
    "║                                           ║",
    "║  ✓ 2 live AI apps using Groq + LLMs       ║",
    "║                                           ║",
    "║  ✓ Full Stack — Frontend to Backend       ║",
    "║    to Database to Deployment              ║",
    "║                                           ║",
    "║  ✓ Fast learner — entire portfolio        ║",
    "║    built in under 2 months                ║",
    "║                                           ║",
    "║  ✓ Available for freelance, full-time,    ║",
    "║    or project-based work                  ║",
    "║                                           ║",
    "║  → Type [ contact ] to get in touch       ║",
    "║  → Or DM on LinkedIn directly             ║",
    "╚═══════════════════════════════════════════╝",
  ],

  contact: [
    "▸ EMAIL     : vardhandoharey@gmail.com",
    "▸ PHONE     : +91 7524940380",
    "▸ LINKEDIN  : linkedin.com/in/vardhan-doharey-zomb",
    "▸ GITHUB    : github.com/VishnuVardhan2000",
    "▸ INSTAGRAM : instagram.com/vishnu.rudra",
    "▸ PORTFOLIO : vardhan.is-a.dev",
    "",
    "Fastest response: LinkedIn DM or Email.",
    "I typically reply within 24 hours.",
    "",
    "For callback requests:",
    "→ vardhandoharey@gmail.com (subject: Callback Request)",
  ],

  status: [
    "▸ AVAILABILITY   : Open to Work ✓",
    "▸ TYPE           : Full-time · Freelance · Contract",
    "▸ LOCATION       : Lucknow (Remote preferred)",
    "▸ NOTICE PERIOD  : Immediate",
    "▸ CURRENT FOCUS  : Full Stack + AI Development",
    "▸ LAST SHIPPED   : Vish.AI (AI Resume Analyzer)",
    "",
    "→ Type [ hire ] to see why you should work with me.",
    "→ Type [ contact ] to reach out.",
  ],
};

const NOT_FOUND = (cmd) => [
  `command not found: ${cmd}`,
  "Type [ help ] to see all available commands.",
];

export default function TerminalPage() {
  const [history, setHistory]   = useState([]);
  const [input, setInput]       = useState("");
  const [booted, setBooted]     = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx]   = useState(-1);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const lines = [];
    const tick = setInterval(() => {
      lines.push({ type: "boot", text: BOOT[i] });
      setHistory([...lines]);
      i++;
      if (i >= BOOT.length) {
        clearInterval(tick);
        setBooted(true);
      }
    }, 120);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((p) => [cmd, ...p]);
    setHistIdx(-1);

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    const output = COMMANDS[cmd] || NOT_FOUND(cmd);

    setHistory((p) => [
      ...p,
      { type: "input", text: `vardhan@portfolio:~$ ${raw}` },
      ...output.map((line) => ({ type: cmd in COMMANDS ? "output" : "error", text: line })),
      { type: "gap", text: "" },
    ]);
  }, []);

  const handleKey = (e) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    }
  };

  const lineColor = (type) => {
    if (type === "boot")   return `${A}0.55)`;
    if (type === "input")  return `${A}1)`;
    if (type === "error")  return "rgba(255,80,80,0.85)";
    if (type === "gap")    return "transparent";
    return "rgba(209,213,219,0.85)";
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white" onClick={() => inputRef.current?.focus()}>

      {/* Ambient glow */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-purple-700/[0.07] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-purple-900/[0.06] rounded-full blur-[160px] pointer-events-none" />

      {/* Scanlines */}
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />

      <style>{`
        .scanlines::before {
          content:""; position:fixed; inset:0; z-index:20;
          background: repeating-linear-gradient(0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
          pointer-events:none;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-track { background: transparent; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: rgba(${ACCENT},0.3); border-radius: 2px; }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24 relative z-10">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-widest mb-1" style={{ color: `${A}0.5)` }}>
              &gt; VARDHAN_OS v2.6 — INTERACTIVE TERMINAL
            </p>
            <h1 className="text-2xl font-bold font-mono" style={{
              color: `${A}1)`,
              textShadow: `0 0 10px ${A}0.6), 0 0 30px ${A}0.3)`,
            }}>
              terminal<span style={{ color: "rgba(255,255,255,0.3)" }}>.exe</span>
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            {["whoami","skills","hire"].map((cmd) => (
              <button key={cmd} onClick={() => runCommand(cmd)}
                className="font-mono text-[10px] px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: `${A}0.08)`,
                  border: `1px solid ${A}0.2)`,
                  color: `${A}0.8)`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${A}0.18)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${A}0.08)`; }}>
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden"
          style={{
            border: `1px solid ${A}0.2)`,
            background: "rgba(5,5,12,0.97)",
            boxShadow: `0 0 60px ${A}0.08), 0 20px 80px rgba(0,0,0,0.6)`,
          }}>

          {/* Window top bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: `${A}0.12)`, background: `${A}0.04)` }}>
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="font-mono text-[11px] ml-3" style={{ color: `${A}0.5)` }}>
              vardhan@portfolio:~
            </span>
          </div>

          {/* Terminal body */}
          <div className="terminal-scroll overflow-y-auto p-5 space-y-0.5"
            style={{ minHeight: "420px", maxHeight: "60vh" }}>
            {history.map((line, i) => (
              <p key={i} className="font-mono text-sm leading-relaxed whitespace-pre"
                style={{ color: lineColor(line.type) }}>
                {line.text || "\u00A0"}
              </p>
            ))}

            {/* Input line */}
            {booted && (
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm" style={{ color: `${A}1)` }}>
                  vardhan@portfolio:~$
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-200 caret-transparent"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <span className="font-mono text-sm cursor-blink" style={{ color: `${A}1)` }}>▌</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Quick command chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(COMMANDS).filter(c => c !== "help").map((cmd) => (
            <button key={cmd} onClick={() => runCommand(cmd)}
              className="font-mono text-[10px] px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(156,163,175,0.8)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${A}0.08)`;
                e.currentTarget.style.borderColor = `${A}0.3)`;
                e.currentTarget.style.color = `${A}1)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(156,163,175,0.8)";
              }}>
              {cmd}
            </button>
          ))}
        </div>

        <p className="font-mono text-[10px] mt-3 text-center" style={{ color: `${A}0.25)` }}>
          ▸ Click anywhere to focus · ↑↓ arrow keys for command history
        </p>
      </div>
    </div>
  );
}