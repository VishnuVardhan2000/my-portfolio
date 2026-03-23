import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-5 md:px-16 lg:px-32 py-5 border-b border-[#1E2A3A]">
      <Link href="/" className="text-sm font-medium tracking-tight text-white hover:text-blue-400 transition-colors">
        Vardhan Doharey
      </Link>
      <div className="flex gap-5 md:gap-8">
        <Link href="/about" className="text-sm text-[#8892A4] hover:text-blue-400 transition-colors">
          About
        </Link>
        <Link href="/resume" className="text-sm text-[#8892A4] hover:text-blue-400 transition-colors">
          Resume
        </Link>
      </div>
    </nav>
  );
}
