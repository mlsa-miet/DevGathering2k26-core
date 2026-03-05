"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";

/* ── Brand colours ── */
const BRAND_BLUE = "#5BA4E6";
const ACCENT = "#E8916E";
const SPARK_COLORS = ["#F4808E", "#6BBF85", "#5AB4E8", "#E8C83A", "#E8916E", "#FFBCC4"];

/* ── Pastel theme ── */
const PINK   = "#FFBCC4";
const GREEN  = "#CCE9D3";
const BLUE   = "#BFE4FF";
const YELLOW = "#FFF1B6";

/* ── Cube shade helper ── */
function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 0xff) * f);
  const g = Math.round(((n >>  8) & 0xff) * f);
  const b = Math.round(( n        & 0xff) * f);
  return `rgb(${r},${g},${b})`;
}

/* ── Cube colors (darker saturated) ── */
const CUBE_C = {
  pink:   "#F4808E",
  green:  "#6BBF85",
  blue:   "#5AB4E8",
  yellow: "#E8C83A",
};

/* ════════════════════════════════════════
   Isometric SVG Cube
════════════════════════════════════════ */
function IsoCube({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  const s = size, h = s * 0.5;
  return (
    <div style={{ filter: `drop-shadow(0 8px 20px ${color}35) blur(2px)`, ...style }}>
      <svg width={s * 2} height={s * 1.7} viewBox={`0 0 ${s * 2} ${s * 1.7}`} style={{ overflow: "visible", display: "block" }}>
        <polygon points={`${s},0 ${s*2},${h} ${s},${h*2} 0,${h}`}                          fill={shade(color, 1.0)} />
        <polygon points={`0,${h} ${s},${h*2} ${s},${h*2+s*0.6} 0,${h+s*0.6}`}             fill={shade(color, 0.70)} />
        <polygon points={`${s},${h*2} ${s*2},${h} ${s*2},${h+s*0.6} ${s},${h*2+s*0.6}`}  fill={shade(color, 0.48)} />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════
   Floating background cubes — left & right
════════════════════════════════════════ */
const BG_CUBES = [
  { color: CUBE_C.pink,   size: 52, x: "2%",  y: "10%", rotate: 18,  dur: 14, delay: 0.3, opacity: 0.35 },
  { color: CUBE_C.yellow, size: 36, x: "5%",  y: "40%", rotate: -14, dur: 19, delay: 0.7, opacity: 0.30 },
  { color: CUBE_C.blue,   size: 24, x: "1%",  y: "66%", rotate: 28,  dur: 15, delay: 0.5, opacity: 0.26 },
  { color: CUBE_C.green,  size: 44, x: "7%",  y: "78%", rotate: -20, dur: 21, delay: 1.0, opacity: 0.33 },
  { color: CUBE_C.green,  size: 50, x: "84%", y: "6%",  rotate: -18, dur: 17, delay: 0.4, opacity: 0.34 },
  { color: CUBE_C.blue,   size: 60, x: "88%", y: "42%", rotate: 14,  dur: 20, delay: 0.6, opacity: 0.38 },
  { color: CUBE_C.pink,   size: 28, x: "80%", y: "68%", rotate: -32, dur: 13, delay: 1.2, opacity: 0.28 },
  { color: CUBE_C.yellow, size: 40, x: "86%", y: "82%", rotate: 24,  dur: 18, delay: 0.9, opacity: 0.31 },
];

function FloatingCubes() {
  return (
    <>
      {BG_CUBES.map((c, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", left: c.x, top: c.y, opacity: c.opacity }}
          initial={{ opacity: 0, scale: 0.2, rotate: c.rotate - 15 }}
          animate={{
            opacity: c.opacity, scale: 1, rotate: c.rotate,
            y: [0, -14, 5, -9, 0],
            x: [0, 5, -3, 7, 0],
          }}
          transition={{
            opacity: { duration: 0.9, delay: c.delay },
            scale:   { duration: 0.9, delay: c.delay, ease: [0.34, 1.56, 0.64, 1] },
            rotate:  { duration: 0.9, delay: c.delay },
            y: { duration: c.dur, delay: c.delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
            x: { duration: c.dur * 1.25, delay: c.delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          }}
        >
          <IsoCube color={c.color} size={c.size} />
        </motion.div>
      ))}
    </>
  );
}

/* ════════════════════════════════════════
   Grid background
════════════════════════════════════════ */
function Grid() {
  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(100,105,120,0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,105,120,0.10) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  );
}

/* ════════════════════════════════════════
   BoyCharacter — light theme, MLSA on chest
════════════════════════════════════════ */
function BoyCharacter({ isPushing }: { isPushing: boolean }) {
  return (
    <svg viewBox="0 0 130 195" style={{ width: "100%", height: "100%", overflow: "visible", display: "block" }}>
      {/* ground shadow */}
      <ellipse cx="70" cy="192" rx="32" ry="4" fill="rgba(0,0,0,0.08)" />

      {/* ── legs ── */}
      <motion.rect
        x="72" y="132" width="15" height="48" rx="7.5" fill="#4A90D9"
        animate={isPushing ? { rotate: [-18, -24, -18] } : { rotate: -18 }}
        transition={isPushing ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        style={{ transformOrigin: "79.5px 132px" }}
      />
      <motion.ellipse
        cx="92" cy="178" rx="13" ry="6" fill="#2d2d2d"
        animate={isPushing ? { cx: [92, 96, 92] } : { cx: 92 }}
        transition={isPushing ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : {}}
      />
      <motion.rect
        x="44" y="132" width="15" height="48" rx="7.5" fill="#5BA4E6"
        animate={isPushing ? { rotate: [5, -2, 5] } : { rotate: 5 }}
        transition={isPushing ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ transformOrigin: "51.5px 132px" }}
      />
      <ellipse cx="48" cy="182" rx="13" ry="6" fill="#2d2d2d" />

      {/* ── body / hoodie — light theme white/blue ── */}
      <path d="M 38 64 Q 32 56 56 50 Q 80 48 92 56 L 88 135 L 44 135 Z" fill="white" />
      {/* hoodie outline */}
      <path d="M 38 64 Q 32 56 56 50 Q 80 48 92 56 L 88 135 L 44 135 Z" fill="none" stroke="#e0e0e0" strokeWidth="1.5" />
      {/* chest zipper line */}
      <line x1="64" y1="56" x2="64" y2="130" stroke="#e8e8e8" strokeWidth="1.5" />

      {/* ── MLSA text on chest ── */}
      <rect x="44" y="72" width="36" height="22" rx="5" fill={BRAND_BLUE} />
      <text
        x="62" y="87"
        textAnchor="middle"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: "10px",
          fill: "white",
          letterSpacing: "1px",
        }}
      >
        MLSA
      </text>
      {/* small star on MLSA badge */}
      <polygon points="62,73 63.2,76.6 67,76.6 64,78.8 65.2,82.4 62,80.2 58.8,82.4 60,78.8 57,76.6 60.8,76.6" fill="rgba(255,255,255,0)" />

      {/* hoodie pocket */}
      <rect x="50" y="104" width="26" height="16" rx="5" fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="1" />

      {/* ── arms ── */}
      {/* right arm (static side) */}
      <line x1="85" y1="68" x2="102" y2="106" stroke="#FFDCB5" strokeWidth="12" strokeLinecap="round" />
      <circle cx="102" cy="107" r="7" fill="#FFDCB5" />
      {/* left arm (pushing) */}
      <motion.g
        animate={isPushing ? { x: [0, -5, 0] } : { x: 0 }}
        transition={isPushing ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <line x1="42" y1="68" x2="10" y2="80" stroke="#FFDCB5" strokeWidth="12" strokeLinecap="round" />
        <circle cx="8" cy="80" r="8" fill="#FFDCB5" />
      </motion.g>

      {/* ── neck ── */}
      <rect x="56" y="46" width="14" height="12" rx="6" fill="#FFDCB5" />

      {/* ── head ── */}
      <circle cx="62" cy="34" r="24" fill="#FFDCB5" />

      {/* hair — slightly tousled */}
      <path d="M 38 28 Q 40 6 64 8 Q 86 10 88 30 L 85 22 Q 82 10 62 10 Q 42 12 40 26 Z" fill="#3D2E1E" />
      <path d="M 54 8 Q 50 0 58 4 Q 64 2 62 8" fill="#3D2E1E" />
      {/* hair tuft */}
      <path d="M 62 9 Q 68 4 72 10" stroke="#3D2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* glasses — thicker, more visible on light bg */}
      <rect x="42" y="28" width="15" height="12" rx="3.5" fill="rgba(91,164,230,0.12)" stroke="#5BA4E6" strokeWidth="1.8" />
      <rect x="60" y="28" width="15" height="12" rx="3.5" fill="rgba(91,164,230,0.12)" stroke="#5BA4E6" strokeWidth="1.8" />
      <line x1="57" y1="33" x2="60" y2="33" stroke="#5BA4E6" strokeWidth="1.6" />
      <line x1="75" y1="31" x2="83" y2="29" stroke="#5BA4E6" strokeWidth="1.4" />
      <line x1="42" y1="31" x2="34" y2="29" stroke="#5BA4E6" strokeWidth="1.4" />
      {/* lens sheen */}
      <rect x="44" y="30" width="4" height="3" rx="1" fill="rgba(255,255,255,0.55)" />
      <rect x="62" y="30" width="4" height="3" rx="1" fill="rgba(255,255,255,0.55)" />

      {/* eyes */}
      <circle cx="49" cy="33" r="2.5" fill="white" />
      <circle cx="67" cy="33" r="2.5" fill="white" />
      <motion.circle cx="49" cy="33.5" r="1.4" fill="#222"
        animate={isPushing ? { cx: [49, 47, 49] } : { cx: 49 }}
        transition={isPushing ? { duration: 0.35, repeat: Infinity } : {}}
      />
      <motion.circle cx="67" cy="33.5" r="1.4" fill="#222"
        animate={isPushing ? { cx: [67, 65, 67] } : { cx: 67 }}
        transition={isPushing ? { duration: 0.35, repeat: Infinity } : {}}
      />
      {/* eye gleam */}
      <circle cx="50" cy="32.5" r="0.7" fill="white" />
      <circle cx="68" cy="32.5" r="0.7" fill="white" />

      {/* determined brows when pushing */}
      <motion.line x1="43" y1="25" x2="54" y2="27" stroke="#3D2E1E" strokeWidth="2.2" strokeLinecap="round"
        animate={isPushing ? { y1: 23, y2: 25 } : { y1: 25, y2: 27 }}
        transition={{ duration: 0.3 }}
      />
      <motion.line x1="61" y1="27" x2="72" y2="25" stroke="#3D2E1E" strokeWidth="2.2" strokeLinecap="round"
        animate={isPushing ? { y1: 25, y2: 23 } : { y1: 27, y2: 25 }}
        transition={{ duration: 0.3 }}
      />

      {/* mouth */}
      <motion.path
        d="M 53 45 Q 60 50 67 45"
        stroke="#c0704a" fill="none" strokeWidth="1.8" strokeLinecap="round"
        animate={isPushing ? { d: "M 53 46 Q 60 51 67 46" } : { d: "M 53 45 Q 60 50 67 45" }}
        transition={{ duration: 0.3 }}
      />
      {/* blush */}
      <ellipse cx="43" cy="42" rx="5" ry="3" fill="rgba(244,128,142,0.22)" />
      <ellipse cx="77" cy="42" rx="5" ry="3" fill="rgba(244,128,142,0.22)" />

      {/* sweat drop when pushing */}
      {isPushing && (
        <motion.ellipse cx="88" cy="22" rx="4" ry="6" fill={BLUE}
          initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: 8 }}
          transition={{ duration: 1.1, delay: 0.4, repeat: Infinity }}
        />
      )}

      {/* earbud */}
      <circle cx="38" cy="36" r="4" fill="#555" stroke="#777" strokeWidth="1" />
      <path d="M 38 32 Q 32 18 43 13" stroke="#777" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ════════════════════════════════════════
   Spark trail
════════════════════════════════════════ */
function SparkTrail() {
  return (
    <div style={{ position: "absolute", right: 0, bottom: "18%", pointerEvents: "none" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute", width: 5, height: 5, borderRadius: "50%",
            background: SPARK_COLORS[i % SPARK_COLORS.length],
          }}
          animate={{ x: [0, 28 + i * 16], y: [0, -(10 + i * 8)], opacity: [0.9, 0], scale: [1, 0.2] }}
          transition={{ duration: 0.5, delay: i * 0.08, repeat: Infinity, repeatDelay: 0.2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   Particle burst on snap
════════════════════════════════════════ */
function ParticleBurst() {
  const particles = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.7) * 320,
      r: Math.random() * 720 - 360,
      s: Math.random() * 0.6 + 0.4,
      color: SPARK_COLORS[i % SPARK_COLORS.length],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.1,
      square: Math.random() > 0.5,
    })), [],
  );
  return (
    <div style={{ position: "absolute", left: 0, top: "50%", pointerEvents: "none", zIndex: 30 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{ position: "absolute", width: p.size, height: p.size, borderRadius: p.square ? 3 : "50%", background: p.color, left: -p.size / 2, top: -p.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.s, rotate: p.r }}
          transition={{ duration: 0.85, ease: "easeOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   Camera viewfinder corners
════════════════════════════════════════ */
function ViewfinderCorners() {
  const c = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", width: 36, height: 36,
    borderColor: "rgba(0,0,0,0.35)", ...pos,
  });
  return (
    <motion.div
      style={{ position: "absolute", inset: "8%", zIndex: 56, pointerEvents: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.55, times: [0, 0.1, 0.55, 1] }}
    >
      <div style={c({ top: 0, left: 0, borderTop: "2.5px solid", borderLeft: "2.5px solid" })} />
      <div style={c({ top: 0, right: 0, borderTop: "2.5px solid", borderRight: "2.5px solid" })} />
      <div style={c({ bottom: 0, left: 0, borderBottom: "2.5px solid", borderLeft: "2.5px solid" })} />
      <div style={c({ bottom: 0, right: 0, borderBottom: "2.5px solid", borderRight: "2.5px solid" })} />
      {/* crosshair */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 24, height: 2, background: "rgba(0,0,0,0.2)", borderRadius: 1 }} />
        <div style={{ width: 2, height: 24, background: "rgba(0,0,0,0.2)", borderRadius: 1, position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)" }} />
      </div>
      {/* REC */}
      <motion.div
        style={{ position: "absolute", top: 12, right: 52, display: "flex", alignItems: "center", gap: 5 }}
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F4808E" }} />
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(0,0,0,0.4)", letterSpacing: 1 }}>REC</span>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════
   MAIN INTRO OVERLAY
════════════════════════════════════════ */
export default function IntroOverlay({ children }: { children: React.ReactNode }) {
  type Phase = "idle" | "pushing" | "placed" | "flash" | "exit" | "done";
  const [phase, setPhase] = useState<Phase>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* lock scroll during overlay */
  useEffect(() => {
    if (phase !== "done") document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  /* timeline */
  useEffect(() => {
    audioRef.current = new Audio("./click.mpeg");
    audioRef.current.volume = 0.6;
    const timers = [
      setTimeout(() => setPhase("pushing"), 700),
      setTimeout(() => setPhase("placed"),  3500),
      setTimeout(() => {
        setPhase("flash");
        try { audioRef.current?.play(); } catch { /* blocked */ }
      }, 4100),
      setTimeout(() => setPhase("exit"), 4800),
      setTimeout(() => setPhase("done"),  5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isPushing = phase === "pushing";
  const isPlaced  = ["placed", "flash", "exit"].includes(phase);
  const showFlash = phase === "flash";

  const textSize = "clamp(52px, 13vw, 168px)";
  const boySize  = "clamp(44px, 9vw, 118px)";

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="overlay"
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "#fafafa",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* ── Pastel corner washes ── */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `
                radial-gradient(ellipse 65% 65% at   0%   0%, rgba(255,188,196,0.22) 0%, transparent 70%),
                radial-gradient(ellipse 65% 65% at 100%   0%, rgba(204,233,211,0.22) 0%, transparent 70%),
                radial-gradient(ellipse 65% 65% at   0% 100%, rgba(191,228,255,0.22) 0%, transparent 70%),
                radial-gradient(ellipse 65% 65% at 100% 100%, rgba(255,241,182,0.22) 0%, transparent 70%)
              `,
            }} />

            <Grid />
            <FloatingCubes />

            {/* ── centre content ── */}
            <div style={{
              position: "relative", zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "clamp(6px, 1.5vw, 16px)",
            }}>

              {/* MLSA badge */}
              <motion.div
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 14px", borderRadius: 99,
                  background: "rgba(255,255,255,0.82)",
                  border: "1.5px solid rgba(91,164,230,0.22)",
                  boxShadow: "0 2px 10px rgba(91,164,230,0.08)",
                  backdropFilter: "blur(6px)",
                }}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {[PINK, YELLOW, GREEN, BLUE].map((c, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
                  ))}
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(8px,1.3vw,11px)",
                  fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "#999",
                }}>
                  MLSA MIET Presents
                </span>
              </motion.div>

              {/* DevGathering title */}
              <motion.h1
                style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 900,
                  fontSize: "clamp(22px, 4.5vw, 58px)", color: "#2d2d2d",
                  margin: 0, letterSpacing: "-0.02em", lineHeight: 1,
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Dev<span style={{ color: BRAND_BLUE }}>Gathering</span>
              </motion.h1>

              {/* ──────── 2K26 row ──────── */}
              <div style={{ display: "flex", alignItems: "flex-end", position: "relative" }}>

                {/* "2K2" */}
                <motion.span
                  style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 900,
                    fontSize: textSize, color: "#2d2d2d",
                    lineHeight: 0.88, letterSpacing: "-0.03em", userSelect: "none",
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  2K2
                </motion.span>

                {/* blinking underscore cursor */}
                <AnimatePresence>
                  {(phase === "idle" || phase === "pushing") && (
                    <motion.span
                      key="cursor"
                      style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: 900,
                        fontSize: textSize, color: ACCENT,
                        lineHeight: 0.88, letterSpacing: "-0.03em",
                        position: "absolute", right: 0, transform: "translateX(100%)",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.9, 0.15, 0.9] }}
                      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.65, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* ── 6 + boy (slides from right) ── */}
                <motion.div
                  style={{ display: "flex", alignItems: "flex-end", position: "relative", marginLeft: "-0.04em" }}
                  initial={{ x: "100vw" }}
                  animate={{ x: (isPushing || isPlaced) ? 0 : "100vw" }}
                  transition={{ duration: 2.6, ease: [0.32, 0.72, 0, 1] }}
                >
                  {isPushing && <SparkTrail />}

                  {/* the "6" */}
                  <motion.span
                    style={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 900,
                      fontSize: textSize, color: ACCENT,
                      lineHeight: 0.88, letterSpacing: "-0.03em",
                      display: "inline-block", userSelect: "none",
                    }}
                    animate={
                      isPlaced
                        ? { scale: [1, 1.18, 0.94, 1.06, 1], rotate: [0, -4, 3, -1, 0] }
                        : isPushing
                          ? { rotate: [0, -2, 1.5, -2, 0] }
                          : {}
                    }
                    transition={
                      isPlaced
                        ? { duration: 0.45, ease: "easeOut" }
                        : { duration: 0.55, repeat: Infinity, ease: "easeInOut" }
                    }
                  >
                    6
                  </motion.span>

                  {/* boy character */}
                  <motion.div
                    style={{
                      width: boySize, height: "auto",
                      marginLeft: "clamp(2px, 0.4vw, 8px)",
                      marginBottom: "clamp(0px, 0.3vw, 4px)",
                    }}
                    animate={
                      isPlaced && !showFlash
                        ? { x: [0, 14, 12], rotate: [0, 5, 4] }
                        : isPushing
                          ? { y: [0, -5, 0, -5, 0] }
                          : {}
                    }
                    transition={
                      isPlaced
                        ? { duration: 0.4, ease: "easeOut" }
                        : isPushing
                          ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
                          : {}
                    }
                  >
                    <BoyCharacter isPushing={isPushing} />
                  </motion.div>

                  {isPlaced && phase === "placed" && <ParticleBurst />}
                </motion.div>

                {/* glow ring on placement */}
                <AnimatePresence>
                  {isPlaced && (
                    <motion.div
                      key="glow"
                      style={{
                        position: "absolute", inset: -24, borderRadius: 24,
                        background: `radial-gradient(ellipse at center, rgba(232,145,110,0.18) 0%, transparent 70%)`,
                        pointerEvents: "none",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 0.4], scale: [0.8, 1.1, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                    />
                  )}
                </AnimatePresence>

                {/* stage floor line */}
                <motion.div
                  style={{
                    position: "absolute", bottom: -6, left: "-8%", right: "-8%",
                    height: 2, borderRadius: 1, pointerEvents: "none",
                    background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>

              {/* tagline */}
              <motion.p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(10px, 1.3vw, 13px)",
                  color: "#aaa", margin: 0, letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Where ideas collide, code comes alive
              </motion.p>
            </div>

            {/* ── camera flash (light theme: subtle warm wash) ── */}
            {showFlash && (
              <>
                <motion.div
                  style={{
                    position: "absolute", inset: 0, zIndex: 52,
                    background: "rgba(255,248,235,0.95)",
                    pointerEvents: "none",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0.85, 0] }}
                  transition={{ duration: 0.55, times: [0, 0.08, 0.18, 0.4, 1], ease: "easeOut" }}
                />
                <ViewfinderCorners />
              </>
            )}

            {/* white fade to site */}
            {phase === "exit" && (
              <motion.div
                style={{ position: "absolute", inset: 0, zIndex: 60, background: "#fafafa", pointerEvents: "none" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* site */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "done" ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </>
  );
}