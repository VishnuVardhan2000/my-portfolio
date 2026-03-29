export default function About() {
  return (
    <div className="min-h-screen px-5 md:px-16 lg:px-32 pb-20">
      <div className="max-w-3xl pt-10">

        <section className="mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-6">About</p>

          <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
            <div className="shrink-0">
              <img
                src="/vardhan.jpg"
                alt="Vardhan Doharey"
                width={120}
                height={120}
                className="rounded-2xl object-cover object-center border border-white/[0.08]"
                style={{ width: 120, height: 120 }}
              />
            </div>
            <div className="pt-1">
              <h1 className="text-2xl font-bold text-white mb-1">Vardhan Doharey</h1>
              <p className="text-sm text-blue-400 mb-3">Full Stack Developer · Digital Marketer</p>
              <p className="text-sm text-[#8892A4] leading-relaxed">
                Based in Lucknow, India — building web apps and helping brands grow.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-base md:text-lg leading-relaxed text-[#8892A4]">
              Hey, I&apos;m Vardhan — a Full-Stack Developer and Digital Marketer. I build web applications and help brands grow through content and strategy.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#8892A4]">
              I&apos;m currently sharpening my skills in React, MongoDB and Node.js while working on freelance projects in lead generation, content creation, and web development.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#8892A4]">
              When I&apos;m not coding, you&apos;ll find me producing phonk music, watching anime, or experimenting with AI tools.
            </p>
          </div>
        </section>

        <section className="mb-16 md:mb-20">
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

        <section className="mb-16 md:mb-20">
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

        <section className="pb-16">
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-6">Get In Touch</p>
          <p className="text-[#8892A4] mb-6 text-base">
            Open to freelance projects, collaborations, and full-time opportunities.
          </p>
          <a
            href="mailto:vardhandoharey@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200"
          >
            Say Hello →
          </a>
        </section>

      </div>
    </div>
  );
}
