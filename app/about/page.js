"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

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

  const glitchTimeout  = useRef(null);
  const glitchCooldown = useRef(false);
  const skillsRef      = useRef(null);
  const handleBoot     = useCallback(() => setBooted(true), []);

  useEffect(() => { setAccent("34,197,94"); }, [setAccent]);

  useEffect(() => {
    const handler = (e) => {
      const { bass, playing } = e.detail;
      setMusicPlaying(playing);
      if (playing && bass > 0.45 && !glitchCooldown.current) {
        glitchCooldown.current = true;
        setGlitching(true);
        clearTimeout(glitchTimeout.current);
        glitchTimeout.current = setTimeout(() => {
          setGlitching(false);
          setTimeout(() => { glitchCooldown.current = false; }, 200);
        }, 80 + bass * 80);
      }
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
        .profile-glitch-wrap { position: relative; display: inline-block; }
        .profile-glitch-wrap.music-on img {
          filter: drop-shadow(2px 0 0 rgba(255,0,80,0.4)) drop-shadow(-2px 0 0 rgba(0,200,255,0.4));
          transition: filter 0.4s ease;
        }
        .profile-glitch-wrap.glitch-hit img {
          animation: glitch-shake 0.14s steps(3) forwards;
          filter: drop-shadow(6px 0 0 rgba(255,0,80,0.95)) drop-shadow(-6px 0 0 rgba(0,200,255,0.95)) brightness(1.25) contrast(1.1);
        }
        .profile-glitch-wrap.glitch-hit::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,0.10) 3px, rgba(0,255,136,0.10) 4px);
          animation: glitch-scan 0.14s steps(2) forwards;
          pointer-events: none; z-index: 2;
        }
        .profile-glitch-wrap.glitch-hit::after {
          content: ""; position: absolute; inset: 0; border-radius: inherit;
          background:
            linear-gradient(transparent 20%, rgba(255,0,80,0.18) 20%, rgba(255,0,80,0.18) 23%, transparent 23%),
            linear-gradient(transparent 55%, rgba(0,200,255,0.18) 55%, rgba(0,200,255,0.18) 59%, transparent 59%),
            linear-gradient(transparent 75%, rgba(0,255,136,0.12) 75%, rgba(0,255,136,0.12) 78%, transparent 78%);
          animation: glitch-bars 0.12s steps(2) forwards;
          pointer-events: none; z-index: 3; mix-blend-mode: screen;
        }
        @keyframes glitch-shake {
          0%   { transform: translate(0) skewX(0deg); }
          15%  { transform: 