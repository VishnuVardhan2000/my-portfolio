"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../context/ThemeContext"; // ← ADDED

const BOOT_LINES = [
  "> ACCESSING SECURE VAULT...",
  "> DECRYPTING CAREER DATA...",
  "> LOADING SKILL MANIFEST...",
  "> EXPERIENCE LOG: FOUND ✦",
  "> CREDENTIALS VERIFIED — GOLD TIER 🏆",
  "> RESUME READY. ▌",
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
            style={{ color: i === lines.length - 1 ? "#fbbf24" : "rgba(251,191,36,0.75)" }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function GoldCard({ children, className = "" }) {
  const ref = useRef(null);
  const g = "251,191,36";

  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--mo", "1");
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--mx", "-999px");
    el.style.setProperty("--my", "-999px");
    el.style.setProperty("--mo", "0");
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`gold-card ${className}`}
      style={{
        "--mx":"-999px","--my":"-999px","--mo":"0",
        border:`1px solid rgba(${g},0.18)`,
        background:`rgba(${g},0.025)`,
        boxShadow:`0 0 40px rgba(${g},0.04) inset`,
      }}>
      <span className="absolute top-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderTop:`2px solid rgba(${g},0.8)`, borderLeft:`2px solid rgba(${g},0.8)`, borderRadius:"2px 0 0 0" }} />
      <span className="absolute top-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderTop:`2px solid rgba(${g},0.8)`, borderRight:`2px solid rgba(${g},0.8)`, borderRadius:"0 2px 0 0" }} />
      <span className="absolute bottom-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderBottom:`2px solid rgba(${g},0.8)`, borderLeft:`2px solid rgba(${g},0.8)`, borderRadius:"0 0 0 2px" }} />
      <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderBottom:`2px solid rgba(${g},0.8)`, borderRight:`2px solid rgba(${g},0.8)`, borderRadius:"0 0 2px 0" }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Resume() {
  const { setAccent } = useTheme(); // ← ADDED
  const [booted, setBooted] = useState(false);
  const [activeSection, setActiveSection] = useState("experience");
  const handleBoot = useCallback(() => setBooted(true), []);
  const sections = ["experience", "projects", "skills", "education"];

  // ← ADDED — set gold on mount
  useEffect(() => { setAccent("234,179,8"); }, [setAccent]);

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
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .resume-name-glow {
          text-shadow: none;
          transition: text-shadow 0.35s ease, color 0.35s ease;
          cursor: default;
          color: #fff;
        }
        .resume-name-glow:hover {
          color: #fde68a;
          text-shadow:
            0 0 8px rgba(251,191,36,1),
            0 0 20px rgba(251,191,36,0.8),
            0 0 40px rgba(251,191,36,0.5),
            0 0 80px rgba(251,191,36,0.25) !important;
        }
        .gold-card {
          position: relative;
          border-radius: 1rem;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.3s ease;
          overflow: visible;
        }
        .gold-card:hover {
          transform: translateY(-3px);
          border-color: rgba(251,191,36,0.4) !important;
          box-shadow: 0 8px 32px rgba(251,191,36,0.1);
        }
        .gold-card::before {
          content:""; position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:0;
          background: radial-gradient(300px circle at var(--mx) var(--my),
            rgba(251,191,36,0.07) 0%, transparent 70%);
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        .gold-card::after {
          content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
          pointer-events:none; z-index:2;
          background: radial-gradient(220px circle at var(--mx) var(--my),
            rgba(251,191,36,0.75), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .blink { animation: blink 2.2s ease-in-out infinite; }
      `}</style>

      <main className="min-h-screen bg-[#0a0a12] text-white px-4 md:px-8 py-12"
        style={{ opacity: booted ? 1 : 0, transition:"opacity 0.8s ease" }}>

        <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-yellow-700/[0.06] rounded-full blur-[180px] pointer-events-none" />
        <div className="fixed bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-yellow-900/[0.05] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Header */}
          <div className="fade-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-yellow-400 mb-2">
                &gt; RESUME_DATA.EXE
              </p>
              <h1 className="text-3xl md:text-4xl font-black font-mono resume-name-glow">
                Vardhan Doharey
              </h1>
              <p className="text-gray-400 mt-1 font-mono text-sm">
                Full Stack Developer · AI Enthusiast · Lucknow
              </p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 font-mono">
                <span>📧 vardhandoharey@gmail.com</span>
                <span>📞 7524940380</span>
                <a href="https://linkedin.com/in/vardhan-doharey-zomb" target="_blank" rel="noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 transition">LinkedIn ↗</a>
                <a href="https://github.com/VishnuVardhan2000" target="_blank" rel="noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 transition">GitHub ↗</a>
              </div>
            </div>
            <a href="/resume.pdf" download
              className="shrink-0 text-xs font-semibold font-mono px-5 py-2.5 rounded-xl transition-all duration-200"
              style={{ background:"rgba(251,191,36,0.15)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.3)" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(251,191,36,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(251,191,36,0.15)"}>
              Download PDF ↓
            </a>
          </div>

          {/* Tabs */}
          <div className="fade-up flex gap-2 mb-8 bg-white/[0.03] border border-yellow-500/[0.12] rounded-2xl p-1.5 w-fit">
            {sections.map((s) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="text-xs font-semibold px-4 py-2 rounded-xl capitalize transition-all duration-200 font-mono"
                style={activeSection === s ? {
                  background:"rgba(251,191,36,0.2)", color:"#fbbf24",
                  border:"1px solid rgba(251,191,36,0.35)",
                  boxShadow:"0 0 14px rgba(251,191,36,0.12)",
                } : { color:"rgba(156,163,175,1)", border:"1px solid transparent" }}
                onMouseEnter={e => { if (activeSection !== s) e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e => { if (activeSection !== s) e.currentTarget.style.color="rgba(156,163,175,1)"; }}>
                &gt; {s}
              </button>
            ))}
          </div>

          {/* Experience */}
          {activeSection === "experience" && (
            <div className="flex flex-col gap-4 fade-up">
              {[
                {
                  role:"Senior Process Associate", company:"Genpact",
                  period:"Aug 2023 – Jun 2025", location:"Hyderabad, Telangana",
                  points:["Managed 100+ monthly customer interactions with 95% resolution rate","Reduced task resolution time by 20% through process improvements","Mentored junior team members on CRM best practices","Collaborated across departments to ensure smooth operations"],
                },
                {
                  role:"Freelance Lead Generation Specialist", company:"Self-Employed",
                  period:"Apr 2023 – Jun 2023", location:"Bhubaneswar, Odisha",
                  points:["Executed lead generation and product marketing campaigns for small businesses","Developed targeted strategies to increase client visibility"],
                },
                {
                  role:"Full Stack Development Specialization", company:"Physics Wallah Skills",
                  period:"2023 – Present", location:"Remote",
                  points:["Shipped Vish.AI — AI resume analyzer powered by Groq Llama 3.3 70B","Built VibeBoard — AI mood-to-aesthetic web app with Groq AI + Unsplash","Deepening expertise in React, Next.js, Node.js, MongoDB, and AI integration"],
                },
              ].map((exp, i) => (
                <GoldCard key={i} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg font-mono">{exp.role}</h3>
                      <p className="text-yellow-400 text-sm font-medium font-mono">{exp.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-400 text-xs font-mono">{exp.period}</p>
                      <p className="text-gray-600 text-xs font-mono">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.points.map((p, j) => (
                      <li key={j} className="text-gray-400 text-sm flex gap-2 font-mono">
                        <span className="text-yellow-400 mt-0.5 shrink-0">▸</span>{p}
                      </li>
                    ))}
                  </ul>
                </GoldCard>
              ))}
            </div>
          )}

          {/* Projects */}
          {activeSection === "projects" && (
            <div className="flex flex-col gap-4 fade-up">
              {[
                {
                  name:"Vish.AI — Resume Analyzer",
                  tech:"Next.js · Groq AI · React · Node.js · Tailwind CSS",
                  live:"https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
                  github:"https://github.com/VishnuVardhan2000/my-portfolio",
                  points:["AI resume analyzer with ATS scoring, keyword gap analysis, and actionable suggestions","Integrated Groq Llama 3.3 70B via custom Next.js API route — sub-3s response times","PDF upload with pdf.js drag-and-drop extraction, deployed on Vercel"],
                },
                {
                  name:"VibeBoard — Mood to Aesthetic Universe",
                  tech:"Next.js · Groq AI · Tailwind CSS · Unsplash API",
                  live:"https://vibeboard-woad.vercel.app",
                  github:"https://github.com/VishnuVardhan2000/vibeboard",
                  points:["Generates color palettes, anime matches, music vibes & Hinglish mood quotes from one input","Groq AI for content generation + Unsplash API for dynamic aesthetic imagery","Fully responsive dark UI with smooth animations, deployed live on Vercel"],
                },
                {
                  name:"Portfolio Website",
                  tech:"Next.js 16 · Tailwind CSS · Vercel",
                  live:"https://my-portfolio-lemon-nine-24.vercel.app",
                  github:"https://github.com/VishnuVardhan2000/my-portfolio",
                  points:["Personal developer portfolio with dark theme, neon effects, and responsive design","Features project showcase with live previews and integrated Vish.AI resume analyzer"],
                },
                {
                  name:"CLI Task Manager", tech:"Node.js · inquirer.js",
                  github:"https://github.com/VishnuVardhan2000",
                  points:["Interactive CLI app for task CRUD with persistent JSON storage","Handles 100+ tasks with async file I/O and zero data loss"],
                },
              ].map((proj, i) => (
                <GoldCard key={i} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg font-mono">{proj.name}</h3>
                      <p className="text-yellow-400/70 text-xs mt-0.5 font-mono">{proj.tech}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {proj.live && (
                        <a href={proj.live} target="_blank" rel="noreferrer"
                          className="text-xs px-3 py-1 rounded-lg font-mono transition"
                          style={{ background:"rgba(251,191,36,0.1)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.25)" }}
                          onMouseEnter={e => e.currentTarget.style.background="rgba(251,191,36,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background="rgba(251,191,36,0.1)"}>
                          Live ↗
                        </a>
                      )}
                      <a href={proj.github} target="_blank" rel="noreferrer"
                        className="text-xs px-3 py-1 rounded-lg bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:bg-white/[0.1] transition font-mono">
                        GitHub
                      </a>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {proj.points.map((p, j) => (
                      <li key={j} className="text-gray-400 text-sm flex gap-2 font-mono">
                        <span className="text-yellow-400 mt-0.5 shrink-0">▸</span>{p}
                      </li>
                    ))}
                  </ul>
                </GoldCard>
              ))}
            </div>
          )}

          {/* Skills */}
          {activeSection === "skills" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-up">
              {[
                { category:"Frontend",    skills:["React.js","Next.js 16","Tailwind CSS","HTML5","CSS3"] },
                { category:"Backend",     skills:["Node.js","Express.js","REST APIs","MongoDB"] },
                { category:"AI & APIs",   skills:["Groq AI","Llama 3.3 70B","Unsplash API","pdf.js"] },
                { category:"Tools",       skills:["Git","GitHub","VS Code","Vercel","npm"] },
                { category:"Languages",   skills:["JavaScript (ES6+)","HTML5","CSS3"] },
                { category:"Soft Skills", skills:["Problem Solving","Communication","Mentoring","Adaptability"] },
              ].map((group, i) => (
                <GoldCard key={i} className="p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-yellow-400 mb-3">
                    &gt; {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, j) => (
                      <span key={j} className="text-xs px-3 py-1.5 rounded-xl font-mono"
                        style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.15)", color:"rgba(209,213,219,1)" }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </GoldCard>
              ))}
            </div>
          )}

          {/* Education */}
          {activeSection === "education" && (
            <div className="flex flex-col gap-4 fade-up">
              {[
                { degree:"B.Tech — Computer Science (ML & AI)", school:"Kalam Institute of Technology", location:"Brahmapur", year:"Graduated Oct 2022" },
                { degree:"Higher Secondary Certificate", school:"Government Model Higher Secondary School", location:"Kerala", year:"2017 – 2018" },
              ].map((edu, i) => (
                <GoldCard key={i} className="p-6 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <h3 className="text-white font-bold text-lg font-mono">{edu.degree}</h3>
                    <p className="text-yellow-400 text-sm font-mono">{edu.school}</p>
                    <p className="text-gray-600 text-xs mt-1 font-mono">{edu.location}</p>
                  </div>
                  <p className="text-gray-400 text-xs shrink-0 font-mono">{edu.year}</p>
                </GoldCard>
              ))}
              <GoldCard className="p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-yellow-400 mb-4">
                  &gt; CERTIFICATIONS.LOG
                </p>
                <div className="flex flex-col gap-2">
                  {["Artificial Intelligence Workshop","Machine Learning and Ongoing Pattern Engineering — 03/2020","The Fundamentals of Digital Marketing — Google, 03/2023"].map((cert, i) => (
                    <div key={i} className="flex gap-2 text-sm text-gray-400 font-mono">
                      <span className="text-yellow-400 shrink-0">▸</span>{cert}
                    </div>
                  ))}
                </div>
              </GoldCard>
            </div>
          )}

        </div>
      </main>
    </>
  );
}