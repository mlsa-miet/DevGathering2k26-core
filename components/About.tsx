"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ══════════════════════════════════════════════════════
   ANIMATED COUNT-UP NUMBER
══════════════════════════════════════════════════════ */
function CountUp({
  target, suffix = "", duration = 1600,
}: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref           = useRef<HTMLSpanElement>(null);
  const inView        = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Stat card ── */
function StatCard({
  value, suffix, label, accent, bg, delay,
}: {
  value: number; suffix: string; label: string;
  accent: string; bg: string; delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-5 py-4 text-center"
      style={{
        background: bg,
        outline: `1.5px solid ${accent}40`,
        boxShadow: `0 0 0 4px ${accent}0d, 0 6px 20px ${accent}1e, inset 0 1px 0 rgba(255,255,255,0.85)`,
        flex: "1 1 0",
        minWidth: 0,
      }}
      initial={{ opacity: 0, y: 22, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.04 }}
    >
      {/* Gloss */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 50%)" }} />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(${accent}28 1px, transparent 1px)`, backgroundSize: "11px 11px", opacity: 0.45, borderRadius: "inherit" }} />
      {/* Accent top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}bb 35%, ${accent} 50%, ${accent}bb 65%, transparent)`, borderRadius: "16px 16px 0 0" }}
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.18 }}
      />
      {/* Corner pip */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-40" style={{ background: accent }} />

      {/* Number */}
      <p className="relative z-10 font-black leading-none"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(22px, 3.5vw, 34px)", color: "#1a1a1a", letterSpacing: "-0.03em" }}>
        <CountUp target={value} suffix={suffix} />
      </p>
      {/* Label */}
      <p className="relative z-10 text-[9px] uppercase tracking-[0.38em] font-semibold"
        style={{ fontFamily: "'DM Sans', sans-serif", color: accent }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   VERTICAL SEPARATOR
══════════════════════════════════════════════════════ */
function VSep({ color, delay }: { color: string; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="hidden md:flex flex-col items-center gap-1.5 shrink-0 self-stretch py-6">
      <motion.div
        className="w-[1.5px] flex-1 rounded-full"
        style={{ background: `linear-gradient(to bottom, transparent, ${color}70 30%, ${color}70 70%, transparent)` }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: color, opacity: 0.5 }}
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: delay + 0.3 }}
      />
      <motion.div
        className="w-[1.5px] flex-1 rounded-full"
        style={{ background: `linear-gradient(to bottom, ${color}70 30%, ${color}70 70%, transparent)` }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURE CARD — horizontal thirds with char slot
══════════════════════════════════════════════════════ */
const FEATURES = [
  {
    number:   "01",
    title:    "Community Focused",
    subtitle: "Built for builders",
    accent:   "#5BA4E6",
    bg:       BLUE,
    bullets:  [
      "Cross-college teams & networking",
      "Mentors from top tech companies",
      "A space where every idea belongs",
    ],
    charLabel: "./21.png",
  },
  {
    number:   "02",
    title:    "Fast-Paced Innovation",
    subtitle: "24 hours, full throttle",
    accent:   "#E8916E",
    bg:       YELLOW,
    bullets:  [
      "Sprint from idea to working demo",
      "Real constraints, real creativity",
      "Judged on impact, not just code",
    ],
    charLabel: "./19.png",
  },
  {
    number:   "03",
    title:    "Real Recognition",
    subtitle: "Impact & opportunity",
    accent:   "#4CAF50",
    bg:       GREEN,
    bullets:  [
      "₹4,00,000+ in prizes & goodies",
      "Certificates for all participants",
      "A launchpad for your next big thing",
    ],
    charLabel: "./22.png",
  },
];

function FeatureCard({
  feat, index,
}: { feat: (typeof FEATURES)[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: feat.bg,
        outline:    `1.5px solid ${feat.accent}40`,
        boxShadow:  `0 0 0 4px ${feat.accent}0d, 0 10px 30px ${feat.accent}22, inset 0 1px 0 rgba(255,255,255,0.85)`,
        flex:       "1 1 0",
        minWidth:   0,
      }}
      initial={{ opacity: 0, y: 36, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      {/* Diagonal gloss */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 50%)" }} />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(${feat.accent}28 1px, transparent 1px)`, backgroundSize: "13px 13px", opacity: 0.45, borderRadius: "inherit" }} />
      {/* Accent top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${feat.accent}bb 35%, ${feat.accent} 50%, ${feat.accent}bb 65%, transparent)`, borderRadius: "16px 16px 0 0" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.25 }}
      />
      {/* Corner pip */}
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: feat.accent }} />

      {/* ── Text content ── */}
      <div className="relative z-10 flex flex-col gap-3 p-6 pb-4">

        {/* Number watermark */}
        <div
          className="absolute top-3 left-4 pointer-events-none select-none"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 64, color: feat.accent, opacity: 0.07, letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          {feat.number}
        </div>

        {/* Tag badge */}
        <motion.span
          className="inline-flex items-center gap-1.5 self-start text-[8px] font-bold uppercase tracking-[0.4em] px-2.5 py-1 rounded-full"
          style={{ background: `${feat.accent}1c`, border: `1px solid ${feat.accent}50`, color: feat.accent, fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: feat.accent }} />
          {feat.subtitle}
        </motion.span>

        {/* Title */}
        <motion.h3
          className="font-black leading-tight tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px, 2vw, 21px)", color: "#1a1a1a" }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: index * 0.1 + 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {feat.title}
        </motion.h3>

        {/* Thin divider */}
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${feat.accent}40, transparent)` }} />

        {/* Bullets */}
        <ul className="flex flex-col gap-2">
          {feat.bullets.map((b, bi) => (
            <motion.li
              key={bi}
              className="flex items-start gap-2 text-xs leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#555" }}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: index * 0.1 + 0.42 + bi * 0.07 }}
            >
              <span
                className="mt-1 w-1 h-1 rounded-full shrink-0"
                style={{ background: feat.accent, opacity: 0.7 }}
              />
              {b}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* ── Character slot ── */}
      {/* ── Character slot ── */}
<div className="relative z-10 mt-auto mx-4 mb-4">
  {/* Thin rule above char */}
  <div
    className="h-px mb-3"
    style={{ background: `linear-gradient(90deg, transparent, ${feat.accent}38, transparent)` }}
  />

  <div
    className="flex items-end justify-center rounded-xl overflow-hidden"
    style={{
      height: 120,
    }}
  >
    <img
      src={feat.charLabel}
      alt=""
      className="block w-full object-contain"
      style={{ maxHeight: 150 }}
    />
  </div>
</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   ABOUT SECTION — default export
══════════════════════════════════════════════════════ */
export default function AboutSection() {
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section
      id="about"
      className="relative w-full py-20 px-4 overflow-hidden"
      // style={{ background: "#fafafa" }}
    >
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.08]" style={{ background: c }} />
        ))}
      </div>
      {/* Grid */}
      {/* <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} /> */}
      {/* Ghost watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden" style={{ opacity: 0.017 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(80px, 16vw, 220px)", color: "#2d2d2d", whiteSpace: "nowrap" }}>
          ABOUT
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Title ── */}
        <div ref={titleRef} className="text-center mb-10">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            The Backstory
          </motion.p>

          <motion.h2
            className="font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(30px, 6vw, 52px)", lineHeight: 1.08, color: "#2d2d2d" }}
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            What is{" "}
            <span style={{ color: "#5BA4E6" }}>DevGathering?</span>
          </motion.h2>

          <motion.div
            className="mx-auto mt-3 rounded-full"
            style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={titleInView ? { width: 110, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="mt-4 text-sm leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.38 }}
          >
            DevGathering is MLSA MIET's flagship 24-hour hackathon — a high-energy
            convergence of students, ideas, and code from colleges across the region.
            Build fast, collaborate fearlessly, and leave your mark.
          </motion.p>
        </div>

        {/* ── Stats row — 4 cards ── */}
        <motion.div
          className="flex flex-row gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.5 }}
        >
          <StatCard value={500}  suffix="+"  label="Registrations" accent="#5BA4E6" bg={BLUE}   delay={0.52} />
          <StatCard value={120}  suffix="+"  label="Projects"       accent="#E8916E" bg={YELLOW} delay={0.60} />
          <StatCard value={30}   suffix="+"  label="Colleges"       accent="#4CAF50" bg={GREEN}  delay={0.68} />
          <StatCard value={4}    suffix="L+" label="Prize Pool"     accent="#D85C8A" bg={PINK}   delay={0.76} />
        </motion.div>

        {/* ── Section label ── */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08))" }} />
          <span className="text-[9px] uppercase tracking-[0.45em] font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}>
            Why DevGathering
          </span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.08), transparent)" }} />
        </motion.div>

        {/* ── Feature cards — 3 columns with vertical separators ── */}
        <div className="flex flex-col md:flex-row items-stretch gap-7">
          {FEATURES.map((feat, i) => (
            <div key={feat.number} className="flex flex-row md:flex-row items-stretch flex-1 min-w-0">
              <FeatureCard feat={feat} index={i} />
              {/* Vertical separator between cards — desktop only */}
              {i < FEATURES.length - 1 && (
                <VSep color={FEATURES[i + 1].accent} delay={0.3 + i * 0.1} />
              )}
            </div>
          ))}
        </div>

        {/* ── Closing quote ── */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, transparent, #5BA4E660, transparent)" }} />
          <p
            className="text-base sm:text-lg font-semibold max-w-md leading-snug"
            style={{ fontFamily: "'Syne', sans-serif", color: "#2d2d2d" }}
          >
            "It's not about who codes the fastest.
            <br />It's about who builds the{" "}
            <span style={{ color: "#5BA4E6" }}>bravest.</span>"
          </p>
          <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, transparent, #FFD6E860, transparent)" }} />
        </motion.div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}