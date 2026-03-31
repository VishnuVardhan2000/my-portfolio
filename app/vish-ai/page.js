"use client";

import { useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────
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
            `<td class="border border-white/10 px-3 py-2 text-gray-300 text-sm">${c.trim()}</td>`
        )
        .join("");
      return `<tr class="border-b border-white/5">${cells}</tr>`;
    })
    .replace(
      /(<tr[\s\S]*?<\/tr>\n?)+/g,
      (m) =>
        `<table class="w-full border-collapse my-4 border border-white/10 rounded-xl overflow-hidden">${m}</table>`
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-2xl font-bold text-teal-400 mt-6 mb-3">$1</h2>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-sm font-semibold text-white mt-5 mb-2 pb-1 border-b border-white/10 uppercase tracking-widest">$1</h3>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-white font-semibold">$1</strong>'
    )
    .replace(
      /^- (.+)$/gm,
      '<li class="text-gray-400 ml-5 list-disc leading-relaxed my-1 text-sm">$1</li>'
    )
    .replace(
      /(<li[\s\S]*?<\/li>\n?)+/g,
      (m) => `<ul class="my-2 space-y-1">${m}</ul>`
    )
    .replace(/^(\d+)\. (.+)$/gm,
      '<li class="text-gray-400 ml-5 list-decimal leading-relaxed my-1 text-sm">$2</li>'
    )
    .replace(/^---$/gm, '<hr class="border-white/10 my-4" />')
    .replace(
      /^(?!<)(.+)$/gm,
      '<p class="text-gray-400 leading-relaxed my-1 text-sm">$1</p>'
    );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 110 }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#2dd4bf" : score >= 60 ? "#facc15" : "#f87171";
  const glow =
    score >= 80
      ? "rgba(45,212,191,0.35)"
      : score >= 60
      ? "rgba(250,204,21,0.35)"
      : "rgba(248,113,113,0.35)";

  return (
    <div style={{ filter: `drop-shadow(0 0 12px ${glow})` }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
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
        <text x="50" y="45" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="inherit">
          {score}
        </text>
        <text x="50" y="58" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="inherit">
          / 100
        </text>
      </svg>
    </div>
  );
}

// ─── PDF Extractor ────────────────────────────────────────────────────────────
async function extractTextFromPDF(file) {
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

// ─── Steps Data ───────────────────────────────────────────────────────────────
const steps = [
  {
    n: "01",
    title: "Upload or Paste",
    desc: "Drop your PDF resume or paste plain text — whichever is faster.",
  },
  {
    n: "02",
    title: "AI Analyzes",
    desc: "Llama 3.3 70B scores every section, checks ATS keywords & action verbs.",
  },
  {
    n: "03",
    title: "Fix & Apply",
    desc: "Get a ranked list of changes. Apply them and recheck in seconds.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "SWE Fresher → Amazon",
    quote:
      "My ATS score went from 54 to 88 after following Vish.AI's suggestions. Got a call from Amazon the same week.",
    score: 88,
  },
  {
    name: "Rahul M.",
    role: "Full Stack Dev · Pune",
    quote:
      "The missing keywords section is gold. I had no idea I was missing 'REST APIs' and 'CI/CD' from my resume.",
    score: 91,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handlePDFFile(e.dataTransfer.files[0]);
    },
    [handlePDFFile]
  );

  const handleAnalyze = async () => {
    setError("");
    setResult("");
    if (resumeText.trim().length < 50) {
      setError(
        inputTab === "pdf"
          ? "PDF text extraction may have failed. Try pasting text manually."
          : "Please paste your resume text (minimum 50 characters)."
      );
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
        setTimeout(
          () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
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

  const scoreLabel =
    score === null
      ? ""
      : score >= 80
      ? "Strong Resume 🎯"
      : score >= 60
      ? "Good — Needs Tweaks ⚡"
      : "Needs Work 🔧";

  const scoreColor =
    score === null
      ? "text-white"
      : score >= 80
      ? "text-teal-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <>
      <style>{`
        .vish-glow-teal {
          box-shadow: 0 0 30px rgba(45,212,191,0.08), inset 0 1px 0 rgba(255,255,255,0.03);
        }
        .vish-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(12,12,27,0.8);
          backdrop-filter: blur(12px);
        }
        .step-line::after {
          content: '';
          position: absolute;
          top: 20px;
          left: calc(100% + 8px);
          width: calc(100% - 16px);
          height: 1px;
          background: linear-gradient(90deg, rgba(45,212,191,0.3), rgba(45,212,191,0.05));
        }
        @keyframes blink {
          0%,100% { opacity: 1 }
          50% { opacity: 0.4 }
        }
        .blink { animation: blink 2.2s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <main className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">

        {/* Ambient glows */}
        <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-teal-700/[0.05] rounded-full blur-[180px] pointer-events-none" />
        <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-blue-700/[0.05] rounded-full blur-[160px] pointer-events-none" />

        {/* ── Navbar ── */}
        <header className="border-b border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44L5.5 6A2.5 2.5 0 0 1 8 3.5h1.5z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44L18.5 6A2.5 2.5 0 0 0 16 3.5h-1.5z" />
                </svg>
              </div>
              <span className="font-black text-base tracking-tight">
                Vish<span className="text-teal-400">.AI</span>
              </span>
            </div>
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Portfolio
            </a>
          </div>
        </header>

        {/* ══════════════════════════════════════
            RESULTS VIEW
        ══════════════════════════════════════ */}
        {result && !loading && (
          <div ref={resultRef} className="max-w-6xl mx-auto px-6 py-10 fade-up">
            {/* Results header */}
            <div className="vish-card rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {score !== null && <ScoreRing score={score} size={100} />}
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                    {mode === "analyze" ? "ATS Resume Analysis" : "Job Match Report"}
                  </p>
                  <h2 className={`text-2xl font-black ${scoreColor}`}>
                    {scoreLabel || "Analysis Complete"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {pdfFile ? `📎 ${pdfFile.name}` : "✏️ Text resume analyzed"}{" "}
                    · Powered by Llama 3.3 70B
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

            {/* Result content */}
            <div className="vish-card rounded-2xl p-8">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            INPUT VIEW
        ══════════════════════════════════════ */}
        {!result && (
          <>
            {/* ── Hero Section ── */}
            <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
              <div className="flex 