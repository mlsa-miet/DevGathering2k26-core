"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ══════════════════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════════════════ */
const CONFETTI_COLORS = [
  "#5BA4E6","#E8916E","#4CAF50","#D85C8A","#C89A2A",
  "#fbbf24","#a78bfa","#34d399","#f87171","#60a5fa",
  "#FFE9A8","#CFE8FF","#D7F5D0","#FFD6E8",
];

interface Particle {
  id: number; x: number; color: string; size: number;
  delay: number; duration: number; rotate: number;
  shape: "rect"|"circle"|"strip"; drift: number;
}

function generateParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 10,
    delay: Math.random() * 0.7,
    duration: 2.2 + Math.random() * 1.8,
    rotate: Math.random() * 720 - 360,
    shape: (["rect","circle","strip"] as const)[Math.floor(Math.random() * 3)],
    drift: (Math.random() - 0.5) * 130,
  }));
}

function ConfettiOverlay({ active }: { active: boolean }) {
  const [particles] = useState(() => generateParticles(120));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`, top: -20,
            width:  p.shape === "strip" ? p.size * 0.38 : p.size,
            height: p.shape === "strip" ? p.size * 3    : p.shape === "circle" ? p.size : p.size * 0.65,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? 2 : 3,
          }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "115vh", x: p.drift, rotate: p.rotate, opacity: [1,1,1,0.4,0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        <div style={{
          width: 640, height: 640, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)",
        }} />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SCRATCH CARD
══════════════════════════════════════════════════════ */
function ScratchCard({ onRevealed }: { onRevealed: () => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const isDrawing  = useRef(false);
  const revealed   = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    const shine = ctx.createLinearGradient(W*0.1, 0, W*0.9, 0);
    shine.addColorStop(0,    "transparent");
    shine.addColorStop(0.48, "rgba(255,255,255,0.25)");
    shine.addColorStop(0.52, "rgba(255,255,255,0.25)");
    shine.addColorStop(1,    "transparent");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.font = "bold 60px 'Syne', sans-serif";
    ctx.fillStyle = "rgba(148,163,184,0.18)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(W/2, H/2);
    ctx.rotate(-0.18);
    ctx.fillText("PRIZE POOL", 0, 0);
    ctx.restore();

    ctx.font = "700 17px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(51,65,85,0.82)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch to Reveal  ✦", W/2, H/2);

    ctx.font = "500 11px 'DM Sans', sans-serif";
    ctx.fillStyle = "rgba(100,116,139,0.65)";
    ctx.fillText("drag your finger or mouse anywhere", W/2, H/2 + 26);

    for (let r = 0; r < H; r += 14) {
      for (let c = 0; c < W; c += 14) {
        ctx.beginPath();
        ctx.arc(c, r, 1, 0, Math.PI*2);
        ctx.fillStyle = "rgba(148,163,184,0.14)";
        ctx.fill();
      }
    }
  }, []);

  const checkThreshold = useCallback(() => {
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
    if (ratio > 0.30) {
      revealed.current = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDone(true);
      onRevealed();
    }
  }, [onRevealed]);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc((x - rect.left) * scaleX, (y - rect.top) * scaleY, 36, 0, Math.PI*2);
    ctx.fill();
    checkThreshold();
  }, [checkThreshold]);

  const onMouseDown  = (e: React.MouseEvent)  => { isDrawing.current = true; scratch(e.clientX, e.clientY); };
  const onMouseMove  = (e: React.MouseEvent)  => { if (isDrawing.current) scratch(e.clientX, e.clientY); };
  const onTouchStart = (e: React.TouchEvent)  => { isDrawing.current = true; scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const onTouchMove  = (e: React.TouchEvent)  => { e.preventDefault(); scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const onEnd        = ()                      => { isDrawing.current = false; };

  return (
    <div className="relative select-none" style={{ touchAction: "none" }}>
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ background: YELLOW, outline: "1.5px solid rgba(200,154,42,0.35)" }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(200,154,42,0.22) 1px, transparent 1px)",
          backgroundSize: "13px 13px", opacity: 0.55,
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(140deg, rgba(255,255,255,0.58) 0%, transparent 52%)",
        }} />
        {["₹","$","₹","$","₹"].map((sym, i) => (
          <div key={i} className="absolute pointer-events-none select-none" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: 52 + (i % 3) * 16, color: "rgba(200,154,42,0.1)",
            left: `${10 + i * 18}%`, top: `${15 + (i % 2) * 40}%`,
            transform: `rotate(${-15 + i * 12}deg)`, userSelect: "none",
          }}>{sym}</div>
        ))}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{
          background: "linear-gradient(90deg, transparent, rgba(200,154,42,0.9) 40%, #C89A2A 50%, rgba(200,154,42,0.9) 60%, transparent)",
        }} />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-40" style={{ background: "#C89A2A" }} />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={done ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.5em] font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#92701a" }}>
            Total Prize Pool
          </p>
          <motion.p
            className="font-black leading-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(40px, 10vw, 68px)",
              color: "#78350f",
              letterSpacing: "-0.03em",
              textShadow: "0 2px 0 rgba(200,154,42,0.25)",
            }}
            animate={done ? { scale: [0.85, 1.08, 1] } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            $4,00,000
          </motion.p>
          <p className="text-xs uppercase tracking-[0.42em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(120,53,15,0.5)" }}>
            in prizes &amp; goodies
          </p>
        </motion.div>
      </div>

      <canvas
        ref={canvasRef}
        width={560}
        height={190}
        className="relative z-10 w-full rounded-2xl"
        style={{
          cursor: done ? "default" : "crosshair",
          display: done ? "none" : "block",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onEnd}
      />
      {done && <div style={{ height: 190 }} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRIZE CARDS
   Sizes: 1st > 2nd > 3rd
   On mobile: stacked vertically, full width, equal size
══════════════════════════════════════════════════════ */
const PRIZES = [
  {
    rank: "1st",
    label: "First Place",
    LucideIcon: Trophy,
    accent: "#5BA4E6",
    bg: BLUE,
    iconColor: "#5BA4E6",
  },
  {
    rank: "2nd",
    label: "Second Place",
    LucideIcon: Medal,
    accent: "#4CAF50",
    bg: GREEN,
    iconColor: "#4CAF50",
  },
  {
    rank: "3rd",
    label: "Third Place",
    LucideIcon: Award,
    accent: "#D85C8A",
    bg: PINK,
    iconColor: "#D85C8A",
  },
];

/* Card size config per rank */
const CARD_SIZES = [
  /* 1st */ { padding: "32px 20px 28px", iconBox: 72, iconSize: 34, nameSize: 20, rankFontSize: 96 },
  /* 2nd */ { padding: "24px 18px 22px", iconBox: 60, iconSize: 28, nameSize: 17, rankFontSize: 80 },
  /* 3rd */ { padding: "20px 16px 18px", iconBox: 54, iconSize: 24, nameSize: 15, rankFontSize: 72 },
];

function PrizeCard({
  prize,
  sizeIndex,  // 0=1st(largest), 1=2nd, 2=3rd(smallest)
  animIndex,
}: {
  prize: typeof PRIZES[0];
  sizeIndex: number;
  animIndex: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const sz     = CARD_SIZES[sizeIndex];
  const { LucideIcon } = prize;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 38, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.58, delay: animIndex * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, scale: 1.03 }}
      className="relative flex flex-col items-center overflow-hidden rounded-2xl cursor-default w-full"
      style={{
        background: prize.bg,
        outline: `1.5px solid ${prize.accent}42`,
        outlineOffset: 0,
        boxShadow: `
          0 0 0 4px ${prize.accent}10,
          0 10px 32px ${prize.accent}22,
          inset 0 1px 0 rgba(255,255,255,0.85)
        `,
        padding: sz.padding,
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(108deg, transparent 28%, rgba(255,255,255,0.52) 50%, transparent 72%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 1.8 }}
      />
      {/* Diagonal gloss */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 50%)" }} />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${prize.accent}28 1px, transparent 1px)`,
          backgroundSize: "13px 13px", opacity: 0.45, borderRadius: "inherit",
        }} />
      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${prize.accent}bb 35%, ${prize.accent} 50%, ${prize.accent}bb 65%, transparent)`,
          borderRadius: "16px 16px 0 0",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: animIndex * 0.12 + 0.2 }}
      />
      {/* Corner pip */}
      <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-50"
        style={{ background: prize.accent }} />

      {/* Rank watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 900,
          fontSize: sz.rankFontSize, color: prize.accent,
          opacity: 0.07, letterSpacing: "-0.04em",
        }}
      >
        {prize.rank}
      </div>

      {/* Pulsing ring behind icon */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: sz.iconBox + 18, height: sz.iconBox + 18,
          border: `1.5px solid ${prize.accent}40`,
          top: parseInt(sz.padding) - 4,
          left: "50%", translateX: "-50%",
        }}
        animate={{ scale: [1, 1.28], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Icon — NO swing, just scale-in */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-xl"
        style={{
          width:  sz.iconBox,
          height: sz.iconBox,
          background: "rgba(255,255,255,0.6)",
          border: `1.5px solid ${prize.accent}28`,
          boxShadow: `0 0 0 4px ${prize.accent}12`,
          backdropFilter: "blur(4px)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.45, delay: animIndex * 0.12 + 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <LucideIcon size={sz.iconSize} color={prize.iconColor} strokeWidth={1.7} />
      </motion.div>

      {/* Label */}
      <p
        className="relative z-10 font-black mt-3 tracking-tight"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: sz.nameSize,
          color: "#1a1a1a",
        }}
      >
        {prize.label}
      </p>

      {/* Divider */}
      <div className="w-3/4 my-2.5 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${prize.accent}55, transparent)` }} />

      {/* Locked state */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <motion.div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 32, height: 32,
            background: `${prize.accent}18`,
            border: `1.5px solid ${prize.accent}45`,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={prize.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </motion.div>
        <p className="text-[9px] uppercase tracking-[0.38em] font-semibold text-center"
          style={{ fontFamily: "'DM Sans', sans-serif", color: prize.accent, opacity: 0.75 }}>
          To be revealed
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   PRIZE POOL SECTION — default export
══════════════════════════════════════════════════════ */
export default function PrizePoolSection() {
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const audioRef    = useRef<HTMLAudioElement | null>(null);

  /* Preload hooray sound */
  useEffect(() => {
    audioRef.current = new Audio("/hooting.mpeg");
    audioRef.current.preload = "auto";
  }, []);

  const handleRevealed = useCallback(() => {
    setRevealed(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
    /* Play hooray once */
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      <ConfettiOverlay active={confetti} />

      <section
        id="prizes"
        className="relative w-full py-24 px-4 overflow-hidden"
      >
        {/* 4-band pastel wash */}
        <div className="absolute inset-0 flex pointer-events-none">
          {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
            <div key={i} className="flex-1 opacity-[0.08]" style={{ background: c }} />
          ))}
        </div>

        {/* Ghost watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden" style={{ opacity: 0.017 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: "clamp(100px, 18vw, 240px)", color: "#2d2d2d", whiteSpace: "nowrap",
          }}>
            PRIZES
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">

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
                ? "The prize pool is out. Now go build and claim it."
                : "Scratch the card below to reveal what's waiting for you."}
            </motion.p>
          </div>

          {/* ── Scratch card ── */}
          <motion.div
            className="w-full mx-auto mb-12"
            style={{ maxWidth: 560 }}
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={titleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: revealed
                  ? "0 0 0 3px rgba(200,154,42,0.35), 0 12px 36px rgba(200,154,42,0.2)"
                  : "0 0 0 1.5px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.5s",
              }}
            >
              <ScratchCard onRevealed={handleRevealed} />
            </div>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="flex justify-center mt-4"
                  initial={{ opacity: 0, y: 8, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold"
                    style={{
                      background: YELLOW,
                      color: "#78350f",
                      fontFamily: "'DM Sans', sans-serif",
                      border: "1.5px solid rgba(200,154,42,0.4)",
                      boxShadow: "0 4px 16px rgba(200,154,42,0.22)",
                    }}
                  >
                    🎉 You revealed it! Total prize pool is $4,00,000
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Separator ── */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65 }}
          >
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08))" }} />
            <span className="text-[9px] uppercase tracking-[0.45em] font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}>
              Prize Breakdown
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.08), transparent)" }} />
          </motion.div>

          {/* ══════════════════════════════════════
              DESKTOP: podium layout — 2nd | 1st | 3rd
              MOBILE:  stacked, 1st on top, equal width
          ══════════════════════════════════════ */}

          {/* Desktop layout */}
          <div className="hidden sm:flex gap-4 items-end">
            {/* 2nd place — medium */}
            <div className="flex-1">
              <PrizeCard prize={PRIZES[1]} sizeIndex={1} animIndex={1} />
            </div>
            {/* 1st place — tallest, slight lift */}
            <div className="flex-1" style={{ marginBottom: -14 }}>
              <PrizeCard prize={PRIZES[0]} sizeIndex={0} animIndex={0} />
            </div>
            {/* 3rd place — smallest */}
            <div className="flex-1">
              <PrizeCard prize={PRIZES[2]} sizeIndex={2} animIndex={2} />
            </div>
          </div>

          {/* Mobile layout — stacked vertically, 1st > 2nd > 3rd */}
          <div className="flex sm:hidden flex-col gap-3">
            <PrizeCard prize={PRIZES[0]} sizeIndex={0} animIndex={0} />
            <PrizeCard prize={PRIZES[1]} sizeIndex={1} animIndex={1} />
            <PrizeCard prize={PRIZES[2]} sizeIndex={2} animIndex={2} />
          </div>

          <motion.p
            className="text-center text-[10px] uppercase tracking-[0.42em] mt-6"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            Individual prize amounts revealed on event day
          </motion.p>

        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        `}</style>
      </section>
    </>
  );
}