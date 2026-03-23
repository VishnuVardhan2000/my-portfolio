export default function Footer() {
  return (
    <footer className="px-6 md:px-16 lg:px-32 py-10 mt-20 border-t border-[#1E2A3A]">
      <div className="flex justify-between items-center">
        <p className="text-xs text-[#8892A4]">
          © 2026 Vishnu Vardhan
        </p>
        <div className="flex gap-6">
          <a href="https://github.com/VishnuVardhan2000" target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#8892A4] hover:text-blue-400 transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/vardhan-doharey-zomb/" target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#8892A4] hover:text-blue-400 transition-colors">
            LinkedIn
          </a>
          <a href="https://www.instagram.com/Vishnu.Rudra" target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#8892A4] hover:text-blue-400 transition-colors">
            Instagram
          </a>
          <a href="mailto:vardhandoharey@gmail.com"
            className="text-xs text-[#8892A4] hover:text-blue-400 transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
