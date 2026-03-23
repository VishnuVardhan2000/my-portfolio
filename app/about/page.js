export default function About() {
  return (
    <main className="min-h-screen px-5 md:px-16 lg:px-32 py-16 md:py-24">
      <div className="max-w-3xl">

        <section className="mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-6">About</p>
          <div className="space-y-5">
            <p className="text-base md:text-lg leading-relaxed text-[#8892A4]">
              Hey, I'm Vardhan — a Full-Stack Developer and Digital Marketer based in Indore, India. I build web applications and help brands grow through content and strategy.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#8892A4]">
              I'm currently sharpening my skills in React, MongoDB and Node.js while working on freelance projects in lead generation, content creation, and web development.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#8892A4]">
              When I'm not coding, you'll find me producing phonk music, watching anime, or experimenting with AI tools.
            </p>
          </div>
        </section>

        <section className="mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-6">Skills</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "JavaScript", "React", "Node.js", "Next.js",
              "HTML & CSS", "Tailwind CSS", "Digital Marketing",
              "Content Creation", "AI Tools", "Git & GitHub",
            ].map((skill) => (
              <span key={skill} className="text-sm text-[#8892A4] py-3 border-b border-[#1E2A3A]">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-6">Beyond Work</p>
          <div className="flex flex-wrap gap-3">
            {[
              "🎵 Music Production", "🎌 Anime", "🎮 Gaming",
              "✍️ Poetry", "🖼️ AI Art", "📱 Content Creation"
            ].map((hobby) => (
              <span key={hobby} className="text-sm bg-[#131929] border border-[#1E2A3A] px-4 py-2 rounded-full text-[#8892A4]">
                {hobby}
              </span>
            ))}
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-6">Get In Touch</p>
          <p className="text-[#8892A4] mb-6 text-base">
            Open to freelance projects, collaborations, and full-time opportunities.
          </p>
          <a
            href="mailto:vardhandoharey@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-3 rounded-lg transition-colors"
          >
            Say Hello →
          </a>
        </section>

      </div>
    </main>
  );
}
