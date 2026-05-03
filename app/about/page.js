"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
const { setAccent } = useTheme();
useEffect(() => { setAccent("0,255,136"); }, [setAccent]);
const PLAYER = {
  name: "Vardhan Doharey",
  class: "Full Stack Developer",
  subclass: "AI Enthusiast · Problem Solver",
  level: 22,
  status: "Grinding Side Quests",
  photo: "/profile.jpg",
  bio: "Isekai'd into the digital realm with a mission to build things that matter. Exploring the intersection of AI and full-stack development — one side quest at a time.",
};

const SKILLS = [
  { name: "React / Next.js",         level: 85, xp: "8,500 XP", color: "96,165,250"  },
  { name: "JavaScript / TypeScript", level: 80, xp: "8,000 XP", color: "250,204,21"  },
  { name: "Node.js / Express",       level: 75, xp: "7,500 XP", color: "0,255,136"   },
  { name: "Tailwind CSS",            level: 90, xp: "9,000 XP", color: "34,211,238"  },
  { name: "MongoDB",                 level: 70, xp: "7,000 XP", color: "74,222,128"  },
  { name: "Groq AI / LLM APIs",     level: 72, xp: "7,200 XP", color: "167,139,250" },
];

const EXPERIENCE = [
  {
    company: "Genpact", role: "Process Associate", period: "2023 — 2024",
    desc: "Handled customer operations and process workflows. Leveled up problem-solving and pressure management skills. Left to pursue the dev path full-time.",
    tag: "QUEST COMPLETED", tagColor: "236,72,153",
  },
];

const EDUCATION = [
  {
    degree: "B.Tech — Computer Science (AI / ML)",
    institute: "SAGE University, Indore", period: "2020 — 2024",
    detail: "Specialized in Machine Learning and AI. Built CLI tools, Resume Builders, and first full-stack apps here.",
  },
];

const ACTIVE_QUESTS = [
  { quest: "Mastering System Design",     progress: 40, type: "MAIN QUEST" },
  { quest: "DSA — LeetCode Daily Grind",  progress: 55, type: "MAIN QUEST" },
  { quest: "Building SaaS Products",      progress: 30, type: "SIDE QUEST" },
  { quest: "Open Source Contributions",   progress: 15, type: "SIDE QUEST" },
  { quest: "Learning Three.js / WebGL",   progress: 20, type: "SIDE QUEST" },
];

