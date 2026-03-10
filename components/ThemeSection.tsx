"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  GraduationCap,
  Banknote,
  Leaf,
  Bot,
  Lightbulb,
  Building2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Star,
  Zap,
} from "lucide-react";

/* ── Palette ── */
const BLUE = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN = "#D7F5D0";
const PINK = "#FFD6E8";

/* ── 8 Tracks ── */
const TRACKS = [
  {
    id: 0,
    number: 1,
    name: "HealthTech",
    Icon: HeartPulse,
    accent: "#5BA4E6",
    bg: BLUE,
    desc: "Build solutions that improve healthcare access, patient outcomes, or medical workflows.",
  },
  {
    id: 1,
    number: 2,
    name: "EdTech",
    Icon: GraduationCap,
    accent: "#E8916E",
    bg: YELLOW,
    desc: "Reimagine how people learn — from classrooms to self-paced platforms and beyond.",
  },
  {
    id: 2,
    number: 3,
    name: "FinTech",
    Icon: Banknote,
    accent: "#4CAF50",
    bg: GREEN,
    desc: "Innovate in payments, budgeting, lending, or financial inclusion for the underserved.",
  },
  {
    id: 3,
    number: 4,
    name: "Sustainability",
    Icon: Leaf,
    accent: "#D85C8A",
    bg: PINK,
    desc: "Create tech-driven solutions for climate action, clean energy, or waste reduction.",
  },
  {
    id: 4,
    number: 5,
    name: "AI & ML",
    Icon: Bot,
    accent: "#C89A2A",
    bg: YELLOW,
    desc: "Harness the power of machine learning, LLMs, or computer vision to solve real problems.",
  },
  {
    id: 5,
    number: 6,
    name: "Open Innovation",
    Icon: Lightbulb,
    accent: "#5BA4E6",
    bg: BLUE,
    desc: "No track? No problem. Bring your wildest idea — anything goes here.",
  },
  {
    id: 6,
    number: 7,
    name: "Smart Cities",
    Icon: Building2,
    accent: "#4CAF50",
    bg: GREEN,
    desc: "Design solutions for urban mobility, civic tech, or connected infrastructure.",
  },
  {
    id: 7,
    number: 8,
    name: "CyberSecurity",
    Icon: ShieldCheck,
    accent: "#D85C8A",
    bg: PINK,
    desc: "Tackle digital threats, privacy challenges, or build tools that make the web safer.",
  },
];

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function getPolarPosition(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

/* ══════════════════════════════════════════════════════
   BULB SVG
══════════════════════════════════════════════════════ */
function Bulb({ on }: { on: boolean }) {
  return (
    <svg
      width="100"
      height="134"
      viewBox="0 0 90 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="45"
        y1="0"
        x2="45"
        y2="18"
        stroke="#d1d5db"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {on && (
        <>
          <ellipse cx="45" cy="62" rx="38" ry="38" fill="#fbbf24" opacity="0.12" />
          <ellipse cx="45" cy="62" rx="28" ry="28" fill="#fbbf24" opacity="0.18" />
        </>
      )}
      <path
        d="M20 55 Q18 36 45 24 Q72 36 70 55 Q70 72 58 80 L58 88 Q58 92 54 92 L36 92 Q32 92 32 88 L32 80 Q20 72 20 55 Z"
        fill={on ? "url(#bulbLitGrad)" : "url(#bulbDimGrad)"}
        stroke={on ? "#f59e0b" : "#d1d5db"}
        strokeWidth="1.5"
      />
      <path
        d="M38 78 Q38 70 42 65 Q45 60 48 65 Q52 70 52 78"
        fill="none"
        stroke={on ? "#f59e0b" : "#9ca3af"}
        strokeWidth={on ? "2" : "1.5"}
        strokeLinecap="round"
      />
      <rect x="32" y="88" width="26" height="5" rx="2" fill={on ? "#fbbf24" : "#d1d5db"} />
      <rect x="34" y="93" width="22" height="5" rx="2" fill={on ? "#f59e0b" : "#9ca3af"} />
      <rect x="36" y="98" width="18" height="5" rx="2" fill={on ? "#f59e0b" : "#6b7280"} />
      {on && (
        <ellipse
          cx="36"
          cy="42"
          rx="5"
          ry="8"
          fill="rgba(255,255,255,0.35)"
          transform="rotate(-20 36 42)"
        />
      )}
      <defs>
        <radialGradient id="bulbLitGrad" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="bulbDimGrad" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#d1d5db" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   TRACK CARD (desktop orbital)
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
  const CARD_W = 176;
  const CARD_H = 196;
  const { Icon } = track;

  return (
    <motion.div
      className="absolute flex flex-col overflow-hidden rounded-2xl cursor-default"
      style={{
        width: CARD_W,
        height: CARD_H,
        left: `calc(50% + ${x}px - ${CARD_W / 2}px)`,
        top: `calc(50% + ${y}px - ${CARD_H / 2}px)`,
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
      animate={revealed ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.88, opacity: 0.55, y: 0 }}
      transition={{
        duration: 0.55,
        delay: revealed ? delay : delay * 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={revealed ? { scale: 1.06, zIndex: 20 } : {}}
    >
      {revealed && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 52%)",
              borderRadius: "inherit",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${track.accent}28 1px, transparent 1px)`,
              backgroundSize: "12px 12px",
              opacity: 0.45,
              borderRadius: "inherit",
            }}
          />
        </>
      )}

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

      {revealed && (
        <div
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-50"
          style={{ background: track.accent }}
        />
      )}

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 72,
          color: revealed ? track.accent : "#bbb",
          opacity: revealed ? 0.1 : 0.25,
          transition: "color 0.4s, opacity 0.4s",
          letterSpacing: "-0.04em",
        }}
      >
        {track.number}
      </div>

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
                width: 38,
                height: 38,
                background: "rgba(0,0,0,0.05)",
                border: "1.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bbb"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

      <AnimatePresence>
        {revealed && (
          <motion.div
            className="relative z-10 flex flex-col gap-2 p-3.5 pt-5 h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, delay: delay + 0.2 }}
          >
            <motion.div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 46,
                height: 46,
                background: "white",
                border: `1.5px solid ${track.accent}28`,
                boxShadow: `0 0 0 3px ${track.accent}14`,
                alignSelf: "flex-start",
                flexShrink: 0,
              }}
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon size={22} color={track.accent} strokeWidth={1.8} />
            </motion.div>

            <p
              className="font-black leading-tight tracking-tight text-sm"
              style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}
            >
              {track.name}
            </p>

            <p
              className="text-[10px] leading-snug flex-1"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}
            >
              {track.desc}
            </p>

            <span
              className="inline-flex items-center gap-1 self-start text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
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
   CONNECTOR LINES
══════════════════════════════════════════════════════ */
function ConnectorLines({
  on,
  radius,
  orbitSize,
}: {
  on: boolean;
  radius: number;
  orbitSize: number;
}) {
  const CARD_W = 176;
  const CARD_H = 196;
  const C = orbitSize / 2;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", zIndex: 1 }}
      viewBox={`0 0 ${orbitSize} ${orbitSize}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {ANGLES.map((angle, i) => {
        const { x: cx, y: cy } = getPolarPosition(angle, radius);
        const cardCX = C + cx;
        const cardCY = C + cy;
        const len = Math.sqrt(cx * cx + cy * cy);
        const nx = cx / len;
        const ny = cy / len;
        const hw = CARD_W / 2;
        const hh = CARD_H / 2;
        let tEnter = -Infinity;
        let tExit = Infinity;
        if (Math.abs(nx) > 1e-9) {
          const t1 = (cardCX - hw - C) / nx;
          const t2 = (cardCX + hw - C) / nx;
          tEnter = Math.max(tEnter, Math.min(t1, t2));
          tExit = Math.min(tExit, Math.max(t1, t2));
        }
        if (Math.abs(ny) > 1e-9) {
          const t1 = (cardCY - hh - C) / ny;
          const t2 = (cardCY + hh - C) / ny;
          tEnter = Math.max(tEnter, Math.min(t1, t2));
          tExit = Math.min(tExit, Math.max(t1, t2));
        }
        const tEdge = tEnter > 0 && tEnter <= tExit ? tEnter : Math.max(0, tExit);
        const EXTRA = 110;
        const ex = C + (tEdge + EXTRA) * nx;
        const ey = C + (tEdge + EXTRA) * ny;
        const startX = C;
        const startY = C;
        return (
          <motion.line
            key={i}
            x1={startX}
            y1={startY}
            x2={ex}
            y2={ey}
            stroke={on ? TRACKS[i].accent : "rgba(0,0,0,0.1)"}
            strokeWidth={on ? 1.8 : 1}
            strokeDasharray="6 5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={on ? { pathLength: 1, opacity: 0.65 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: on ? i * 0.07 : 0, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE GRID
══════════════════════════════════════════════════════ */
function MobileGrid({ revealedCount }: { revealedCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full px-2 md:hidden">
      {TRACKS.map((track, i) => {
        const revealed = i < revealedCount;
        const { Icon } = track;
        return (
          <motion.div
            key={track.id}
            className="relative flex flex-col overflow-hidden rounded-2xl"
            style={{
              background: revealed ? track.bg : "#f0f0f0",
              outline: `1.5px solid ${revealed ? track.accent + "45" : "rgba(0,0,0,0.08)"}`,
              boxShadow: revealed
                ? `0 0 0 4px ${track.accent}10, 0 8px 28px ${track.accent}28, inset 0 1px 0 rgba(255,255,255,0.85)`
                : "0 2px 10px rgba(0,0,0,0.06)",
              minHeight: 170,
              transition: "background 0.4s, outline 0.4s, box-shadow 0.4s",
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0.88, opacity: 0.55 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {revealed && (
              <>
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${track.accent}bb 35%, ${track.accent} 50%, ${track.accent}bb 65%, transparent)`,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(${track.accent}28 1px, transparent 1px)`,
                    backgroundSize: "12px 12px",
                    opacity: 0.45,
                    borderRadius: "inherit",
                  }}
                />
              </>
            )}

            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: 72,
                color: revealed ? track.accent : "#bbb",
                opacity: revealed ? 0.1 : 0.25,
                transition: "color 0.4s",
              }}
            >
              {track.number}
            </div>

            <AnimatePresence>
              {!revealed && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 38,
                      height: 38,
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

            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="relative z-10 flex flex-col gap-2 p-3 pt-4 h-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 46,
                      height: 46,
                      background: "white",
                      border: `1.5px solid ${track.accent}28`,
                      boxShadow: `0 0 0 3px ${track.accent}14`,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Icon size={22} color={track.accent} strokeWidth={1.8} />
                  </div>
                  <p className="font-black leading-tight tracking-tight text-sm" style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}>
                    {track.name}
                  </p>
                  <p className="text-[10px] leading-snug flex-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
                    {track.desc}
                  </p>
                  <span
                    className="inline-flex items-center self-start text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
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
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ✦ ASI ONE — SPECIAL TRACK SECTION
══════════════════════════════════════════════════════ */

// Floating particle for the ASI One section background
function AsiParticle({ delay, x, size, duration }: { delay: number; x: number; size: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: -20,
        background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(79,70,229,0.2) 60%, transparent 100%)",
      }}
      animate={{
        y: [-300, -600],
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

// Animated neural node for the icon
function NeuralIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* Center node */}
      <circle cx="14" cy="14" r="3.5" fill="#a78bfa" />
      {/* Outer nodes */}
      <circle cx="14" cy="4" r="2" fill="#7c3aed" />
      <circle cx="14" cy="24" r="2" fill="#7c3aed" />
      <circle cx="4" cy="14" r="2" fill="#7c3aed" />
      <circle cx="24" cy="14" r="2" fill="#7c3aed" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="#c4b5fd" />
      <circle cx="21.5" cy="6.5" r="1.5" fill="#c4b5fd" />
      <circle cx="6.5" cy="21.5" r="1.5" fill="#c4b5fd" />
      <circle cx="21.5" cy="21.5" r="1.5" fill="#c4b5fd" />
      {/* Connection lines */}
      <line x1="14" y1="10.5" x2="14" y2="6" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="14" y1="17.5" x2="14" y2="22" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="10.5" y1="14" x2="6" y2="14" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="17.5" y1="14" x2="22" y2="14" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="11.5" y1="11.5" x2="7.5" y2="7.5" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="16.5" y1="11.5" x2="20.5" y2="7.5" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="11.5" y1="16.5" x2="7.5" y2="20.5" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="16.5" y1="16.5" x2="20.5" y2="20.5" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

function ASIOneSection({ on }: { on: boolean }) {
  const PARTICLES = [
    { delay: 0, x: 10, size: 6, duration: 5 },
    { delay: 1.2, x: 25, size: 4, duration: 6.5 },
    { delay: 0.5, x: 42, size: 8, duration: 4.5 },
    { delay: 2.1, x: 58, size: 5, duration: 7 },
    { delay: 0.8, x: 74, size: 4, duration: 5.5 },
    { delay: 1.7, x: 88, size: 7, duration: 6 },
    { delay: 3.0, x: 33, size: 3, duration: 8 },
    { delay: 2.5, x: 65, size: 5, duration: 5 },
    { delay: 1.0, x: 50, size: 4, duration: 7.5 },
    { delay: 3.5, x: 18, size: 6, duration: 4 },
  ];

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          className="relative w-full mt-16"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Section label ── */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Connector line from tracks to ASI */}
            <motion.div
              className="w-px bg-gradient-to-b from-transparent via-purple-300 to-purple-500 mb-6"
              style={{ height: 48 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            />

            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-px flex-1"
                style={{
                  width: 48,
                  background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5))",
                }}
              />
              <motion.span
                className="text-[9px] uppercase tracking-[0.6em] font-bold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#a78bfa" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ✦ Beyond the Tracks ✦
              </motion.span>
              <div
                className="h-px flex-1"
                style={{
                  width: 48,
                  background: "linear-gradient(90deg, rgba(139,92,246,0.5), transparent)",
                }}
              />
            </div>
          </motion.div>

          {/* ── Main ASI One Card ── */}
          <motion.div
            className="relative mx-auto overflow-hidden"
            style={{
              maxWidth: 860,
              borderRadius: 28,
              background: "linear-gradient(135deg, #0f0a1e 0%, #1a0f38 40%, #0d1528 100%)",
              border: "1.5px solid rgba(139,92,246,0.35)",
              boxShadow:
                "0 0 0 1px rgba(139,92,246,0.1), 0 20px 80px rgba(109,40,217,0.35), 0 0 120px rgba(79,70,229,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "inherit" }}>
              {PARTICLES.map((p, i) => (
                <AsiParticle key={i} {...p} />
              ))}
            </div>

            {/* Top gradient bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, #7c3aed 20%, #a78bfa 40%, #e879f9 55%, #818cf8 75%, transparent 100%)",
                borderRadius: "28px 28px 0 0",
              }}
            />

            {/* Animated shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(139,92,246,0.06) 50%, transparent 70%)",
                borderRadius: "inherit",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
            />

            {/* Grid dot texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(rgba(167,139,250,0.8) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                borderRadius: "inherit",
              }}
            />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-6 h-6 pointer-events-none" style={{ borderTop: "1.5px solid rgba(139,92,246,0.5)", borderLeft: "1.5px solid rgba(139,92,246,0.5)", borderRadius: "3px 0 0 0" }} />
            <div className="absolute top-4 right-4 w-6 h-6 pointer-events-none" style={{ borderTop: "1.5px solid rgba(139,92,246,0.5)", borderRight: "1.5px solid rgba(139,92,246,0.5)", borderRadius: "0 3px 0 0" }} />
            <div className="absolute bottom-4 left-4 w-6 h-6 pointer-events-none" style={{ borderBottom: "1.5px solid rgba(139,92,246,0.5)", borderLeft: "1.5px solid rgba(139,92,246,0.5)", borderRadius: "0 0 0 3px" }} />
            <div className="absolute bottom-4 right-4 w-6 h-6 pointer-events-none" style={{ borderBottom: "1.5px solid rgba(139,92,246,0.5)", borderRight: "1.5px solid rgba(139,92,246,0.5)", borderRadius: "0 0 3px 0" }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-0 p-8 md:p-10">

              {/* LEFT — Track identity */}
              <motion.div
                className="flex flex-col items-center md:items-start justify-center md:justify-between gap-6 md:w-2/5 md:pr-10 md:border-r pb-8 md:pb-0"
                style={{ borderColor: "rgba(139,92,246,0.2)" }}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {/* Icon + badge */}
                <div className="flex flex-col items-center md:items-start gap-4">
                  {/* Glowing icon container */}
                  <motion.div
                    className="relative flex items-center justify-center rounded-2xl"
                    style={{
                      width: 72,
                      height: 72,
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.4) 0%, rgba(79,70,229,0.3) 100%)",
                      border: "1.5px solid rgba(139,92,246,0.4)",
                      boxShadow: "0 0 0 6px rgba(109,40,217,0.1), 0 8px 32px rgba(109,40,217,0.4)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0 6px rgba(109,40,217,0.1), 0 8px 32px rgba(109,40,217,0.4)",
                        "0 0 0 10px rgba(109,40,217,0.06), 0 8px 48px rgba(109,40,217,0.55)",
                        "0 0 0 6px rgba(109,40,217,0.1), 0 8px 32px rgba(109,40,217,0.4)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Rotating ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        border: "1px dashed rgba(167,139,250,0.35)",
                        borderRadius: "inherit",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <NeuralIcon />
                  </motion.div>

                  {/* Track number badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(109,40,217,0.35), rgba(79,70,229,0.25))",
                        border: "1px solid rgba(139,92,246,0.4)",
                        color: "#c4b5fd",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <Star size={8} strokeWidth={2.5} />
                      Special Track
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <motion.p
                    className="text-[10px] uppercase tracking-[0.5em] mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(167,139,250,0.6)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                  >
                    Track 09
                  </motion.p>
                  <motion.h3
                    className="text-5xl md:text-6xl font-black tracking-tight leading-none"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #e9d5ff 0%, #a78bfa 30%, #818cf8 55%, #e879f9 80%, #fbbf24 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ASI
                    </span>
                    <br />
                    <span
                      style={{
                        background: "linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #a78bfa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      One
                    </span>
                  </motion.h3>
                </div>

                {/* Desc */}
                <motion.p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(196,181,253,0.7)", maxWidth: 260 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  The most ambitious track at the hackathon. Build toward the frontier of Artificial Superintelligence — systems that reason, adapt, and solve problems beyond human-level across any domain.
                </motion.p>
              </motion.div>

              {/* RIGHT — Prize + Winner */}
              <motion.div
                className="flex flex-col gap-6 md:w-3/5 md:pl-10"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {/* Prize banner */}
                <motion.div
                  className="relative overflow-hidden rounded-xl p-4 flex items-center gap-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.08) 50%, rgba(234,179,8,0.05) 100%)",
                    border: "1px solid rgba(251,191,36,0.3)",
                  }}
                  animate={{
                    borderColor: [
                      "rgba(251,191,36,0.3)",
                      "rgba(251,191,36,0.55)",
                      "rgba(251,191,36,0.3)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(251,191,36,0.04) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  />
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(251,191,36,0.15)",
                      border: "1px solid rgba(251,191,36,0.4)",
                    }}
                  >
                    <Trophy size={20} color="#fbbf24" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.4em] mb-0.5"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(251,191,36,0.65)" }}
                    >
                      Grand Prize
                    </p>
                    <p
                      className="text-xl font-black"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        background: "linear-gradient(90deg, #fef3c7, #fbbf24, #f59e0b)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      1 Winner Takes All
                    </p>
                  </div>
                  <Zap
                    size={14}
                    color="rgba(251,191,36,0.4)"
                    style={{ marginLeft: "auto", flexShrink: 0 }}
                  />
                </motion.div>

                {/* What we're looking for */}
                <div>
                  <p
                    className="text-[9px] uppercase tracking-[0.45em] mb-3"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(167,139,250,0.55)" }}
                  >
                    What We're Looking For
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: "◈", label: "Meta-learning & self-improvement architectures" },
                      { icon: "◈", label: "Multi-domain reasoning & generalisation" },
                      { icon: "◈", label: "Novel alignment or interpretability research" },
                      { icon: "◈", label: "Recursive problem-solving at scale" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2.5"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                      >
                        <span
                          style={{
                            color: "#a78bfa",
                            fontSize: 10,
                            lineHeight: "20px",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </span>
                        <p
                          className="text-[11px] leading-5"
                          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(196,181,253,0.75)" }}
                        >
                          {item.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }}
                />

                {/* Bottom row — special status + sparkle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#a78bfa" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.35em]"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(167,139,250,0.6)" }}
                    >
                      Exclusive — Open to All Tracks
                    </span>
                  </div>
                  <Sparkles size={14} color="rgba(167,139,250,0.45)" />
                </div>
              </motion.div>
            </div>

            {/* Bottom ambient line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 30%, rgba(232,121,249,0.4) 50%, rgba(139,92,246,0.4) 70%, transparent 100%)",
                borderRadius: "0 0 28px 28px",
              }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* ── Mobile extra spacing ── */}
          <div className="h-4" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════
   THEMES SECTION (full — original + ASI One)
══════════════════════════════════════════════════════ */
export default function ThemesSection() {
  const [revealedCount, setRevealedCount] = useState(0);
  const [on, setOn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const RADIUS_DESKTOP = 620;
  const ORBIT_SIZE = RADIUS_DESKTOP * 2 + 240;

  useEffect(() => {
    audioRef.current = new Audio("./click.mpeg");
    audioRef.current.preload = "auto";
  }, []);

  const playClick = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const toggle = useCallback(() => {
    playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    if (!on) {
      setOn(true);
      setRevealedCount(0);
      let count = 0;
      timerRef.current = setInterval(() => {
        count += 1;
        setRevealedCount(count);
        if (count >= TRACKS.length) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
        }
      }, 500);
    } else {
      setOn(false);
      let count = TRACKS.length;
      timerRef.current = setInterval(() => {
        count -= 1;
        setRevealedCount(count);
        if (count <= 0) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setRevealedCount(0);
        }
      }, 500);
    }
  }, [on, playClick]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const isAnimating = timerRef.current !== null;

  return (
    <section id="themes" className="relative w-full py-20 px-4 overflow-hidden">
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.08]" style={{ background: c }} />
        ))}
      </div>

      {/* Ghost watermark */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.018 }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(100px, 20vw, 180px)",
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
            style={{
              height: 3,
              background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)",
            }}
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
              ? revealedCount < TRACKS.length
                ? `Revealing track ${revealedCount + 1} of ${TRACKS.length}…`
                : "The tracks are live — choose your battlefield."
              : isAnimating
                ? "Powering down…"
                : "Hit the switch to reveal all 8 tracks."}
          </motion.p>
        </div>

        {/* ── Toggle ── */}
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

          <motion.button
            onClick={toggle}
            disabled={isAnimating}
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
              opacity: isAnimating ? 0.7 : 1,
            }}
            whileHover={!isAnimating ? { scale: 1.06 } : {}}
            whileTap={!isAnimating ? { scale: 0.95 } : {}}
          >
            <motion.div
              className="rounded-full bg-white"
              style={{ width: 32, height: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              animate={{ x: on ? 40 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
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

        {/* ── MOBILE grid ── */}
        <MobileGrid revealedCount={revealedCount} />

        {/* ── DESKTOP orbit ── */}
        <div className="hidden md:flex flex-col items-center">
          <div
            className="relative"
            style={{
              width: ORBIT_SIZE,
              height: ORBIT_SIZE,
              maxWidth: "min(100vw - 48px, 1000px)",
              maxHeight: "min(100vw - 48px, 1000px)",
            }}
          >
            <AnimatePresence>
              {on && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "45%",
                    height: "45%",
                    top: "27.5%",
                    left: "27.5%",
                    background:
                      "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(245,158,11,0.08) 50%, transparent 70%)",
                    filter: "blur(32px)",
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </AnimatePresence>

            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${((RADIUS_DESKTOP * 2) / ORBIT_SIZE) * 100}%`,
                height: `${((RADIUS_DESKTOP * 2) / ORBIT_SIZE) * 100}%`,
                top: `${((ORBIT_SIZE / 2 - RADIUS_DESKTOP) / ORBIT_SIZE) * 100}%`,
                left: `${((ORBIT_SIZE / 2 - RADIUS_DESKTOP) / ORBIT_SIZE) * 100}%`,
                border: on ? "1.5px dashed rgba(251,191,36,0.3)" : "1.5px dashed rgba(0,0,0,0.07)",
                transition: "border 0.5s",
              }}
            />

            <ConnectorLines on={on} radius={RADIUS_DESKTOP * 0.5} orbitSize={ORBIT_SIZE} />

            {TRACKS.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                angle={ANGLES[i]}
                radius={RADIUS_DESKTOP * 0.5}
                revealed={i < revealedCount}
                delay={0}
              />
            ))}

            <div
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -54%)",
                zIndex: 30,
              }}
            >
              <AnimatePresence>
                {on && (
                  <>
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 120,
                        height: 120,
                        top: "50%",
                        left: "50%",
                        translateX: "-50%",
                        translateY: "-50%",
                        border: "1.5px solid rgba(251,191,36,0.4)",
                      }}
                      animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 120,
                        height: 120,
                        top: "50%",
                        left: "50%",
                        translateX: "-50%",
                        translateY: "-50%",
                        border: "1.5px solid rgba(251,191,36,0.25)",
                      }}
                      animate={{ scale: [1, 2], opacity: [0.35, 0] }}
                      transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </>
                )}
              </AnimatePresence>
              <motion.div
                animate={
                  on
                    ? { filter: "drop-shadow(0 0 24px rgba(251,191,36,0.7)) drop-shadow(0 0 8px rgba(245,158,11,0.5))" }
                    : { filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))" }
                }
                transition={{ duration: 0.5 }}
              >
                <Bulb on={on} />
              </motion.div>
            </div>
          </div>

          {/* ✦ ASI One special track — rendered below orbit, tied to switch */}
          <ASIOneSection on={on} />
        </div>

        {/* ── ASI One on mobile too ── */}
        <div className="md:hidden">
          <ASIOneSection on={on} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}