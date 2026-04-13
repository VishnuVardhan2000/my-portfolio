"use client";
import { useState, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "service_38qh568";
const EMAILJS_TEMPLATE_ID = "template_qbr6yyh";
const EMAILJS_PUBLIC_KEY  = "aXzvxw_jnlSgduN2-";

const SOCIALS = [
  { label: "GitHub",    value: "VishnuVardhan2000",       href: "https://github.com/VishnuVardhan2000",               color: "255,255,255" },
  { label: "LinkedIn",  value: "vardhan-doharey-zomb",    href: "https://www.linkedin.com/in/vardhan-doharey-zomb/",  color: "96,165,250"  },
  { label: "Instagram", value: "@vishnu.rudra",            href: "https://www.instagram.com/vishnu.rudra",             color: "236,72,153"  },
  { label: "Email",     value: "vardhandoharey@gmail.com", href: "mailto:vardhandoharey@gmail.com",                    color: "74,222,128"  },
];

/* ── RPGFrame with cursor spotlight ── */
function RPGFrame({ children, title, accent = "236,72,153" }) {
  const ref = useRef(null);
  const c = `rgba(${accent},`;

  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--mo", "1");
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--mx", "-999px");
    el.style.setProperty("--my", "-999px");
    el.style.setProperty("--mo", "0");
  }, []);

  return (
    <>
      <style>{`
        .rpg-frame-contact {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .rpg-frame-contact:hover { transform: translateY(-2px); }
        .rpg-frame-contact::before {
          content:""; position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:0;
          background: radial-gradient(300px circle at var(--mx) var(--my),
            rgba(var(--rpg-c),0.07) 0%, transparent 70%);
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
        .rpg-frame-contact::after {
          content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
          pointer-events:none; z-index:2;
          background: radial-gradient(220px circle at var(--mx) var(--my),
            rgba(var(--rpg-c),0.7), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity:var(--mo); transition:opacity 0.4s ease;
        }
      `}</style>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="rpg-frame-contact relative rounded-xl p-6"
        style={{
          "--mx": "-999px", "--my": "-999px", "--mo": "0",
          "--rpg-c": accent,
          border: `1px solid ${c}0.2)`,
          background: `${c}0.02)`,
          boxShadow: `0 0 40px ${c}0.04) inset`,
        }}>
        <span className="absolute top-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
          style={{ borderTop: `2px solid ${c}0.8)`, borderLeft: `2px solid ${c}0.8)`, borderRadius: "2px 0 0 0" }} />
        <span className="absolute top-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
          style={{ borderTop: `2px solid ${c}0.8)`, borderRight: `2px solid ${c}0.8)`, borderRadius: "0 2px 0 0" }} />
        <span className="absolute bottom-[-1px] left-[-1px] w-3 h-3 pointer-events-none"
          style={{ borderBottom: `2px solid ${c}0.8)`, borderLeft: `2px solid ${c}0.8)`, borderRadius: "0 0 0 2px" }} />
        <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 pointer-events-none"
          style={{ borderBottom: `2px solid ${c}0.8)`, borderRight: `2px solid ${c}0.8)`, borderRadius: "0 0 2px 0" }} />
        {title && (
          <div className="absolute -top-3.5 left-6">
            <span className="font-mono text-[11px] font-bold tracking-widest px-3 py-0.5 rounded"
              style={{ color: `rgba(${accent},1)`, background: "#0a0a12", border: `1px solid ${c}0.25)` }}>
              // {title}
            </span>
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}

function TerminalInput({ label, name, value, onChange, type = "text", required, accent = "236,72,153" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] tracking-widest uppercase"
        style={{ color: `rgba(${accent}, 0.7)` }}>
        &gt; {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? `rgba(${accent},0.5)` : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? `0 0 16px rgba(${accent},0.1)` : "none",
        }}>
        <span className="font-mono text-sm" style={{ color: `rgba(${accent},0.6)` }}>$</span>
        <input type={type} name={name} value={value} onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-200 placeholder-gray-600"
          placeholder={`enter ${label.toLowerCase()}...`} autoComplete="off" />
        {focused && <span className="font-mono text-sm animate-pulse" style={{ color: `rgba(${accent},0.8)` }}>▌</span>}
      </div>
    </div>
  );
}