const BOOT_LINES = [
  "> ISEKAI PROTOCOL ACTIVATED...",
  "> SCANNING DIMENSIONAL FREQUENCY...",
  "> PLAYER DATA FOUND — LOADING...",
  "> SKILL TREE SYNCHRONIZED...",
  "> QUEST LOG INITIALIZED...",
  "> ALL SYSTEMS NOMINAL.",
  "> WELCOME, ADVENTURER. ▌",
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
      style={{ transition: "opacity 0.6s ease", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "all" }}>
      <div className="space-y-2 px-8 max-w-lg w-full">
        {lines.map((line, i) => (
          <p key={i} className="font-mono text-sm"
            style={{ color: i === lines.length - 1 ? "#00ff88" : "rgba(74,222,128,0.75)" }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function RPGFrame({ children, title, accent = "0,255,136" }) {
  const ref = useRef(null);
  const c = `rgba(${accent},`;
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
      className="rpg-frame relative rounded-xl p-6"
      style={{
        "--mx": "-999px", "--my": "-999px", "--mo": "0", "--rpg-accent": accent,
        border: `1px solid ${c}0.2)`, background: `${c}0.02)`,
        boxShadow: `0 0 40px ${c}0.04) inset`,
      }}>
      <span className="absolute top-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderTop: `2px solid ${c}0.8)`, borderLeft: `2px solid ${c}0.8)`, borderRadius: "2px 0 0 0" }} />
      <span className="absolute top-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderTop: `2px solid ${c}0.8)`, borderRight: `2px solid ${c}0.8)`, borderRadius: "0 2px 0 0" }} />
      <span className="absolute bottom-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderBottom: `2px solid ${c}0.8)`, borderLeft: `2px solid ${c}0.8)`, borderRadius: "0 0 0 2px" }} />
      <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
        style={{ borderBottom: `2px solid ${c}0.8)`, borderRight: `2px solid ${c}0.8)`, borderRadius: "0 0 2px 0" }} />
      {title && (
        <div className="absolute -top-3.5 left-6">
          <span className="font-mono text-[11px] font-bold tracking-widest px-3 py-0.5 rounded"
            style={{ color: `rgba(${accent},1)`, background: "#0a0a12", border: `1px solid ${c}0.25)` }}>
            // {title}
          </span>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function XPBar({ skill, animate }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-gray-300">{skill.name}</span>
        <span className="text-xs font-mono" style={{ color: `rgba(${skill.color},0.85)` }}>
          LV.{Math.floor(skill.level / 10)} &nbsp;·&nbsp; {skill.xp}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full"
          style={{
            width: animate ? `${skill.level}%` : "0%",
            background: `linear-gradient(90deg, rgba(${skill.color},0.5), rgba(${skill.color},1))`,
            boxShadow: `0 0 10px rgba(${skill.color},0.55)`,
            transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
          }} />
      </div>
    </div>
  );
}

function QuestBar({ quest }) {
  const isMain = quest.type === "MAIN QUEST";
  const color = isMain ? "0,255,136" : "250,204,21";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-mono text-gray-300">{quest.quest}</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap"
          style={{ color: `rgba(${color},1)`, borderColor: `rgba(${color},0.3)`, background: `rgba(${color},0.08)` }}>
          {quest.type}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full"
          style={{
            width: `${quest.progress}%`,
            background: `linear-gradient(90deg, rgba(${color},0.5), rgba(${color},1))`,
            boxShadow: `0 0 6px rgba(${color},0.4)`,
          }} />
      </div>
      <p className="text-[11px] font-mono text-gray-600">{quest.progress}% complete</p>
    </div>
  );
}

export default function AboutPage() {
  const { setAccent } = useTheme();
  const [booted, setBooted]               = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [musicPlaying, setMusicPlaying]   = useState(false);
  const [glitching, setGlitching]         = useState(false);

  // ── Use a ref for the glitch timeout so it persists ──────────
  const glitchTimeout  = useRef(null);
  const glitchCooldown = useRef(false);   // prevents too-rapid re-triggers
  const skillsRef      = useRef(null);
  const handleBoot     = useCallback(() => setBooted(true), []);

  useEffect(() => { setAccent("34,197,94"); }, [setAccent]);

  // ── Beat listener — persistent glitch while playing ──────────
  useEffect(() => {
    const handler = (e) => {
      const { bass, playing } = e.detail;

      // Always sync playing state
      setMusicPlaying(playing);

      // Only trigger hard glitch on strong beats, with cooldown
      if (playing && bass > 0.45 && !glitchCooldown.current) {
        glitchCooldown.current = true;
        setGlitching(true);

        clearTimeout(glitchTimeout.current);
        // Hold glitch for 80–160ms based on bass intensity
        glitchTimeout.current = setTimeout(() => {
          setGlitching(false);
          // Cooldown: don't re-trigger for 200ms so it feels punchy not spammy
          setTimeout(() => { glitchCooldown.current = false; }, 200);
        }, 80 + bass * 80);
      }

      // Stop everything when music stops
      if (!playing) {
        setGlitching(false);
        glitchCooldown.current = false;
        clearTimeout(glitchTimeout.current);
      }
    };

    window.addEventListener("bgm-beat", handler);
    return () => {
      window.removeEventListener("bgm-beat", handler);
      clearTimeout(glitchTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!booted || !skillsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, [booted]);

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

        .about-name-glow {
          color: #fff;
          transition: text-shadow 0.35s ease, color 0.35s ease;
          cursor: default;
          display: inline-block;
        }
        .about-name-glow:hover {
          color: #6effc0;
          text-shadow:
            0 0 8px rgba(0,255,136,1),
            0 0 20px rgba(0,255,136,0.8),
            0 0 40px rgba(0,255,136,0.5),
            0 0 80px rgba(0,255,136,0.25) !important;
        }

        .rpg-frame { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .rpg-frame:hover { transform: translateY(-2px); }
        .rpg-frame::before {
          content:""; position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:0;
          background: radial-gradient(300px circle at var(--mx) var(--my),
            rgba(var(--rpg-accent),0.07) 0%, transparent 70%);
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        .rpg-frame::after {
          content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
          pointer-events:none; z-index:2;
          background: radial-gradient(220px circle at var(--mx) var(--my),
            rgba(var(--rpg-accent),0.7), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity:var(--mo); transition:opacity 0.4s ease;
        }

        /* ─── GLITCH WRAPPER ──────────────────────────────── */
        .profile-glitch-wrap {
          position: relative;
          display: inline-block;
        }

        /* Subtle RGB split — stays on the whole time music plays */
        .profile-glitch-wrap.music-on img {
          filter:
            drop-shadow(2px 0 0 rgba(255,0,80,0.4))
            drop-shadow(-2px 0 0 rgba(0,200,255,0.4));
          transition: filter 0.4s ease;
        }

        /* Hard glitch on every bass hit */
        .profile-glitch-wrap.glitch-hit img {
          animation: glitch-shake 0.14s steps(3) forwards;
          filter:
            drop-shadow(6px 0 0 rgba(255,0,80,0.95))
            drop-shadow(-6px 0 0 rgba(0,200,255,0.95))
            brightness(1.25) contrast(1.1);
        }

        /* Scanline slice overlay on bass hit */
        .profile-glitch-wrap.glitch-hit::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 3px,
            rgba(0,255,136,0.10) 3px, rgba(0,255,136,0.10) 4px
          );
          animation: glitch-scan 0.14s steps(2) forwards;
          pointer-events: none;
          z-index: 2;
        }

        /* RGB horizontal slice bars on bass hit */
        .profile-glitch-wrap.glitch-hit::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(transparent 20%, rgba(255,0,80,0.18) 20%, rgba(255,0,80,0.18) 23%, transparent 23%),
            linear-gradient(transparent 55%, rgba(0,200,255,0.18) 55%, rgba(0,200,255,0.18) 59%, transparent 59%),
            linear-gradient(transparent 75%, rgba(0,255,136,0.12) 75%, rgba(0,255,136,0.12) 78%, transparent 78%);
          animation: glitch-bars 0.12s steps(2) forwards;
          pointer-events: none;
          z-index: 3;
          mix-blend-mode: screen;
        }

        @keyframes glitch-shake {
          0%   { transform: translate(0) skewX(0deg); }
          15%  { transform: translate(-5px,  1px) skewX(-4deg); }
          30%  { transform: translate( 5px, -1px) skewX( 3deg); }
          50%  { transform: translate(-3px,  2px) skewX(-2deg); }
          70%  { transform: translate( 3px, -1px) skewX( 1deg); }
          85%  { transform: translate(-1px,  0)   skewX(-0.5deg); }
          100% { transform: translate(0) skewX(0deg); }
        }

        @keyframes glitch-scan {
          0%   { transform: translateY(0);   opacity: 1; }
          50%  { transform: translateY(-4px); opacity: 0.7; }
          100% { transform: translateY(0);   opacity: 0; }
        }

        @keyframes glitch-bars {
          0%   { transform: translateX(0);   opacity: 1; }
          33%  { transform: translateX(-6px); opacity: 0.8; }
          66%  { transform: translateX( 4px); opacity: 0.6; }
          100% { transform: translateX(0);   opacity: 0; }
        }

        /* Border pulse while music plays */
        @keyframes border-pulse {
          0%,100% { box-shadow: 0 0 28px rgba(0,255,136,0.12); }
          50%      { box-shadow: 0 0 42px rgba(0,255,136,0.38), 0 0 64px rgba(168,85,247,0.18); }
        }
        .profile-glitch-wrap.music-on .profile-img-border {
          animation: border-pulse 0.85s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] bg-green-900/[0.06] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-emerald-900/[0.05] rounded-full blur-[160px] pointer-events-none" />

      <section className="max-w-4xl mx-auto px-4 pt-8 pb-24 space-y-10"
        style={{ opacity: booted ? 1 : 0, transition: "opacity 0.8s ease" }}>

        {/* HERO */}
        <RPGFrame title="PLAYER_DATA.EXE" accent="0,255,136">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start pt-3">

            {/* Profile image — glitch wrapper */}
            <div className={`profile-glitch-wrap flex-shrink-0 ${musicPlaying ? "music-on" : ""} ${glitching ? "glitch-hit" : ""}`}>
              <div className="profile-img-border w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden"
                style={{
                  border: `2px solid rgba(0,255,136,${musicPlaying ? 0.65 : 0.35})`,
                  boxShadow: "0 0 28px rgba(0,255,136,0.12)",
                  transition: "border-color 0.3s ease",
                }}>
                <img src={PLAYER.photo} alt={PLAYER.name} className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.parentNode.innerHTML =
                      `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,255,136,0.05);font-size:2.5rem">⚔️</div>`;
                  }} />
              </div>

              {/* Status badge */}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  background: musicPlaying ? "rgba(168,85,247,0.2)" : "rgba(0,255,136,0.15)",
                  color: musicPlaying ? "#c084fc" : "#00ff88",
                  border: `1px solid ${musicPlaying ? "rgba(168,85,247,0.4)" : "rgba(0,255,136,0.3)"}`,
                  transition: "all 0.4s ease",
                }}>
                {musicPlaying ? "♫ VIBING" : "● ONLINE"}
              </span>
            </div>

            <div className="flex-1 space-y-3 font-mono text-sm">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-green-500/60 uppercase mb-1">&gt; IDENTITY CONFIRMED</p>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ letterSpacing: "0.04em" }}>
                  <span className="about-name-glow">{PLAYER.name}</span>
                </h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {[
                  ["CLASS",    PLAYER.class,           "text-green-400"],
                  ["SUBCLASS", PLAYER.subclass,        "text-blue-400"],
                  ["LEVEL",    PLAYER.level,           "text-yellow-400"],
                  ["STATUS",   PLAYER.status + " ▌",  "text-pink-400"],
                ].map(([key, val, cls]) => (
                  <p key={key}>
                    <span className="text-green-400/60">{key}</span>
                    <span className="text-gray-500"> : </span>
                    <span className={cls}>{val}</span>
                  </p>
                ))}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed pt-2 border-t border-white/5">{PLAYER.bio}</p>
            </div>
          </div>
        </RPGFrame>

        {/* SKILL TREE */}
        <div ref={skillsRef}>
          <RPGFrame title="SKILL_TREE.DAT" accent="96,165,250">
            <div className="space-y-5 pt-3">
              <p className="font-mono text-[11px] text-blue-400/60 tracking-widest">&gt; LOADING ATTRIBUTES...</p>
              {SKILLS.map((s, i) => <XPBar key={i} skill={s} animate={skillsVisible} />)}
            </div>
          </RPGFrame>
        </div>

        {/* QUEST LOG */}
        <RPGFrame title="QUEST_LOG.TXT" accent="236,72,153">
          <div className="space-y-5 pt-3">
            <p className="font-mono text-[11px] text-pink-400/60 tracking-widest">&gt; READING COMPLETED QUESTS...</p>
            {EXPERIENCE.map((q, i) => (
              <div key={i} className="space-y-2 font-mono text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-white font-semibold">{q.role}</p>
                    <p className="text-pink-400/70 text-xs">&gt; {q.company} · {q.period}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded border whitespace-nowrap"
                    style={{ color: `rgba(${q.tagColor},1)`, borderColor: `rgba(${q.tagColor},0.3)`, background: `rgba(${q.tagColor},0.08)` }}>
                    ✓ {q.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{q.desc}</p>
              </div>
            ))}
          </div>
        </RPGFrame>

        {/* ORIGIN STORY */}
        <RPGFrame title="ORIGIN_STORY.LOG" accent="167,139,250">
          <div className="space-y-4 pt-3 font-mono text-sm">
            <p className="text-[11px] text-purple-400/60 tracking-widest">&gt; READING BACKSTORY...</p>
            {EDUCATION.map((o, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-white font-semibold">{o.degree}</p>
                <p className="text-purple-400/70 text-xs">&gt; {o.institute} · {o.period}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{o.detail}</p>
              </div>
            ))}
          </div>
        </RPGFrame>

        {/* ACTIVE QUESTS */}
        <RPGFrame title="ACTIVE_QUESTS.EXE" accent="74,222,128">
          <div className="space-y-5 pt-3">
            <p className="font-mono text-[11px] text-green-400/60 tracking-widest">&gt; FETCHING CURRENT OBJECTIVES...</p>
            {ACTIVE_QUESTS.map((q, i) => <QuestBar key={i} quest={q} />)}
          </div>
        </RPGFrame>

      </section>
    </>
  );
}