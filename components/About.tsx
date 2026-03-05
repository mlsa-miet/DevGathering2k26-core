"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

/* ══════════════════════════════════════════════════════
   STAT COUNTER CARD
══════════════════════════════════════════════════════ */
function StatCard({
  value,
  label,
  accent,
  bg,
  delay,
}: {
  value: string;
  label: string;
  accent: string;
  bg: string;
  delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="relative flex flex-col items-center justify-center gap-1 overflow-hidden cursor-default"
      style={{
        background: bg,
        borderRadius: 20,
        padding: "22px 16px",
        outline: `1.5px solid ${accent}45`,
        outlineOffset: 0,
        boxShadow: `
          0 0 0 4px ${accent}10,
          0 8px 24px ${accent}20,
          inset 0 1px 0 rgba(255,255,255,0.85)
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
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${accent}28 1px, transparent 1px)`,
          backgroundSize: "13px 13px",
          opacity: 0.5,
          borderRadius: "inherit",
        }}
      />
      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}bb 35%, ${accent} 50%, ${accent}bb 65%, transparent)`,
          borderRadius: "20px 20px 0 0",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.65, delay: delay + 0.2 }}
      />
      {/* Corner pip */}
      <div
        className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-50"
        style={{ background: accent }}
      />

      <p
        className="relative z-10 font-black leading-none"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(28px, 5vw, 40px)",
          color: accent,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </p>
      <p
        className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-semibold text-center mt-1"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#777" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURE BLOCK — large horizontal card
══════════════════════════════════════════════════════ */
function FeatureBlock({
  icon,
  title,
  subtitle,
  description,
  bullets,
  accent,
  bg,
  index,
  reverse = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  accent: string;
  bg: string;
  index: number;
  reverse?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10 items-center overflow-hidden rounded-3xl`}
      style={{
        background: bg,
        padding: "36px 32px",
        outline: `1.5px solid ${accent}35`,
        boxShadow: `
          0 0 0 5px ${accent}0e,
          0 12px 40px ${accent}1c,
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
      }}
    >
      {/* Gloss */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 50%)" }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          backgroundImage: `radial-gradient(${accent}22 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          opacity: 0.45,
        }}
      />
      {/* Accent left (or right if reversed) bar */}
      <motion.div
        className={`absolute top-0 bottom-0 ${reverse ? "right-0" : "left-0"} w-[3px] rounded-full`}
        style={{ background: `linear-gradient(180deg, transparent, ${accent}cc 30%, ${accent} 50%, ${accent}cc 70%, transparent)` }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Icon blob */}
      <motion.div
        className="relative z-10 flex items-center justify-center shrink-0 rounded-2xl"
        style={{
          width: 96,
          height: 96,
          background: "white",
          border: `2px solid ${accent}30`,
          boxShadow: `0 0 0 6px ${accent}14, 0 8px 24px ${accent}28`,
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08, rotate: 3 }}
      >
        {icon}
      </motion.div>

      {/* Text content */}
      <div className="relative z-10 flex flex-col gap-3 flex-1">
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.45em] font-semibold mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif", color: accent }}
          >
            {subtitle}
          </p>
          <h3
            className="text-2xl sm:text-3xl font-black tracking-tight leading-tight"
            style={{ fontFamily: "'Syne', sans-serif", color: "#1a1a1a" }}
          >
            {title}
          </h3>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}
        >
          {description}
        </p>

        {/* Bullet points */}
        <ul className="flex flex-col gap-2 mt-1">
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: reverse ? 14 : -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="mt-[3px] shrink-0 w-[6px] h-[6px] rounded-full"
                style={{ background: accent }}
              />
              <span
                className="text-xs leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#555" }}
              >
                {b}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ── Separator (same as rest of site) ── */
