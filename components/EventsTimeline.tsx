"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Mic2,
  BookOpen,
  Code2,
  UtensilsCrossed,
  Users,
  Filter,
  Trophy,
  Cookie,
  Zap,
  Moon,
  Gamepad2,
  ClipboardList,
  Sunrise,
  Coffee,
  Presentation,
  Swords,
  Scale,
  Award,
} from "lucide-react";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ══════════════════════════════════════════════════════
   TIMELINE DATA  (36-hour span: Day1 08:00 → Day2 18:30)
   startHour: hours from Day1 08:00
   duration:  hours
   day: 1 | 2
══════════════════════════════════════════════════════ */
const EVENTS = [
  {
    id: 0,
    time: "08:00 AM",
    label: "Registration Window",
    duration: 2,
    startHour: 0,
    icon: UserCheck,
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "Teams check in, collect swag kits, set up their stations, and get fully onboarded before the clock starts ticking.",
    tag: "Registration",
    day: 1,
  },
  {
    id: 1,
    time: "10:00 AM",
    label: "Inauguration & Opening Keynote",
    duration: 0.5,
    startHour: 2,
    icon: Mic2,
    accent: "#D85C8A",
    bg: PINK,
    description:
      "Official launch — welcome address by MLSA MIET leads, sponsor introductions, theme reveal, and the ceremonial countdown to kickoff.",
    tag: "Ceremony",
    day: 1,
  },
  {
    id: 2,
    time: "10:30 AM",
    label: "Workshop",
    duration: 1,
    startHour: 2.5,
    icon: BookOpen,
    accent: "#E8916E",
    bg: YELLOW,
    description:
      "A focused hands-on session covering tools, APIs, and frameworks relevant to this year's problem statements. Build faster with what you learn here.",
    tag: "Workshop",
    day: 1,
  },
  {
    id: 3,
    time: "11:30 AM",
    label: "Hacking Begins",
    duration: 2,
    startHour: 3.5,
    icon: Code2,
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "The clock starts. Teams sprint on their ideas — brainstorming, wireframing, and laying the very first lines of code.",
    tag: "Hacking",
    day: 1,
  },
  {
    id: 4,
    time: "01:30 PM",
    label: "Lunch Break",
    duration: 1.25,
    startHour: 5.5,
    icon: UtensilsCrossed,
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Fuel up, step away from the screen, and talk shop with other teams. Don't let the ideas stop though.",
    tag: "Break",
    day: 1,
  },
  {
    id: 5,
    time: "02:45 PM",
    label: "Mentoring Round 1",
    duration: 2,
    startHour: 6.75,
    icon: Users,
    accent: "#D85C8A",
    bg: PINK,
    description:
      "Industry mentors rotate through teams — get early feedback, unblock problems, and sharpen your approach before the first elimination.",
    tag: "Mentorship",
    day: 1,
  },
  {
    id: 6,
    time: "04:30 PM",
    label: "Round 1 Elimination",
    duration: 0.5,
    startHour: 8.5,
    icon: Filter,
    accent: "#E8916E",
    bg: YELLOW,
    description:
      "Judges evaluate progress on the spot. Teams are assessed on idea clarity, feasibility, and execution so far.",
    tag: "Evaluation",
    day: 1,
  },
  {
    id: 7,
    time: "05:00 PM",
    label: "Result Round 1 + Group Photo",
    duration: 0.5,
    startHour: 9,
    icon: Trophy,
    accent: "#C89A2A",
    bg: YELLOW,
    description:
      "Results announced — advancing teams revealed. Then everyone gathers for the official DevGathering 2K26 group photograph.",
    tag: "Checkpoint",
    day: 1,
  },
  {
    id: 8,
    time: "05:30 PM",
    label: "Snacks",
    duration: 0.5,
    startHour: 9.5,
    icon: Cookie,
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Quick snack break to recharge before the next deep hacking sprint. Network, breathe, refuel.",
    tag: "Break",
    day: 1,
  },
  {
    id: 9,
    time: "06:00 PM",
    label: "Hacking Time",
    duration: 3,
    startHour: 10,
    icon: Zap,
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "The evening stretch. Heads down, music on, code flowing. This is where real momentum builds.",
    tag: "Hacking",
    day: 1,
  },
  {
    id: 10,
    time: "09:00 PM",
    label: "Dinner",
    duration: 1,
    startHour: 13,
    icon: UtensilsCrossed,
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Dinner served. A proper sit-down meal to power the all-nighter ahead. Don't skip this one.",
    tag: "Break",
    day: 1,
  },
  {
    id: 11,
    time: "10:00 PM",
    label: "Fun Activities",
    duration: 2,
    startHour: 14,
    icon: Gamepad2,
    accent: "#D85C8A",
    bg: PINK,
    description:
      "Organised mini-games, trivia, and team challenges to break the tension and spark creativity before the overnight grind.",
    tag: "Activity",
    day: 1,
  },
  {
    id: 12,
    time: "12:00 AM",
    label: "Core Team Evaluation + Snacks",
    duration: 2,
    startHour: 16,
    icon: ClipboardList,
    accent: "#C89A2A",
    bg: YELLOW,
    description:
      "Organising core team walks through all remaining projects, paired with midnight snacks to keep everyone going.",
    tag: "Evaluation",
    day: 2,
  },
  {
    id: 13,
    time: "02:00 AM",
    label: "Hacking Time",
    duration: 4,
    startHour: 18,
    icon: Moon,
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "The marathon. Teams code through the silent hours. No distractions, just pure build time. The grind is real.",
    tag: "Hacking",
    day: 2,
  },
  {
    id: 14,
    time: "06:00 AM",
    label: "Mentoring Round 3",
    duration: 2,
    startHour: 22,
    icon: Users,
    accent: "#D85C8A",
    bg: PINK,
    description:
      "Final mentor rotations as the sun rises. Last chance to sharpen your pitch, fix blockers, and polish the demo.",
    tag: "Mentorship",
    day: 2,
  },
  {
    id: 15,
    time: "08:30 AM",
    label: "Breakfast + Freshen Up",
    duration: 1,
    startHour: 24.5,
    icon: Sunrise,
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Morning reset. Grab breakfast, freshen up, and come back to your station with a clear head and full stomach.",
    tag: "Break",
    day: 2,
  },
  {
    id: 16,
    time: "09:30 AM",
    label: "Session",
    duration: 1.5,
    startHour: 25.5,
    icon: Presentation,
    accent: "#E8916E",
    bg: YELLOW,
    description:
      "An inspiring talk from a guest speaker or panel — insights from the industry to energise teams for the final push.",
    tag: "Session",
    day: 2,
  },
  {
    id: 17,
    time: "11:00 AM",
    label: "Second Elimination",
    duration: 1,
    startHour: 27,
    icon: Swords,
    accent: "#C89A2A",
    bg: YELLOW,
    description:
      "Second round of cuts. Judges assess product completeness, innovation, and market potential. Only the best advance.",
    tag: "Evaluation",
    day: 2,
  },
  {
    id: 18,
    time: "12:00 PM",
    label: "Hacking Time",
    duration: 1.5,
    startHour: 28,
    icon: Code2,
    accent: "#5BA4E6",
    bg: BLUE,
    description:
      "Final coding window. Polish the UI, stress-test the backend, perfect the pitch deck. Every minute matters.",
    tag: "Hacking",
    day: 2,
  },
  {
    id: 19,
    time: "01:30 PM",
    label: "Lunch Break",
    duration: 1,
    startHour: 29.5,
    icon: Coffee,
    accent: "#4CAF50",
    bg: GREEN,
    description:
      "Last proper break before the finals. Breathe, eat, and mentally prepare for your 5-minute moment on stage.",
    tag: "Break",
    day: 2,
  },
  {
    id: 20,
    time: "02:30 PM",
    label: "Final Judging",
    duration: 3,
    startHour: 30.5,
    icon: Scale,
    accent: "#D85C8A",
    bg: PINK,
    description:
      "Teams present to the final panel. 5 minutes to demo, pitch, and defend your idea. Make every second count.",
    tag: "Judging",
    day: 2,
  },
  {
    id: 21,
    time: "05:30 PM",
    label: "Result Declaration + Wrap Up",
    duration: 1,
    startHour: 33.5,
    icon: Award,
    accent: "#C89A2A",
    bg: GREEN,
    description:
      "Winners announced, prizes awarded, certificates distributed. The DevGathering 2K26 story is written — and you were part of it.",
    tag: "Ceremony",
    day: 2,
  },
];

