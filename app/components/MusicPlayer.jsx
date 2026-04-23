"use client";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function getAudio() {
  if (typeof window === "undefined") return null;
  // ← Stored on window — survives ALL Next.js page navigations
  if (!window.__bgm__) {
    window.__bgm__ = new Audio("/portfoliobg.m4a");
    window.__bgm__.loop = true;
    window.__bgm__.volume = 0.4;
    window.__bgm__._playing = false;
    window.__bgm__._vol = 0.4;
  }
  return window.__bgm__;
}

export default function MusicPlayer() {
  const { accent } = useTheme();
  const analyserRef  = useRef(null);
  const audioCtxRef  = useRef(null);
  const animFrameRef = useRef(null);
  const dragRef      = useRef({ dragging: false, startX: 0, startY: 0, initX: 0, initY: 0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume,    setVolume]    = useState(0.4);
  const [beats,     setBeats]     = useState(Array(10).fill(2));
  const [visible,   setVisible]   = useState(false);
  const [pos,       setPos]       = useState({ x: null, y: null });

  // Sync UI with actual window.__bgm__ state on every mount/navigation
  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;
    setIsPlaying(audio._playing);
    setVolume(audio._vol);
  }, []);

  // Show player after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Default position bottom-right
  useEffect(() => {
    if (typeof window !== "undefined" && pos.x === null) {
      setPos({ x: window.innerWidth - 158, y: window.innerHeight - 260 });
    }
  }, [pos.x]);

  // Beat visualizer loop
  useEffect(() => {
    const tick = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        setBeats(
          Array.from({ length: 10 }, (_, i) => {
            const val = data[Math.floor((i / 10) * data.length)];
            return isPlaying ? Math.max(2, (val / 255) * 22) : 2;
          })
        );
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  // Init Web Audio analyser only once per window.__bgm__
  const initAnalyser = () => {
    const audio = getAudio();
    if (!audio || audioCtxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const source  = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
  };

  const togglePlay = async () => {
    const audio = getAudio();
    if (!audio) return;
    initAnalyser();

    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    if (audio._playing) {
      audio.pause();
      audio._playing = false;
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        audio._playing = true;
        setIsPlaying(true);
      } catch (e) {
        console.error("Playback error:", e);
      }
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    const audio = getAudio();
    if (audio) { audio.volume = val; audio._vol = val; }
    setVolume(val);
  };

  // Drag handlers
  const onMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    dragRef.current = {
      dragging: true,
      startX: e.clientX, startY: e.clientY,
      initX: pos.x,      initY: pos.y,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 140, dragRef.current.initX + (e.clientX - dragRef.current.startX))),
        y: Math.max(0, Math.min(window.innerHeight - 240, dragRef.current.initY + (e.clientY - dragRef.current.startY))),
      });
    };
    const onUp = () => { dragRef.current.dragging = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  if (pos.x === null) return null;

  const c = accent || "168,85,247";

  return (
    <>
      <div
        onMouseDown={onMouseDown}
        className="fixed z-50 flex flex-col items-center gap-2 px-3 py-3 rounded-xl select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: "124px",
          background: "rgba(10,10,18,0.88)",
          border: `1px solid rgba(${c},0.22)`,
          boxShadow: `0 0 30px rgba(${c},0.05) inset`,
          backdropFilter: "blur(16px)",
          cursor: "grab",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.5s ease",
        }}
      >
        {/* RPG corner brackets */}
        {[
          { top:"-1px",    left:"-1px",  bt:true, bl:true, r:"2px 0 0 0" },
          { top:"-1px",    right:"-1px", bt:true, br:true, r:"0 2px 0 0" },
          { bottom:"-1px", left:"-1px",  bb:true, bl:true, r:"0 0 0 2px" },
          { bottom:"-1px", right:"-1px", bb:true, br:true, r:"0 0 2px 0" },
        ].map((corner, i) => (
          <span key={i} className="absolute w-2.5 h-2.5 pointer-events-none" style={{
            top: corner.top, left: corner.left,
            right: corner.right, bottom: corner.bottom,
            borderTop:    corner.bt ? `2px solid rgba(${c},0.85)` : undefined,
            borderLeft:   corner.bl ? `2px solid rgba(${c},0.85)` : undefined,
            borderRight:  corner.br ? `2px solid rgba(${c},0.85)` : undefined,
            borderBottom: corner.bb ? `2px solid rgba(${c},0.85)` : undefined,
            borderRadius: corner.r,
            transition: "border-color 0.5s ease",
          }} />
        ))}

        {/* // BGM label */}
        <div className="absolute -top-3 left-3 pointer-events-none">
          <span className="font-mono text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
            style={{
              color: `rgba(${c},1)`,
              background: "#0a0a12",
              border: `1px solid rgba(${c},0.28)`,
              transition: "color 0.5s ease, border-color 0.5s ease",
            }}>
            // BGM
          </span>
        </div>

        {/* Beat visualizer */}
        <div className="flex items-end gap-[2px] h-6 mt-1">
          {beats.map((h, i) => (
            <div key={i} style={{
              width: "4px",
              height: `${h}px`,
              borderRadius: "2px",
              background: isPlaying
                ? `rgba(${c},${0.35 + (h / 22) * 0.65})`
                : `rgba(${c},0.15)`,
              boxShadow: isPlaying && h > 11
                ? `0 0 5px rgba(${c},0.75)`
                : "none",
              transition: "height 0.07s ease, background 0.5s ease",
            }} />
          ))}
        </div>

        {/* Play / Pause button */}
        <button onClick={togglePlay}
          className="font-mono text-[10px] font-bold px-2 py-1 rounded-lg w-full"
          style={{
            background: isPlaying ? `rgba(${c},0.18)` : `rgba(${c},0.07)`,
            border: `1px solid rgba(${c},0.3)`,
            color: `rgba(${c},1)`,
            cursor: "pointer",
            letterSpacing: "0.06em",
            transition: "background 0.2s ease",
          }}>
          {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
        </button>

        {/* Volume % */}
        <span className="font-mono text-[9px]"
          style={{ color: `rgba(${c},0.45)`, transition: "color 0.5s ease" }}>
          VOL {Math.round(volume * 100)}%
        </span>

        {/* Vertical volume slider */}
        <input
          type="range" min="0" max="1" step="0.01"
          value={volume} onChange={handleVolume}
          style={{
            writingMode: "vertical-lr",
            direction: "rtl",
            height: "58px",
            width: "6px",
            cursor: "pointer",
            accentColor: `rgba(${c},1)`,
            WebkitAppearance: "slider-vertical",
          }}
        />
      </div>
    </>
  );
}