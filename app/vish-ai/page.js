"use client";

import { useState, useRef, useCallback, useEffect } from "react";

async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return { text: fullText, pages: pdf.numPages };
}

function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/^\|(.+)\|$/gm, (match) => {
      if (match.replace(/\|/g, "").trim().match(/^[-\s]+$/)) return "";
      const cells = match
        .split("|")
        .filter((c) => c.trim() !== "")
        .map(
          (c) =>
            '<td class="border border-white/10 px-3 py-2 text-slate-300 text-sm">' +
            c.trim() +
            "</td>"
        )
        .join("");
      return '<tr class="border-b border-white/5">' + cells + "</tr>";
    })
    .replace(
      /(<tr[\s\S]*?<\/tr>\n?)+/g,
      (m) =>
        '<table class="w-full border-collapse my-4 border border-white/10 rounded-xl overflow-hidden">' +
        m +
        "</table>"
    )
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-teal-400 mt-6 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xs font-bold text-white mt-5 mb-2 pb-1 border-b border-white/10 uppercase tracking-widest">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 ml-5 list-disc leading-relaxed my-1 text-sm">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (m) => '<ul class="my-2 space-y-1">' + m + "</ul>")
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-slate-300 ml-5 list-decimal leading-relaxed my-1 text-sm">$2</li>')
    .replace(/^---$/gm, '<hr class="border-white/10 my-4" />')
    .replace(/^(?!<)(.+)$/gm, '<p class="text-slate-300 leading-relaxed my-1 text-sm">$1</p>');
}

function ScoreRing({ score, size = 110 }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#2dd4bf" : score >= 60 ? "#facc15" : "#f87171";
  return (
    <div>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <text x="50" y="45" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold">{score}</text>
        <text x="50" y="58" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">/ 100</text>
      </svg>
    </div>
  );
}

// ── ModeToggle Component ──
function ModeToggle({ mode, onChange }) {
  const analyzeRef = useRef(null);
  const matchRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({ width: "0px", transform: "translateX(0px)" });

  useEffect(() => {
    const el = mode === "analyze" ? analyzeRef.current : matchRef.current;
    if (el) {
      setSliderStyle({
        width: el.offsetWidth + "px",
        transform: `translateX(${el.offsetLeft - 5}px)`,
      });
    }
  }, [mode]);

  return (
    <div className="mode-toggle-wrap">
      <div className="mode-slider-bg" style={sliderStyle} />
      <button
        ref={analyzeRef}
        className={"mode-toggle-btn " + (mode === "analyze" ? "mode-toggle-btn-active" : "mode-toggle-btn-inactive")}
        onClick={() => onChange("analyze")}
      >
        📄 Resume Analysis
      </button>
      <button
        ref={matchRef}
        className={"mode-toggle-btn " + (mode === "match" ? "mode-toggle-btn-active" : "mode-toggle-btn-inactive")}
        onClick={() => onChange("match")}
      >
        🎯 Job Match
      </button>
    </div>
  );
}

