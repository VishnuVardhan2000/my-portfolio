"use client";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function MusicPlayer() {
  const { accent } = useTheme();
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const dragRef = useRef({ dragging:false, startX:0, startY:0, initX:0, initY:0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [beats, setBeats] = useState(Array(10).fill(2));
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: null, y: null });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPos({ x: window.innerWidth - 160, y: window.innerHeight - 260 });
    }
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
  };

  useEffect(() => {
    const tick = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const bars = Array.from({ length: 10 }, (_, i) => {
          const val = data[Math.floor((i / 10) * data.length)];
          return isPlaying ? Math.max(2, (val / 255) * 22) : 2;
        });
        setBeats(bars);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  const togglePlay = async () => {
    initAudio();
    const audio = audioRef.current;
    if (!audio) return;
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Playback failed:", e);
      }
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const onMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    dragRef.current = { dragging:true, startX:e.clientX, startY:e.clientY, initX:pos.x, initY:pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 140, dragRef.current.initX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 240, dragRef.current.initY + dy)),
      });
    };
    const onMouseUp = () => { dragRef.current.dragging = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [pos]);

  if (pos.x === null) return null;

  return (
    <>
      <audio ref={audioRef} src="/portfoliobg.m4a" loop preload="auto" />

      <div
        onMouseDown={onMouseDown}
        className="music-player fixed z-50 flex flex-col items-center gap-2 px-3 py-3 rounded-xl select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          background: "rgba(10,10,18,0.88)",
          border: `1px solid rgba(${accent},0.2)`,
          boxShadow: `0 0 30px rgba(${accent},0.04) inset`,
          backdropFilter: "blur(14px)",
          width: "120px",
          cursor: "grab",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          transition: "opacity 0.6s ease, transform 0.6s ease, border-color 0.5s ease, box-shadow 0.5s ease",
          "--accent-glow": `rgba(${accent},0.07)`,
          "--accent-border": `rgba(${accent},0.75)`,
        }}
      >
        {/* RPG corner brackets */}
        {[
          { top:"-1px",    left:"-1px",  bt:true, bl:true, r:"2px 0 0 0" },
          { top:"-1px",    right:"-1px", bt:true, br:true, r:"0 2px 0 0" },
          { bottom:"-1px", left:"-1px",  bb:true, bl:true, r:"0 0 0 2px" },
          { bottom:"-1px", right:"-1px", bb:true, br:true, r:"0 0 2px 0" },
        ].map((c, i) => (
          <span key={i} className="absolute w-2.5 h-2.5 pointer-events-none"
            style={{
              top:c.top, left:c.left, right:c.right, bottom:c.bottom,
              borderTop:    c.bt ? `2px solid rgba(${accent},0.8)` : undefined,
              borderLeft:   c.bl ? `2px solid rgba(${accent},0.8)` : undefined,
              borderRight:  c.br ? `2px solid rgba(${accent},0.8)` : undefined,
              borderBottom: c.bb ? `2px solid rgba(${accent},0.8)` : undefined,
              borderRadius: c.r,
              transition: "border-color 0.5s ease",
            }} />
        ))}

        {/* Title tag */}
        <div className="absolute -top-3 left-3">
          <span className="font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded"
            style={{
              color: `rgba(${accent},1)`,
              background: "#0a0a12",
              border: `1px solid rgba(${accent},0.25)`,
              transition: "color 0.5s ease, border-color 0.5s ease",
            }}>
            // BGM
          </span>
        </div>

        {/* Beat bars */}
        <div className="flex items-end gap-[2px] h-6 mt-1">
          {beats.map((h, i) => (
            <div key={i} style={{
              width: "4px",
              height: `${h}px`,
              borderRadius: "2px",
              background: isPlaying
                ? `rgba(${accent},${0.4 + (h / 22) * 0.6})`
                : `rgba(${accent},0.18)`,
              boxShadow: isPlaying && h > 12
                ? `0 0 5px rgba(${accent},0.8)`
                : "none",
              transition: "height 0.08s ease, background 0.5s ease",
            }} />
          ))}
        </div>

        {/* Play/Pause */}
        <button onClick={togglePlay}
          className="font-mono text-[10px] font-bold px-3 py-1 rounded-lg w-full transition-all duration-200"
          style={{
            background: isPlaying ? `rgba(${accent},0.18)` : `rgba(${accent},0.07)`,
            border: `1px solid rgba(${accent},0.28)`,
            color: `rgba(${accent},1)`,
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}>
          {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
        </button>

        {/* Volume label */}
        <span className="font-mono text-[9px] tracking-widest"
          style={{ color: `rgba(${accent},0.5)`, transition: "color 0.5s ease" }}>
          VOL {Math.round(volume * 100)}%
        </span>

        {/* Volume slider */}
        <input
          type="range" min="0" max="1" step="0.01"
          value={volume} onChange={handleVolume}
          className="volume-knob"
          style={{
            writingMode: "vertical-lr",
            direction: "rtl",
            height: "60px",
            cursor: "pointer",
            accentColor: `rgba(${accent},1)`,
          }}
        />
      </div>

      <style>{`
        .volume-knob {
          -webkit-appearance: slider-vertical;
          appearance: auto;
          width: 6px;
        }
        .music-player:active { cursor: grabbing; }
      `}</style>
    </>
  );
}