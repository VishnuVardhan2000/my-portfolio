"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { COMMANDS, NOT_FOUND, TERM_ACCENT, CHIP_COMMANDS } from "../../lib/terminalCommands";
const { setAccent } = useTheme();
useEffect(() => { setAccent("74,222,128"); }, [setAccent]);

const TA = `rgba(${TERM_ACCENT},`;

const BOOT = [
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

export default function TerminalPage() {
  const [history, setHistory]       = useState([]);
  const [input, setInput]           = useState("");
  const [booted, setBooted]         = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    let i = 0;
    const lines = [];
    const tick = setInterval(() => {
      lines.push({ type: "boot", text: BOOT[i] });
      setHistory([...lines]);
      i++;
      if (i >= BOOT.length) { clearInterval(tick); setBooted(true); }
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
    if (cmd === "clear") { setHistory([]); return; }
    const output = COMMANDS[cmd] || NOT_FOUND(cmd);
    setHistory((p) => [
      ...p,
      { type: "input",  text: `vardhan@portfolio:~$ ${raw}` },
      ...output.map((line) => ({ type: cmd in COMMANDS ? "output" : "error", text: line })),
      { type: "gap", text: "" },
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
    if (type === "boot")  return `${TA}0.55)`;
    if (type === "input") return `${TA}1)`;
    if (type === "error") return "rgba(255,80,80,0.85)";
    if (type === "gap")   return "transparent";
    return "rgba(209,213,219,0.85)";
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white"
      onClick={() => inputRef.current?.focus()}>

      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none"
        style={{ background:`${TA}0.06)` }} />
      <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
        style={{ background:`${TA}0.04)` }} />

      <div className="scanlines pointer-events-none fixed inset-0 z-20" />

      <style>{`
        .scanlines::before {
          content:""; position:fixed; inset:0; z-index:20;
          background: repeating-linear-gradient(0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
          pointer-events:none;
        }
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-track { background: transparent; }
        .terminal-scroll::-webkit-scrollbar-thumb {
          background: rgba(${TERM_ACCENT},0.3);
          border-radius: 2px;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24 relative z-10">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-widest mb-1"
              style={{ color:`${TA}0.5)` }}>
              &gt; VARDHAN_OS v2.6 — INTERACTIVE TERMINAL
            </p>
            <h1 className="text-2xl font-bold font-mono" style={{
              color: `${TA}1)`,
              textShadow: `0 0 10px ${TA}0.6), 0 0 30px ${TA}0.3)`,
            }}>
              terminal<span style={{ color:"rgba(255,255,255,0.3)" }}>.exe</span>
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["whoami","skills","hire"].map((cmd) => (
              <button key={cmd} className="kbd-key"
                style={{ color:`${TA}0.8)`, fontSize:"11px" }}
                onClick={() => runCommand(cmd)}>
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden"
          style={{
            border:`1px solid ${TA}0.2)`,
            background:"rgba(3,7,3,0.97)",
            boxShadow:`0 0 60px ${TA}0.07), 0 20px 80px rgba(0,0,0,0.6)`,
          }}>

          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor:`${TA}0.12)`, background:`${TA}0.04)` }}>
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="font-mono text-[11px] ml-3" style={{ color:`${TA}0.5)` }}>
              vardhan@portfolio:~
            </span>
          </div>

          {/* Terminal body */}
          <div className="terminal-scroll overflow-y-auto p-5 space-y-0.5"
            style={{ minHeight:"420px", maxHeight:"60vh" }}>
            {history.map((line, i) => (
              <p key={i} className="font-mono text-sm leading-relaxed whitespace-pre"
                style={{ color: lineColor(line.type) }}>
                {line.text || "\u00A0"}
              </p>
            ))}

            {booted && (
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm" style={{ color:`${TA}1)` }}>
                  vardhan@portfolio:~$
                </span>
                <input ref={inputRef} value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-200 caret-transparent"
                  spellCheck={false} autoComplete="off" autoCorrect="off" />
                <span className="font-mono text-sm cursor-blink" style={{ color:`${TA}1)` }}>▌</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Keyboard key chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CHIP_COMMANDS.map((cmd) => (
            <button key={cmd} className="kbd-key"
              style={{ color:`${TA}0.8)`, fontSize:"11px" }}
              onClick={() => runCommand(cmd)}>
              {cmd}
            </button>
          ))}
        </div>

        <p className="font-mono text-[10px] mt-3 text-center"
          style={{ color:`${TA}0.25)` }}>
          ▸ Click anywhere to focus · ↑↓ arrow keys for command history
        </p>
      </div>
    </div>
  );
}