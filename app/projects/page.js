export default function ProjectsPage() {
  const projects = [
    {
      title: "Portfolio Website",
      description:
        "Personal developer portfolio built with Next.js 14 and Tailwind CSS. Features dark theme, responsive design, smooth animations, and deployed on Vercel.",
      tech: ["Next.js", "Tailwind CSS", "Vercel"],
      github: "https://github.com/VishnuVardhan2000/my-portfolio",
      live: "https://my-portfolio-lemon-nine-24.vercel.app",
    },
    {
      title: "VibeBoard — Mood to Aesthetic",
      description:
        "Describe your mood and instantly get a full aesthetic universe — AI-generated color palette, anime match, music vibe, typography & a Hinglish mood quote. Powered by Groq AI + Unsplash.",
      tech: ["Next.js", "Groq AI", "Tailwind CSS", "Unsplash API"],
      github: "https://github.com/VishnuVardhan2000/vibeboard",
      live: "https://vibeboard-woad.vercel.app",
      badge: "Featured",
    },
    {
      title: "TaskFlow — Task Manager App",
      description:
        "Full-stack task management application with user authentication, real-time CRUD operations, priority tagging, and a responsive dashboard UI.",
      tech: ["MongoDB", "Express.js", "Next.js", "Tailwind CSS", "JWT Auth"],
      github: "https://github.com/VishnuVardhan2000/taskflow",
      live: "https://taskflow-sand-gamma.vercel.app",
      badge: "Featured",
    },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6
                       hover:border-blue-500/50 hover:bg-white/10
                       transition-all duration-300 flex flex-col gap-4 relative"
          >
            {project.badge && (
              <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white tracking-wide">
                ⭐ {project.badge}
              </span>
            )}

            <h2 className="text-xl font-bold text-white pr-16">
              {project.title}
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
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
        ))}
      </div>

    </section>
  );
}
