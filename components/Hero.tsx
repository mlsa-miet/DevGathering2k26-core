"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ── Countdown target: 4 April 2026 09:00 IST ── */
const TARGET = new Date("2026-04-04T09:00:00+05:30");

function getTimeLeft() {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  };
}

/* ── Deterministic floating shapes ── */
// const SHAPES = [
//   { x: "4%",  y: "10%", size: 52, color: BLUE,   delay: 0.2, dur: 6.2 },
//   { x: "89%", y: "8%",  size: 38, color: PINK,   delay: 0.5, dur: 7.1 },
//   { x: "83%", y: "66%", size: 44, color: GREEN,  delay: 0.3, dur: 5.8 },
//   { x: "2%",  y: "72%", size: 30, color: YELLOW, delay: 0.7, dur: 6.6 },
//   { x: "48%", y: "3%",  size: 20, color: PINK,   delay: 1.1, dur: 5.2 },
//   { x: "93%", y: "42%", size: 38, color: BLUE,   delay: 0.4, dur: 7.3 },
//   { x: "20%", y: "88%", size: 26, color: GREEN,  delay: 0.6, dur: 6.0 },
//   { x: "64%", y: "84%", size: 18, color: YELLOW, delay: 0.9, dur: 5.6 },
// ];

/* ════════════════════════════════════════════════════
   Flip Digit Card
════════════════════════════════════════════════════ */
function TickerDigit({
  value, label, accent, bg,
}: {
  value: number; label: string; accent: string; bg: string;
}) {
  const [displayed, setDisplayed] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayed) {
      setAnimating(true);
      const t = setTimeout(() => { setDisplayed(value); setAnimating(false); }, 280);
      return () => clearTimeout(t);
    }
  }, [value, displayed]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width:  "clamp(58px, 11vw, 96px)",
          height: "clamp(62px, 12vw, 102px)",
          borderRadius: 16,
          background: bg,
          outline: `2px solid ${accent}42`,
          outlineOffset: 0,
          boxShadow: `0 0 0 4px ${accent}10, 0 8px 24px ${accent}24, inset 0 1px 0 rgba(255,255,255,0.85)`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.65) 0%, transparent 52%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(${accent}28 1px, transparent 1px)`, backgroundSize: "12px 12px", opacity: 0.5 }} />
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}bb 40%, ${accent} 50%, ${accent}bb 60%, transparent)` }} />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: accent }} />

        <motion.span
          key={displayed}
          initial={animating ? { y: -20, opacity: 0, scale: 0.8 } : false}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 font-black tabular-nums select-none"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 4.5vw, 38px)", color: "#1a1a1a", letterSpacing: "-0.03em" }}
        >
          {String(displayed).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-[8px] uppercase tracking-[0.42em] font-semibold"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}>
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <motion.div className="flex flex-col gap-1.5 mb-6"
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ccc" }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ccc" }} />
    </motion.div>
  );
}

function Pill({ icon, text, accent, bg, delay }: { icon: React.ReactNode; text: string; accent: string; bg: string; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
      style={{ background: bg, border: `1.5px solid ${accent}38`, boxShadow: `0 2px 10px ${accent}16` }}
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <span style={{ color: accent, display: "flex" }}>{icon}</span>
      <span className="text-[11px] font-semibold whitespace-nowrap"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#444" }}>
        {text}
      </span>
    </motion.div>
  );
}

const CalIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const PinIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const ClkIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const UsrIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

