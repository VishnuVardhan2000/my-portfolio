"use client";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_38qh568";
const EMAILJS_TEMPLATE_ID = "template_qbr6yyh";
const EMAILJS_PUBLIC_KEY = "SdcEi86rbAic5W-NDq4db";

const SOCIALS = [
  {
    label: "GitHub",
    value: "VishnuVardhan2000",
    href: "https://github.com/VishnuVardhan2000",
    color: "255,255,255",
  },
  {
    label: "LinkedIn",
    value: "vardhan-doharey-zomb",
    href: "https://www.linkedin.com/in/vardhan-doharey-zomb/",
    color: "96,165,250",
  },
  {
    label: "Instagram",
    value: "@vishnu.rudra",
    href: "https://www.instagram.com/vishnu.rudra",
    color: "236,72,153",
  },
  {
    label: "Email",
    value: "vardhandoharey@gmail.com",
    href: "mailto:vardhandoharey@gmail.com",
    color: "74,222,128",
  },
];

function RPGFrame({ children, title, accent = "0,255,136" }) {
  const c = `rgba(${accent},`;
  return (
    <div
      className="relative rounded-xl p-6"
      style={{
        border: `1px solid ${c}0.2)`,
        background: `${c}0.02)`,
        boxShadow: `0 0 40px ${c}0.04) inset`,
      }}
    >
      <span
        className="absolute top-[-1px] left-[-1px] w-3 h-3"
        style={{
          borderTop: `2px solid ${c}0.8)`,
          borderLeft: `2px solid ${c}0.8)`,
          borderRadius: "2px 0 0 0",
        }}
      />
      <span
        className="absolute top-[-1px] right-[-1px] w-3 h-3"
        style={{
          borderTop: `2px solid ${c}0.8)`,
          borderRight: `2px solid ${c}0.8)`,
          borderRadius: "0 2px 0 0",
        }}
      />
      <span
        className="absolute bottom-[-1px] left-[-1px] w-3 h-3"
        style={{
          borderBottom: `2px solid ${c}0.8)`,
          borderLeft: `2px solid ${c}0.8)`,
          borderRadius: "0 0 0 2px",
        }}
      />
      <span
        className="absolute bottom-[-1px] right-[-1px] w-3 h-3"
        style={{
          borderBottom: `2px solid ${c}0.8)`,
          borderRight: `2px solid ${c}0.8)`,
          borderRadius: "0 0 2px 0",
        }}
      />

      {title && (
        <div className="absolute -top-3.5 left-6">
          <span
            className="font-mono text-[11px] font-bold tracking-widest px-3 py-0.5 rounded"
            style={{
              color: `rgba(${accent},1)`,
              background: "#0a0a12",
              border: `1px solid ${c}0.25)`,
            }}
          >
            // {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

function TerminalInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  accent = "0,255,136",
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        className="font-mono text-[11px] tracking-widest uppercase"
        style={{ color: `rgba(${accent}, 0.7)` }}
      >
        &gt; {label}
      </label>
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${
            focused ? `rgba(${accent},0.5)` : "rgba(255,255,255,0.08)"
          }`,
          boxShadow: focused ? `0 0 16px rgba(${accent},0.1)` : "none",
        }}
      >
        <span className="font-mono text-sm" style={{ color: `rgba(${accent},0.6)` }}>
          $
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-200 placeholder-gray-600"
          placeholder={`enter ${label.toLowerCase()}...`}
          autoComplete="off"
        />
        {focused && (
          <span className="font-mono text-sm animate-pulse" style={{ color: `rgba(${accent},0.8)` }}>
            ▌
          </span>
        )}
      </div>
    </div>
  );
}

function TerminalTextarea({ label, name, value, onChange, accent = "0,255,136" }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        className="font-mono text-[11px] tracking-widest uppercase"
        style={{ color: `rgba(${accent}, 0.7)` }}
      >
        &gt; {label}
      </label>
      <div
        className="rounded-lg px-3 py-2.5 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${
            focused ? `rgba(${accent},0.5)` : "rgba(255,255,255,0.08)"
          }`,
          boxShadow: focused ? `0 0 16px rgba(${accent},0.1)` : "none",
        }}
      >
        <div className="flex gap-2">
          <span
            className="font-mono text-sm mt-0.5 flex-shrink-0"
            style={{ color: `rgba(${accent},0.6)` }}
          >
            $
          </span>
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            required
            rows={5}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-200 placeholder-gray-600 resize-none"
            placeholder="enter message..."
          />
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />

      <section className="max-w-3xl mx-auto px-4 pt-8 pb-24 space-y-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-xs tracking-[0.25em] text-green-500/60 uppercase">
            &gt; INITIATING CONTACT PROTOCOL...
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne)", letterSpacing: "0.04em" }}
          >
            Send a Message
          </h1>
          <p className="text-gray-400 text-sm font-mono">
            Open to work, collabs, and side quests. ▌
          </p>
        </div>

        <RPGFrame title="TRANSMIT_MESSAGE.EXE" accent="0,255,136">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TerminalInput
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                accent="0,255,136"
              />
              <TerminalInput
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                accent="96,165,250"
              />
            </div>

            <TerminalInput
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              accent="167,139,250"
            />

            <TerminalTextarea
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              accent="74,222,128"
            />

            {status === "success" && (
              <div
                className="font-mono text-sm rounded-lg px-4 py-3"
                style={{
                  background: "rgba(0,255,136,0.08)",
                  border: "1px solid rgba(0,255,136,0.25)",
                  color: "#00ff88",
                }}
              >
                ✓ MESSAGE TRANSMITTED SUCCESSFULLY — I will respond within 24hrs.
              </div>
            )}

            {status === "error" && (
              <div
                className="font-mono text-sm rounded-lg px-4 py-3"
                style={{
                  background: "rgba(236,72,153,0.08)",
                  border: "1px solid rgba(236,72,153,0.25)",
                  color: "rgb(236,72,153)",
                }}
              >
                ✗ TRANSMISSION FAILED — check your credentials or try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full font-mono font-bold text-sm py-3 rounded-xl tracking-widest uppercase transition-all duration-200 disabled:opacity-50"
              style={{
                background:
                  status === "sending"
                    ? "rgba(0,255,136,0.1)"
                    : "rgba(0,255,136,0.12)",
                border: "1px solid rgba(0,255,136,0.35)",
                color: "#00ff88",
                boxShadow:
                  status === "sending"
                    ? "none"
                    : "0 0 20px rgba(0,255,136,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,255,136,0.2)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,136,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  status === "sending"
                    ? "rgba(0,255,136,0.1)"
                    : "rgba(0,255,136,0.12)";
                e.currentTarget.style.boxShadow =
                  status === "sending"
                    ? "none"
                    : "0 0 20px rgba(0,255,136,0.08)";
              }}
            >
              {status === "sending" ? "[ TRANSMITTING... ▌ ]" : "[ TRANSMIT MESSAGE ]"}
            </button>
          </form>
        </RPGFrame>

        <RPGFrame title="COMMS_CHANNELS.DAT" accent="96,165,250">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 font-mono text-sm transition-all duration-200 group"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid rgba(${s.color},0.15)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${s.color},0.06)`;
                  e.currentTarget.style.borderColor = `rgba(${s.color},0.4)`;
                  e.currentTarget.style.boxShadow = `0 0 16px rgba(${s.color},0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = `rgba(${s.color},0.15)`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span className="text-[10px] tracking-widest" style={{ color: `rgba(${s.color},0.6)` }}>
                  [{s.label.toUpperCase()}]
                </span>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
                  {s.value}
                </span>
                <span className="ml-auto text-gray-600 group-hover:text-gray-300 transition-colors duration-200">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </RPGFrame>
      </section>
    </>
  );
}