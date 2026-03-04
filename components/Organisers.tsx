"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

const ACCENTS = ["#5BA4E6", "#E8916E", "#4CAF50", "#D85C8A", "#C89A2A"];
const BGS     = [BLUE, YELLOW, GREEN, PINK, YELLOW];

interface Person {
  name: string;
  role: string;
  linkedin: string;
}

/* ════════════════════════════════════════════════════ */
// I Wrote the names as they were given to me 

const LEADS: Person[] = [
  { name: "Pranav", role: "Lead",               linkedin: "#" },
  { name: "Avni", role: "Lead",               linkedin: "#" },
  { name: "Kushagra", role: "Head of Operations", linkedin: "#" },
];

const ORG_ROW1: Person[] = [
  { name: "Ankit", role: "Tech Head",     linkedin: "#" },
  { name: "Aayushi", role: "Tech Head",     linkedin: "#" },
  { name: "Geetanshi", role: "Content Head",  linkedin: "#" },
  { name: "Bhavya", role: "Graphics Head", linkedin: "#" },
  { name: "Prafullit", role: "Outreach Head",  linkedin: "#" },
];

const ORG_ROW2: Person[] = [
  { name: "Ansh", role: "Outreach Head",   linkedin: "#" },
  { name: "Yojit", role: "Visuals Head", linkedin: "#" },
  { name: "Yash", role: "Socials Head", linkedin: "#" },
  { name: "Daksh", role: "Workflow Head",   linkedin: "#" },
  // { name: "Name Here", role: "Social Head",   linkedin: "#" },
];

const ROLE_INDEX: Record<string, number> = {
  "Lead":               0,
  "Head of Operations": 1,
  "Tech Head":          0,
  "Graphic Head":       3,
  "Content Head":       4,
  "Visual Head":        2,
  "Workflow Head":      1,
  "Outreach Head":      3,
  "Social Head":        0,
};

const LinkedInIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

function Avatar({ name, accent, size }: { name: string; accent: string; size: number }) {
  const initials = name === "Name Here"
    ? "?" : name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size,
        background: "white",
        border: `2.5px solid ${accent}60`,
        color: accent,
        fontFamily: "'Syne', sans-serif",
        fontSize: size * 0.32,
        /* double-ring halo effect */
        boxShadow: `0 0 0 3px ${accent}18, 0 0 0 6px ${accent}0c, 0 4px 14px ${accent}30`,
      }}
    >
      {initials}
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
function PersonCard({
  person, index, delay = 0, avatarSize = 60,
}: {
  person: Person; index: number; delay?: number; avatarSize?: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ai     = ROLE_INDEX[person.role] ?? 0;
  const accent = ACCENTS[ai % ACCENTS.length];
  const bg     = BGS[ai % BGS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 34, scale: 0.87 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.58, delay: delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, scale: 1.04 }}
      className="relative flex flex-col items-center gap-3 rounded-2xl overflow-hidden cursor-default"
      style={{
        background: bg,
        padding: "18px 10px 14px",
        /* layered border: sharp inner + soft outer glow */
        outline: `1.5px solid ${accent}50`,
        outlineOffset: "0px",
        boxShadow: `
          0 0 0 4px ${accent}12,
          0 1px 0 0 rgba(255,255,255,0.9) inset,
          0 10px 28px ${accent}20,
          0 2px 6px rgba(0,0,0,0.04)
        `,
      }}
    >
      {/* Diagonal gloss */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(140deg, rgba(255,255,255,0.6) 0%, transparent 52%)",
          borderRadius: "inherit",
        }}
      />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${accent}28 1px, transparent 1px)`,
          backgroundSize: "13px 13px",
          opacity: 0.5,
          borderRadius: "inherit",
        }}
      />

      {/* Animated top accent bar — full width, rounded top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}bb 35%, ${accent} 50%, ${accent}bb 65%, transparent)`,
          borderRadius: "16px 16px 0 0",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.65, delay: delay + index * 0.08 + 0.2 }}
      />

      {/* Corner pip */}
      <div
        className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-60"
        style={{ background: accent }}
      />

      {/* Avatar */}
      <Avatar name={person.name} accent={accent} size={avatarSize} />

      {/* Name */}
      <p
        className="relative z-10 text-xs font-bold text-center leading-tight px-1"
        style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}
      >
        {person.name}
      </p>

      {/* Role badge + LinkedIn icon — inline flex */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 flex-wrap px-1">
        <span
          className="text-[8px] font-semibold uppercase tracking-wider px-2 py-[3px] rounded-full whitespace-nowrap"
          style={{
            background: `${accent}1c`,
            border: `1px solid ${accent}55`,
            color: accent,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {person.role}
        </span>

        <motion.a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full"
          style={{
            width: 22, height: 22,
            background: `${accent}18`,
            border: `1px solid ${accent}50`,
            flexShrink: 0,
          }}
          whileHover={{ scale: 1.25, background: `${accent}30` }}
          whileTap={{ scale: 0.93 }}
          onClick={e => e.stopPropagation()}
        >
          <LinkedInIcon color={accent} />
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ── Separator ── */
function Separator({ label }: { label: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className="flex items-center gap-4 my-9">
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white"
        style={{ border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        initial={{ opacity: 0, scale: 0.82 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="4"  cy="4"  r="3" fill="#CFE8FF" stroke="#5BA4E6" strokeWidth="1"/>
          <circle cx="12" cy="4"  r="3" fill="#FFE9A8" stroke="#C89A2A" strokeWidth="1"/>
          <circle cx="4"  cy="12" r="3" fill="#D7F5D0" stroke="#4CAF50" strokeWidth="1"/>
          <circle cx="12" cy="12" r="3" fill="#FFD6E8" stroke="#D85C8A" strokeWidth="1"/>
        </svg>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.35em] whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}
        >
          {label}
        </span>
      </motion.div>
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FFD6E8, #D7F5D0, #FFE9A8, #CFE8FF, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function SubLabel({ label, color, delay = 0 }: { label: string; color: string; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-2 mb-5"
      initial={{ opacity: 0, x: -14 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span
        className="text-[10px] uppercase tracking-[0.38em] font-semibold"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#777" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════ */
export default function OrganisersSection() {
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section className="relative w-full py-20 px-4 overflow-hidden" style={{ background: "#fafafa" }}>

      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.07]" style={{ background: c }} />
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

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section title ── */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            The People Behind It
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 28 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>Meet the </span>
            <span style={{ color: "#5BA4E6" }}>Organisers</span>
          </motion.h2>

          <motion.div
            className="mx-auto mt-4 rounded-full"
            style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={titleInView ? { width: 140, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* ══ LEAD ORGANISERS — 3 centred ══ */}
         {/* ══ SEPARATOR ══ */}
        <Separator label="Lead Organisers" />

        <SubLabel label="Meet the team" color="#E8916E" />
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {LEADS.map((p, i) => (
            <PersonCard key={i} person={p} index={i} delay={0} avatarSize={66} />
          ))}
        </div>

        {/* ══ ORGANISERS — 5 + 5 ══ */}
        {/* <SubLabel label="Meet the team" color="#E8916E" delay={0.1} /> */}
        <div className="flex flex-col gap-3 md:mt-4">
          <div className="grid grid-cols-5 gap-3">
            {ORG_ROW1.map((p, i) => (
              <PersonCard key={i} person={p} index={i} delay={0.05} avatarSize={58} />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3">
            {ORG_ROW2.map((p, i) => (
              <PersonCard key={i} person={p} index={i} delay={0.15} avatarSize={58} />
            ))}
          </div>
        </div>

      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </section>
  );
}