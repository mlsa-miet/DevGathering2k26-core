"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";

const EVENTS = [
  {
    id: 1,
    name: "DevGathering 2k25",
    tag: "Flagship Hackathon",
    year: "25",
    description:
      "500+ registrations, 120+ projects, 30+ colleges — 24 hours of non-stop building and innovation.",
    image: "/images/width_800.jpg",
    accent: "#5BA4E6",
    bg: BLUE,
    link: "#",
    desktopOffset: "mt-0",
  },
  {
    id: 2,
    name: "SAMAARAMBH 3.0",
    tag: "Orientation & Launch",
    year: "24",
    description:
      "Grand orientation for MLSA MIET's new cohort — keynotes, live demos, and community kickoff.",
    image: "/images/samaarambh3.jpg",
    accent: "#E8916E",
    bg: YELLOW,
    link: "#",
    desktopOffset: "mt-10",
  },
  {
    id: 3,
    name: "Salesforce",
    tag: "Industry Workshop",
    year: "24",
    description:
      "Exclusive hands-on workshop with Salesforce engineers on CRM dev, Apex, and LWC.",
    image: "/images/salesforce.jpg",
    accent: "#4CAF50",
    bg: GREEN,
    link: "#",
    desktopOffset: "mt-4",
  },
];

/* ══════════════════════════════════════════════════════
   SINGLE EVENT CARD
══════════════════════════════════════════════════════ */
function EventCard({
  event,
  index,
  isMobile = false,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  isMobile?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const enterY     = index === 0 ? 48 : index === 1 ? 64 : 52;
  const enterDelay = isMobile ? index * 0.08 : index * 0.14;

  return (
    <motion.div
      ref={ref}
      className={`relative flex flex-col overflow-hidden rounded-2xl cursor-default ${
        isMobile ? "w-full" : `${event.desktopOffset} flex-1`
      }`}
      style={{
        background: event.bg,
        outline: `1.5px solid ${event.accent}40`,
        outlineOffset: 0,
        boxShadow: `
          0 0 0 4px ${event.accent}0e,
          0 12px 36px ${event.accent}25,
          inset 0 1px 0 rgba(255,255,255,0.82)
        `,
        minWidth: 0,
      }}
      initial={{ opacity: 0, y: enterY, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: enterDelay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: `0 0 0 4px ${event.accent}18, 0 20px 48px ${event.accent}35, inset 0 1px 0 rgba(255,255,255,0.82)`,
      }}
    >
      {/* Diagonal gloss */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, transparent 50%)",
          borderRadius: "inherit",
        }}
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

      {/* Animated top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${event.accent}bb 35%, ${event.accent} 50%, ${event.accent}bb 65%, transparent)`,
          borderRadius: "16px 16px 0 0",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: enterDelay + 0.25 }}
      />

      {/* Corner pips */}
      <div
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full z-10 opacity-50"
        style={{ background: event.accent }}
      />
      <div
        className="absolute top-3 right-6 w-1 h-1 rounded-full z-10 opacity-30"
        style={{ background: event.accent }}
      />

      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", flexShrink: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${event.accent}30 0%, ${event.accent}12 100%)`,
          }}
        />
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover relative z-[1]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        {/* Bottom fade into card body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 z-[2]"
          style={{ background: `linear-gradient(to bottom, transparent, ${event.bg})` }}
        />
        {/* Year watermark on image */}
        <div
          className="absolute bottom-1 right-3 z-[3] pointer-events-none select-none leading-none"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(52px, 8vw, 80px)",
            color: event.accent,
            opacity: 0.18,
            letterSpacing: "-0.04em",
          }}
        >
          '{event.year}
        </div>
      </div>

      {/* ── Text content ── */}
      <div className="relative z-10 flex flex-col gap-3 p-5 pt-3 flex-1">
        {/* Tag badge */}
        <motion.span
          className="inline-flex items-center gap-1.5 self-start text-[8px] font-bold uppercase tracking-[0.4em] px-2.5 py-1 rounded-full"
          style={{
            background: `${event.accent}1c`,
            border: `1px solid ${event.accent}50`,
            color: event.accent,
            fontFamily: "'DM Sans', sans-serif",
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: enterDelay + 0.3 }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: event.accent }} />
          {event.tag}
        </motion.span>

        {/* Event name */}
        <motion.h3
          className="font-black leading-tight tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(17px, 2.2vw, 22px)",
            color: "#1a1a1a",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: enterDelay + 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          {event.name}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-xs leading-relaxed flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#555" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.45, delay: enterDelay + 0.44 }}
        >
          {event.description}
        </motion.p>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, ${event.accent}40, transparent)`,
          }}
        />

        {/* Explore More */}
        <motion.a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 self-start text-xs font-bold rounded-full px-4 py-2 text-white"
          style={{
            background: event.accent,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: `0 4px 14px ${event.accent}45, inset 0 1px 0 rgba(255,255,255,0.18)`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: enterDelay + 0.52 }}
          whileHover={{ scale: 1.07, boxShadow: `0 6px 20px ${event.accent}60` }}
          whileTap={{ scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
        >
          Explore More
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE VIEW — expand / collapse
══════════════════════════════════════════════════════ */
function MobileEventList() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:hidden">
      {/* Card 1 — always fully visible */}
      <EventCard event={EVENTS[0]} index={0} isMobile />

      {/* Cards 2 & 3 — hidden behind a gradient mask until expanded */}
      <div className="relative">
        {/* Animated container */}
        <motion.div
          className="flex flex-col gap-4 overflow-hidden"
          initial={false}
          animate={{ height: expanded ? "auto" : 220 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative" }}
        >
          <EventCard event={EVENTS[1]} index={1} isMobile />
          <AnimatePresence>
            {expanded && (
              <motion.div
                key="card3"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <EventCard event={EVENTS[2]} index={2} isMobile />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Fade-out overlay — hides when expanded */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              key="fade"
              className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(250,250,250,0.92) 55%, #fafafa 100%)",
              }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <motion.button
        onClick={() => setExpanded((v) => !v)}
        className="self-center inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white mt-1"
        style={{
          background: "linear-gradient(135deg, #5BA4E6, #E8916E)",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 18px rgba(91,164,230,0.32)",
          border: "none",
          cursor: "pointer",
        }}
        whileHover={{ scale: 1.06, boxShadow: "0 8px 26px rgba(91,164,230,0.45)" }}
        whileTap={{ scale: 0.96 }}
      >
        {expanded ? (
          <>
            Show Less
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </>
        ) : (
          <>
            View More Events
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAST EVENTS SECTION — default export
══════════════════════════════════════════════════════ */
export default function PastEventsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      id="past-events"
      className="relative w-full py-24 px-4 overflow-hidden"
      style={{ background: "#fafafa" }}
    >
      {/* Parallax pastel bands */}
      <motion.div className="absolute inset-0 flex pointer-events-none" style={{ y: bgY }}>
        {[BLUE, YELLOW, GREEN, "#FFD6E8"].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.09]" style={{ background: c }} />
        ))}
      </motion.div>

      {/* Grid texture */}
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
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.017 }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(100px, 20vw, 280px)",
            color: "#2d2d2d",
            whiteSpace: "nowrap",
          }}
        >
          EVENTS
        </span>
      </div>

      {/* Character PNG slots — desktop only, outside the card row */}
      {/* Left character — replace inner div with your <img> */}
      <div
        className="hidden xl:block absolute pointer-events-none select-none"
        style={{
          left: "calc(50% - 680px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: 110,
        }}
      >
        {/* ↓ Replace with: <img src="/characters/char-left.png" alt="" style={{width:'100%'}} /> */}
        <div
          className="rounded-2xl flex items-center justify-center text-center"
          style={{
            width: 110,
            height: 160,
            border: "1.5px dashed rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#ccc", fontSize: 9 }}>
            char PNG
          </span>
        </div>
      </div>

      {/* Right character — replace inner div with your <img> */}
      <div
        className="hidden xl:block absolute pointer-events-none select-none"
        style={{
          right: "calc(50% - 680px)",
          top: "38%",
          transform: "translateY(-50%)",
          width: 110,
        }}
      >
        {/* ↓ Replace with: <img src="/characters/char-right.png" alt="" style={{width:'100%'}} /> */}
        <div
          className="rounded-2xl flex items-center justify-center text-center"
          style={{
            width: 110,
            height: 160,
            border: "1.5px dashed rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#ccc", fontSize: 9 }}>
            char PNG
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Title ── */}
        <div ref={titleRef} className="text-center mb-14">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Where We've Been
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.08 }}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>Past </span>
            <span style={{ color: "#5BA4E6" }}>Events</span>
          </motion.h2>

          <motion.div
            className="mx-auto mt-4 rounded-full"
            style={{
              height: 3,
              background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)",
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={titleInView ? { width: 140, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="mt-5 text-sm max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#999" }}
            initial={{ opacity: 0, y: 12 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.45 }}
          >
            Hundreds of students, thousands of lines of code, and endless innovation.
          </motion.p>
        </div>

        {/* ── MOBILE: expandable vertical stack (hidden on sm+) ── */}
        <MobileEventList />

        {/* ── DESKTOP: three cards horizontal with stagger offsets (hidden on mobile) ── */}
        <div className="hidden sm:flex gap-4 items-start pb-10">
          {EVENTS.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} isMobile={false} />
          ))}
        </div>

        {/* ── Gallery CTA ── */}
        <motion.div
          className="mt-4 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.42em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}
          >
            See everything
          </p>
          <motion.a
            href="#gallery"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #5BA4E6, #E8916E)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(91,164,230,0.3)",
            }}
            whileHover={{ scale: 1.06, boxShadow: "0 8px 28px rgba(91,164,230,0.45)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Browse Full Gallery
          </motion.a>
        </motion.div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}