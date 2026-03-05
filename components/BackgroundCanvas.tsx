"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

function shadeColor(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 0xff) * factor);
  const g = Math.round(((n >> 8)  & 0xff) * factor);
  const b = Math.round(( n        & 0xff) * factor);
  return `rgb(${r},${g},${b})`;
}

// Only left strip (x < 18%) and right strip (x > 78%) — never middle
const CUBES = [
  // LEFT SIDE
  { color: "#F4808E", size: 58, x: "2%",  y: "8%",  rotate: 18,  duration: 14, delay: 0.0, opacity: 0.92, depth: 1.8 },
  { color: "#E8C83A", size: 40, x: "6%",  y: "38%", rotate: -14, duration: 19, delay: 1.4, opacity: 0.85, depth: 1.2 },
  { color: "#5AB4E8", size: 26, x: "1%",  y: "62%", rotate: 30,  duration: 15, delay: 0.6, opacity: 0.80, depth: 0.7 },
  { color: "#6BBF85", size: 48, x: "8%",  y: "78%", rotate: -22, duration: 21, delay: 2.2, opacity: 0.88, depth: 1.5 },
  // RIGHT SIDE
  { color: "#6BBF85", size: 54, x: "84%", y: "6%",  rotate: -20, duration: 17, delay: 0.3, opacity: 0.90, depth: 1.6 },
  { color: "#5AB4E8", size: 66, x: "88%", y: "40%", rotate: 14,  duration: 20, delay: 0.9, opacity: 0.88, depth: 2.0 },
  { color: "#F4808E", size: 32, x: "80%", y: "68%", rotate: -35, duration: 13, delay: 1.8, opacity: 0.82, depth: 0.9 },
  { color: "#E8C83A", size: 44, x: "87%", y: "82%", rotate: 25,  duration: 18, delay: 2.8, opacity: 0.86, depth: 1.3 },
];

function IsoCube({
  color, size, x, y, rotate, duration, delay, opacity, depth,
  mouseX, mouseY,
}: {
  color: string; size: number; x: string; y: string;
  rotate: number; duration: number; delay: number; opacity: number; depth: number;
  mouseX: any; mouseY: any;
}) {
  const s = size;
  const h = s * 0.5;
  const top   = shadeColor(color, 1.0);
  const left  = shadeColor(color, 0.70);
  const right = shadeColor(color, 0.48);

  // Parallax: deeper cubes move more with mouse
  const px = useTransform(mouseX, [-1, 1], [-60 * depth, 60 * depth]);
const py = useTransform(mouseY, [-1, 1], [-40 * depth, 40 * depth]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s * 2,
        height: s * 1.7,
        opacity,
        willChange: "transform",
        filter: `drop-shadow(0 14px 32px ${color}45)`,
        x: px,
        y: py,
      }}
      initial={{ opacity: 0, scale: 0.2, rotate: rotate - 20 }}
      animate={{
        opacity,
        scale: 1,
        rotate,
        // floating drift layered on top of parallax via separate wrapper below
      }}
      transition={{
        opacity: { duration: 1.1, delay, ease: "easeOut" },
        scale:   { duration: 1.1, delay, ease: [0.34, 1.56, 0.64, 1] },
        rotate:  { duration: 1.1, delay, ease: "easeOut" },
      }}
    >
      {/* Inner wrapper for the floating drift so it composes with parallax */}
      <motion.div
        animate={{
          y: [0, -14, 4, -9, 0],
          x: [0, 5, -3, 7, 0],
        }}
        transition={{
          y: { duration, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          x: { duration: duration * 1.25, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
        }}
      >
        <svg
          width={s * 2}
          height={s * 1.7}
          viewBox={`0 0 ${s * 2} ${s * 1.7}`}
          style={{ overflow: "visible" }}
        >
          {/* Top face */}
          <polygon
            points={`${s},0 ${s*2},${h} ${s},${h*2} 0,${h}`}
            fill={top}
          />
          {/* Left face */}
          <polygon
            points={`0,${h} ${s},${h*2} ${s},${h*2+s*0.6} 0,${h+s*0.6}`}
            fill={left}
          />
          {/* Right face */}
          <polygon
            points={`${s},${h*2} ${s*2},${h} ${s*2},${h+s*0.6} ${s},${h*2+s*0.6}`}
            fill={right}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function BackgroundCanvas() {
  // Raw mouse position normalised -1 to +1
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth spring so movement feels weighty, not jittery
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
        backgroundColor: "#fafafa",
      }}
      aria-hidden="true"
    >
      {/* Very faint pastel corner wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 65% 65% at   0%   0%, rgba(255,188,196,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 65% 65% at 100%   0%, rgba(204,233,211,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 65% 65% at   0% 100%, rgba(191,228,255,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 65% 65% at 100% 100%, rgba(255,241,182,0.15) 0%, transparent 70%)
          `,
        }}
      />

      {/* Grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(100,105,120,0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,105,120,0.09) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating 3D cubes — left & right edges only */}
      {CUBES.map((cube, i) => (
        <IsoCube key={i} {...cube} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}