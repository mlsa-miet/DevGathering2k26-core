"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ══════════════════════════════════════════════════════
   TIMELINE DATA
   startHour: decimal hour from 09:00 (0 = 9am, 3.5 = 12:30pm, etc.)
   duration:  hours (used for clock hand position and arc)
══════════════════════════════════════════════════════ */
const EVENTS = [
  {
    id: 0,
    time: "09:00 AM",
    label: "Opening Ceremony",
    duration: 1,
    startHour: 0,
    icon: "🎤",
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "Welcome address by MLSA MIET leads, sponsor introductions, theme reveal, and the official countdown to kickoff.",
    tag: "Ceremony",
  },
  {
    id: 1,
    time: "10:00 AM",
    label: "Hacking Begins",
    duration: 3,
    startHour: 1,
    icon: "💻",
    accent: "#E8916E",
    bg: YELLOW,
    description:
      "The clock starts. Teams sprint on their ideas — brainstorming, wireframing, and laying the first lines of code.",
    tag: "Hacking",
  },
  {
    id: 2,
    time: "01:00 PM",
    label: "Lunch Break",
    duration: 1,
    startHour: 4,
    icon: "🍱",
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Fuel up. Grab lunch, recharge, and talk shop with other teams. Don't stop the ideas though.",
    tag: "Break",
  },
  {
    id: 3,
    time: "02:00 PM",
    label: "Mentor Sessions",
    duration: 2,
    startHour: 5,
    icon: "🧑‍🏫",
    accent: "#D85C8A",
    bg: PINK,
    description:
      "Industry mentors rotate through teams — get feedback, unblock problems, and sharpen your pitch.",
    tag: "Mentorship",
  },
  {
    id: 4,
    time: "04:00 PM",
    label: "Mid-Submission",
    duration: 0.5,
    startHour: 7,
    icon: "📋",
    accent: "#C89A2A",
    bg: YELLOW,
    description:
      "Submit your PPT/PDF checkpoint. Judges review progress and teams adjust based on early feedback.",
    tag: "Checkpoint",
  },
  {
    id: 5,
    time: "04:30 PM",
    label: "Deep Hacking",
    duration: 3.5,
    startHour: 7.5,
    icon: "🔥",
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "The intense stretch. Build, debug, polish, and push. This is where winners are made.",
    tag: "Hacking",
  },
  {
    id: 6,
    time: "08:00 PM",
    label: "Dinner & Night Fuel",
    duration: 1,
    startHour: 11,
    icon: "🌙",
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Dinner served. Energy drinks, snacks, and music to power the all-nighter ahead.",
    tag: "Break",
  },
  {
    id: 7,
    time: "09:00 PM",
    label: "Overnight Hacking",
    duration: 8,
    startHour: 12,
    icon: "⚡",
    accent: "#D85C8A",
    bg: PINK,
    description:
      "The marathon. Teams code through the night. Mentors check in. The grind is real.",
    tag: "Hacking",
  },
  {
    id: 8,
    time: "05:00 AM",
    label: "Final Submissions",
    duration: 1,
    startHour: 20,
    icon: "🚀",
    accent: "#E8916E",
    bg: YELLOW,
    description:
      "Lock in your work. Final code push, last slide tweak, and submit before the buzzer.",
    tag: "Deadline",
  },
  {
    id: 9,
    time: "09:00 AM",
    label: "Presentations",
    duration: 2,
    startHour: 24,
    icon: "🎯",
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "Teams present to judges. 5 minutes to demo, pitch, and defend your idea. Make it count.",
    tag: "Judging",
  },
  {
    id: 10,
    time: "11:00 AM",
    label: "Awards & Closing",
    duration: 1,
    startHour: 26,
    icon: "🏆",
    accent: "#C89A2A",
    bg: GREEN,
    description:
      "Results announced, prizes awarded, certificates distributed. The DevGathering 2K26 story is written.",
    tag: "Ceremony",
  },
];

