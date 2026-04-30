"use client";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const TRACKS = [
  { title: "Portfolio BGM",        file: "/portfoliobg.m4a",                    emoji: "🎵" },
  { title: "Poster Boy",           file: "/music/2hollis - poster boy.mp3",     emoji: "🖤" },
  { title: "Montagem Alquimia",    file: "/music/MONTAGEM ALQUIMIA (S).mp3",    emoji: "⚗️" },
  { title: "Montagem Miau Remix",  file: "/music/MONTAGEM Miau Remix.mp3",      emoji: "🐱" },
  { title: "Montagem Santa Fe 2",  file: "/music/MONTAGEM SANTA FE 2 (S).mp3", emoji: "🌵" },
  { title: "MONTAGEM REBOLA",      file: "/music/MONTAGEM REBOLA.mp3",          emoji: "🫵" },
];

const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

function getAudio(src) {
  if (typeof window === "undefined") return null;
  const full = new URL(src, window.location.href).href;
  if (!window.__bgm__ || window.__bgm__._src !== full) {
    if (window.__bgm__) window.__bgm__.pause();
    const a = new Audio(src);
    a.loop = false;
    a.volume = window.__bgm__?._vol ?? 0.4;
    a._playing = false;
    a._vol = window.__bgm__?._vol ?? 0.4;
    a._src = full;
    window.__bgm__ = a;
  }
  return window.__bgm__;
}

