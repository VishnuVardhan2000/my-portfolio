export default function Resume() {
  return (
    <main className="min-h-screen px-5 md:px-16 lg:px-32 py-16 md:py-24">

      <div className="mb-8 flex justify-between items-center">
        <p className="text-xs uppercase tracking-widest text-blue-400">Resume</p>
        <a
          href="https://drive.google.com/uc?export=download&id=1lgLtz7MbHCbBqZkix9rfrG0b5l8l90Ft"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Download PDF →
        </a>
      </div>

      <div className="w-full rounded-lg overflow-hidden border border-[#1E2A3A]"
        style={{ height: 'calc(100vh - 160px)' }}>
        <iframe
          src="https://drive.google.com/file/d/1lgLtz7MbHCbBqZkix9rfrG0b5l8l90Ft/preview"
          width="100%"
          height="100%"
          allow="autoplay"
          style={{ border: 'none' }}
        />
      </div>

    </main>
  );
}
