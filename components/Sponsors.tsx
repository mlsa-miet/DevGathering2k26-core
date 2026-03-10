"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Brand palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ── Sponsors (1 revealed, 8 locked = 9 total) ── */
const SPONSORS_REVEALED = [
  {
    name: "Fetch.ai",
    accent: "#5BA4E6",
    bg: BLUE,
    logo: (
    <img
    src="/fetchai.png"
    alt="Fetch.ai"
    style={{
      width: "36px",
      height: "36px",
      objectFit: "contain"
    }}
  />
    ),
  },
  
];

const SPONSORS_LOCKED_COUNT = 8;

/* ── Community Partners (3 revealed, 6 locked = 9 total) ── */

const PARTNERS_REVEALED = [
 
  
];

const PARTNERS_LOCKED_COUNT = 9;

/* ══════════════════════════════════════════════════════ */

interface CardData {
  name: string;
  accent: string;
  bg: string;
  logo: React.ReactNode;
}

function SponsorCard({ card, index, globalDelay = 0 }: { card: CardData; index: number; globalDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: globalDelay + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.04 }}
      className="relative flex flex-col items-center justify-center gap-2 rounded-xl p-3 cursor-default overflow-hidden"
      style={{
        background: card.bg,
        border: `1.5px solid ${card.accent}28`,
        boxShadow: `0 4px 18px ${card.accent}1a`,
        minHeight: 96,
      }}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${card.accent}22 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
          opacity: 0.6,
        }}
      />
      <motion.div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${card.accent}88, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: globalDelay + index * 0.07 + 0.25 }}
      />
      <div
        className="relative z-10 flex items-center justify-center rounded-lg bg-white shadow-sm"
        style={{ width: 52, height: 52, padding: 8 }}
      >
        {card.logo}
      </div>
      <p
        className="relative z-10 text-xs font-bold tracking-tight text-center"
        style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}
      >
        {card.name}
      </p>
    </motion.div>
  );
}

function LockedCard({ bg, accent, index, globalDelay = 0 }: { bg: string; accent: string; index: number; globalDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: globalDelay + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl overflow-hidden cursor-default"
      style={{
        background: bg,
        border: `1.5px dashed ${accent}55`,
        minHeight: 96,
      }}
    >
      <div className="absolute inset-0 rounded-xl" style={{ background: "rgba(255,255,255,0.38)" }} />
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear", repeatDelay: 1.4 }}
      />
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, background: `${accent}18`, border: `1.5px solid ${accent}44` }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </motion.div>
      <p className="relative z-10 text-[9px] uppercase tracking-[0.3em]"
        style={{ fontFamily: "'DM Sans', sans-serif", color: accent }}>
        Soon
      </p>
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 80, height: 80, border: `1px solid ${accent}33`, top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />
    </motion.div>
  );
}

/* ── Single outlined CTA button ── */
function SectionCTA({
  label,
  href,
  accent,
  delay = 0,
}: {
  label: string;
  href: string;
  accent: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-center mt-6"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.a
        href={href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em]"
        style={{
          background: "rgba(255,255,255,0.7)",
          fontFamily: "'DM Sans', sans-serif",
          border: `1.5px solid ${accent}45`,
          color: accent,
          backdropFilter: "blur(8px)",
        }}
        whileHover={{ scale: 1.05, background: `${accent}10`, borderColor: `${accent}80` }}
        whileTap={{ scale: 0.97 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        {label}
      </motion.a>
    </motion.div>
  );
}

/* ── Thematic separator ── */
function Separator({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex items-center gap-3 my-10">
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full shrink-0"
        style={{
          background: "white",
          border: "1.5px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function SponsorsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  const sponsorBgs     = [BLUE, YELLOW, GREEN, PINK, BLUE, GREEN];
  const sponsorAccents = ["#5BA4E6","#C89A2A","#4CAF50","#D85C8A","#5BA4E6","#4CAF50"];
  const partnerBgs     = [PINK, GREEN, BLUE, YELLOW, PINK, BLUE];
  const partnerAccents = ["#D85C8A","#4CAF50","#5BA4E6","#C89A2A","#D85C8A","#5BA4E6"];

  return (
    <section id="sponsors" className="relative w-full py-24 px-4 overflow-hidden">
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.07]" style={{ background: c }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section title ── */}
        <div ref={titleRef} className="text-center mb-14">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Backed By The Best
          </motion.p>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 28 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>Our </span>
            <span style={{ color: "#5BA4E6" }}>Sponsors</span>
            <span style={{ color: "#2d2d2d" }}> &amp; </span>
            <span style={{ color: "#E8916E" }}>Partners</span>
          </motion.h2>
        </div>

        {/* ════════ SPONSORS ════════ */}
        <Separator label="Sponsors" />

        {/* 3 cols on mobile, 9 cols on md+ — always one clean row on desktop */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-9">
          {SPONSORS_REVEALED.map((s, i) => (
            <SponsorCard key={s.name} card={s} index={i} />
          ))}
          {Array.from({ length: SPONSORS_LOCKED_COUNT }).map((_, i) => (
            <LockedCard
              key={i}
              bg={sponsorBgs[i % sponsorBgs.length]}
              accent={sponsorAccents[i % sponsorAccents.length]}
              index={SPONSORS_REVEALED.length + i}
            />
          ))}
        </div>

        <SectionCTA
          label="Apply as Sponsor"
          href="mailto:mlsa.community@miet.ac.in?subject=Sponsorship%20Inquiry%20–%20DevGathering%202K26"
          accent="#5BA4E6"
          delay={0.1}
        />

        {/* ════════ COMMUNITY PARTNERS ════════ */}
        <Separator label="Community Partners" />

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-9">
          {PARTNERS_REVEALED.map((p, i) => (
            <SponsorCard key={p.name} card={p} index={i} globalDelay={0.1} />
          ))}
          {Array.from({ length: PARTNERS_LOCKED_COUNT }).map((_, i) => (
            <LockedCard
              key={i}
              bg={partnerBgs[i % partnerBgs.length]}
              accent={partnerAccents[i % partnerAccents.length]}
              index={PARTNERS_REVEALED.length + i}
              globalDelay={0.1}
            />
          ))}
        </div>

        <SectionCTA
          label="Become a Community Partner"
          href="mailto:mlsa.community@miet.ac.in?subject=Community%20Partner%20Inquiry%20–%20DevGathering%202K26"
          accent="#D85C8A"
          delay={0.1}
        />

        {/* ── Bottom Get in Touch ── */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.35em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}>
            Interested in sponsoring?
          </p>
          <motion.a
            href="mailto:mlsa.community@miet.ac.in"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #5BA4E6, #E8916E)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(91,164,230,0.3)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 6px 28px rgba(91,164,230,0.45)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Get in Touch
          </motion.a>
        </motion.div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </section>
  );
}