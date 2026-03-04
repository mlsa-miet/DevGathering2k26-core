"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ══════════════════════════════════════════════════════
   CONFETTI PARTICLE
══════════════════════════════════════════════════════ */
interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  shape: "rect" | "circle" | "strip";
  drift: number;
}

const CONFETTI_COLORS = [
  "#5BA4E6", "#E8916E", "#4CAF50", "#D85C8A", "#C89A2A",
  "#fbbf24", "#a78bfa", "#34d399", "#f87171", "#60a5fa",
  "#FFE9A8", "#CFE8FF", "#D7F5D0", "#FFD6E8",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 10,
    delay: Math.random() * 0.8,
    duration: 2.2 + Math.random() * 1.8,
    rotate: Math.random() * 720 - 360,
    shape: (["rect", "circle", "strip"] as const)[Math.floor(Math.random() * 3)],
    drift: (Math.random() - 0.5) * 120,
  }));
}

function ConfettiOverlay({ active }: { active: boolean }) {
  const [particles] = useState(() => generateParticles(110));

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width:  p.shape === "strip"  ? p.size * 0.4  : p.size,
            height: p.shape === "strip"  ? p.size * 2.8  :
                    p.shape === "circle" ? p.size         : p.size * 0.7,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? 2 : 3,
          }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            x: p.drift,
            rotate: p.rotate,
            opacity: [1, 1, 1, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Central burst flash */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.18, 0] }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SCRATCH CARD CANVAS
