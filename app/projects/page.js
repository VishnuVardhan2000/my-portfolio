export default function ProjectsPage() {
  const projects = [
    {
      title: "Portfolio Website",
      description: "Personal developer portfolio built with Next.js 14 and Tailwind CSS. Features dark theme, responsive design, smooth animations, and deployed on Vercel.",
      tech: ["Next.js", "Tailwind CSS", "Vercel"],
      github: "https://github.com/VishnuVardhan2000/my-portfolio",
      live: "https://my-portfolio-lemon-nine-24.vercel.app",
    },
    {
      title: "YOUR REAL PROJECT",         // ← Replace this
      description: "Add your description here.",  // ← Replace this
      tech: ["React", "Node.js"],         // ← Replace with real tech
      github: "YOUR_GITHUB_LINK_1",       // ← Replace
      live: "#",
    },
    {
  title: "TaskFlow — Task Manager App",
  description: "Full-stack task management application with user authentication, real-time CRUD operations, priority tagging, and a responsive dashboard UI.",
  tech: ["MongoDB", "Express.js", "Next.js", "Tailwind CSS", "JWT Auth"],
  github: "https://github.com/VishnuVardhan2000/taskflow",
  live: "https://taskflow-sand-gamma.vercel.app",
  badge: "Featured"
},

  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">

      <div className="mb-14 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-syne)' }}>
          My Projects
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          A collection of things I've built — from web apps to freelance work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {projects.map((project, index) => (
          <div key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6
                       hover:border-blue-500/50 hover:bg-white/10
                       transition-all duration-300 flex flex-col gap-4 relative">

            {/* Featured Badge */}
            {project.badge && (
              <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full
                               bg-blue-600 text-white font-semibold">
                ⭐ {project.badge}
              </span>
            )}

            <h2 className="text-xl font-bold text-white pr-16"
              style={{ fontFamily: 'var(--font-syne)' }}>
              {project.title}
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed flex-1"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span key={i}
                  className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <a href={project.github} target="_blank" rel="noreferrer"
                className="flex-1 text-center text-sm py-2 rounded-xl
                           bg-white/10 text-white hover:bg-white/20 transition">
                GitHub
              </a>
              <a href={project.live} target="_blank" rel="noreferrer"
                className="flex-1 text-center text-sm py-2 rounded-xl
                           bg-blue-600 text-white hover:bg-blue-500 transition">
                Live ↗
              </a>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