/* ════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════ */
export default function HeroSection() {
  const [time, setTime]     = useState(getTimeLeft());
  const containerRef        = useRef<HTMLDivElement>(null);
  const { scrollY }         = useScroll();
  const bgY                 = useTransform(scrollY, [0, 600], [0, 90]);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const tickers = [
    { value: time.days,    label: "Days",    accent: "#5BA4E6", bg: BLUE   },
    { value: time.hours,   label: "Hours",   accent: "#E8916E", bg: YELLOW },
    { value: time.minutes, label: "Minutes", accent: "#4CAF50", bg: GREEN  },
    { value: time.seconds, label: "Seconds", accent: "#D85C8A", bg: PINK   },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16 md:mt-7"
    >
      {/* ── Parallax 4-band bg ── */}
      <motion.div className="absolute inset-0 flex pointer-events-none" style={{ y: bgY }}>
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.13]" style={{ background: c }} />
        ))}
      </motion.div>

      {/* ── Floating blobs ── */}
      {/* {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: s.color, filter: "blur(1.5px)" }}
          animate={{ y: [0, -14, 0, 8, 0], x: [0, 6, 0, -4, 0], opacity: [0.45, 0.65, 0.7, 0.6, 0.45], scale: [0.94, 1.05, 1.02, 1.05, 0.94] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))} */}

      {/* ── Ghost watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{ opacity: 0.022 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(80px, 19vw, 230px)", color: "#2d2d2d", whiteSpace: "nowrap" }}>
          DEV2K26
        </span>
      </div>

      {/* ══════════════════════════════════════════════
          CONTENT STACK
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5 w-full max-w-3xl">

        {/* ── MLSA badge ── */}
        <motion.div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white"
          style={{ border: "1.5px solid rgba(91,164,230,0.25)", boxShadow: "0 2px 12px rgba(91,164,230,0.1)" }}
          initial={{ opacity: 0, y: -16, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-1">
            {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, border: "1px solid rgba(0,0,0,0.09)" }} />
            ))}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.42em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
            MLSA MIET Presents
          </span>
        </motion.div>

        {/* ── EVENT LOGO SLOT ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
         

          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-2 rounded-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(207,232,255,0.6), rgba(255,233,168,0.45), rgba(215,245,208,0.4), rgba(255,214,232,0.5))" }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Placeholder logo box */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              width:        "clamp(160px, 22vw, 280px)",
              height:       "clamp(64px, 9vw, 100px)",
              borderRadius: 14,
              background:   "rgba(255,255,255,0.75)",
              border:       "1.5px dashed rgba(91,164,230,0.38)",
              boxShadow:    "0 4px 20px rgba(91,164,230,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
            }}
          >
            
            {/* Dot grid inside placeholder */}
            <img
                src="./devgatheringlogo.png"
                alt="DevGathering 2K26"
                style={{
                  width: "clamp(160px, 22vw, 280px)",
                  height: "auto",
                  maxHeight: 100,
                  objectFit: "contain",
                }}
              />
          </div>
        </motion.div>

        {/* ── TITLE BLOCK ── */}
        <div className="flex flex-col items-center gap-0">
          {/* Main wordmark */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-black leading-[0.92] tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(38px, 8.5vw, 82px)",
                color: "#2d2d2d",
              }}
            >
              Dev<span style={{ color: "#5BA4E6" }}>Gathering</span>
            </h1>

            {/* 2K26 — slightly smaller, accent colour, with flanking lines */}
            <div className="flex items-center gap-3 mt-0.5">
              <motion.div
                className="h-[3px] rounded-full hidden sm:block"
                style={{ background: "linear-gradient(90deg, transparent, #E8916E)", width: 36 }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              />
              <h2
                className="font-black tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 7.5vw, 68px)", color: "#E8916E", letterSpacing: "-0.02em" }}
              >
                2K26
              </h2>
              <motion.div
                className="h-[3px] rounded-full hidden sm:block"
                style={{ background: "linear-gradient(90deg, #E8916E, transparent)", width: 36 }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              />
            </div>
          </motion.div>

          {/* Rainbow rule */}
          <motion.div
            className="rounded-full mt-2"
            style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 90, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* ── Tagline ── */}
        <motion.p
          className="text-sm sm:text-base max-w-md leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Where ideas collide, code comes alive, and the next big thing begins.{" "}
          <span style={{ color: "#5BA4E6", fontWeight: 600 }}>24 hours. Infinite possibilities.</span>
        </motion.p>

        {/* ── Info pills ── */}
        <div className="flex flex-wrap justify-center gap-2">
          <Pill icon={<CalIcon />} text="4 April 2026"         accent="#5BA4E6" bg={BLUE}   delay={0.80} />
          <Pill icon={<PinIcon />} text="MIET, Meerut"         accent="#E8916E" bg={YELLOW} delay={0.90} />
          <Pill icon={<ClkIcon />} text="24-Hour Hackathon"    accent="#4CAF50" bg={GREEN}  delay={1.00} />
          <Pill icon={<UsrIcon />} text="Open to All Colleges" accent="#D85C8A" bg={PINK}   delay={1.10} />
        </div>

        {/* ── Countdown ── */}
        <motion.div
          className="w-full flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[9px] uppercase tracking-[0.55em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#c0c0c0" }}>
            Hackathon Starts In
          </p>
          <div className="flex items-end justify-center gap-2 sm:gap-3">
            {tickers.map((t, i) => (
              <div key={t.label} className="flex items-end gap-2 sm:gap-3">
                <TickerDigit {...t} />
                {i < tickers.length - 1 && <Colon />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.a
            href="#register"
            className="relative inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #5BA4E6, #3f8fd4)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(91,164,230,0.36), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            whileHover={{ scale: 1.06, boxShadow: "0 8px 28px rgba(91,164,230,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Register Now
          </motion.a>

          <motion.a
            href="#about"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold bg-white"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#555",
              border: "1.5px solid rgba(0,0,0,0.09)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
            whileHover={{ scale: 1.06, boxShadow: "0 6px 20px rgba(0,0,0,0.09)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Learn More
          </motion.a>
        </motion.div>

        {/* ── Scroll nudge ── */}
        <motion.div
          className="mt-1 flex flex-col items-center gap-1 opacity-30"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[9px] uppercase tracking-[0.42em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#999" }}>
            Scroll
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}