function TerminalTextarea({ label, name, value, onChange, accent = "236,72,153" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] tracking-widest uppercase"
        style={{ color: `rgba(${accent}, 0.7)` }}>
        &gt; {label}
      </label>
      <div className="rounded-lg px-3 py-2.5 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? `rgba(${accent},0.5)` : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? `0 0 16px rgba(${accent},0.1)` : "none",
        }}>
        <div className="flex gap-2">
          <span className="font-mono text-sm mt-0.5 flex-shrink-0" style={{ color: `rgba(${accent},0.6)` }}>$</span>
          <textarea name={name} value={value} onChange={onChange} required rows={5}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-200 placeholder-gray-600 resize-none"
            placeholder="enter message..." />
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        { name: form.name, email: form.email, subject: form.subject, message: form.message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  return (
    <>
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />

      {/* ambient pink orbs */}
      <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] bg-pink-900/[0.07] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-rose-900/[0.05] rounded-full blur-[160px] pointer-events-none" />

      <section className="max-w-3xl mx-auto px-4 pt-8 pb-24 space-y-10">

        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase"
            style={{ color: "rgba(236,72,153,0.6)" }}>
            &gt; INITIATING CONTACT PROTOCOL...
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-mono"
            style={{
              letterSpacing: "0.04em",
              textShadow: "0 0 10px rgba(236,72,153,0.9), 0 0 30px rgba(236,72,153,0.5), 0 0 60px rgba(236,72,153,0.2)",
            }}>
            Send a Message
          </h1>
          <p className="text-gray-400 text-sm font-mono">
            Open to work, collabs, and side quests.{" "}
            <span style={{ color: "rgba(236,72,153,0.8)" }}>▌</span>
          </p>
        </div>

        {/* ── Form ── */}
        <RPGFrame title="TRANSMIT_MESSAGE.EXE" accent="236,72,153">
          <form onSubmit={handleSubmit} className="space-y-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TerminalInput label="Name"    name="name"    value={form.name}    onChange={handleChange} required accent="236,72,153" />
              <TerminalInput label="Email"   name="email"   value={form.email}   onChange={handleChange} required type="email" accent="96,165,250" />
            </div>
            <TerminalInput   label="Subject" name="subject" value={form.subject} onChange={handleChange} required accent="167,139,250" />
            <TerminalTextarea label="Message" name="message" value={form.message} onChange={handleChange} accent="236,72,153" />

            {status === "success" && (
              <div className="font-mono text-sm rounded-lg px-4 py-3"
                style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.25)", color: "rgb(236,72,153)" }}>
                ✓ MESSAGE TRANSMITTED SUCCESSFULLY — I will respond within 24hrs.
              </div>
            )}
            {status === "error" && (
              <div className="font-mono text-sm rounded-lg px-4 py-3"
                style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)", color: "rgb(255,100,100)" }}>
                ✗ TRANSMISSION FAILED — check your credentials or try again.
              </div>
            )}

            <button type="submit" disabled={status === "sending"}
              className="w-full font-mono font-bold text-sm py-3 rounded-xl tracking-widest uppercase transition-all duration-200 disabled:opacity-50"
              style={{
                background: "rgba(236,72,153,0.12)",
                border: "1px solid rgba(236,72,153,0.35)",
                color: "rgb(236,72,153)",
                boxShadow: status === "sending" ? "none" : "0 0 20px rgba(236,72,153,0.1)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(236,72,153,0.22)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(236,72,153,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(236,72,153,0.12)"; e.currentTarget.style.boxShadow = status === "sending" ? "none" : "0 0 20px rgba(236,72,153,0.1)"; }}>
              {status === "sending" ? "[ TRANSMITTING... ▌ ]" : "[ TRANSMIT MESSAGE ]"}
            </button>
          </form>
        </RPGFrame>

        {/* ── Socials ── */}
        <RPGFrame title="COMMS_CHANNELS.DAT" accent="96,165,250">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {SOCIALS.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 font-mono text-sm transition-all duration-200 group"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(${s.color},0.15)` }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(${s.color},0.06)`; e.currentTarget.style.borderColor = `rgba(${s.color},0.4)`; e.currentTarget.style.boxShadow = `0 0 16px rgba(${s.color},0.12)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = `rgba(${s.color},0.15)`; e.currentTarget.style.boxShadow = "none"; }}>
                <span className="text-[10px] tracking-widest" style={{ color: `rgba(${s.color},0.6)` }}>[{s.label.toUpperCase()}]</span>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">{s.value}</span>
                <span className="ml-auto text-gray-600 group-hover:text-gray-300 transition-colors duration-200">↗</span>
              </a>
            ))}
          </div>
        </RPGFrame>

      </section>
    </>
  );
}