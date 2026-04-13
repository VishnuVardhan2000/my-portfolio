import "./globals.css";
import Navbar from "./components/Navbar.jsx";

export const metadata = {
  title: "Vardhan Doharey",
  description: "Full Stack Developer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a12] text-white antialiased">
        <Navbar />
        <main style={{ paddingTop: "80px" }}>{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.06] py-12 px-6">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
            <p className="text-white font-semibold text-base tracking-wide">Vardhan Doharey.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap justify-center">
              {["Home", "About", "Projects", "Resume", "Contact"].map((item) => (
                <a key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="hover:text-gray-300 transition-colors duration-200">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/VishnuVardhan2000" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="https://www.instagram.com/vishnu.rudra" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/vardhan-doharey-zomb/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
            <p className="text-gray-700 text-xs">© 2026 Vardhan Doharey. All rights reserved.</p>
          </div>
        </footer>

        <style>{`
          .social-icon {
            width: 40px; height: 40px;
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 10px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.65);
            text-decoration: none;
            transition: color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
          }
          .social-icon:hover {
            color: #7db4ff;
            border-color: rgba(96,165,250,0.35);
            box-shadow: 0 0 18px rgba(96,165,250,0.18);
            transform: translateY(-2px);
          }
        `}</style>
      </body>
    </html>
  );
}