══════════════════════════════════════════════════════ */
function ScratchCard({ onRevealed }: { onRevealed: () => void }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const isDrawing   = useRef(false);
  const revealed    = useRef(false);
  const [done, setDone] = useState(false);

  /* Initialize canvas scratch layer */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    /* Scratch surface gradient */
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   "#e2e8f0");
    grad.addColorStop(0.3, "#cbd5e1");
    grad.addColorStop(0.7, "#e2e8f0");
    grad.addColorStop(1,   "#94a3b8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* "Scratch to Reveal" text on the layer */
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    /* Watermark */
    ctx.font = "bold 72px 'Syne', sans-serif";
    ctx.fillStyle = "rgba(148,163,184,0.25)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-0.2);
    ctx.fillText("PRIZE", 0, -24);
    ctx.fillText("POOL",  0,  36);
    ctx.restore();

    /* Main instruction */
    ctx.font = "700 18px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(71,85,105,0.85)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch to Reveal  ✦", W / 2, H / 2);

    /* Sub label */
    ctx.font = "500 12px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(100,116,139,0.7)";
    ctx.fillText("drag your finger or mouse", W / 2, H / 2 + 28);
    ctx.restore();

    /* Shimmer stripe */
    const shimmer = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, 0);
    shimmer.addColorStop(0,    "transparent");
    shimmer.addColorStop(0.45, "rgba(255,255,255,0.22)");
    shimmer.addColorStop(0.55, "rgba(255,255,255,0.22)");
    shimmer.addColorStop(1,    "transparent");
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, W, H);
  }, []);

  /* Check how much is scratched */
  const checkRevealThreshold = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }
    const ratio = transparent / (canvas.width * canvas.height);
    if (ratio > 0.48) {
      revealed.current = true;
      /* Clear remaining */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDone(true);
      onRevealed();
    }
  }, [onRevealed]);

  /* Scratch helpers */
  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width  / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = (x - rect.left) * scaleX;
      const cy = (y - rect.top)  * scaleY;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();
      checkRevealThreshold();
    },
    [checkRevealThreshold]
  );

  const onMouseMove  = (e: React.MouseEvent)  => { if (isDrawing.current) scratch(e.clientX, e.clientY); };
  const onTouchMove  = (e: React.TouchEvent)  => { e.preventDefault(); scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const onMouseDown  = (e: React.MouseEvent)  => { isDrawing.current = true; scratch(e.clientX, e.clientY); };
  const onTouchStart = (e: React.TouchEvent)  => { isDrawing.current = true; scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const onEnd        = ()                      => { isDrawing.current = false; };

  return (
    <div className="relative select-none" style={{ touchAction: "none" }}>
      {/* Revealed content underneath */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
        }}
      >
        {/* Stars bg */}
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width:  1 + (i % 3),
              height: 1 + (i % 3),
              left:   `${(i * 37) % 95}%`,
              top:    `${(i * 53) % 95}%`,
              opacity: 0.15 + (i % 5) * 0.08,
            }}
          />
        ))}

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={done ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-sm uppercase tracking-[0.5em] font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(251,191,36,0.75)" }}
            animate={done ? { opacity: [0, 1] } : {}}
            transition={{ delay: 0.2 }}
          >
            Total Prize Pool
          </motion.p>

          <motion.div
            className="relative"
            animate={done ? { scale: [0.8, 1.12, 1] } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow behind number */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
                filter: "blur(20px)",
                transform: "scale(1.8)",
              }}
            />
            <p
              className="relative font-black leading-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(42px, 10vw, 72px)",
                background: "linear-gradient(135deg, #fef3c7, #fbbf24, #f59e0b, #fef3c7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
                textShadow: "none",
              }}
            >
              ₹4,00,000
            </p>
          </motion.div>

          <motion.p
            className="text-xs uppercase tracking-[0.45em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)" }}
            animate={done ? { opacity: [0, 1] } : {}}
            transition={{ delay: 0.5 }}
          >
            in prizes &amp; goodies
          </motion.p>
        </motion.div>
      </div>

      {/* Canvas scratch layer */}
      <canvas
        ref={canvasRef}
        width={520}
        height={200}
        className="relative z-10 w-full rounded-2xl"
        style={{
          cursor: done ? "default" : "crosshair",
          display: done ? "none" : "block",
          borderRadius: 16,
          boxShadow: "0 4px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onEnd}
      />

      {/* Placeholder height when done */}
      {done && <div style={{ height: 200 }} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MEDAL CARD
══════════════════════════════════════════════════════ */
const MEDALS = [
  {
    rank: 1,
    label: "1st Place",
    emoji: "🥇",
    prize: "To Be Revealed",
    gradient: "linear-gradient(135deg, #fef3c7 0%, #fbbf24 40%, #f59e0b 70%, #fef3c7 100%)",
    accent: "#f59e0b",
    border: "#fbbf24",
    glow: "rgba(251,191,36,0.35)",
    shimmer: "rgba(255,255,255,0.5)",
    size: "lg",
  },
  {
    rank: 2,
    label: "2nd Place",
    emoji: "🥈",
    prize: "To Be Revealed",
    gradient: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 40%, #94a3b8 70%, #f1f5f9 100%)",
    accent: "#64748b",
    border: "#cbd5e1",
    glow: "rgba(148,163,184,0.28)",
    shimmer: "rgba(255,255,255,0.45)",
    size: "md",
  },
  {
    rank: 3,
    label: "3rd Place",
    emoji: "🥉",
    prize: "To Be Revealed",
    gradient: "linear-gradient(135deg, #fff7ed 0%, #fb923c 40%, #ea580c 70%, #fff7ed 100%)",
    accent: "#ea580c",
    border: "#fb923c",
    glow: "rgba(251,146,60,0.28)",
    shimmer: "rgba(255,255,255,0.4)",
    size: "md",
  },
];

function MedalCard({
  medal,
  index,
}: {
  medal: (typeof MEDALS)[0];
  index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const isLg   = medal.size === "lg";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.88 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.04 }}
      className="relative flex flex-col items-center overflow-hidden rounded-2xl cursor-default"
      style={{
        background: medal.gradient,
        border: `1.5px solid ${medal.border}`,
        boxShadow: `0 0 0 4px ${medal.glow}, 0 10px 32px ${medal.glow}, inset 0 1px 0 ${medal.shimmer}`,
        padding: isLg ? "28px 20px 24px" : "22px 16px 20px",
        flex: isLg ? "1.2 1 0" : "1 1 0",
        minWidth: 0,
        alignSelf: isLg ? "flex-start" : "center",
      }}
    >
      {/* Shimmer sweep animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
      />

      {/* Diagonal gloss */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.45) 0%, transparent 50%)" }}
      />

      {/* Rank watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: isLg ? 100 : 80,
          color: medal.accent,
          opacity: 0.07,
          letterSpacing: "-0.04em",
        }}
      >
        #{medal.rank}
      </div>

      {/* Pulsing outer ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: isLg ? 90 : 72, height: isLg ? 90 : 72,
          border: `1.5px solid ${medal.border}`,
          top: isLg ? 20 : 14, left: "50%", translateX: "-50%",
        }}
        animate={{ scale: [1, 1.25], opacity: [0.45, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Emoji medal */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width:  isLg ? 72 : 58,
          height: isLg ? 72 : 58,
          background: "rgba(255,255,255,0.55)",
          border: `2px solid ${medal.shimmer}`,
          boxShadow: `0 0 0 4px ${medal.glow}`,
          fontSize: isLg ? 32 : 26,
          backdropFilter: "blur(4px)",
        }}
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {medal.emoji}
      </motion.div>

      {/* Rank label */}
      <motion.p
        className="relative z-10 font-black mt-3 tracking-tight"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isLg ? 20 : 17,
          color: medal.rank === 2 ? "#1e293b" : medal.rank === 1 ? "#78350f" : "#7c2d12",
        }}
      >
        {medal.label}
      </motion.p>

      {/* Divider */}
      <div
        className="w-3/4 my-3 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${medal.border}, transparent)` }}
      />

      {/* Lock icon */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <motion.div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 34, height: 34,
            background: "rgba(255,255,255,0.5)",
            border: `1.5px solid ${medal.border}`,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={medal.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </motion.div>

        <p
          className="text-[9px] uppercase tracking-[0.4em] font-semibold text-center"
          style={{ fontFamily: "'DM Sans', sans-serif", color: medal.accent, opacity: 0.8 }}
        >
          {medal.prize}
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   PRIZE POOL SECTION — default export
══════════════════════════════════════════════════════ */
export default function PrizePoolSection() {
  const [revealed,   setRevealed]   = useState(false);
  const [confetti,   setConfetti]   = useState(false);
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const handleRevealed = useCallback(() => {
    setRevealed(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  }, []);

  return (
    <>
      

      <section
        id="prizes"
        className="relative w-full py-24 px-4 overflow-hidden"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0.017 }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(100px, 18vw, 240px)",
              color: "#2d2d2d",
              whiteSpace: "nowrap",
            }}
          >
            PRIZES
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* ── Title ── */}
          <div ref={titleRef} className="text-center mb-12">
            <motion.p
              className="text-[10px] uppercase tracking-[0.55em] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
              initial={{ opacity: 0, y: 10 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Win Big
            </motion.p>

            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.08 }}
              initial={{ opacity: 0, y: 28 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{ color: "#2d2d2d" }}>Prize </span>
              <span style={{ color: "#5BA4E6" }}>Pool</span>
            </motion.h2>

            <motion.div
              className="mx-auto mt-4 rounded-full"
              style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={titleInView ? { width: 140, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p
              className="mt-4 text-sm max-w-sm mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
              initial={{ opacity: 0 }}
              animate={titleInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {revealed
                ? "The prize pool has been revealed. Now go win it."
                : "Scratch the card below to reveal the total prize pool."}
            </motion.p>
          </div>

          {/* ── Scratch card ── */}
          <motion.div
            className="max-w-xl mx-auto mb-14"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Card wrapper with ring glow */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: revealed
                  ? "0 0 0 3px rgba(251,191,36,0.4), 0 12px 40px rgba(251,191,36,0.25)"
                  : "0 0 0 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.5s",
              }}
            >
              <ScratchCard onRevealed={handleRevealed} />
            </div>

            {/* "You revealed it!" badge */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="flex justify-center mt-4"
                  initial={{ opacity: 0, y: 10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.3 }}
                >
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #fef3c7, #fbbf24)",
                      color: "#78350f",
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: "0 4px 16px rgba(251,191,36,0.35)",
                    }}
                  >
                    🎉 You revealed it! The prize pool is ₹4,00,000
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Medal cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08))" }} />
              <span
                className="text-[9px] uppercase tracking-[0.45em] font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}
              >
                Prize Breakdown
              </span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.08), transparent)" }} />
            </div>

            {/* Gold on top (center), silver left, bronze right on mobile — all three horizontal on desktop */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              {/* Silver — index 1 */}
              <MedalCard medal={MEDALS[1]} index={1} />
              {/* Gold — center, taller */}
              <MedalCard medal={MEDALS[0]} index={0} />
              {/* Bronze — index 2 */}
              <MedalCard medal={MEDALS[2]} index={2} />
            </div>

            <motion.p
              className="text-center text-[10px] uppercase tracking-[0.4em] mt-6"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}
              initial={{ opacity: 0 }}
              animate={titleInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              Individual prize amounts will be announced on event day
            </motion.p>
          </motion.div>

        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        `}</style>
      </section>
    </>
  );
}