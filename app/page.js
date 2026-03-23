import Link from 'next/link';
import { projects } from './data/projects';

export default function Home() {
  return (
    <main className="min-h-screen px-5 md:px-16 lg:px-32 py-16 md:py-24">
      <section className="mb-20 md:mb-28">
        <p className="text-xs uppercase tracking-widest text-blue-400 mb-4">Vardhan Doharey</p>
        <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-tight mb-6 text-white">
          Vishnu Vardhan
        </h1>
        <p className="text-[#8892A4] text-base md:text-xl max-w-2xl leading-relaxed">
          Full-Stack Developer & Digital Marketer based in Indore. I build clean web experiences and create content that connects.
        </p>
      </section>

      <section>
        <p className="text-xs uppercase tracking-widest text-blue-400 mb-8">Selected Work</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group block cursor-pointer"
            >
              <div className="overflow-hidden bg-[#131929] aspect-video w-full mb-4 rounded-lg border border-[#1E2A3A]">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">{project.category}</p>
              <h2 className="text-base md:text-lg font-medium text-white group-hover:text-blue-300 transition-colors">{project.title}</h2>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
