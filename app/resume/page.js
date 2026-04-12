"use client";
import { useState } from "react";

export default function Resume() {
  const [activeSection, setActiveSection] = useState("experience");

  const sections = ["experience", "projects", "skills", "education"];

  return (
    <main className="min-h-screen bg-[#0a0a12] text-white px-4 md:px-8 py-12">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .card-hover {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 8px 32px rgba(96,165,250,0.08);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="fade-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">Resume</p>
            <h1 className="text-3xl md:text-4xl font-black text-white">Vardhan Doharey</h1>
            <p className="text-gray-400 mt-1">Full Stack Developer · AI Enthusiast · Lucknow</p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
              <span>📧 vardhandoharey@gmail.com</span>
              <span>📞 7524940380</span>
              <a href="https://linkedin.com/in/vardhan-doharey-zomb" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition">LinkedIn ↗</a>
              <a href="https://github.com/VishnuVardhan2000" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition">GitHub ↗</a>
            </div>
          </div>
          <a
            href="/resume.pdf"
            download
            className="shrink-0 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30"
          >
            Download PDF ↓
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="fade-up flex gap-2 mb-8 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-1.5 w-fit">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl capitalize transition-all duration-200 ${
                activeSection === s
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Experience */}
        {activeSection === "experience" && (
          <div className="flex flex-col gap-4 fade-up">
            {[
              {
                role: "Senior Process Associate",
                company: "Genpact",
                period: "Aug 2023 – Jun 2025",
                location: "Hyderabad, Telangana",
                points: [
                  "Managed 100+ monthly customer interactions with 95% resolution rate",
                  "Reduced task resolution time by 20% through process improvements",
                  "Mentored junior team members on CRM best practices",
                  "Collaborated across departments to ensure smooth operations",
                ],
              },
              {
                role: "Freelance Lead Generation Specialist",
                company: "Self-Employed",
                period: "Apr 2023 – Jun 2023",
                location: "Bhubaneswar, Odisha",
                points: [
                  "Executed lead generation and product marketing campaigns for small businesses",
                  "Developed targeted strategies to increase client visibility",
                ],
              },
              {
                role: "Full Stack Development Specialization",
                company: "Physics Wallah Skills",
                period: "2023 – Present",
                location: "Remote",
                points: [
                  "Shipped Vish.AI — AI resume analyzer powered by Groq Llama 3.3 70B",
                  "Built VibeBoard — AI mood-to-aesthetic web app with Groq AI + Unsplash",
                  "Deepening expertise in React, Next.js, Node.js, MongoDB, and AI integration",
                ],
              },
            ].map((exp, i) => (
              <div key={i} className="card-hover bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{exp.role}</h3>
                    <p className="text-blue-400 text-sm font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-400 text-xs">{exp.period}</p>
                    <p className="text-gray-600 text-xs">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {exp.points.map((p, j) => (
                    <li key={j} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-blue-400 mt-0.5 shrink-0">▸</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeSection === "projects" && (
          <div className="flex flex-col gap-4 fade-up">
            {[
              {
                name: "Vish.AI — Resume Analyzer",
                tech: "Next.js · Groq AI · React · Node.js · Tailwind CSS",
                live: "https://my-portfolio-lemon-nine-24.vercel.app/vish-ai",
                github: "https://github.com/VishnuVardhan2000/my-portfolio",
                points: [
                  "AI resume analyzer with ATS scoring, keyword gap analysis, and actionable suggestions",
                  "Integrated Groq Llama 3.3 70B via custom Next.js API route — sub-3s response times",
                  "PDF upload with pdf.js drag-and-drop extraction, deployed on Vercel",
                ],
              },
              {
                name: "VibeBoard — Mood to Aesthetic Universe",
                tech: "Next.js · Groq AI · Tailwind CSS · Unsplash API",
                live: "https://vibeboard-woad.vercel.app",
                github: "https://github.com/VishnuVardhan2000/vibeboard",
                points: [
                  "Generates color palettes, anime matches, music vibes & Hinglish mood quotes from one input",
                  "Groq AI for content generation + Unsplash API for dynamic aesthetic imagery",
                  "Fully responsive dark UI with smooth animations, deployed live on Vercel",
                ],
              },
              {
                name: "Portfolio Website",
                tech: "Next.js 16 · Tailwind CSS · Vercel",
                live: "https://my-portfolio-lemon-nine-24.vercel.app",
                github: "https://github.com/VishnuVardhan2000/my-portfolio",
                points: [
                  "Personal developer portfolio with dark theme, neon effects, and responsive design",
                  "Features project showcase with live previews and integrated Vish.AI resume analyzer",
                ],
              },
              {
                name: "CLI Task Manager",
                tech: "Node.js · inquirer.js",
                github: "https://github.com/VishnuVardhan2000",
                points: [
                  "Interactive CLI app for task CRUD with persistent JSON storage",
                  "Handles 100+ tasks with async file I/O and zero data loss",
                ],
              },
            ].map((proj, i) => (
              <div key={i} className="card-hover bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">{proj.name}</h3>
                    <p className="text-blue-400/70 text-xs mt-0.5">{proj.tech}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noreferrer"
                        className="text-xs px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition">
                        Live ↗
                      </a>
                    )}
                    <a href={proj.github} target="_blank" rel="noreferrer"
                      className="text-xs px-3 py-1 rounded-lg bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:bg-white/[0.1] transition">
                      GitHub
                    </a>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {proj.points.map((p, j) => (
                    <li key={j} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-blue-400 mt-0.5 shrink-0">▸</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeSection === "skills" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-up">
            {[
              { category: "Frontend", skills: ["React.js", "Next.js 16", "Tailwind CSS", "HTML5", "CSS3"] },
              { category: "Backend", skills: ["Node.js", "Express.js", "REST APIs", "MongoDB"] },
              { category: "AI & APIs", skills: ["Groq AI", "Llama 3.3 70B", "Unsplash API", "pdf.js"] },
              { category: "Tools", skills: ["Git", "GitHub", "VS Code", "Vercel", "npm"] },
              { category: "Languages", skills: ["JavaScript (ES6+)", "HTML5", "CSS3"] },
              { category: "Soft Skills", skills: ["Problem Solving", "Communication", "Mentoring", "Adaptability"] },
            ].map((group, i) => (
              <div key={i} className="card-hover bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-blue-400 mb-3 font-medium">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, j) => (
                    <span key={j} className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeSection === "education" && (
          <div className="flex flex-col gap-4 fade-up">
            {[
              {
                degree: "B.Tech — Computer Science (ML & AI)",
                school: "Kalam Institute of Technology",
                location: "Brahmapur",
                year: "Graduated Oct 2022",
              },
              {
                degree: "Higher Secondary Certificate",
                school: "Government Model Higher Secondary School",
                location: "Kerala",
                year: "2017 – 2018",
              },
            ].map((edu, i) => (
              <div key={i} className="card-hover bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <h3 className="text-white font-bold text-lg">{edu.degree}</h3>
                  <p className="text-blue-400 text-sm">{edu.school}</p>
                  <p className="text-gray-600 text-xs mt-1">{edu.location}</p>
                </div>
                <p className="text-gray-400 text-xs shrink-0">{edu.year}</p>
              </div>
            ))}

            <div className="card-hover bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-blue-400 mb-4 font-medium">Certifications</p>
              <div className="flex flex-col gap-2">
                {[
                  "Artificial Intelligence Workshop",
                  "Machine Learning and Ongoing Pattern Engineering — 03/2020",
                  "The Fundamentals of Digital Marketing — Google, 03/2023",
                ].map((cert, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-blue-400 shrink-0">▸</span>{cert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}