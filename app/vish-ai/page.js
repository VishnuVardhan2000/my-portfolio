'use client';
import { useState } from 'react';

export default function VishAI() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [mode, setMode] = useState('resume');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!resume.trim()) { setError('Please paste your resume first.'); return; }
    if (mode === 'match' && !jobDesc.trim()) { setError('Please paste the job description too.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: jobDesc, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Powered by Groq · Llama 3.3 70B
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Vish<span className="text-teal-600 dark:text-teal-400">.AI</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
            Instant AI resume analysis. Get your ATS score, find gaps, and land more interviews.
          </p>
        </div>

        {!result ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">

            {/* Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
              {[
                { id: 'resume', label: '📄 Resume Analysis' },
                { id: 'match',  label: '🎯 Job Match' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Resume Textarea */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Resume <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resume}
                onChange={e => setResume(e.target.value)}
                placeholder="Paste your resume text — work experience, skills, education, achievements..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">{resume.length} characters</p>
            </div>

            {/* Job Description Textarea */}
            {mode === 'match' && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the job description you're applying for..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-colors"
                />
              </div>
            )}

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={loading}
              className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : mode === 'match' ? '🎯 Match Resume to Job' : '🔍 Analyze My Resume'}
            </button>
          </div>
        ) : (
          <Results result={result} onReset={() => setResult(null)} mode={mode} />
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const color = value >= 75 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400 capitalize">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Results({ result, onReset, mode }) {
  const score = result.ats_score ?? 0;
  const scoreColor = score >= 75 ? 'text-green-600 dark:text-green-400' : score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const cardBorder = score >= 75 ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : score >= 50 ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10';

  return (
    <div className="space-y-4">

      {/* Score Card */}
      <div className={`rounded-2xl border p-6 ${cardBorder}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {mode === 'match' ? 'Job Match Score' : 'ATS Score'}
            </p>
            <div className={`text-6xl font-bold ${scoreColor} leading-none`}>
              {score}<span className="text-xl text-gray-400">/100</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-lg leading-relaxed">{result.summary}</p>
          </div>
          <button
            onClick={onReset}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 transition-colors"
          >
            ← Analyze Another
          </button>
        </div>
      </div>

      {/* Section Scores */}
      {result.section_scores && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Section Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(result.section_scores).map(([k, v]) => (
              <ScoreBar key={k} label={k} value={v} />
            ))}
          </div>
        </div>
      )}

      {/* Strengths + Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 shrink-0">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.weaknesses?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Areas to Improve
            </h3>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-red-500 shrink-0">!</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Missing Keywords */}
      {result.missing_keywords?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-full text-xs font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">💡 Actionable Suggestions</h3>
          <ol className="space-y-3">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}