const TOTAL_HOURS = 36.5; // Day1 08:00 → Day2 18:30
const DAY_BREAK_HOUR = 16; // Hour 16 (12:00 AM) = Day 2 starts

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function hourToAngle(hour: number): number {
  return (hour / TOTAL_HOURS) * 360 - 90;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number
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
   DAY BADGE
══════════════════════════════════════════════════════ */
function DayBadge({ day }: { day: 1 | 2 }) {
  const isDay2 = day === 2;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.35em] px-2.5 py-1 rounded-full"
      style={{
        background: isDay2 ? "rgba(93,75,153,0.1)" : "rgba(91,164,230,0.1)",
        border: `1px solid ${isDay2 ? "rgba(93,75,153,0.35)" : "rgba(91,164,230,0.35)"}`,
        color: isDay2 ? "#7C5CBF" : "#4A8FD4",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {isDay2 ? "🌙" : "☀️"} Day {day}
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   CLOCK FACE SVG — now with Day 1 / Day 2 halves
══════════════════════════════════════════════════════ */
interface ClockProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

function ClockFace({ activeIndex, onSelect }: ClockProps) {
  const cx = 160;
  const cy = 160;
  const R  = 118;
  const RINNER = 86;

  const activeEvent = EVENTS[activeIndex];
  const handAngle   = hourToAngle(activeEvent.startHour + activeEvent.duration / 2);

  // Day divider angle — at TOTAL_HOURS/2 of 36h = 18h from start (2:00 AM day 2)
  const dayBreakAngle = hourToAngle(DAY_BREAK_HOUR);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={320} height={320} viewBox="0 0 320 320" style={{ overflow: "visible" }}>

        {/* ── Outer ring ── */}
        <circle cx={cx} cy={cy} r={R + 14} fill="white"
          stroke="rgba(0,0,0,0.06)" strokeWidth={1.5}
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.08))" }}
        />

        {/* ── Day 1 half band (top-right quadrant area) ── */}
        <path
          d={arcPath(cx, cy, R + 14, -90, dayBreakAngle)}
          fill="none"
          stroke="rgba(91,164,230,0.08)"
          strokeWidth={28}
        />
        {/* ── Day 2 half band ── */}
        <path
          d={arcPath(cx, cy, R + 14, dayBreakAngle, 270)}
          fill="none"
          stroke="rgba(93,75,153,0.06)"
          strokeWidth={28}
        />

        {/* ── Day 1 / Day 2 label on outer ring ── */}
        {/* Day 1 label near top */}
        <text
          x={polar(cx, cy, R + 26, hourToAngle(DAY_BREAK_HOUR / 2)).x}
          y={polar(cx, cy, R + 26, hourToAngle(DAY_BREAK_HOUR / 2)).y + 3}
          textAnchor="middle"
          fontSize={7}
          fontFamily="'DM Sans', sans-serif"
          fill="#5BA4E6"
          fontWeight={700}
          letterSpacing={1}
        >
          DAY 1
        </text>
        {/* Day 2 label */}
        <text
          x={polar(cx, cy, R + 26, hourToAngle((DAY_BREAK_HOUR + TOTAL_HOURS) / 2)).x}
          y={polar(cx, cy, R + 26, hourToAngle((DAY_BREAK_HOUR + TOTAL_HOURS) / 2)).y + 3}
          textAnchor="middle"
          fontSize={7}
          fontFamily="'DM Sans', sans-serif"
          fill="#7C5CBF"
          fontWeight={700}
          letterSpacing={1}
        >
          DAY 2
        </text>

        {/* ── Day divider dashed line ── */}
        <line
          x1={polar(cx, cy, 0, dayBreakAngle).x}
          y1={polar(cx, cy, 0, dayBreakAngle).y}
          x2={polar(cx, cy, R + 14, dayBreakAngle).x}
          y2={polar(cx, cy, R + 14, dayBreakAngle).y}
          stroke="rgba(93,75,153,0.25)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />

        {/* ── Arc segments for each event ── */}
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
                strokeWidth={isActive ? 12 : 6}
                strokeLinecap="round"
                style={{
                  transition: "stroke 0.3s, stroke-width 0.3s",
                  filter: isActive ? `drop-shadow(0 0 6px ${ev.accent}80)` : "none",
                }}
              />
            </g>
          );
        })}

        {/* ── Tick marks ── */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * 360 - 90;
          const outer = polar(cx, cy, R + 4, angle);
          const inner = polar(cx, cy, R - 2, angle);
          const isMajor = i % 6 === 0;
          return (
            <line key={i}
              x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y}
              stroke={isMajor ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.07)"}
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* ── Event dot markers ── */}
        {EVENTS.map((ev, i) => {
          const angle    = hourToAngle(ev.startHour);
          const pt       = polar(cx, cy, R + 14, angle);
          const isActive = i === activeIndex;
          return (
            <g key={`dot-${ev.id}`} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
              <circle
                cx={pt.x} cy={pt.y} r={isActive ? 6 : 4}
                fill={isActive ? ev.accent : "white"}
                stroke={ev.accent}
                strokeWidth={isActive ? 0 : 1.5}
                style={{ transition: "all 0.3s", filter: isActive ? `drop-shadow(0 0 4px ${ev.accent})` : "none" }}
              />
              {isActive && (
                <circle cx={pt.x} cy={pt.y} r={10}
                  fill="none" stroke={ev.accent} strokeWidth={1.5} opacity={0.35}
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
          style={{
            filter: `drop-shadow(0 0 4px ${activeEvent.accent}90)`,
            transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        <motion.circle
          cx={polar(cx, cy, RINNER - 10, handAngle).x}
          cy={polar(cx, cy, RINNER - 10, handAngle).y}
          r={4} fill={activeEvent.accent}
          style={{ transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)" }}
        />

        {/* ── Center hub ── */}
        <circle cx={cx} cy={cy} r={22} fill="white" stroke="rgba(0,0,0,0.06)" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={6}  fill={activeEvent.accent} style={{ transition: "fill 0.3s" }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={7.5}
          fontFamily="'DM Sans', sans-serif" fill="#aaa" fontWeight={700} letterSpacing={1}>
          DEV
        </text>
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize={7.5}
          fontFamily="'DM Sans', sans-serif" fill="#aaa" fontWeight={700} letterSpacing={1}>
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
  const IconComponent = event.icon;
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
          minHeight: 300,
        }}
        initial={{ opacity: 0, x: 28, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -28, scale: 0.96 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Diagonal gloss */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 50%)", borderRadius: "inherit" }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${event.accent}28 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
            opacity: 0.45,
            borderRadius: "inherit",
          }}
        />
        {/* Top accent bar */}
        <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${event.accent}bb 35%, ${event.accent} 50%, ${event.accent}bb 65%, transparent)`,
            borderRadius: "16px 16px 0 0",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        {/* Corner pip */}
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-50"
          style={{ background: event.accent }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-3">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <TagBadge tag={event.tag} accent={event.accent} />
            <DayBadge day={event.day as 1 | 2} />
          </div>

          {/* Icon + time row */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center rounded-xl"
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
              <IconComponent size={26} color={event.accent} strokeWidth={1.8} />
            </motion.div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: event.accent }}>
                {event.time}
              </p>
              <h3 className="font-black tracking-tight leading-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(16px, 2.2vw, 24px)",
                  color: "#1a1a1a",
                }}>
                {event.label}
              </h3>
            </div>
          </div>

          {/* Duration pill */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${event.accent}50, transparent)` }} />
            <span className="text-[9px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.65)",
                border: `1px solid ${event.accent}35`,
                color: event.accent,
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {event.duration >= 1
                ? `${event.duration % 1 === 0 ? event.duration : event.duration.toFixed(1).replace(".0", "")} hr${event.duration !== 1 ? "s" : ""}`
                : `${event.duration * 60} min`}
            </span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${event.accent}50)` }} />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#555" }}>
            {event.description}
          </p>

          {/* Event index counter */}
          <p className="text-[9px] uppercase tracking-[0.4em] mt-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}>
            Event {event.id + 1} of {EVENTS.length} · 36-Hour Hackathon
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════
   EVENT STRIP — dot navigator
══════════════════════════════════════════════════════ */
function EventStrip({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  // Split by day for visual grouping
  const day1 = EVENTS.filter(e => e.day === 1);
  const day2 = EVENTS.filter(e => e.day === 2);

  const renderGroup = (group: typeof EVENTS, label: string, labelColor: string) => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[7px] font-bold uppercase tracking-[0.4em]"
        style={{ fontFamily: "'DM Sans', sans-serif", color: labelColor }}>
        {label}
      </span>
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {group.map((ev) => {
          const i = EVENTS.indexOf(ev);
          const isActive = i === activeIndex;
          return (
            <motion.button
              key={ev.id}
              onClick={() => onSelect(i)}
              className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-xl cursor-pointer border-none bg-transparent"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              title={ev.label}
            >
              <motion.div
                className="rounded-full"
                style={{ background: isActive ? ev.accent : `${ev.accent}40` }}
                animate={{ width: isActive ? 24 : 7, height: 7 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              {isActive && (
                <motion.span
                  className="text-[7px] font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: ev.accent }}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {ev.time}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
      {renderGroup(day1, "☀️ Day 1", "#4A8FD4")}
      {/* Divider */}
      <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-purple-300 to-transparent opacity-50" />
      <div className="block sm:hidden h-px w-24 bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50" />
      {renderGroup(day2, "🌙 Day 2", "#7C5CBF")}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function EventTimelineDetails() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = useCallback(() => setActiveIndex(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setActiveIndex(i => Math.min(EVENTS.length - 1, i + 1)), []);

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
    <section id="timeline" className="relative w-full py-20 px-4 overflow-hidden">
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.08]" style={{ background: c }} />
        ))}
      </div>

      {/* Ghost watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden" style={{ opacity: 0.018 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(100px, 20vw, 260px)", color: "#2d2d2d", whiteSpace: "nowrap" }}>
          36HRS
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Title ── */}
        <div className="text-center mb-12">
          <motion.p className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Every Hour Counts
          </motion.p>

          <motion.h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.08 }}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <span style={{ color: "#2d2d2d" }}>Event </span>
            <span style={{ color: "#5BA4E6" }}>Timeline</span>
          </motion.h2>

          {/* Day indicators */}
          <motion.div className="flex items-center justify-center gap-4 mt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded-full" style={{ background: "#5BA4E6" }} />
              <span className="text-[9px] uppercase tracking-widest font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#5BA4E6" }}>
                ☀️ Day 1
              </span>
            </div>
            <span style={{ color: "#ddd" }}>·</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded-full" style={{ background: "#7C5CBF" }} />
              <span className="text-[9px] uppercase tracking-widest font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7C5CBF" }}>
                🌙 Day 2
              </span>
            </div>
          </motion.div>

          <motion.p className="mt-3 text-sm max-w-sm mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
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
            <ClockFace activeIndex={activeIndex} onSelect={setActiveIndex} />

            {/* Nav controls */}
            <div className="flex items-center gap-3">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={activeIndex === 0 ? "#bbb" : "white"} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>

              <div className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 42, height: 42,
                  background: `${activeEvent.accent}18`,
                  border: `1.5px solid ${activeEvent.accent}40`,
                  fontFamily: "'Syne', sans-serif",
                  color: activeEvent.accent,
                  transition: "background 0.3s, border 0.3s, color 0.3s",
                }}>
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={activeIndex === EVENTS.length - 1 ? "#bbb" : "white"} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>

            <p className="text-[9px] uppercase tracking-[0.35em] hidden lg:block"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}>
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