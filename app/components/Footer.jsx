import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-white/10 bg-[#0A0F1E]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 py-14 
                      flex flex-col items-center gap-8">

        {/* Name */}
        <p className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}>
          Vardhan Doharey<span className="text-blue-400">.</span>
        </p>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <Link href="/"         className="hover:text-white transition">Home</Link>
          <Link href="/about"    className="hover:text-white transition">About</Link>
          <Link href="/projects" className="hover:text-white transition">Projects</Link>
          <Link href="/resume"   className="hover:text-white transition">Resume</Link>
        </div>

        {/* Social Links - names for now, will swap for logos next */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="https://github.com/yourusername" target="_blank" rel="noreferrer"
            className="hover:text-white transition px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
            GitHub
          </a>
          <a href="https://instagram.com/yourusername" target="_blank" rel="noreferrer"
            className="hover:text-white transition px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
            Instagram
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer"
            className="hover:text-white transition px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
            LinkedIn
          </a>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-gray-600 pt-4 border-t border-white/5 w-full text-center">
          © 2026 Vardhan Doharey. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
