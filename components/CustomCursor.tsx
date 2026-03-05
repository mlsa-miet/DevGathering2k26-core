"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ── Theme colors that the trailing ring cycles through ── */
const COLORS = ["#F4808E", "#6BBF85", "#5AB4E8", "#adb349"];

/* Interpolate between two hex colors by t (0–1) */
function lerpHex(a: string, b: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl2 = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl2})`;
}

export default function CustomCursor() {
  /* Raw mouse position */
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  /* Dot — snappy, near-instant */
  const dotX = useSpring(rawX, { stiffness: 1200, damping: 40, mass: 0.2 });
  const dotY = useSpring(rawY, { stiffness: 1200, damping: 40, mass: 0.2 });

  /* Ring — lags behind nicely */
  const ringX = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const ringY = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  /* Hover state */
  const [hovered, setHovered]   = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible]   = useState(false);

  /* Color cycle based on time */
  const [colorIdx, setColorIdx] = useState(0);
  const [colorT, setColorT]     = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    /* Hide native cursor globally */
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onMouseDown = () => setClicking(true);
    const onMouseUp   = () => setClicking(false);

    /* Detect hoverable elements */
    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isClickable = !!(
        el.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]") ||
        window.getComputedStyle(el).cursor === "pointer"
      );
      setHovered(isClickable);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup",   onMouseUp);

    /* Color animation loop */
    const animateColor = (time: number) => {
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;
      setColorT(prev => {
        const next = prev + dt * 0.0007; // full cycle every ~1.4s
        if (next >= 1) {
          setColorIdx(i => (i + 1) % COLORS.length);
          return next - 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(animateColor);
    };
    rafRef.current = requestAnimationFrame((t) => {
      lastTimeRef.current = t;
      rafRef.current = requestAnimationFrame(animateColor);
    });

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup",   onMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rawX, rawY, visible]);

  const ringColor = lerpHex(COLORS[colorIdx], COLORS[(colorIdx + 1) % COLORS.length], colorT);

  /* Don't render on touch devices */
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* ── Trailing ring ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0, left: 0,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 99998,
          pointerEvents: "none",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          width:  hovered ? 52 : clicking ? 28 : 36,
          height: hovered ? 52 : clicking ? 28 : 36,
        }}
        transition={{ opacity: { duration: 0.2 }, width: { type: "spring", stiffness: 300, damping: 22 }, height: { type: "spring", stiffness: 300, damping: 22 } }}
      >
        <div style={{
          width: "100%", height: "100%",
          borderRadius: hovered ? "30%" : "50%",
          border: `2px solid ${ringColor}`,
          background: hovered ? `${ringColor}22` : "transparent",
          transition: "border-color 0.1s, background 0.2s, border-radius 0.3s",
          boxShadow: `0 0 12px ${ringColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ringColor,
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              ●
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* ── Sharp center dot ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0, left: 0,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 99999,
          pointerEvents: "none",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.5 : hovered ? 1.6 : 1,
          width:  6,
          height: 6,
        }}
        transition={{ scale: { type: "spring", stiffness: 500, damping: 20 }, opacity: { duration: 0.15 } }}
      >
        <div style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: ringColor,
          transition: "background 0.1s",
          boxShadow: `0 0 6px ${ringColor}88`,
        }} />
      </motion.div>

      {/* Particle trail on click */}
      <ClickParticles rawX={rawX} rawY={rawY} clicking={clicking} color={ringColor} />
    </>
  );
}

/* ── Mini burst on click ── */
function ClickParticles({ rawX, rawY, clicking, color }: {
  rawX: any; rawY: any; clicking: boolean; color: string;
}) {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const prevClick = useRef(false);

  useEffect(() => {
    if (clicking && !prevClick.current) {
      const id = Date.now();
      setBursts(b => [...b, { id, x: rawX.get(), y: rawY.get(), color }]);
      setTimeout(() => setBursts(b => b.filter(p => p.id !== id)), 600);
    }
    prevClick.current = clicking;
  }, [clicking, rawX, rawY, color]);

  const OFFSETS = [
    { dx: -18, dy: -18 }, { dx: 18, dy: -18 },
    { dx: -18, dy:  18 }, { dx: 18, dy:  18 },
    { dx:   0, dy: -24 }, { dx:  0, dy:  24 },
  ];

  return (
    <>
      {bursts.map(burst => (
        <div key={burst.id} style={{ position: "fixed", left: burst.x, top: burst.y, zIndex: 99997, pointerEvents: "none" }}>
          {OFFSETS.map((o, i) => (
            <motion.div
              key={i}
              style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: COLORS[i % COLORS.length], left: -2, top: -2 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: o.dx, y: o.dy, opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.02 }}
            />
          ))}
        </div>
      ))}
    </>
  );
}