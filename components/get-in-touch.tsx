"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

const MIET_LAT = 28.973047;
const MIET_LNG = 77.641003;
const MAPS_URL  = `https://www.google.com/maps/search/?api=1&query=${MIET_LAT},${MIET_LNG}`;
const EMBED_URL = `https://maps.google.com/maps?q=${MIET_LAT},${MIET_LNG}&z=16&output=embed`;

const QUICK_LINKS = [
  { label: "Home",        href: "#"           },
  { label: "About",       href: "#about"      },
  { label: "Past Events", href: "#past-events" },
  { label: "Timeline",    href: "#timeline"   },
  { label: "Themes",      href: "#themes"     },
  { label: "Prizes",      href: "#prizes"     },
  { label: "Sponsors",    href: "#sponsors"   },
  { label: "FAQs",        href: "#faq"        },
  { label: "Our Team",    href: "#organisers" },
];

/* ── Social icons ── */
const SOCIALS = [
  {
    label: "Instagram",
    href:  "#",
    accent: "#D85C8A",
    bg: PINK,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  "#",
    accent: "#5BA4E6",
    bg: BLUE,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href:  "#",
    accent: "#4CAF50",
    bg: GREEN,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Website",
    href:  "#",
    accent: "#C89A2A",
    bg: YELLOW,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

/* ── helpers ── */
const EmailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

/* ── Character slot ── */
function CharSlot({ className, style, label }: { className?: string; style?: React.CSSProperties; label: string }) {
  return (
    <div className={`pointer-events-none select-none absolute ${className ?? ""}`} style={style}>
      {/*
        Replace with your character PNG:
        <img src="/characters/char.png" alt="" style={{ height: '100%', objectFit: 'contain' }} />
      */}
      <div
        className="flex items-end justify-center rounded-xl"
        style={{
          width: "100%", height: "100%",
          border: "1.5px dashed rgba(0,0,0,0.09)",
          background: "rgba(0,0,0,0.018)",
        }}
      >
        <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#ccc", fontSize: 8, paddingBottom: 4 }}>{label}</span>
      </div>
    </div>
  );
}

function Separator({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex items-center gap-4 my-10">
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{
          background: "white",
          border: "1.5px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 4-dot icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="4"  cy="4"  r="3" fill="#CFE8FF" stroke="#5BA4E6" strokeWidth="1"/>
          <circle cx="12" cy="4"  r="3" fill="#FFE9A8" stroke="#C89A2A" strokeWidth="1"/>
          <circle cx="4"  cy="12" r="3" fill="#D7F5D0" stroke="#4CAF50" strokeWidth="1"/>
          <circle cx="12" cy="12" r="3" fill="#FFD6E8" stroke="#D85C8A" strokeWidth="1"/>
        </svg>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.35em] whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}
        >
          {label}
        </span>
      </motion.div>
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FFD6E8, #D7F5D0, #FFE9A8, #CFE8FF, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   GET IN TOUCH FOOTER
══════════════════════════════════════════════════════ */
export default function GetInTouchSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ background: "#fafafa" }}
    >

      <Separator label="Wanna Reach Out ?" />

      {/* Pastel bands */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.09]" style={{ background: c }} />
        ))}
      </div>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* Rainbow top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, #CFE8FF)" }} />

      {/* Character slots — only xl */}
      <CharSlot
        className="hidden xl:block"
        style={{ left: 16, bottom: 0, width: 90, height: 160, zIndex: 2 }}
        label="char PNG"
      />
      <CharSlot
        className="hidden xl:block"
        style={{ right: 16, bottom: 0, width: 90, height: 160, zIndex: 2 }}
        label="char PNG"
      />

      {/* ══ Main footer grid ══ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ── COL 1: Brand ── */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Logos row */}
            <div className="flex items-center gap-2.5">
              {/* Event logo — replace inner div */}
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 38, height: 38,
                  background: BLUE,
                  border: "1.5px dashed rgba(91,164,230,0.4)",
                  boxShadow: "0 0 0 3px rgba(91,164,230,0.1)",
                }}
              >
                <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#5BA4E6", fontSize: 7, textAlign: "center" }}>logo</span>
              </div>
              {/* Community logo — replace inner div */}
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  width: 30, height: 30,
                  background: PINK,
                  border: "1.5px dashed rgba(216,92,138,0.4)",
                }}
              >
                <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#D85C8A", fontSize: 6 }}>MLSA</span>
              </div>
              <div>
                <p className="font-black leading-none text-sm"
                  style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}>
                  Dev<span style={{ color: "#5BA4E6" }}>Gathering</span>
                </p>
                <p className="text-[9px] uppercase tracking-[0.35em] mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}>
                  2K26 · MLSA MIET
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
              A 24-hour hackathon where ideas collide, code comes alive, and the next big thing begins.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 32, height: 32,
                    background: s.bg,
                    color: s.accent,
                    border: `1.5px solid ${s.accent}40`,
                    boxShadow: `0 2px 8px ${s.accent}18`,
                    transition: "box-shadow 0.2s",
                  }}
                  whileHover={{ scale: 1.15, boxShadow: `0 4px 14px ${s.accent}40` }}
                  whileTap={{ scale: 0.92 }}
                  title={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── COL 2: Get in Touch ── */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[9px] uppercase tracking-[0.48em] font-bold mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#5BA4E6" }}>
              Get in Touch
            </p>

            {[
              { icon: <EmailIcon />, text: "mlsa.community@miet.ac.in", href: "mailto:mlsa.community@miet.ac.in", accent: "#5BA4E6" },
              { icon: <PhoneIcon />, text: "+91 12345 67899",            href: "tel:+911234567899",               accent: "#4CAF50" },
              { icon: <PinIcon />,   text: "N.H. 58, Delhi-Roorkee Highway, Baghpat Bypass Road Crossing, Meerut, UP 250005",
                                                                          href: MAPS_URL,                           accent: "#E8916E" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group"
                style={{ textDecoration: "none" }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="flex items-center justify-center rounded-lg mt-0.5 shrink-0 transition-colors duration-200"
                  style={{
                    width: 26, height: 26,
                    color: item.accent,
                    background: `${item.accent}14`,
                    border: `1px solid ${item.accent}30`,
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-xs leading-snug"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#555",
                    transition: "color 0.2s",
                  }}
                >
                  {item.text}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* ── COL 3: Quick Links ── */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[9px] uppercase tracking-[0.48em] font-bold mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#E8916E" }}>
              Quick Links
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {QUICK_LINKS.map((l, i) => (
                <motion.a
                  key={i}
                  href={l.href}
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#777",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  whileHover={{ x: 3, color: "#1a1a1a" }}
                  transition={{ duration: 0.15 }}
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: "#ddd" }}
                  />
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── COL 4: Map ── */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[9px] uppercase tracking-[0.48em] font-bold mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#4CAF50" }}>
              Location
            </p>

            {/* Map card */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-xl group"
              style={{
                height: 150,
                outline: "1.5px solid rgba(91,164,230,0.3)",
                boxShadow: "0 4px 16px rgba(91,164,230,0.14)",
                textDecoration: "none",
              }}
            >
              <iframe
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", pointerEvents: "none" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MIET Meerut"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                style={{
                  background: "rgba(207,232,255,0.72)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{
                    background: "#5BA4E6",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 3px 12px rgba(91,164,230,0.45)",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Open in Maps
                </div>
              </div>

              {/* Rainbow top bar on card */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }} />
            </a>

            <p className="text-[10px] leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#999" }}>
              MIET, N.H. 58, Meerut, UP 250005
            </p>
          </motion.div>

        </div>

        {/* ── Divider ── */}
        <motion.div
          className="mt-8 mb-5 h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, #CFE8FF 20%, #FFE9A8 40%, #D7F5D0 60%, #FFD6E8 80%, transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* ── Bottom strip ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          {/* Left: brand dots */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: c, border: "1px solid rgba(0,0,0,0.07)" }} />
              ))}
            </div>
            <p className="text-[10px] font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}>
              DevGathering 2K26 · MLSA MIET
            </p>
          </div>

          {/* Right: copyright */}
          <p className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}>
            © 2026 MLSA MIET. All rights reserved.
          </p>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        a:hover span { color: #1a1a1a; }
      `}</style>
    </footer>
  );
}