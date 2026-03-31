"use client";

import { useState, useRef, useCallback } from "react";

async function extractTextFromPDF(file) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" +
    pdfjsLib.version +
    "/pdf.worker.min.js";
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
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
        .map((c) => '<td class="border border-white/10 px-3 py-2 text-gray-300 text-sm">' + c.trim() + "</td>")
        .join("");
      return '<tr class="border-b border-white/5">' + cells + "</tr>";
    })
    .replace(
      /(<tr[\s\S]*?<\/tr>\n?)+/g,
      (m) => '<table class="w-full border-collapse my-4 border border-white/10 rounded-xl overflow-hidden">' + m + "</table>"
    )
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-teal-400 mt-6 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xs font-bold text-white mt-5 mb-2 pb-1 border-b border-white/10 uppercase tracking-widest">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="text-gray-400 ml-5 list-disc leading-relaxed my-1 text-sm">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (m) => '<ul class="my-2 space-y-1">' + m + "</ul>")
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-400 ml-5 list-decimal leading-relaxed my-1 text-sm">$2</li>')
    .replace(/^---$/gm, '<hr class="border-white/10 my-4" />')
    .replace(/^(?!<)(.+)$/gm, '<p class="text-gray-400 leading-relaxed my-1 text-sm">$1</p>');
}

function ScoreRing({ score, size }) {
  const s = size || 110;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#2dd4bf" : score >= 60 ? "#facc15" : "#f87171";
  const glow =
    score >= 80 ? "rgba(45,212,191,0.35)" : score >= 60 ? "rgba(250,204,21,0.35)" : "rgba(248,113,113,0.35)";
  return (
    <div style={{ filter: "drop-shadow(0 0 12px " + glow + ")" }}>
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <text x="50" y="45" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="inherit">{score}</text>
        <text x="50" y="58" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="inherit">/ 100</text>
      </svg>
    </div>
  );
}

const steps = [
  { n: "01", title: "Upload or Paste", desc: "Drop your PDF resume or paste plain text — whichever is faster." },
  { n: "02", title: "AI Analyzes", desc: "Llama 3.3 70B scores every section, checks ATS keywords & action verbs." },
  { n: "03", title: "Fix & Apply", desc: "Get a ranked list of changes. Apply them and recheck in seconds." },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "SWE Fresher → Amazon",
    quote: "My ATS score went from 54 to 88 after following Vish.AI's suggestions. Got a call from Amazon the same week.",
    score: 88,
  },
  {
    name: "Rahul M.",
    role: "Full Stack Dev · Pune",
    quote: "The missing keywords section is gold. I had no idea I was missing REST APIs and CI/CD from my resume.",
    score: 91,
  },
];

