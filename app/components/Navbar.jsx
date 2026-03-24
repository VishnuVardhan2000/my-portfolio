'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',          label: 'Home',     icon: '🏠' },
  { href: '/about',     label: 'About',    icon: '👤' },
  { href: '/projects',  label: 'Projects', icon: '🚀' },
  { href: '/resume',    label: 'Resume',   icon: '📄' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full px-6 sm:px-10 md:px-16 py-6 flex items-center justify-between
                    bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-50
                    border-b border-white/10">

      {/* Logo */}
      <Link href="/" className="text-xl font-bold tracking-tight text-white"
        style={{ fontFamily: 'var(--font-syne)' }}>
        VD<span className="text-blue-400">.</span>
      </Link>

      {/* App Icon Style Nav Buttons */}
      <div className="flex items-center gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl
                              text-xs font-semibold gap-1 transition-all duration-200
                              shadow-lg select-none
                              ${isActive
                                ? 'bg-blue-600 text-white scale-105 shadow-blue-500/40'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105 hover:text-white'
                              }`}
                style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                <span className="text-lg">{link.icon}</span>
                <span className="hidden sm:block">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
