"use client";
import { useRef, useCallback } from "react";

const projects = [
  {
    title: "Portfolio Website",
    description:
      "Personal developer portfolio built with Next.js 14 and Tailwind CSS. Features dark theme, responsive design, smooth animations, and deployed on Vercel.",
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    github: "https://github.com/VishnuVardhan2000/my-portfolio",
    live: "https://my-portfolio-lemon-nine-24.vercel.app",
    glow: "99,102,241",
  },
  {
    title: "VibeBoard — Mood to Aesthetic",
    description:
      "Describe your mood and instantly get a full aesthetic universe — AI-generated color palette, anime match, music vibe, typography & a Hinglish mood quote. Powered by Groq AI + Unsplash.",
    tech: ["Next.js", "Groq AI", "Tailwind CSS", "Unsplash API"],
    github: "https://github.com/VishnuVardhan2000/vibeboard",
    live: "https://vibeboard-woad.vercel.app",
    badge: "Featured",
    glow: "236,72,153",
  },
  {
    title: "TaskFlow — Task Manager App",
    description:
      "Full-stack task management application with user authentication, real-time CRUD operations, priority tagging, and a responsive dashboard UI.",
    tech: ["MongoDB", "Express.js", "Next.js", "Tailwind CSS", "JWT Auth"],
    github: "https://github.com/VishnuVardhan2000/taskflow",
    live: "https://taskflow-sand-gamma.vercel.app",
    badge: "Featured",
    glow: "34,211,238",
  },
  {
    title: "Vish.AI — Resume Analyzer",
    description:
      "AI-powered resume analyzer — paste your resume or upload a PDF and get an ATS score, section breakdown, keyword gaps, and actionable suggestions. Powered by Groq Llama 3.3 70B.",
    tech: ["Next.js", "Groq AI", "React", "Node.js"],
    github: "https://github.com/VishnuVardhan2000/my-portfolio",
    live: "https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
    badge: "Featured",
    glow: "74,222,128",
  },
];

function ProjectCard({ project }) {
  const wrapperRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    el.style.setProperty("--rx", `${rotateX}deg`);
    el.style.setProperty("--ry", `${rotateY}deg`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-999px");
    el.style.setProperty("--my", "-999px");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="spotlight-wrapper"
      style={{
        "--glow": project.glow || "96,165,250",
        "--mx": "-999px",
        "--my": "-999px",
        "--rx": "0deg",
        "--ry": "0deg",
      }}
    >
      <div className="spotlight-card">
        <div className="spotlight-inner" />

        {project.badge && (
          <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white tracking-wide z-10">
            ⭐ {project.badge}
          </span>
        )}

        <h2 className="text-xl font-bold text-white pr-16 relative z-10">
          {project.title}
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed flex-1 relative z-10">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 relative z-10">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3 pt-2 relative z-10">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            GitHub
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Live ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 pb-20">
      <div className="mb-14 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          My Projects
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          A collection of things I&apos;ve built — from web apps to freelance work.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 pb-10 justify-center">
        {projects.map((project, index) => (
          <div key={index} style={{ width: "clamp(300px, 30%, 380px)" }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}