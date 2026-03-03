"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ── 8 Tracks arranged in a circle ── */
const TRACKS = [
  {
    id: 0,
    number: 1,
    name: "HealthTech",
    icon: "🏥",
    accent: "#5BA4E6",
    bg: BLUE,
    desc: "Build solutions that improve healthcare access, patient outcomes, or medical workflows.",
  },
  {
    id: 1,
    number: 2,
    name: "EdTech",
    icon: "📚",
    accent: "#E8916E",
    bg: YELLOW,
    desc: "Reimagine how people learn — from classrooms to self-paced platforms and beyond.",
  },
  {
    id: 2,
    number: 3,
    name: "FinTech",
    icon: "💰",
    accent: "#4CAF50",
    bg: GREEN,
    desc: "Innovate in payments, budgeting, lending, or financial inclusion for the underserved.",
  },
  {
    id: 3,
    number: 4,
    name: "Sustainability",
    icon: "🌱",
    accent: "#D85C8A",
    bg: PINK,
    desc: "Create tech-driven solutions for climate action, clean energy, or waste reduction.",
  },
  {
    id: 4,
    number: 5,
    name: "AI & ML",
    icon: "🤖",
    accent: "#C89A2A",
    bg: YELLOW,
    desc: "Harness the power of machine learning, LLMs, or computer vision to solve real problems.",
  },
  {
    id: 5,
    number: 6,
    name: "Open Innovation",
    icon: "💡",
    accent: "#5BA4E6",
    bg: BLUE,
    desc: "No track? No problem. Bring your wildest idea — anything goes here.",
  },
  {
    id: 6,
    number: 7,
    name: "Smart Cities",
    icon: "🏙️",
    accent: "#4CAF50",
    bg: GREEN,
    desc: "Design solutions for urban mobility, civic tech, or connected infrastructure.",
  },
  {
    id: 7,
    number: 8,
    name: "CyberSecurity",
    icon: "🔐",
    accent: "#D85C8A",
    bg: PINK,
    desc: "Tackle digital threats, privacy challenges, or build tools that make the web safer.",
  },
];

