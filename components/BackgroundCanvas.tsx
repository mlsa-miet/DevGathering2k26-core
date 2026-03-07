 "use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

// Glass crystal cube — uses SVG filters for refraction/gloss effect
function GlassCube({
  color,
  size,
  x,
  y,
  rotate,
  duration,
  delay,
  opacity,
  depth,
  mouseX,
  mouseY,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
  rotate: number;
  duration: number;
  delay: number;
  opacity: number;
  depth: number;
  mouseX: any;
  mouseY: any;
}) {
  const s = size;
  const h = s * 0.5;

  // Parallax from mouse
  const px = useTransform(mouseX, [-1, 1], [-55 * depth, 55 * depth]);
  const py = useTransform(mouseY, [-1, 1], [-35 * depth, 35 * depth]);

  // Unique filter id per cube
  const filterId = `glass-${Math.round(size)}-${color.replace("#", "")}`;

  // Color palette for top / left / right faces with glass tinting
  const rgba = (hex: string, alpha: number) => {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 0xff;
    const g = (n >> 8) & 0xff;
    const b = n & 0xff;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const topFill    = rgba(color, 0.35);
  const leftFill   = rgba(color, 0.22);
  const rightFill  = rgba(color, 0.14);
  const edgeStroke = rgba(color, 0.70);
  const gloss      = "rgba(255,255,255,0.55)";
  const glossFaint = "rgba(255,255,255,0.18)";

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s * 2,
        height: s * 1.7 + s * 0.6,
        opacity,
        willChange: "transform",
        x: px,
        y: py,
      }}
      initial={{ opacity: 0, scale: 0.15, rotate: rotate - 30 }}
      animate={{ opacity, scale: 1, rotate }}
      transition={{
        opacity: { duration: 1.2, delay, ease: "easeOut" },
        scale:   { duration: 1.2, delay, ease: [0.34, 1.56, 0.64, 1] },
        rotate:  { duration: 1.2, delay, ease: "easeOut" },
      }}
    >
      <motion.div
        animate={{
          y: [0, -12, 3, -8, 0],
          x: [0, 4, -2, 6, 0],
        }}
        transition={{
          y: { duration, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          x: { duration: duration * 1.3, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
        }}
      >
        <svg
          width={s * 2}
          height={s * 1.7 + s * 0.6}
          viewBox={`0 0 ${s * 2} ${s * 1.7 + s * 0.6}`}
          style={{ overflow: "visible", filter: `drop-shadow(0 8px 28px ${rgba(color, 0.40)}) drop-shadow(0 2px 6px ${rgba(color, 0.25)})` }}
        >
          <defs>
            <linearGradient id={`${filterId}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.60)" />
              <stop offset="40%"  stopColor={rgba(color, 0.30)} />
              <stop offset="100%" stopColor={rgba(color, 0.50)} />
            </linearGradient>
            <linearGradient id={`${filterId}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={rgba(color, 0.28)} />
              <stop offset="100%" stopColor={rgba(color, 0.15)} />
            </linearGradient>
            <linearGradient id={`${filterId}-right`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={rgba(color, 0.18)} />
              <stop offset="100%" stopColor={rgba(color, 0.08)} />
            </linearGradient>
            {/* Inner gloss reflection on top face */}
            <linearGradient id={`${filterId}-gloss`} x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.75)" />
              <stop offset="55%"  stopColor="rgba(255,255,255,0.20)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
            </linearGradient>
          </defs>

          {/* ── TOP FACE ── */}
          <polygon
            points={`${s},0 ${s*2},${h} ${s},${h*2} 0,${h}`}
            fill={`url(#${filterId}-top)`}
            stroke={edgeStroke}
            strokeWidth="0.8"
          />
          {/* Top face gloss */}
          <polygon
            points={`${s},0 ${s*2},${h} ${s},${h*2} 0,${h}`}
            fill={`url(#${filterId}-gloss)`}
            opacity="0.65"
          />

          {/* ── LEFT FACE ── */}
          <polygon
            points={`0,${h} ${s},${h*2} ${s},${h*2+s*0.6} 0,${h+s*0.6}`}
            fill={`url(#${filterId}-left)`}
            stroke={edgeStroke}
            strokeWidth="0.8"
          />
          {/* Left face subtle inner highlight */}
          <polygon
            points={`0,${h} ${s*0.18},${h+s*0.09} ${s*0.18},${h+s*0.09+s*0.6} 0,${h+s*0.6}`}
            fill="rgba(255,255,255,0.18)"
          />

          {/* ── RIGHT FACE ── */}
          <polygon
            points={`${s},${h*2} ${s*2},${h} ${s*2},${h+s*0.6} ${s},${h*2+s*0.6}`}
            fill={`url(#${filterId}-right)`}
            stroke={edgeStroke}
            strokeWidth="0.8"
          />
          {/* Right face edge glint */}
          <polygon
            points={`${s*2},${h} ${s*2},${h+s*0.12} ${s*2},${h+s*0.6} ${s*2},${h+s*0.6}`}
            fill="rgba(255,255,255,0.10)"
          />

          {/* ── EDGE HIGHLIGHTS (crisp glass look) ── */}
          {/* Top ridge */}
          <line x1={s} y1={0}    x2={s*2} y2={h}   stroke="rgba(255,255,255,0.70)" strokeWidth="1.2" />
          <line x1={s} y1={0}    x2={0}   y2={h}   stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" />
          {/* Vertical edges */}
          <line x1={0}   y1={h}      x2={0}   y2={h+s*0.6}   stroke={edgeStroke} strokeWidth="0.7" />
          <line x1={s*2} y1={h}      x2={s*2} y2={h+s*0.6}   stroke={edgeStroke} strokeWidth="0.7" />
          <line x1={s}   y1={h*2}    x2={s}   y2={h*2+s*0.6} stroke={edgeStroke} strokeWidth="0.7" />
          {/* Bottom edges */}
          <line x1={0}   y1={h+s*0.6}   x2={s}   y2={h*2+s*0.6} stroke={edgeStroke} strokeWidth="0.8" />
          <line x1={s*2} y1={h+s*0.6}   x2={s}   y2={h*2+s*0.6} stroke={edgeStroke} strokeWidth="0.8" />

          {/* Small inner refraction highlight on top face */}
          <polygon
            points={`${s*1.15},${h*0.30} ${s*1.65},${h*0.78} ${s*1.40},${h*1.05} ${s*0.90},${h*0.57}`}
            fill="rgba(255,255,255,0.22)"
            stroke="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── Cube definitions — matching the screenshot positions/colors ───────────────
const CUBES = [
  // LEFT SIDE
  { color: "#E85C6A", size: 62, x: "1%",  y: "5%",  rotate: 10,  duration: 14, delay: 0.0, opacity: 0.90, depth: 1.8 }, // red/pink top-left
  { color: "#D4A017", size: 42, x: "5%",  y: "38%", rotate: -12, duration: 19, delay: 1.4, opacity: 0.85, depth: 1.2 }, // gold mid-left
  { color: "#3DA8E0", size: 28, x: "0%",  y: "63%", rotate: 28,  duration: 15, delay: 0.6, opacity: 0.80, depth: 0.7 }, // blue small lower-left
  { color: "#48B872", size: 52, x: "7%",  y: "78%", rotate: -20, duration: 21, delay: 2.2, opacity: 0.88, depth: 1.5 }, // green bottom-left
  // RIGHT SIDE
  { color: "#48B872", size: 56, x: "83%", y: "4%",  rotate: -18, duration: 17, delay: 0.3, opacity: 0.90, depth: 1.6 }, // green top-right
  { color: "#3DA8E0", size: 70, x: "87%", y: "36%", rotate: 12,  duration: 20, delay: 0.9, opacity: 0.88, depth: 2.0 }, // large blue mid-right
  { color: "#E85C6A", size: 34, x: "79%", y: "65%", rotate: -32, duration: 13, delay: 1.8, opacity: 0.82, depth: 0.9 }, // pink small lower-right
  { color: "#D4A017", size: 46, x: "86%", y: "80%", rotate: 22,  duration: 18, delay: 2.8, opacity: 0.86, depth: 1.3 }, // gold bottom-right
];

export default function BackgroundCanvas() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const mouseX = useSpring(rawX, { stiffness: 55, damping: 22, mass: 1 });
  const mouseY = useSpring(rawY, { stiffness: 55, damping: 22, mass: 1 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth)  * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [rawX, rawY]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundColor: "#f0f4f8",
      }}
      aria-hidden="true"
    >
      {/* ── Soft pastel gradient wash (matches screenshot's airy light bg) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 75% 65% at   0%   0%, rgba(210,230,255,0.55) 0%, transparent 65%),
            radial-gradient(ellipse 65% 60% at 100%   0%, rgba(195,240,215,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 65% 60% at   0% 100%, rgba(185,225,255,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 70% 65% at 100% 100%, rgba(255,240,185,0.40) 0%, transparent 65%),
            radial-gradient(ellipse 55% 50% at  50%  50%, rgba(230,235,255,0.25) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Subtle dot / grid overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(90,100,130,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(90,100,130,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Glass cubes — hidden on mobile ── */}
      <div className="hidden sm:block">
        {CUBES.map((cube, i) => (
          <GlassCube key={i} {...cube} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>
    </div>
  );
}