const TOTAL_HOURS = 27; // 09:00 Day1 → 12:00 Day2

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
// Convert decimal hour (0-27) to clock angle in degrees
// We map the 27-hour span across 360°
function hourToAngle(hour: number): number {
  return (hour / TOTAL_HOURS) * 360 - 90; // -90 to start at 12 o'clock
}

// Polar to cartesian on a circle of given radius
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// SVG arc path between two angles
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polar(cx, cy, r, startAngle);
  const end   = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

/* ══════════════════════════════════════════════════════
   TAG BADGE
══════════════════════════════════════════════════════ */
function TagBadge({ tag, accent }: { tag: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.4em] px-2.5 py-1 rounded-full"
      style={{
        background: `${accent}1c`,
        border: `1px solid ${accent}55`,
        color: accent,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
      {tag}
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   CLOCK FACE SVG
══════════════════════════════════════════════════════ */
interface ClockProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

function ClockFace({ activeIndex, onSelect }: ClockProps) {
  const cx = 160;
  const cy = 160;
  const R  = 120; // outer tick ring
  const RINNER = 88; // arc ring radius

  const activeEvent = EVENTS[activeIndex];
  const handAngle   = hourToAngle(activeEvent.startHour + activeEvent.duration / 2);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={320}
        height={320}
        viewBox="0 0 320 320"
        style={{ overflow: "visible" }}
      >
        {/* ── Outer ring ── */}
        <circle
          cx={cx} cy={cy} r={R + 14}
          fill="white"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={1.5}
          style={{
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.08))",
          }}
        />
        <circle
          cx={cx} cy={cy} r={R + 14}
          fill="none"
          stroke="rgba(0,0,0,0.04)"
          strokeWidth={10}
        />

        {/* ── Background arc segments for each event ── */}
        {EVENTS.map((ev, i) => {
          const startAngle = hourToAngle(ev.startHour);
          const endAngle   = hourToAngle(ev.startHour + ev.duration);
          const isActive   = i === activeIndex;
          return (
            <g key={ev.id} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
              <path
                d={arcPath(cx, cy, RINNER, startAngle, endAngle)}
                fill="none"
                stroke={isActive ? ev.accent : `${ev.accent}30`}
                strokeWidth={isActive ? 12 : 7}
                strokeLinecap="round"
                style={{
                  transition: "stroke 0.3s, stroke-width 0.3s",
                  filter: isActive ? `drop-shadow(0 0 6px ${ev.accent}80)` : "none",
                }}
              />
            </g>
          );
        })}

        {/* ── Hour tick marks ── */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 360 - 90;
          const outer = polar(cx, cy, R + 4, angle);
          const inner = polar(cx, cy, R - 2, angle);
          const isMajor = i % 6 === 0;
          return (
            <line
              key={i}
              x1={outer.x} y1={outer.y}
              x2={inner.x} y2={inner.y}
              stroke={isMajor ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.1)"}
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* ── Event dot markers on ring ── */}
        {EVENTS.map((ev, i) => {
          const angle  = hourToAngle(ev.startHour);
          const pt     = polar(cx, cy, R + 14, angle);
          const isActive = i === activeIndex;
          return (
            <g key={`dot-${ev.id}`} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
              <circle
                cx={pt.x} cy={pt.y} r={isActive ? 7 : 5}
                fill={isActive ? ev.accent : "white"}
                stroke={ev.accent}
                strokeWidth={isActive ? 0 : 1.5}
                style={{ transition: "all 0.3s", filter: isActive ? `drop-shadow(0 0 4px ${ev.accent})` : "none" }}
              />
              {isActive && (
                <circle
                  cx={pt.x} cy={pt.y} r={11}
                  fill="none"
                  stroke={ev.accent}
                  strokeWidth={1.5}
                  opacity={0.35}
                />
              )}
            </g>
          );
        })}

        {/* ── Clock hand ── */}
        <motion.line
          x1={cx} y1={cy}
          x2={polar(cx, cy, RINNER - 10, handAngle).x}
          y2={polar(cx, cy, RINNER - 10, handAngle).y}
          stroke={activeEvent.accent}
          strokeWidth={3}
          strokeLinecap="round"
          animate={{ rotate: 0 }}
          style={{
            filter: `drop-shadow(0 0 4px ${activeEvent.accent}90)`,
            transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        {/* Hand cap */}
        <motion.circle
          cx={polar(cx, cy, RINNER - 10, handAngle).x}
          cy={polar(cx, cy, RINNER - 10, handAngle).y}
          r={4}
          fill={activeEvent.accent}
          style={{ transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)" }}
        />

        {/* ── Center hub ── */}
        <circle cx={cx} cy={cy} r={22} fill="white" stroke="rgba(0,0,0,0.06)" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={6}  fill={activeEvent.accent} style={{ transition: "fill 0.3s" }} />

        {/* ── Center label ── */}
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          fontSize={8}
          fontFamily="'DM Sans', sans-serif"
          fill="#aaa"
          fontWeight={600}
          letterSpacing={1}
          style={{ textTransform: "uppercase" }}
        >
          DEV
        </text>
        <text
          x={cx} y={cy + 6}
          textAnchor="middle"
          fontSize={8}
          fontFamily="'DM Sans', sans-serif"
          fill="#aaa"
          fontWeight={600}
          letterSpacing={1}
        >
          2K26
        </text>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   EVENT DETAIL CARD
══════════════════════════════════════════════════════ */
function EventDetailCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={event.id}
        className="relative flex flex-col gap-4 rounded-2xl overflow-hidden h-full"
        style={{
          background: event.bg,
          padding: "28px 28px 24px",
          outline: `1.5px solid ${event.accent}40`,
          outlineOffset: 0,
          boxShadow: `
            0 0 0 4px ${event.accent}0e,
            0 12px 40px ${event.accent}28,
            inset 0 1px 0 rgba(255,255,255,0.85)
          `,
          minHeight: 280,
        }}
        initial={{ opacity: 0, x: 28, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -28, scale: 0.96 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Diagonal gloss */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 50%)", borderRadius: "inherit" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${event.accent}28 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
            opacity: 0.45,
            borderRadius: "inherit",
          }}
        />
        {/* Top accent bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${event.accent}bb 35%, ${event.accent} 50%, ${event.accent}bb 65%, transparent)`,
            borderRadius: "16px 16px 0 0",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        {/* Corner pip */}
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: event.accent }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-3">
          <TagBadge tag={event.tag} accent={event.accent} />

          {/* Icon + time row */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center rounded-xl text-3xl"
              style={{
                width: 60, height: 60,
                background: "white",
                border: `2px solid ${event.accent}28`,
                boxShadow: `0 0 0 4px ${event.accent}12, 0 4px 14px ${event.accent}22`,
                flexShrink: 0,
              }}
              initial={{ scale: 0.6, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {event.icon}
            </motion.div>

            <div>
              <p
                className="text-[10px] uppercase tracking-[0.4em] font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: event.accent }}
              >
                {event.time}
              </p>
              <h3
                className="font-black tracking-tight leading-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  color: "#1a1a1a",
                }}
              >
                {event.label}
              </h3>
            </div>
          </div>

          {/* Duration pill */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${event.accent}50, transparent)` }} />
            <span
              className="text-[9px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.65)",
                border: `1px solid ${event.accent}35`,
                color: event.accent,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {event.duration >= 1
                ? `${event.duration} hr${event.duration !== 1 ? "s" : ""}`
                : `${event.duration * 60} min`}
            </span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${event.accent}50)` }} />
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#555" }}
          >
            {event.description}
          </p>

          {/* Event index counter */}
          <p
            className="text-[9px] uppercase tracking-[0.4em] mt-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}
          >
            Event {event.id + 1} of {EVENTS.length}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════
   MINI EVENT STRIP — dots along bottom
══════════════════════════════════════════════════════ */
function EventStrip({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {EVENTS.map((ev, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.button
            key={ev.id}
            onClick={() => onSelect(i)}
            className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer border-none bg-transparent"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            title={ev.label}
          >
            <motion.div
              className="rounded-full"
              style={{ background: isActive ? ev.accent : `${ev.accent}40` }}
              animate={{ width: isActive ? 28 : 8, height: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            {isActive && (
              <motion.span
                className="text-[8px] font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ fontFamily: "'DM Sans', sans-serif", color: ev.accent }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {ev.time}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   EVENT TIMELINE — default export
══════════════════════════════════════════════════════ */
export default function EventTimelineDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(
    () => setActiveIndex((i) => Math.max(0, i - 1)),
    []
  );
  const next = useCallback(
    () => setActiveIndex((i) => Math.min(EVENTS.length - 1, i + 1)),
  []
  );

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const activeEvent = EVENTS[activeIndex];

  return (
    <section
      id="timeline"
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
      {/* <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      /> */}

      {/* Ghost watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.018 }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(100px, 20vw, 260px)",
            color: "#2d2d2d",
            whiteSpace: "nowrap",
          }}
        >
          24HRS
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Title ── */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Every Hour Counts
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.08 }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>Event </span>
            <span style={{ color: "#5BA4E6" }}>Timeline</span>
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
            Click any segment on the clock or use the arrows to explore.
          </motion.p>
        </div>

        {/* ── Main interactive area ── */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Left: Clock + nav controls ── */}
          <div className="flex flex-col items-center gap-6 shrink-0">
            {/* Clock */}
            <ClockFace activeIndex={activeIndex} onSelect={setActiveIndex} />

            {/* Nav controls */}
            <div className="flex items-center gap-3">
              {/* Prev */}
              <motion.button
                onClick={prev}
                disabled={activeIndex === 0}
                className="flex items-center justify-center rounded-full font-bold text-white"
                style={{
                  width: 42, height: 42,
                  background: activeIndex === 0 ? "rgba(0,0,0,0.07)" : activeEvent.accent,
                  border: "none",
                  cursor: activeIndex === 0 ? "not-allowed" : "pointer",
                  boxShadow: activeIndex === 0 ? "none" : `0 4px 14px ${activeEvent.accent}45`,
                  transition: "background 0.3s, box-shadow 0.3s",
                }}
                whileHover={activeIndex > 0 ? { scale: 1.1 } : {}}
                whileTap={activeIndex > 0 ? { scale: 0.95 } : {}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeIndex === 0 ? "#bbb" : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>

              {/* Active event counter */}
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 42, height: 42,
                  background: `${activeEvent.accent}18`,
                  border: `1.5px solid ${activeEvent.accent}40`,
                  fontFamily: "'Syne', sans-serif",
                  color: activeEvent.accent,
                  transition: "background 0.3s, border 0.3s, color 0.3s",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

              {/* Next */}
              <motion.button
                onClick={next}
                disabled={activeIndex === EVENTS.length - 1}
                className="flex items-center justify-center rounded-full font-bold text-white"
                style={{
                  width: 42, height: 42,
                  background: activeIndex === EVENTS.length - 1 ? "rgba(0,0,0,0.07)" : activeEvent.accent,
                  border: "none",
                  cursor: activeIndex === EVENTS.length - 1 ? "not-allowed" : "pointer",
                  boxShadow: activeIndex === EVENTS.length - 1 ? "none" : `0 4px 14px ${activeEvent.accent}45`,
                  transition: "background 0.3s, box-shadow 0.3s",
                }}
                whileHover={activeIndex < EVENTS.length - 1 ? { scale: 1.1 } : {}}
                whileTap={activeIndex < EVENTS.length - 1 ? { scale: 0.95 } : {}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeIndex === EVENTS.length - 1 ? "#bbb" : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>

            {/* Keyboard hint */}
            <p
              className="text-[9px] uppercase tracking-[0.35em] hidden lg:block"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}
            >
              ← → arrow keys also work
            </p>
          </div>

          {/* ── Right: Event detail card ── */}
          <div className="flex-1 w-full lg:max-w-none">
            <EventDetailCard event={activeEvent} />
          </div>
        </motion.div>

        {/* ── Dot strip navigator ── */}
        <div className="mt-10">
          <EventStrip activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}