function Separator({ label }: { label: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className="flex items-center gap-4 my-10">
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

/* ── SVG Icons ── */
const CommunityIcon = ({ accent }: { accent: string }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ImpactIcon = ({ accent }: { accent: string }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const InnovationIcon = ({ accent }: { accent: string }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
);

/* ════════════════════════════════════════════════════
   ABOUT SECTION — default export
════════════════════════════════════════════════════ */
export default function AboutSection() {
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section
      id="about"
      className="relative w-full py-24 px-4 overflow-hidden"
      // style={{ background: "#fafafa" }}
    >
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.07]" style={{ background: c }} />
        ))}
      </div>

      {/* Grid texture */}
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
            fontSize: "clamp(120px, 22vw, 300px)",
            color: "#2d2d2d",
            whiteSpace: "nowrap",
          }}
        >
          ABOUT
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section title ── */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            className="text-[10px] uppercase tracking-[0.55em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Origin Story
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.08 }}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>What is </span>
            <span style={{ color: "#5BA4E6" }}>Dev</span>
            <span style={{ color: "#E8916E" }}>Gathering</span>
            <span style={{ color: "#2d2d2d" }}>?</span>
          </motion.h2>

          {/* Rainbow underline */}
          <motion.div
            className="mx-auto mt-4 rounded-full"
            style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={titleInView ? { width: 140, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Intro paragraph */}
          <motion.p
            className="mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            DevGathering is{" "}
            <span style={{ color: "#5BA4E6", fontWeight: 600 }}>MLSA MIET's flagship hackathon</span>
            {" "}— a 24-hour sprint where students from across India come together to
            brainstorm, build, and present ideas that actually matter. It's not just
            a competition; it's the start of something bigger.
          </motion.p>

          <motion.p
            className="mt-3 text-sm max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#999" }}
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            From its first edition to 2K26, DevGathering has grown into a movement —
            one that celebrates creativity, rewards hustle, and builds careers.
          </motion.p>
        </div>

        {/* ── Stats Row ── */}
        <Separator label="By the Numbers" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard value="500+"  label="Registrations Last Year" accent="#5BA4E6" bg={BLUE}   delay={0.0} />
          <StatCard value="120+"  label="Projects Submitted"       accent="#E8916E" bg={YELLOW} delay={0.1} />
          <StatCard value="30+"   label="Colleges Represented"     accent="#4CAF50" bg={GREEN}  delay={0.2} />
          <StatCard value="₹1L+"  label="Prize Pool"               accent="#D85C8A" bg={PINK}   delay={0.3} />
        </div>

        {/* ── Feature blocks ── */}
        <Separator label="Why DevGathering" />

        <div className="flex flex-col gap-5">

          {/* Block 1 — Community Focused */}
          <FeatureBlock
            index={0}
            reverse={false}
            accent="#5BA4E6"
            bg={BLUE}
            icon={<CommunityIcon accent="#5BA4E6" />}
            subtitle="Pillar 01"
            title="Community Focused"
            description="DevGathering is built on the belief that the best ideas emerge when diverse minds come together. We bring students from different colleges, disciplines, and backgrounds under one roof to connect, collaborate, and grow."
            bullets={[
              "Network with 500+ developers, designers, and visionaries",
              "Cross-college team-ups are not just allowed — they're encouraged",
              "Mentors from top companies guide you through every stage",
              "Build friendships and professional connections that last beyond the event",
            ]}
          />

          {/* Block 2 — Fast-Paced Innovation */}
          <FeatureBlock
            index={1}
            reverse={true}
            accent="#E8916E"
            bg={YELLOW}
            icon={<InnovationIcon accent="#E8916E" />}
            subtitle="Pillar 02"
            title="Fast-Paced Innovation"
            description="24 hours. One problem. Unlimited potential. DevGathering is where theory meets execution — you don't just ideate, you ship. Our structured format is designed to push your limits and sharpen your skills under real pressure."
            bullets={[
              "Full 24-hour non-stop hacking with dedicated rest zones",
              "Mid-submission checkpoint to keep projects on track",
              "Expert panel evaluates innovation, impact, and presentation",
              "No restrictions on languages, stacks, or AI tools — build freely",
            ]}
          />

          {/* Block 3 — Impact */}
          <FeatureBlock
            index={2}
            reverse={false}
            accent="#4CAF50"
            bg={GREEN}
            icon={<ImpactIcon accent="#4CAF50" />}
            subtitle="Pillar 03"
            title="Real Impact, Real Recognition"
            description="We don't just celebrate winners — we celebrate builders. Every project submitted is reviewed, every effort is valued, and the top teams walk away with more than just trophies. DevGathering is a launchpad."
            bullets={[
              "Win certificates, cash prizes, and exclusive goodies",
              "Top projects get featured and shared across MLSA India's network",
              "Portfolio-ready work you can show to any recruiter",
              "Winners from past editions have gone on to internships and startups",
            ]}
          />

        </div>

        {/* ── Closing quote ── */}
        <motion.div
          className="mt-14 relative flex flex-col items-center text-center gap-4 px-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Large quote mark */}
          <span
            className="select-none pointer-events-none leading-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 80,
              color: "#5BA4E6",
              opacity: 0.15,
              lineHeight: 0.8,
              marginBottom: -16,
            }}
          >
            "
          </span>
          <p
            className="text-xl sm:text-2xl font-bold max-w-2xl leading-snug"
            style={{ fontFamily: "'Syne', sans-serif", color: "#2d2d2d" }}
          >
            It's not about who codes the fastest.
            <br />
            <span style={{ color: "#5BA4E6" }}>It's about who builds the bravest.</span>
          </p>
          <p
            className="text-xs uppercase tracking-[0.4em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}
          >
            — DevGathering Ethos
          </p>

          {/* Rainbow rule */}
          <motion.div
            className="mt-2 rounded-full"
            style={{ height: 3, background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)", width: 80 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </motion.div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}