import { projects } from '../../data/projects';

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="min-h-screen px-5 md:px-16 lg:px-32 py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-[#8892A4]">Project not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 md:px-16 lg:px-32 py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-blue-400 mb-3">{project.category}</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">{project.title}</h1>
        <p className="text-[#8892A4] text-base md:text-lg leading-relaxed mb-10">{project.description}</p>

        <div className="flex flex-wrap gap-3 mb-10">
          {project.tech.map((t) => (
            <span key={t} className="text-sm bg-[#131929] border border-[#1E2A3A] px-4 py-2 rounded-full text-[#8892A4]">
              {t}
            </span>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden border border-[#1E2A3A] aspect-video w-full mb-10">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-3 rounded-lg transition-colors"
        >
          View on GitHub →
        </a>
      </div>
    </main>
  );
}