export default function MusicPlayer() {
  const { accent } = useTheme();
  const c = accent || "168,85,247";

  const [open,        setOpen]        = useState(false);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [volume,      setVolume]      = useState(0.4);
  const [trackIdx,    setTrackIdx]    = useState(0);
  const [beats,       setBeats]       = useState(Array(12).fill(2));
  const [progress,    setProgress]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);

  const audioCtxRef  = useRef(null);
  const analyserRef  = useRef(null);
  const animRef      = useRef(null);
  const canvasRef    = useRef(null);
  const particlesRef = useRef([]);
  const matrixRef    = useRef([]);
  const popupRef     = useRef(null);
  const lastEventRef = useRef(0);

  useEffect(() => {
    const audio = getAudio(TRACKS[0].file);
    if (!audio) return;
    setIsPlaying(audio._playing);
    setVolume(audio._vol);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const audio = getAudio(TRACKS[trackIdx].file);
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnd = () => switchTrack((trackIdx + 1) % TRACKS.length);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [trackIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const initMatrix = (w) => {
      matrixRef.current = Array.from({ length: Math.floor(w / 20) }, (_, i) => ({
        x:      i * 20,
        y:      Math.random() * -500,
        speed:  Math.random() * 1.2 + 0.4,
        char:   CHARS[Math.floor(Math.random() * CHARS.length)],
        glowing: false,
      }));
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: 55 }, () => ({
        x:      Math.random() * window.innerWidth,
        y:      Math.random() * window.innerHeight,
        size:   Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        op:     Math.random() * 0.25 + 0.05,
        burst:  0,
      }));
      initMatrix(window.innerWidth);
    };

    resize();
    window.addEventListener("resize", resize);

    const [r, g, b] = c.split(",").map(Number);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      let bass = 0;
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        bass = (data[0] + data[1] + data[2]) / (3 * 255);
        if (isPlaying) {
          setBeats(Array.from({ length: 12 }, (_, i) => {
            const val = data[Math.floor((i / 12) * (data.length / 3))];
            return Math.max(2, (val / 255) * 28);
          }));
        }
      }
      if (!isPlaying) setBeats(Array(12).fill(2));

      // Aura radial glow
      if (isPlaying && bass > 0.25) {
        const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.85);
        grad.addColorStop(0,   `rgba(${r},${g},${b},${bass * 0.10})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${bass * 0.045})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Edge vignette bloom
      if (isPlaying && bass > 0.45) {
        const edge = ctx.createRadialGradient(w/2, h/2, w*0.4, w/2, h/2, w*0.85);
        edge.addColorStop(0, `rgba(${r},${g},${b},0)`);
        edge.addColorStop(1, `rgba(${r},${g},${b},${bass * 0.12})`);
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, w, h);
      }

      // Floating particles
      particlesRef.current.forEach((p) => {
        if (isPlaying && bass > 0.5) p.burst = Math.min(p.burst + bass * 4, 10);
        else p.burst *= 0.90;
        p.x += p.speedX + (Math.random() - 0.5) * p.burst * 0.4;
        p.y += p.speedY - p.burst * 0.25;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const opacity = isPlaying ? Math.min(p.op + bass * 0.5, 0.85) : p.op * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + p.burst * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
        ctx.fill();
      });

      // Matrix rain
      matrixRef.current.forEach((col) => {
        col.char  = CHARS[Math.floor(Math.random() * CHARS.length)];
        col.y    += col.speed + (isPlaying ? bass * 2.5 : 0);
        if (col.y > h) {
          col.y = Math.random() * -200;
          col.x = Math.floor(Math.random() * Math.floor(w / 20)) * 20;
        }
        col.glowing = isPlaying && bass > 0.48 && Math.random() > 0.72;
        const baseOp = isPlaying ? 0.07 + bass * 0.16 : 0.03;
        const opacity = col.glowing ? Math.min(baseOp + 0.6, 0.92) : baseOp;

        ctx.shadowBlur = 0;
        ctx.font = `${col.glowing ? "bold " : ""}12px monospace`;

        if (col.glowing) {
          ctx.shadowBlur  = 14;
          ctx.shadowColor = `rgba(${r},${g},${b},1)`;
          ctx.fillStyle   = `rgba(255,255,255,${opacity})`;
        } else {
          ctx.shadowColor = "transparent";
          ctx.fillStyle   = `rgba(${r},${g},${b},${opacity})`;
        }

        ctx.fillText(col.char, col.x, col.y);
        ctx.shadowBlur = 0;
      });

      // Beat event for About page glitch
      const now = Date.now();
      if (now - lastEventRef.current > 50) {
        window.dispatchEvent(new CustomEvent("bgm-beat", {
          detail: { bass, playing: isPlaying },
        }));
        lastEventRef.current = now;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isPlaying, c]);

  const initAnalyser = (audio) => {
    if (audioCtxRef.current || !audio) return;
    const ctx      = new (window.AudioContext || window.webkitAudioContext)();
    const source   = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  };

  const togglePlay = async () => {
    const audio = getAudio(TRACKS[trackIdx].file);
    if (!audio) return;
    initAnalyser(audio);
    if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
    if (audio._playing) {
      audio.pause(); audio._playing = false; setIsPlaying(false);
    } else {
      try { await audio.play(); audio._playing = true; setIsPlaying(true); }
      catch (e) { console.error(e); }
    }
  };

  const switchTrack = async (idx) => {
    if (window.__bgm__) { window.__bgm__.pause(); window.__bgm__._playing = false; }
    if (audioCtxRef.current) {
      await audioCtxRef.current.close();
      audioCtxRef.current = null; analyserRef.current = null;
    }
    window.__bgm__ = null;
    setTrackIdx(idx); setProgress(0); setCurrentTime(0);
    const audio = getAudio(TRACKS[idx].file);
    if (!audio) return;
    initAnalyser(audio);
    try { await audio.play(); audio._playing = true; setIsPlaying(true); }
    catch (e) { console.error(e); }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    const audio = getAudio(TRACKS[trackIdx].file);
    if (audio) { audio.volume = val; audio._vol = val; }
    setVolume(val);
  };

  const handleSeek = (e) => {
    const audio = getAudio(TRACKS[trackIdx].file);
    if (!audio?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const fmt = (s) => !s || isNaN(s) ? "0:00"
    : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      <div className="relative" ref={popupRef}>

        <button
          onClick={() => setOpen((o) => !o)}
          className="relative flex items-center justify-center gap-[2px] px-2 h-9 rounded-lg transition-all duration-200"
          style={{
            background: open || isPlaying ? `rgba(${c},0.12)` : "transparent",
            border: `1px solid rgba(${c},${open || isPlaying ? 0.4 : 0.18})`,
            minWidth: "36px",
          }}
          aria-label="Music player"
        >
          {isPlaying && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: `rgba(${c},1)`, animation: "mp-pulse 1.4s ease-in-out infinite" }} />
          )}
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-4">
              {beats.slice(0, 5).map((h, i) => (
                <div key={i} style={{
                  width: "3px",
                  height: `${Math.max(3, (h / 28) * 16)}px`,
                  borderRadius: "2px",
                  background: `rgba(${c},${0.5 + (h / 28) * 0.5})`,
                  boxShadow: h > 14 ? `0 0 4px rgba(${c},0.8)` : "none",
                  transition: "height 0.07s ease",
                }} />
              ))}
            </div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={`rgba(${c},0.8)`} strokeWidth="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 rounded-xl overflow-visible"
            style={{
              width: "262px",
              background: "rgba(10,10,18,0.97)",
              border: `1px solid rgba(${c},0.22)`,
              boxShadow: `0 0 40px rgba(${c},0.12), 0 20px 60px rgba(0,0,0,0.7)`,
              backdropFilter: "blur(20px)",
              zIndex: 9999,
            }}>

            {[
              { top:0,    left:0,    bt:true, bl:true,  br_:"2px 0 0 0" },
              { top:0,    right:0,   bt:true, br:true,  br_:"0 2px 0 0" },
              { bottom:0, left:0,    bb:true, bl:true,  br_:"0 0 0 2px" },
              { bottom:0, right:0,   bb:true, br:true,  br_:"0 0 2px 0" },
            ].map((corner, i) => (
              <span key={i} className="absolute w-3 h-3 pointer-events-none" style={{
                top: corner.top, left: corner.left, right: corner.right, bottom: corner.bottom,
                borderTop:    corner.bt ? `2px solid rgba(${c},0.85)` : undefined,
                borderLeft:   corner.bl ? `2px solid rgba(${c},0.85)` : undefined,
                borderRight:  corner.br ? `2px solid rgba(${c},0.85)` : undefined,
                borderBottom: corner.bb ? `2px solid rgba(${c},0.85)` : undefined,
                borderRadius: corner.br_,
              }} />
            ))}

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                  style={{ color:`rgba(${c},1)`, border:`1px solid rgba(${c},0.28)`, background:"rgba(10,10,18,0.8)" }}>
                  // BGM
                </span>
                <span className="font-mono text-[10px] truncate max-w-[130px]" style={{ color:`rgba(${c},0.7)` }}>
                  {TRACKS[trackIdx].emoji} {TRACKS[trackIdx].title}
                </span>
              </div>

              <div className="flex items-end gap-[3px] h-8 mb-3 justify-center">
                {beats.map((h, i) => (
                  <div key={i} style={{
                    width: "14px", height: `${h}px`, borderRadius: "2px",
                    background: isPlaying ? `rgba(${c},${0.35+(h/28)*0.65})` : `rgba(${c},0.15)`,
                    boxShadow: isPlaying && h > 14 ? `0 0 6px rgba(${c},0.8)` : "none",
                    transition: "height 0.07s ease",
                  }} />
                ))}
              </div>

              <div className="mb-3">
                <div className="w-full h-1 rounded-full cursor-pointer mb-1"
                  style={{ background:`rgba(${c},0.15)` }} onClick={handleSeek}>
                  <div className="h-full rounded-full"
                    style={{ width:`${progress}%`, background:`rgba(${c},0.9)`,
                             boxShadow:`0 0 6px rgba(${c},0.6)`, transition:"width 0.3s linear" }} />
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[9px]" style={{ color:`rgba(${c},0.4)` }}>{fmt(currentTime)}</span>
                  <span className="font-mono text-[9px]" style={{ color:`rgba(${c},0.4)` }}>{fmt(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mb-3">
                <button onClick={() => switchTrack((trackIdx - 1 + TRACKS.length) % TRACKS.length)}
                  style={{ color:`rgba(${c},0.7)`, background:"none", border:"none", cursor:"pointer", fontSize:"14px" }}>⏮</button>
                <button onClick={togglePlay}
                  className="font-mono text-[10px] font-bold px-4 py-1.5 rounded-lg"
                  style={{
                    background: isPlaying ? `rgba(${c},0.18)` : `rgba(${c},0.07)`,
                    border:`1px solid rgba(${c},0.3)`, color:`rgba(${c},1)`,
                    cursor:"pointer", letterSpacing:"0.06em",
                  }}>
                  {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
                </button>
                <button onClick={() => switchTrack((trackIdx + 1) % TRACKS.length)}
                  style={{ color:`rgba(${c},0.7)`, background:"none", border:"none", cursor:"pointer", fontSize:"14px" }}>⏭</button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[9px]" style={{ color:`rgba(${c},0.4)` }}>VOL</span>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume}
                  className="flex-1 cursor-pointer" style={{ accentColor:`rgba(${c},1)`, height:"3px" }} />
                <span className="font-mono text-[9px]" style={{ color:`rgba(${c},0.4)` }}>{Math.round(volume*100)}%</span>
              </div>

              <div className="border-t pt-2" style={{ borderColor:`rgba(${c},0.1)` }}>
                <p className="font-mono text-[8px] tracking-widest uppercase mb-1.5"
                  style={{ color:`rgba(${c},0.35)` }}>Queue</p>
                <div className="flex flex-col gap-0.5">
                  {TRACKS.map((track, i) => (
                    <button key={i} onClick={() => switchTrack(i)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left w-full transition-all"
                      style={{
                        background: i === trackIdx ? `rgba(${c},0.12)` : "transparent",
                        border: i === trackIdx ? `1px solid rgba(${c},0.2)` : "1px solid transparent",
                        cursor:"pointer",
                      }}>
                      <span className="text-xs">{track.emoji}</span>
                      <span className="font-mono text-[10px] flex-1 truncate"
                        style={{ color: i === trackIdx ? `rgba(${c},1)` : `rgba(${c},0.45)` }}>
                        {track.title}
                      </span>
                      {i === trackIdx && isPlaying && (
                        <span className="font-mono text-[8px]" style={{ color:`rgba(${c},0.7)` }}>▶</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes mp-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.35; transform:scale(0.65); }
        }
      `}</style>
    </>
  );
}