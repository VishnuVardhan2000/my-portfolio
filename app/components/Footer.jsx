import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-32 border-t border-white/10 bg-[#0A0F1E]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 py-20
                      flex flex-col items-center gap-10">

        <p className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}>
          Vardhan Doharey<span className="text-blue-400">.</span>
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <Link href="/"         className="hover:text-white transition">Home</Link>
          <Link href="/about"    className="hover:text-white transition">About</Link>
          <Link href="/projects" className="hover:text-white transition">Projects</Link>
          <Link href="/resume"   className="hover:text-white transition">Resume</Link>
          <Link href="/terminal" className="hover:text-white transition">Terminal</Link>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com/yourusername" target="_blank" rel="noreferrer"
            className="hover:text-white transition px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300">
            GitHub
          </a>
          <a href="https://instagram.com/yourusername" target="_blank" rel="noreferrer"
            className="hover:text-white transition px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300">
            Instagram
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer"
            className="hover:text-white transition px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300">
            LinkedIn
          </a>
        </div>

        <p className="text-xs text-gray-600 pt-6 border-t border-white/5 w-full text-center">
          © 2026 Vardhan Doharey. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
