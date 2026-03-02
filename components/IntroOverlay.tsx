"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Pastel palette ────────────────────────────────────────── */
const BLUE = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN = "#D7F5D0";
const PINK = "#FFD6E8";

/* ── Floating shape data (deterministic) ──────────────────── */
const SHAPES = [
  { x: "8%",  y: "12%", size: 60,  color: BLUE,   delay: 0.2, dur: 5 },
  { x: "85%", y: "18%", size: 44,  color: PINK,   delay: 0.6, dur: 6 },
  { x: "72%", y: "75%", size: 52,  color: GREEN,  delay: 0.4, dur: 5.5 },
  { x: "15%", y: "78%", size: 36,  color: YELLOW, delay: 0.8, dur: 4.5 },
  { x: "50%", y: "8%",  size: 28,  color: PINK,   delay: 1.0, dur: 5 },
  { x: "30%", y: "88%", size: 40,  color: BLUE,   delay: 0.3, dur: 6 },
  { x: "90%", y: "50%", size: 34,  color: GREEN,  delay: 0.7, dur: 5 },
  { x: "5%",  y: "45%", size: 48,  color: YELLOW, delay: 0.5, dur: 5.5 },
];

/* ── Letter-stagger helper ────────────────────────────────── */
function StaggerText({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.04,
  duration = 0.5,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  return (
    <span className={className} style={{ ...style, display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function IntroOverlay({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 4200);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  /* Memoize shapes so they don't re-render */
  const floatingShapes = useMemo(
    () =>
      SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            background: s.color,
            opacity: 0,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -18, 0, 14, 0],
            x: [0, 10, 0, -8, 0],
            opacity: [0, 0.45, 0.5, 0.45, 0],
            scale: [0.7, 1, 1.08, 1, 0.7],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            ease: "easeInOut",
            repeat: 0,
          }}
        />
      )),
    []
  );

  return (
    <>
      {/* Main content underneath */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ pointerEvents: show ? "none" : "auto" }}
      >
        {children}
      </motion.div>

      {/* ── Intro Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* ── 4-section pastel gradient background ──── */}
            <div className="absolute inset-0 flex">
              {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
                <motion.div
                  key={i}
                  className="flex-1"
                  style={{ background: c }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                />
              ))}
            </div>

            {/* Soft white wash over the 4 bands so it's not too saturated */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(255,255,255,0.45)" }}
            />

            {/* ── Subtle white grid overlay ────────────── */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                opacity: 0.45,
              }}
            />

            {/* ── Floating pastel shapes ───────────────── */}
            {floatingShapes}

            {/* ── Text container ───────────────────────── */}
            <div className="relative z-10 flex flex-col items-center gap-4 px-6">
              {/* MLSA MIET — elegant cursive */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StaggerText
                    text="MLSA MIET"
                    delay={0.3}
                    stagger={0.055}
                    duration={0.55}
                    className="text-2xl sm:text-3xl md:text-4xl text-black font-bold"
                    // style={{
                    //   fontFamily: "'Great Vibes', cursive",
                    //   color: "#4a4a4a",
                    // }}
                  />
                </motion.div>
              </div>

              {/* Presents — modern sans-serif */}
              <motion.p
                className="text-[10px] sm:text-xs uppercase tracking-[0.55em]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#888",
                }}
                initial={{ opacity: 0, letterSpacing: "0.9em" }}
                animate={{ opacity: 1, letterSpacing: "0.55em" }}
                transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
              >
                Presents
              </motion.p>

              {/* DevGathering 2K26 */}
              <div className="overflow-hidden mt-1">
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1
                    className="text-center text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    <StaggerText
                      text="Dev"
                      delay={1.5}
                      stagger={0.06}
                      duration={0.55}
                      style={{ color: "#2d2d2d" }}
                    />
                    <StaggerText
                      text="Gathering"
                      delay={1.7}
                      stagger={0.035}
                      duration={0.55}
                      style={{ color: "#5BA4E6" }}
                    />
                    <span style={{ display: "inline-block", width: "0.25em" }} />
                    <StaggerText
                      text="2K26"
                      delay={2.15}
                      stagger={0.06}
                      duration={0.5}
                      style={{ color: "#E8916E" }}
                    />
                  </h1>
                </motion.div>
              </div>

              {/* Pastel accent underline */}
              <motion.div
                className="rounded-full"
                style={{
                  height: 3,
                  background:
                    "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)",
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 180, opacity: 1 }}
                transition={{ duration: 0.7, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Tagline */}
              <motion.p
                className="text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-1"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#aaa",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.8, ease: "easeOut" }}
              >
                Where Developers Unite
              </motion.p>
            </div>

            {/* Font imports */}
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700;800&display=swap');
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}