const features = [
  { icon: "📊", title: "ATS Score out of 100", desc: "See exactly how recruiter software rates your resume." },
  { icon: "🔑", title: "Missing Keywords", desc: "High-value terms ATS systems look for that you're missing." },
  { icon: "⚡", title: "Action Verb Check", desc: "Weak phrases replaced with powerful, recruiter-approved verbs." },
  { icon: "🎯", title: "Job Match Mode", desc: "Paste any JD and get a match % with a tailoring checklist." },
];

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
  };

  const extractScore = (text) => {
    const match = text.match(/(\d{1,3})\s*\/\s*100/);
    return match ? parseInt(match[1]) : null;
  };

  const score = result ? extractScore(result) : null;
  const scoreLabel = score === null ? "" : score >= 80 ? "Strong Resume 🎯" : score >= 60 ? "Good — Needs Tweaks ⚡" : "Needs Work 🔧";
  const scoreColor = score === null ? "text-white" : score >= 80 ? "text-teal-400" : score >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <>
      <style>{`
        .vish-card { border: 1px solid rgba(255,255,255,0.07); background: rgba(12,12,27,0.8); backdrop-filter: blur(12px); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .blink { animation: blink 2.2s ease-in-out infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <main className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">
        <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-teal-700/[0.05] rounded-full blur-[180px] pointer-events-none" />
        <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-blue-700/[0.05] rounded-full blur-[160px] pointer-events-none" />

        {/* Navbar */}
        <header className="border-b border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44L5.5 6A2.5 2.5 0 0 1 8 3.5h1.5z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44L18.5 6A2.5 2.5 0 0 0 16 3.5h-1.5z" />
                </svg>
              </div>
              <span className="font-black text-base tracking-tight">Vish<span className="text-teal-400">.AI</span></span>
            </div>
            <a href="/" className="text-sm text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Portfolio
            </a>
          </div>
        </header>

        {/* RESULTS VIEW */}
        {result && !loading && (
          <div ref={resultRef} className="max-w-6xl mx-auto px-6 py-10 fade-up">
            <div className="vish-card rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {score !== null && <ScoreRing score={score} size={100} />}
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                    {mode === "analyze" ? "ATS Resume Analysis" : "Job Match Report"}
                  </p>
                  <h2 className={"text-2xl font-black " + scoreColor}>{scoreLabel || "Analysis Complete"}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {pdfFile ? "📎 " + pdfFile.name : "✏️ Text resume analyzed"} · Powered by Llama 3.3 70B
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/20 text-xs transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 text-xs font-semibold transition-all"
                >
                  ← Analyze Another
                </button>
              </div>
            </div>
            <div className="vish-card rounded-2xl p-8">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
            </div>
          </div>
        )}

        {/* INPUT VIEW */}
        {!result && (
          <>
            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 blink" />
                  Powered by Groq · Llama 3.3 70B · Free
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                  Get hired faster with <span className="text-teal-400">AI-powered</span> resume feedback
                </h1>
                <p className="text-gray-400 text-base leading-relaxed mb-4">
                  Paste your resume or upload a PDF. Get an ATS score, section breakdown, missing keywords, action verb analysis, and ranked fixes — in under 30 seconds.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex -space-x-1.5">
                    {["VD", "RS", "PM", "AK"].map((init) => (
                      <span key={init} className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center text-[9px] font-bold text-teal-300">
                        {init}
                      </span>
                    ))}
                  </span>
                  <span>100+ job seekers improved their resume this month</span>
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="max-w-6xl mx-auto px-6 mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {steps.map((s, i) => (
                  <div key={i} className="relative vish-card rounded-2xl p-5 flex gap-4 items-start">
                    <span className="shrink-0 text-xs font-black text-teal-400/50 mt-0.5 w-6">{s.n}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{s.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden sm:block absolute top-7 -right-2 z-10">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-500/30">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 2-Column Layout */}
            <section className="max-w-6xl mx-auto px-6 pb-16">
              <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">

                {/* LEFT */}
                <div className="space-y-6 lg:sticky lg:top-20">
                  <div className="vish-card rounded-2xl p-5 space-y-5">
                    <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">What you get</p>
                    {features.map((f) => (
                      <div key={f.title} className="flex gap-3 items-start">
                        <span className="text-lg mt-0.5 shrink-0">{f.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-white leading-snug">{f.title}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold px-1">Real results</p>
                    {testimonials.map((t) => (
                      <div key={t.name} className="vish-card rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-bold text-white">{t.name}</p>
                            <p className="text-xs text-teal-400">{t.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-teal-400">{t.score}</p>
                            <p className="text-[10px] text-gray-600">ATS Score</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  {/* Mode toggle */}
                  <div className="flex rounded-xl border border-white/[0.07] bg-white/[0.02] p-1 gap-1">
                    {[{ id: "analyze", label: "📄 Resume Analysis" }, { id: "match", label: "🎯 Job Match" }].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setMode(m.id); setError(""); setResult(""); }}
                        className={"flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all " + (mode === m.id ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-gray-500 hover:text-gray-300")}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Input card */}
                  <div className="vish-card rounded-2xl overflow-hidden">
                    <div className="flex border-b border-white/[0.06]">
                      {[{ id: "paste", label: "✏️ Paste Text" }, { id: "pdf", label: "📎 Upload PDF" }].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { setInputTab(t.id); setError(""); if (t.id === "paste") setPdfFile(null); }}
                          className={"flex-1 py-3 text-sm font-semibold transition-all " + (inputTab === t.id ? "text-teal-400 border-b-2 border-teal-400 bg-teal-500/5" : "text-gray-600 hover:text-gray-300")}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-5">
                      {inputTab === "paste" && (
                        <>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Your Resume</label>
                          <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your resume text here — work experience, skills, education, projects, certifications..."
                            className="w-full h-60 resize-none bg-black/20 rounded-xl border border-white/[0.06] p-4 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/10 transition-all font-mono leading-relaxed"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-700">{resumeText.length < 50 ? (50 - resumeText.length) + " more chars needed" : "✓ Ready to analyze"}</p>
                            <p className="text-xs text-gray-700">{resumeText.length} chars</p>
                          </div>
                        </>
                      )}

                      {inputTab === "pdf" && (
                        <>
                          {!pdfFile ? (
                            <div
                              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={"h-60 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 " + (isDragging ? "border-teal-400/60 bg-teal-500/5" : "border-white/10 hover:border-teal-500/30 hover:bg-white/[0.02]")}
                            >
                              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handlePDFFile(e.target.files[0])} />
                              {pdfLoading ? (
                                <>
                                  <svg className="animate-spin w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                  </svg>
                                  <p className="text-gray-500 text-sm">Extracting text from PDF...</p>
                                </>
                              ) : (
                                <>
                                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <polyline points="14 2 14 8 20 8" />
                                      <line x1="12" y1="18" x2="12" y2="12" />
                                      <line x1="9" y1="15" x2="15" y2="15" />
                                    </svg>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-gray-400 text-sm font-semibold">Drop your PDF here</p>
                                    <p className="text-gray-600 text-xs mt-1">or <span className="text-teal-400 underline underline-offset-2">click to browse</span></p>
                                  </div>
                                  <p className="text-gray-700 text-xs">PDF only · Max 10MB</p>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="h-60 rounded-xl border border-teal-500/20 bg-teal-500/5 flex flex-col items-center justify-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-teal-500/15 flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <p className="text-teal-400 text-sm font-bold">{pdfFile.name}</p>
                                <p className="text-gray-600 text-xs mt-0.5">{pdfFile.pages} page{pdfFile.pages > 1 ? "s" : ""} · Text extracted ✓</p>
                              </div>
                              <button onClick={() => { setPdfFile(null); setResumeText(""); }} className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2">
                                Remove file
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {mode === "match" && (
                    <div className="vish-card rounded-2xl p-5">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Job Description</label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description — title, requirements, responsibilities, preferred skills..."
                        className="w-full h-48 resize-none bg-black/20 rounded-xl border border-white/[0.06] p-4 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/10 transition-all font-mono leading-relaxed"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 flex items-start gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={loading || pdfLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 disabled:bg-teal-500/25 disabled:cursor-not-allowed text-[#0a0a12] font-black text-sm tracking-wide transition-all shadow-lg shadow-teal-500/10"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Analyzing with Llama 3.3 70B...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        {mode === "analyze" ? "Analyze My Resume" : "Check Job Match"}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-700">Free · No signup · Results in ~15 seconds</p>

                  {loading && (
                    <div className="vish-card rounded-2xl p-6 space-y-3 fade-up">
                      <div className="flex items-center gap-2 mb-4">
                        {[0, 150, 300].map((d) => (
                          <div key={d} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: d + "ms" }} />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">Reading your resume...</span>
                      </div>
                      {[95, 75, 88, 55, 70].map((w, i) => (
                        <div key={i} className="h-3 rounded-full bg-white/[0.04] animate-pulse" style={{ width: w + "%", animationDelay: i * 80 + "ms" }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}