export default function VishAI() {
  const [mode, setMode] = useState("analyze");
  const [inputTab, setInputTab] = useState("paste");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  const handlePDFFile = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setPdfLoading(true);
    try {
      const { text, pages } = await extractTextFromPDF(file);
      setResumeText(text);
      setPdfFile({ name: file.name, pages });
    } catch {
      setError("Couldn't read this PDF. Try pasting the text instead.");
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handlePDFFile(e.dataTransfer.files[0]);
  }, [handlePDFFile]);

  const handleAnalyze = async () => {
    setError("");
    setResult("");
    if (resumeText.trim().length < 50) {
      setError(inputTab === "pdf" ? "PDF extraction may have failed. Try pasting text manually." : "Please paste your resume text (minimum 50 characters).");
      return;
    }
    if (mode === "match" && jobDescription.trim().length < 30) {
      setError("Please paste a valid job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data.result);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText("");
    setJobDescription("");
    setResult("");
    setError("");
    setPdfFile(null);
    setInputTab("paste");
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "analyze" ? "resume-analysis-vish-ai.txt" : "job-match-report-vish-ai.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const extractScore = (text) => {
    const match = text.match(/(\d{1,3})\s*\/\s*100/);
    return match ? parseInt(match[1]) : null;
  };

  const score = result ? extractScore(result) : null;
  const scoreLabel =
    score === null ? "Analysis Complete"
    : score >= 80 ? "Strong Resume"
    : score >= 60 ? "Needs Some Improvements"
    : "Needs Major Improvements";

  return (
    <>
      <style>{`
        /* ── Fizzy Download Button ── */
        .btn-fizzy {
          position: relative;
          padding: 9px 20px;
          font-size: 13px;
          font-weight: 600;
          color: #2dd4bf;
          background: rgba(45,212,191,0.08);
          border: 1px solid rgba(45,212,191,0.3);
          border-radius: 9px;
          cursor: pointer;
          overflow: hidden;
          transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-fizzy:hover {
          background: rgba(45,212,191,0.18);
          border-color: rgba(45,212,191,0.6);
          transform: translateY(-2px);
          color: #5eead4;
        }
        .btn-fizzy .fizz {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2dd4bf;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%);
        }
        .btn-fizzy:hover .fizz { animation: fizzy-pop 0.8s ease-out forwards; }
        .btn-fizzy:hover .fizz:nth-child(2) { left: 30%; animation-delay: 0.08s; width: 4px; height: 4px; }
        .btn-fizzy:hover .fizz:nth-child(3) { left: 70%; animation-delay: 0.15s; width: 5px; height: 5px; }
        .btn-fizzy:hover .fizz:nth-child(4) { left: 20%; animation-delay: 0.22s; width: 3px; height: 3px; }
        .btn-fizzy:hover .fizz:nth-child(5) { left: 80%; animation-delay: 0.1s;  width: 4px; height: 4px; }
        .btn-fizzy:hover .fizz:nth-child(6) { left: 45%; animation-delay: 0.18s; width: 5px; height: 5px; }
        @keyframes fizzy-pop {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-28px) scale(0.3); }
        }

        /* ── Glow Analyze Button ── */
        .btn-glow {
          position: relative;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.04em;
          color: #0a0a12;
          background: #2dd4bf;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.3s, box-shadow 0.3s, transform 0.15s;
          box-shadow: 0 0 0 0 rgba(45,212,191,0);
        }
        .btn-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-glow:hover::before { transform: translateX(100%); }
        .btn-glow:hover {
          box-shadow: 0 0 18px 4px rgba(45,212,191,0.45), 0 0 40px 8px rgba(45,212,191,0.2);
          transform: translateY(-1px);
        }
        .btn-glow:active { transform: translateY(0); }
        .btn-glow:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; transform: none; }

        /* ── Swipe Fill Button ── */
        .btn-swipe {
          position: relative;
          padding: 12px 28px;
          font-weight: 600;
          font-size: 14px;
          color: #94a3b8;
          background: transparent;
          border: 1.5px solid rgba(148,163,184,0.3);
          border-radius: 10px;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.35s ease, border-color 0.35s ease;
        }
        .btn-swipe::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: rgba(148,163,184,0.12);
          transition: left 0.35s cubic-bezier(0.16,1,0.3,1);
          z-index: 0;
        }
        .btn-swipe:hover::after { left: 0; }
        .btn-swipe:hover { color: #e2e8f0; border-color: rgba(148,163,184,0.6); }
        .btn-swipe span { position: relative; z-index: 1; }

        /* ── Magnetic Sliding Mode Toggle ── */
        .mode-toggle-wrap {
          position: relative;
          display: inline-flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 5px;
          gap: 0;
        }
        .mode-slider-bg {
          position: absolute;
          top: 5px;
          left: 5px;
          height: calc(100% - 10px);
          border-radius: 8px;
          background: #2dd4bf;
          box-shadow: 0 0 16px rgba(45,212,191,0.35);
          transition: transform 0.42s cubic-bezier(0.34,1.56,0.64,1),
                      width 0.42s cubic-bezier(0.34,1.56,0.64,1);
          pointer-events: none;
          z-index: 0;
        }
        .mode-toggle-btn {
          position: relative;
          z-index: 1;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: color 0.3s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mode-toggle-btn-active   { color: #0a0a12; }
        .mode-toggle-btn-inactive { color: #475569; }
        .mode-toggle-btn-inactive:hover { color: #94a3b8; }

        /* ── Sliding Pill Tab Switcher ── */
        .tab-switcher {
          position: relative;
          display: inline-flex;
          background: rgba(15,20,40,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 4px;
          gap: 0;
        }
        .tab-pill {
          position: absolute;
          top: 4px;
          height: calc(100% - 8px);
          width: calc(50% - 4px);
          background: rgba(45,212,191,0.15);
          border: 1px solid rgba(45,212,191,0.3);
          border-radius: 9px;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .tab-pill-paste { transform: translateX(0); left: 4px; }
        .tab-pill-pdf   { transform: translateX(100%); left: 4px; }
        .tab-btn {
          position: relative;
          z-index: 1;
          padding: 9px 20px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 9px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: color 0.3s;
          white-space: nowrap;
        }
        .tab-btn-active  { color: #2dd4bf; }
        .tab-btn-inactive{ color: #475569; }
        .tab-btn-inactive:hover { color: #94a3b8; }

        /* ── Pulse Upload Button ── */
        .btn-pulse {
          position: relative;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 14px;
          color: #2dd4bf;
          background: transparent;
          border: 2px solid #2dd4bf;
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, transform 0.15s;
          overflow: visible;
        }
        .btn-pulse::before,
        .btn-pulse::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50px;
          border: 2px solid #2dd4bf;
          opacity: 0;
          animation: pulse-ring 2s ease-out infinite;
        }
        .btn-pulse::after { animation-delay: 1s; }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .btn-pulse:hover { background: #2dd4bf; color: #0a0a12; transform: translateY(-2px); }
        .btn-pulse:hover::before,
        .btn-pulse:hover::after { animation: none; opacity: 0; }

        /* ── Copy Button ── */
        .btn-outline-sm {
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          background: transparent;
          border: 1px solid rgba(100,116,139,0.25);
          border-radius: 8px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .btn-outline-sm:hover {
          color: #e2e8f0;
          border-color: rgba(100,116,139,0.5);
          background: rgba(100,116,139,0.08);
        }
        .btn-outline-sm-copied {
          color: #2dd4bf;
          border-color: rgba(45,212,191,0.4);
          background: rgba(45,212,191,0.08);
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .blink { animation: blink 2s ease-in-out infinite; }
      `}</style>

      <main className="min-h-screen bg-[#070b14] text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-teal-500/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/8 blur-3xl" />
        </div>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-xs text-teal-400 mb-5">
              <span className="h-2 w-2 rounded-full bg-teal-400 blink" />
              Powered by Groq · Llama 3.3 70B
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Vish<span className="text-teal-400">.AI</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto">
              Instant AI resume analysis. Get your ATS score, find missing keywords, improve action verbs, and match against job descriptions.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="flex justify-center mb-10">
            <div className="h-1 w-28 rounded-full bg-amber-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 text-center">
            {[
              {
                icon: (
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h8" /><path d="M8 17h5" />
                  </svg>
                ),
                title: "Upload your resume in PDF or paste the text",
              },
              {
                icon: (
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <circle cx="17.5" cy="5.5" r="2.5" />
                    <path d="m16.7 5.5.6.6 1.2-1.2" />
                  </svg>
                ),
                title: "Choose analysis mode or match with a job description",
              },
              {
                icon: (
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h5" />
                  </svg>
                ),
                title: "Get score, corrections and suggestions in seconds",
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center mb-6 text-slate-300">
                  {s.icon}
                </div>
                <h3 className="text-xl font-semibold text-white leading-snug">{s.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Main Card */}
        <section className="max-w-5xl mx-auto px-6 pb-20 relative z-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 md:p-8 shadow-2xl">

            {/* Mode toggle — Magnetic Sliding */}
            <div className="mb-7">
              <ModeToggle mode={mode} onChange={(m) => { setMode(m); setError(""); }} />
            </div>

            {/* Input tab */}
            <div className="mb-6">
              <div className="tab-switcher">
                <div className={"tab-pill " + (inputTab === "paste" ? "tab-pill-paste" : "tab-pill-pdf")} />
                <button
                  className={"tab-btn " + (inputTab === "paste" ? "tab-btn-active" : "tab-btn-inactive")}
                  onClick={() => { setInputTab("paste"); setPdfFile(null); setError(""); }}
                >
                  ✏️ Paste Text
                </button>
                <button
                  className={"tab-btn " + (inputTab === "pdf" ? "tab-btn-active" : "tab-btn-inactive")}
                  onClick={() => { setInputTab("pdf"); setError(""); }}
                >
                  📎 Upload PDF
                </button>
              </div>
            </div>

            {/* Paste tab */}
            {inputTab === "paste" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Your Resume</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here — work experience, skills, education, achievements, projects..."
                  className="w-full min-h-[260px] rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition resize-none"
                />
                <div className="mt-2 text-xs text-slate-600">
                  {resumeText.length < 50
                    ? (50 - resumeText.length) + " more characters needed"
                    : "✓ Ready to analyze · " + resumeText.length + " characters"}
                </div>
              </div>
            )}

            {/* PDF tab */}
            {inputTab === "pdf" && (
              <div className="mb-6">
                {!pdfFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={"min-h-[260px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 gap-5 transition " + (isDragging ? "border-teal-400 bg-teal-500/8" : "border-slate-700 bg-slate-950")}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handlePDFFile(e.target.files[0])}
                    />
                    {pdfLoading ? (
                      <>
                        <div className="h-10 w-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
                        <p className="text-slate-400 text-sm">Extracting text from PDF...</p>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl">📄</div>
                        <div>
                          <p className="text-base font-medium text-slate-300 mb-1">Drag and drop your PDF here</p>
                          <p className="text-slate-500 text-sm">or click the button below to browse</p>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="btn-pulse">
                          Browse PDF File
                        </button>
                        <p className="text-slate-600 text-xs">PDF only · Max 10MB</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-teal-500/25 bg-teal-500/8 p-8 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="font-bold text-teal-400 text-lg">{pdfFile.name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {pdfFile.pages} page{pdfFile.pages > 1 ? "s" : ""} · Text extracted successfully
                    </p>
                    <button onClick={() => { setPdfFile(null); setResumeText(""); }} className="mt-5 btn-swipe">
                      <span>Remove file</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Job description */}
            {mode === "match" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here — title, requirements, responsibilities, preferred skills..."
                  className="w-full min-h-[220px] rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition resize-none"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400 flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={handleAnalyze} disabled={loading || pdfLoading} className="btn-glow">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Analyzing...
                  </span>
                ) : mode === "analyze" ? "⚡ Analyze My Resume" : "🎯 Check Job Match"}
              </button>
              <button onClick={handleReset} className="btn-swipe">
                <span>↺ Reset</span>
              </button>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6 fade-up">
                <div className="flex items-center gap-2 mb-5">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: d + "ms" }} />
                  ))}
                  <span className="text-sm text-slate-500 ml-2">Vish.AI is analyzing your resume...</span>
                </div>
                <div className="space-y-3">
                  {[100, 83, 92, 66, 75].map((w, i) => (
                    <div key={i} className="h-3 rounded-full bg-slate-800 animate-pulse" style={{ width: w + "%", animationDelay: i * 80 + "ms" }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        {result && !loading && (
          <section ref={resultRef} className="max-w-5xl mx-auto px-6 pb-24 relative z-10 fade-up">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-5">
                  {score !== null && <ScoreRing score={score} />}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-600 mb-1">
                      {mode === "analyze" ? "Resume Analysis Report" : "Job Match Report"}
                    </p>
                    <h2 className="text-2xl font-bold text-white">{scoreLabel}</h2>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className={"btn-outline-sm " + (copied ? "btn-outline-sm-copied" : "")}
                  >
                    {copied ? "✓ Copied!" : "Copy Report"}
                  </button>
                  <button onClick={handleDownload} className="btn-fizzy">
                    <span className="fizz" />
                    <span className="fizz" />
                    <span className="fizz" />
                    <span className="fizz" />
                    <span className="fizz" />
                    <span className="fizz" />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Report
                  </button>
                  <button onClick={handleReset} className="btn-glow">
                    Analyze Another
                  </button>
                </div>
              </div>
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
            </div>
          </section>
        )}
      </main>
    </>
  );
}