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
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-2xl font-bold text-teal-400 mt-6 mb-3">$1</h2>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-xs font-bold text-white mt-5 mb-2 pb-1 border-b border-white/10 uppercase tracking-widest">$1</h3>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-white font-semibold">$1</strong>'
    )
    .replace(
      /^- (.+)$/gm,
      '<li class="text-slate-300 ml-5 list-disc leading-relaxed my-1 text-sm">$1</li>'
    )
    .replace(
      /(<li[\s\S]*?<\/li>\n?)+/g,
      (m) => '<ul class="my-2 space-y-1">' + m + "</ul>"
    )
    .replace(
      /^(\d+)\. (.+)$/gm,
      '<li class="text-slate-300 ml-5 list-decimal leading-relaxed my-1 text-sm">$2</li>'
    )
    .replace(/^---$/gm, '<hr class="border-white/10 my-4" />')
    .replace(
      /^(?!<)(.+)$/gm,
      '<p class="text-slate-300 leading-relaxed my-1 text-sm">$1</p>'
    );
}

function ScoreRing({ score, size = 110 }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#2dd4bf" : score >= 60 ? "#facc15" : "#f87171";

  return (
    <div>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill={color}
          fontSize="20"
          fontWeight="bold"
        >
          {score}
        </text>
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
        >
          / 100
        </text>
      </svg>
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
          ? "PDF extraction may have failed. Try pasting text manually."
          : "Please paste your resume text (minimum 50 characters)."
      );
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
      ? "Analysis Complete"
      : score >= 80
      ? "Strong Resume"
      : score >= 60
      ? "Needs Some Improvements"
      : "Needs Major Improvements";

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-xs text-teal-400 mb-5">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            Powered by Groq · Llama 3.3 70B
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Vish<span className="text-teal-400">.AI</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Instant AI resume analysis. Get your ATS score, find missing
            keywords, improve action verbs, and match against job descriptions.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="flex justify-center mb-10">
          <div className="h-1 w-28 rounded-full bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center mb-6">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-slate-300"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white leading-snug">
              Upload your resume in PDF or paste the text
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center mb-6">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-slate-300"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <circle cx="17.5" cy="5.5" r="2.5" />
                <path d="m16.7 5.5.6.6 1.2-1.2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white leading-snug">
              Choose analysis mode or match with a job description
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center mb-6">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-slate-300"
              >
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white leading-snug">
              Get mistakes, score, corrections and suggestions in seconds
            </h3>
          </div>
        </div>
      </section>

      {/* Main card */}
      <section className="max-w-5xl mx-auto px-6 pb-20 relative z-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-6 md:p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => { setMode("analyze"); setError(""); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                mode === "analyze"
                  ? "bg-teal-500 text-slate-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              📄 Resume Analysis
            </button>
            <button
              onClick={() => { setMode("match"); setError(""); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                mode === "match"
                  ? "bg-teal-500 text-slate-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              🎯 Job Match
            </button>
          </div>

          {/* Input type toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setInputTab("paste"); setPdfFile(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                inputTab === "paste"
                  ? "bg-slate-100 text-slate-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              ✏️ Paste Text
            </button>
            <button
              onClick={() => setInputTab("pdf")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                inputTab === "pdf"
                  ? "bg-slate-100 text-slate-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              📎 Upload PDF
            </button>
          </div>

          {/* Paste tab */}
          {inputTab === "paste" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Your Resume
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here — work experience, skills, education, achievements, projects..."
                className="w-full min-h-[260px] rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
              <div className="mt-2 text-xs text-slate-500">
                {resumeText.length} characters
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
                  onClick={() => fileInputRef.current?.click()}
                  className={`min-h-[260px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 cursor-pointer transition ${
                    isDragging
                      ? "border-teal-400 bg-teal-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-teal-500"
                  }`}
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
                      <div className="h-10 w-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mb-4" />
                      <p className="text-slate-300">Extracting text from PDF...</p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-4">📄</div>
                      <p className="text-lg font-medium text-white mb-2">
                        Drop your PDF here
                      </p>
                      <p className="text-slate-400 text-sm">
                        or click to browse your file
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-6 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <p className="font-semibold text-teal-400">{pdfFile.name}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {pdfFile.pages} page{pdfFile.pages > 1 ? "s" : ""} extracted
                  </p>
                  <button
                    onClick={() => { setPdfFile(null); setResumeText(""); }}
                    className="mt-4 text-sm text-slate-300 underline hover:text-white"
                  >
                    Remove file
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Job description */}
          {mode === "match" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full min-h-[220px] rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading || pdfLoading}
              className="px-6 py-3 rounded-xl bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Analyzing..."
                : mode === "analyze"
                ? "Analyze My Resume"
                : "Check Job Match"}
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
            >
              Reset
            </button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" />
                <span
                  className="h-2 w-2 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
                <span className="text-sm text-slate-400 ml-2">
                  Vish.AI is analyzing your resume...
                </span>
              </div>
              <div className="space-y-3">
                <div className="h-3 rounded bg-slate-800 animate-pulse w-full" />
                <div className="h-3 rounded bg-slate-800 animate-pulse w-5/6" />
                <div className="h-3 rounded bg-slate-800 animate-pulse w-4/6" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && !loading && (
        <section
          ref={resultRef}
          className="max-w-5xl mx-auto px-6 pb-24 relative z-10"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-5">
                {score !== null && <ScoreRing score={score} />}
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                    {mode === "analyze" ? "Resume Analysis Report" : "Job Match Report"}
                  </p>
                  <h2 className="text-2xl font-bold text-white">{scoreLabel}</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-teal-500 text-slate-900 hover:bg-teal-400 transition text-sm font-semibold"
                >
                  Analyze Another
                </button>
              </div>
            </div>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
            />
          </div>
        </section>
      )}
    </main>
  );
}