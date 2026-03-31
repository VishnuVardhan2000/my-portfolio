"use client";
import Link from "next/link";

const stats = [
  { value: "3+", label: "Projects Shipped" },
  { value: "3", label: "APIs Integrated" },
  { value: "2", label: "Live AI Apps" },
  { value: "∞", label: "Curiosity" },
];

const stack = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Node.js",
  "MongoDB",
  "Groq AI",
  "JavaScript",
  "Git",
  "Vercel",
  "REST APIs",
];

const projects = [
  {
    name: "VibeBoard",
    thumb: "/vibeboard-thumb.png",
    tagline: "Describe your mood. Get an aesthetic universe.",
    desc: "AI-generated color palettes, anime matches, music vibes & Hinglish mood quotes — all from one mood input. Powered by Groq AI + Unsplash.",
    tags: ["Next.js", "Groq AI", "Tailwind CSS", "Unsplash API"],
    badge: "AI · Live",
    glow: "147,51,234",
    live: "https://vibeboard-woad.vercel.app",
    github: "https://github.com/VishnuVardhan2000/vibeboard",
  },
  {
    name: "Vish.AI",
    tagline: "Paste your resume. Get an ATS score instantly.",
    desc: "AI-powered resume analyzer — get an ATS score, section breakdown, keyword gaps, and actionable suggestions. Upload PDF or paste text. Powered by Groq Llama 3.3 70B.",
    tags: ["Next.js", "Groq AI", "React", "Node.js"],
    badge: "AI · Live",
    glow: "45,212,191",
    live: "https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
    github: "https://github.com/VishnuVardhan2000/my-portfolio",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        .neon-name {
          text-shadow:
            0 0 10px rgba(96,165,250,0.24),
            0 0 24px rgba(96,165,250,0.08);
          transition: text-shadow 0.45s ease, color 0.45s ease;
          cursor: default;
          display: inline-block;
        }

        .neon-name:hover {
          color: #7db4ff;
          text-shadow:
            0 0 5px rgba(255,255,255,0.9),
            0 0 12px rgba(96,165,250,1),
            0 0 28px rgba(96,165,250,0.7),
            0 0 56px rgba(96,165,250,0.4),
            0 0 90px rgba(147,51,234,0.24);
        }

        .neon-text-hover {
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }

        .neon-text-hover:hover {
          color: #7db4ff;
          text-shadow:
            0 0 6px rgba(96,165,250,0.9),
            0 0 18px rgba(96,165,250,0.45),
            0 0 34px rgba(147,51,234,0.2);
        }

        .rect-btn {
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 0.82rem;
          line-height: 1;
        }

        .proj-card {
          border: 1px solid rgba(96,165,250,0.13);
          box-shadow:
            0 0 14px rgba(96,165,250,0.05),
            inset 0 1px 0 rgba(255,255,255,0.025);
          transition:
            transform 0.38s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.38s cubic-bezier(0.16,1,0.3,1),
            border-color 0.38s ease;
        }

        .proj-card:hover {
          transform: scale(1.025) translateY(-3px);
          border-color: rgba(96,165,250,0.48);
          box-shadow:
            0 0 0 1px rgba(96,165,250,0.28),
            0 0 20px rgba(96,165,250,0.20),
            0 0 50px rgba(96,165,250,0.09),
            0 10px 36px rgba(0,0,0,0.35);
        }

        .chip-bg {
          background-image:
            linear-gradient(rgba(96,165,250,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.045) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        @keyframes blink {
          0%,100% { opacity: 1 }
          50% { opacity: 0.45 }
        }

        .blink {
          animation: blink 2.2s ease-in-out infinite;
        }
      `}</style>

      <main className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">
        <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-blue-700/[0.07] rounded-full blur-[180px] pointer-events-none" />
        <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-purple-700/[0.06] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 relative z-10">

          {/* ── Hero ── */}
          <section className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 blink" />
              Open to work · Fresher Full Stack Developer
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Hi, I&apos;m{" "}
              <span className="neon-name text-blue-400">Vardhan</span>
              <br />
              <span className="text-white/30 text-2xl md:text-4xl font-bold">
                I build things for the web.
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10">
              Full Stack Developer in progress — turning ideas into live web
              apps with React, Next.js &amp; a sprinkle of AI. Based in Lucknow.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rect-btn neon-text-hover bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30"
              >
                View Projects ↗
              </Link>

              <Link
                href="/about"
                className="rect-btn neon-text-hover bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-white font-semibold transition-all duration-200"
              >
                About Me
              </Link>

              <a
                href="/resume.pdf"
                download
                className="rect-btn neon-text-hover bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-gray-300 font-semibold transition-all duration-200"
              >
                Resume ↓
              </a>
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 text-center hover:bg-white/[0.05] transition-all duration-200"
              >
                <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-xs tracking-wide">{s.label}</p>
              </div>
            ))}
          </section>

          {/* ── Selected Projects ── */}
          <section className="mb-20">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-6 font-medium">
              Selected Projects
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="proj-card chip-bg group bg-[#0c0c1b] rounded-2xl p-6 flex flex-col gap-4"
                >
                  {p.thumb && (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-1">
                      <img
                        src={p.thumb}
                        alt={`${p.name} preview`}
                        width={600}
                        height={340}
                        loading="lazy"
                        className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        style={{ aspectRatio: "16/9" }}
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-0.5">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-400 leading-snug">
                        {p.tagline}
                      </p>
                    </div>

                    <span
                      className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap"
                      style={{
                        backgroundColor: `rgba(${p.glow},0.1)`,
                        borderColor: `rgba(${p.glow},0.28)`,
                        color: `rgb(${p.glow})`,
                      }}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t, j) => (
                      <span
                        key={j}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto pt-1">
                    {p.live ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] px-4 py-2 rounded-md font-semibold neon-text-hover transition-all duration-200"
                        style={{
                          backgroundColor: `rgba(${p.glow},0.14)`,
                          borderColor: `rgba(${p.glow},0.28)`,
                          color: `rgb(${p.glow})`,
                          border: `1px solid rgba(${p.glow},0.28)`,
                        }}
                      >
                        Live Demo ↗
                      </a>
                    ) : (
                      <span className="text-xs px-4 py-2 rounded-lg font-medium text-gray-600 bg-white/[0.025] border border-white/[0.05] cursor-default select-none">
                        In Development...
                      </span>
                    )}

                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-4 py-2 rounded-lg font-semibold text-gray-400 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all duration-200"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tech Stack ── */}
          <section className="mb-20">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-6 font-medium">
              Tech Stack
            </p>

            <div className="flex flex-wrap gap-2.5">
              {stack.map((t, i) => (
                <div
                  key={i}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.13] transition-all duration-200 cursor-default"
                >
                  <span className="text-gray-300 text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA Footer ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-1.5 font-medium">
                Currently
              </p>
              <p className="text-white font-semibold">
                Shipped Vish.AI &mdash; deepening Full Stack &amp; AI skills
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Physics Wallah Skills — Full Stack Development Specialization
              </p>
            </div>

            <Link
              href="/projects"
              className="shrink-0 rect-btn bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold neon-text-hover transition-all duration-200 whitespace-nowrap"
            >
              All Projects →
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}