/* ── Orbital positions for 8 cards (angle in degrees, 0 = top) ── */
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/* ── Polar helper ── */
function getPolarPosition(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

/* ══════════════════════════════════════════════════════
   BULB SVG
══════════════════════════════════════════════════════ */
function Bulb({ on }: { on: boolean }) {
  return (
    <svg
      width="90"
      height="120"
      viewBox="0 0 90 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cord */}
      <line x1="45" y1="0" x2="45" y2="18" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />

      {/* Outer glow — only when on */}
      {on && (
        <>
          <ellipse cx="45" cy="62" rx="38" ry="38"
            fill="#fbbf24" opacity="0.12" />
          <ellipse cx="45" cy="62" rx="28" ry="28"
            fill="#fbbf24" opacity="0.18" />
        </>
      )}

      {/* Bulb glass */}
      <path
        d="M20 55 Q18 36 45 24 Q72 36 70 55 Q70 72 58 80 L58 88 Q58 92 54 92 L36 92 Q32 92 32 88 L32 80 Q20 72 20 55 Z"
        fill={on ? "url(#bulbLitGrad)" : "url(#bulbDimGrad)"}
        stroke={on ? "#f59e0b" : "#d1d5db"}
        strokeWidth="1.5"
      />

      {/* Filament */}
      <path
        d="M38 78 Q38 70 42 65 Q45 60 48 65 Q52 70 52 78"
        fill="none"
        stroke={on ? "#f59e0b" : "#9ca3af"}
        strokeWidth={on ? "2" : "1.5"}
        strokeLinecap="round"
      />

      {/* Base rings */}
      <rect x="32" y="88" width="26" height="5" rx="2" fill={on ? "#fbbf24" : "#d1d5db"} />
      <rect x="34" y="93" width="22" height="5" rx="2" fill={on ? "#f59e0b" : "#9ca3af"} />
      <rect x="36" y="98" width="18" height="5" rx="2" fill={on ? "#f59e0b" : "#6b7280"} />

      {/* Shine spot */}
      {on && (
        <ellipse cx="36" cy="42" rx="5" ry="8"
          fill="rgba(255,255,255,0.35)" transform="rotate(-20 36 42)" />
      )}

      <defs>
        <radialGradient id="bulbLitGrad" cx="50%" cy="60%" r="55%">
          <stop offset="0%"  stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="bulbDimGrad" cx="50%" cy="50%" r="55%">
          <stop offset="0%"  stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#d1d5db" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   TRACK CARD
══════════════════════════════════════════════════════ */
function TrackCard({
  track,
  angle,
  radius,
  revealed,
  delay,
}: {
  track: (typeof TRACKS)[0];
  angle: number;
  radius: number;
  revealed: boolean;
  delay: number;
}) {
  const { x, y } = getPolarPosition(angle, radius);
  const CARD_W = 138;
  const CARD_H = 156;

  return (
    <motion.div
      className="absolute flex flex-col overflow-hidden rounded-2xl cursor-default"
      style={{
        width: CARD_W,
        height: CARD_H,
        left: `calc(50% + ${x}px - ${CARD_W / 2}px)`,
        top:  `calc(50% + ${y}px - ${CARD_H / 2}px)`,
        background: revealed ? track.bg : "#f0f0f0",
        outline: `1.5px solid ${revealed ? track.accent + "45" : "rgba(0,0,0,0.08)"}`,
        outlineOffset: 0,
        boxShadow: revealed
          ? `0 0 0 4px ${track.accent}10, 0 8px 28px ${track.accent}28, inset 0 1px 0 rgba(255,255,255,0.85)`
          : "0 2px 10px rgba(0,0,0,0.06)",
        transition: "background 0.4s, outline 0.4s, box-shadow 0.4s",
        zIndex: 10,
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={
        revealed
          ? { scale: 1, opacity: 1, y: 0 }
          : { scale: 0.88, opacity: 0.55, y: 0 }
      }
      transition={{
        duration: 0.55,
        delay: revealed ? delay : delay * 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={revealed ? { scale: 1.07, zIndex: 20 } : {}}
    >
      {/* Gloss — only revealed */}
      {revealed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 52%)",
            borderRadius: "inherit",
          }}
        />
      )}

      {/* Dot grid — only revealed */}
      {revealed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${track.accent}28 1px, transparent 1px)`,
            backgroundSize: "12px 12px",
            opacity: 0.45,
            borderRadius: "inherit",
          }}
        />
      )}

      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: revealed
            ? `linear-gradient(90deg, transparent, ${track.accent}bb 35%, ${track.accent} 50%, ${track.accent}bb 65%, transparent)`
            : "transparent",
          borderRadius: "16px 16px 0 0",
          transition: "background 0.4s",
        }}
        animate={revealed ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: revealed ? delay + 0.15 : 0 }}
      />

      {/* Corner pip */}
      {revealed && (
        <div
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-50"
          style={{ background: track.accent }}
        />
      )}

      {/* Track watermark number */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 64,
          color: revealed ? track.accent : "#bbb",
          opacity: revealed ? 0.1 : 0.25,
          transition: "color 0.4s, opacity 0.4s",
          letterSpacing: "-0.04em",
        }}
      >
        {track.number}
      </div>

      {/* Lock icon — shown when not revealed */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center rounded-full"
              style={{
                width: 36, height: 36,
                background: "rgba(0,0,0,0.05)",
                border: "1.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </motion.div>
            <p
              className="text-[9px] uppercase tracking-[0.35em] font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}
            >
              Track {track.number}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content — shown when revealed */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="relative z-10 flex flex-col gap-2 p-3 pt-4 h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, delay: delay + 0.2 }}
          >
            {/* Icon */}
            <motion.div
              className="flex items-center justify-center rounded-xl text-2xl"
              style={{
                width: 44, height: 44,
                background: "white",
                border: `1.5px solid ${track.accent}28`,
                boxShadow: `0 0 0 3px ${track.accent}14`,
                alignSelf: "flex-start",
              }}
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {track.icon}
            </motion.div>

            {/* Name */}
            <p
              className="font-black leading-tight tracking-tight text-xs"
              style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}
            >
              {track.name}
            </p>

            {/* Desc */}
            <p
              className="text-[9px] leading-snug flex-1"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}
            >
              {track.desc}
            </p>

            {/* Tag */}
            <span
              className="inline-flex items-center gap-1 self-start text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: `${track.accent}1c`,
                border: `1px solid ${track.accent}45`,
                color: track.accent,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Track {track.number}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   CONNECTOR LINES from bulb to each card
══════════════════════════════════════════════════════ */
function ConnectorLines({ on, radius }: { on: boolean; radius: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {ANGLES.map((angle, i) => {
        const { x, y } = getPolarPosition(angle, radius - 80);
        return (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${x}px)`}
            y2={`calc(50% + ${y}px)`}
            stroke={on ? TRACKS[i].accent : "rgba(0,0,0,0.08)"}
            strokeWidth={on ? 1.5 : 1}
            strokeDasharray="4 4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={on
              ? { pathLength: 1, opacity: 0.55 }
              : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.4, delay: on ? i * 0.07 : 0, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE GRID — shown below md breakpoint
══════════════════════════════════════════════════════ */
function MobileGrid({ on }: { on: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full px-2 md:hidden">
      {TRACKS.map((track, i) => (
        <motion.div
          key={track.id}
          className="relative flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: on ? track.bg : "#f0f0f0",
            outline: `1.5px solid ${on ? track.accent + "45" : "rgba(0,0,0,0.08)"}`,
            boxShadow: on
              ? `0 0 0 4px ${track.accent}10, 0 8px 28px ${track.accent}28, inset 0 1px 0 rgba(255,255,255,0.85)`
              : "0 2px 10px rgba(0,0,0,0.06)",
            minHeight: 160,
            transition: "background 0.4s, outline 0.4s, box-shadow 0.4s",
          }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={on ? { scale: 1, opacity: 1 } : { scale: 0.88, opacity: 0.55 }}
          transition={{ duration: 0.55, delay: on ? i * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top accent bar */}
          {on && (
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${track.accent}bb 35%, ${track.accent} 50%, ${track.accent}bb 65%, transparent)`,
              }}
            />
          )}

          {/* Dot grid */}
          {on && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${track.accent}28 1px, transparent 1px)`,
                backgroundSize: "12px 12px",
                opacity: 0.45,
                borderRadius: "inherit",
              }}
            />
          )}

          {/* Watermark number */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: 64,
              color: on ? track.accent : "#bbb",
              opacity: on ? 0.1 : 0.25,
              transition: "color 0.4s",
            }}
          >
            {track.number}
          </div>

          {/* Lock state */}
          <AnimatePresence>
            {!on && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 36, height: 36,
                    background: "rgba(0,0,0,0.05)",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <p className="text-[9px] uppercase tracking-[0.35em] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}>
                  Track {track.number}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Revealed content */}
          <AnimatePresence>
            {on && (
              <motion.div
                className="relative z-10 flex flex-col gap-2 p-3 pt-4 h-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 + 0.2 }}
              >
                <div
                  className="flex items-center justify-center rounded-xl text-2xl"
                  style={{
                    width: 44, height: 44,
                    background: "white",
                    border: `1.5px solid ${track.accent}28`,
                    boxShadow: `0 0 0 3px ${track.accent}14`,
                    alignSelf: "flex-start",
                  }}
                >
                  {track.icon}
                </div>
                <p className="font-black leading-tight tracking-tight text-xs" style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}>
                  {track.name}
                </p>
                <p className="text-[9px] leading-snug flex-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
                  {track.desc}
                </p>
                <span
                  className="inline-flex items-center self-start text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${track.accent}1c`,
                    border: `1px solid ${track.accent}45`,
                    color: track.accent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Track {track.number}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   THEMES SECTION — default export
══════════════════════════════════════════════════════ */
export default function ThemesSection() {
  const [on, setOn] = useState(false);

  /*
   * Orbit sizing:
   * – RADIUS_DESKTOP: distance from center to card center
   * – ORBIT_SIZE: the square container that holds the orbit
   *   = 2 × radius + card width + some breathing room
   *   Cards are 138 px wide so we add ~160 px extra.
   */
  const RADIUS_DESKTOP = 510;               // ← was 230, now much bigger
  const ORBIT_SIZE     = RADIUS_DESKTOP * 2 + 180; // ≈ 800 px

  const toggle = useCallback(() => setOn((v) => !v), []);

  return (
    <section
      id="themes"
      className="relative w-full py-20 px-4 overflow-hidden"
      style={{ background: "#fafafa" }}
    >
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.08]" style={{ background: c }} />
        ))}
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ghost watermark */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.018 }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(100px, 20vw, 280px)",
            color: "#2d2d2d",
            whiteSpace: "nowrap",
          }}
        >
          THEMES
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Title ── */}
        <div className="text-center mb-10">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pick Your Track
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.08 }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>Hackathon </span>
            <span style={{ color: "#5BA4E6" }}>Themes</span>
          </motion.h2>

          <motion.div
            className="mx-auto mt-4 rounded-full"
            style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="mt-4 text-sm max-w-sm mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {on
              ? "The tracks are live — choose your battlefield."
              : "Hit the switch to reveal all 8 tracks."}
          </motion.p>
        </div>

        {/* ── ON / OFF button ── */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p
            className="text-[9px] uppercase tracking-[0.45em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}
          >
            {on ? "Click to turn off" : "Click to illuminate"}
          </p>

          {/* Toggle switch */}
          <motion.button
            onClick={toggle}
            className="relative flex items-center rounded-full cursor-pointer border-none"
            style={{
              width: 80,
              height: 40,
              background: on
                ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                : "rgba(0,0,0,0.1)",
              padding: 4,
              boxShadow: on
                ? "0 0 0 4px rgba(251,191,36,0.2), 0 4px 18px rgba(251,191,36,0.45)"
                : "0 2px 8px rgba(0,0,0,0.1)",
              transition: "background 0.4s, box-shadow 0.4s",
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="rounded-full bg-white"
              style={{
                width: 32, height: 32,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              animate={{ x: on ? 40 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* ON/OFF label */}
            <motion.span
              className="absolute text-[9px] font-black uppercase tracking-widest"
              style={{
                fontFamily: "'Syne', sans-serif",
                color: on ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.3)",
                left: on ? 10 : "auto",
                right: on ? "auto" : 10,
                transition: "color 0.3s",
              }}
            >
              {on ? "ON" : "OFF"}
            </motion.span>
          </motion.button>
        </motion.div>

        {/* ── Track count badges when on ── */}
        <AnimatePresence>
          {on && (
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              {TRACKS.map((t, i) => (
                <motion.span
                  key={t.id}
                  className="text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: `${t.accent}18`,
                    border: `1px solid ${t.accent}40`,
                    color: t.accent,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.05 }}
                >
                  {t.icon} {t.name}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MOBILE: 2-column grid ── */}
        <MobileGrid on={on} />

        {/* ── DESKTOP: Orbit ── */}
        <div className="hidden md:flex flex-col items-center">
          <div
            className="relative"
            style={{
              width: ORBIT_SIZE,
              height: ORBIT_SIZE,
              maxWidth: "min(100vw - 48px, 860px)",
              maxHeight: "min(100vw - 48px, 860px)",
            }}
          >
            {/* Ambient glow when on */}
            <AnimatePresence>
              {on && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "45%",
                    height: "45%",
                    top: "27.5%",
                    left: "27.5%",
                    background: "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(245,158,11,0.08) 50%, transparent 70%)",
                    filter: "blur(32px)",
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </AnimatePresence>

            {/* Orbit ring */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                /* ring sits right at the card centers */
                width: `${(RADIUS_DESKTOP * 2 / ORBIT_SIZE) * 100}%`,
                height: `${(RADIUS_DESKTOP * 2 / ORBIT_SIZE) * 100}%`,
                top: `${((ORBIT_SIZE / 2 - RADIUS_DESKTOP) / ORBIT_SIZE) * 100}%`,
                left: `${((ORBIT_SIZE / 2 - RADIUS_DESKTOP) / ORBIT_SIZE) * 100}%`,
                border: on ? "1.5px dashed rgba(251,191,36,0.3)" : "1.5px dashed rgba(0,0,0,0.07)",
                transition: "border 0.5s",
              }}
            />

            {/* Connector dashed lines */}
            <ConnectorLines on={on} radius={RADIUS_DESKTOP * 0.5} />

            {/* Track cards */}
            {TRACKS.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                angle={ANGLES[i]}
                radius={RADIUS_DESKTOP * 0.5}
                revealed={on}
                delay={on ? i * 0.08 : (TRACKS.length - 1 - i) * 0.04}
              />
            ))}

            {/* ── CENTER BULB ── */}
            <div
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -54%)",
                zIndex: 20,
              }}
            >
              {/* Pulsing rings when on */}
              <AnimatePresence>
                {on && (
                  <>
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 110, height: 110,
                        top: "50%", left: "50%",
                        translateX: "-50%", translateY: "-50%",
                        border: "1.5px solid rgba(251,191,36,0.4)",
                      }}
                      animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 110, height: 110,
                        top: "50%", left: "50%",
                        translateX: "-50%", translateY: "-50%",
                        border: "1.5px solid rgba(251,191,36,0.25)",
                      }}
                      animate={{ scale: [1, 2], opacity: [0.35, 0] }}
                      transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.div
                animate={on
                  ? { filter: "drop-shadow(0 0 24px rgba(251,191,36,0.7)) drop-shadow(0 0 8px rgba(245,158,11,0.5))" }
                  : { filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))" }
                }
                transition={{ duration: 0.5 }}
              >
                <Bulb on={on} />
              </motion.div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}