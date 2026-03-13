"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Brand palette ── */
const BLUE = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN = "#D7F5D0";
const PINK = "#FFD6E8";

/* ── Sponsors (1 revealed, 8 locked = 9 total) ── */
const SPONSORS_REVEALED = [
  {
    name: "ASI:One",
    accent: "#5BA4E6",
    bg: BLUE,
    logo: (
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2219 512"
        style={{ width: 160, height: "auto" , color:"black" }}
      >
        <path
          fill="currentColor"
          d="M724.5 126.7L633.2 380.2h34l26.9-75.7H813.3l27.8 75.7h35.1L782.2 126.7H724.5zM705 274l41.5-116.7h12.6L802.1 274H705zm363.3-25.9c-12.6-5.9-27.6-9.5-45-10.9l-28.1-2.4c-14.1-1.2-24.8-5.3-31.9-12.5s-10.8-15.4-10.8-24.7c0-8.1 2-15.7 6.1-22.7s10.2-12.8 18.4-17.2s18.6-6.6 31.1-6.6c13 0 23.5 2.3 31.6 6.9c8.1 4.6 14.1 10.5 17.9 17.7s5.7 14.8 5.7 22.9h34c0-16.2-3.8-30.2-11.3-41.8c-7.5-11.7-18-20.8-31.4-27.3s-28.9-9.7-46.5-9.7c-17.8 0-33.5 3.3-46.9 9.9s-23.9 15.7-31.4 27.3s-11.3 25.1-11.3 40.6c0 19.7 6.7 35.5 20.1 47.6s31.4 19 53.8 20.8l28.1 2.4c17.4 1.6 30.6 5.9 39.6 12.7s13.5 15.5 13.5 25.9c0 8.6-2.3 16.5-6.9 23.8s-11.8 13.2-21.5 17.7s-22.2 6.8-37.5 6.8c-16.4 0-29.5-2.5-39.1-7.6s-16.4-11.5-20.5-19.1c-4.1-7.6-6.1-15.3-6.1-22.9h-34c0 15.5 3.9 29.4 11.8 41.7c7.9 12.3 19.2 21.9 34 28.8s32.8 10.4 53.8 10.4c19.9 0 37.4-3.4 52.4-10.1s26.7-16.1 35.1-28.1s12.5-25.8 12.5-41.3c0-13.7-3.4-25.4-10.2-35.2s-16.6-17.7-29.2-23.6zm131.1-121.4h-34V380.2h34V126.7zm124.7 40h-40.3v42.4h40.3V166.7zm0 128.5h-40.3v42.4h40.3V295.2zm196.4 91.2c-21.9 0-41.4-3.8-57.8-11.2c-16.5-7.5-30.6-17.5-41.9-29.7c-11.3-12.3-20-26.2-25.7-41.4c-5.8-15.2-8.7-31-8.7-46.8v-8.9c0-15.8 3-31.7 8.9-47.1c5.9-15.3 14.7-29.3 26.2-41.6c11.4-12.2 25.6-22.1 42.1-29.5c16.5-7.3 35.6-11 56.8-11s40.4 3.7 56.8 11c16.5 7.3 30.6 17.2 42.1 29.5c11.5 12.3 20.3 26.3 26.2 41.6c5.9 15.4 8.9 31.2 8.9 47.1v8.9c0 15.9-2.9 31.6-8.7 46.8c-5.7 15.2-14.4 29.1-25.7 41.4c-11.3 12.2-25.4 22.2-41.9 29.7c-16.4 7.4-35.9 11.2-57.8 11.2zm0-239c-20.4 0-38.4 4.7-53.6 13.9c-15.3 9.2-27.1 22-35.3 37.9c-8.1 15.8-12.1 33.8-12.1 53.7c0 19.5 4 37.3 11.9 53.1c8 15.9 19.7 28.8 34.7 38.2s33.4 14.2 54.4 14.2c21 0 39.3-4.8 54.4-14.2s26.8-22.3 34.7-38.2c7.9-15.8 11.9-33.6 11.9-53.1c0-19.8-4.1-37.9-12.1-53.7c-8.2-15.9-19.9-28.7-35-37.9c-15.1-9.2-33.2-13.9-53.9-13.9zm371.7 232.5V224.5c0-22.5-6.6-40.9-19.5-54.7c-13-14-31-21.1-53.3-21.1c-22.9 0-41.8 7.3-56.1 21.6s-21.6 33.6-21.6 57.2V379.9h-33.5V127.2h33.9v55.5s5.9-16.6 19.7-32c14.6-16.3 38-31.5 70.2-31.5h2c31.6 0 54.9 13.4 69.8 32.7c15.1 19.6 22 44.7 22 82.6V379.9h-33.5zm210.6 6.6c-56.8 0-124.8-37.7-124.8-138c0-53.7 34-129.2 121.8-129.2c81.1 0 118.9 60.5 118.9 121.3v15H2011l.4 6.4c.9 16 3.9 30.6 9.1 43.4c6.5 15.9 16.7 28.7 30.4 38c13.7 9.3 31.2 14 52 14c21.8 0 39.9-5 53.7-14.8c12.3-8.7 20.4-18.9 24.3-30.3l.1-.4h31.8l-.2 .8c-3.8 13.6-9.9 25.6-18.4 35.8c-10.1 12.2-23 21.7-38.3 28.2c-15.5 6.5-33.4 9.8-53 9.8zm-2.9-238.2c-58.7 0-83.1 44.6-87.9 84.2h174.2c-1.7-40.6-27.5-84.2-86.3-84.2zM.2 168.8H168.9V337.5H.2V168.8zM422.1 337.5a84.4 84.4 0 1 0 0-168.8 84.4 84.4 0 1 0 0 168.8zm-84.4 0H168.9V506.3H337.7V337.5zM337.7 0H168.9V168.8H337.7V0z"
        />
      </svg>
    ),
  },
];

const SPONSORS_LOCKED_COUNT = 8;

/* ── Community Partners (0 revealed, 9 locked = 9 total) ── */
const PARTNERS_LOCKED_COUNT = 9;

/* ══════════════════════════════════════════════════════ */

interface CardData {
  name: string;
  accent: string;
  bg: string;
  logo: React.ReactNode;
}

function SponsorCard({
  card,
  index,
  globalDelay = 0,
}: {
  card: CardData;
  index: number;
  globalDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.55,
        delay: globalDelay + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
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
        style={{
          background: `linear-gradient(90deg, transparent, ${card.accent}88, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: globalDelay + index * 0.07 + 0.25 }}
      />
      <div
        className="relative z-10 flex items-center justify-center rounded-lg bg-white shadow-sm"
        style={{ width: 60, height: 60, padding: 8 }}
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

function LockedCard({
  bg,
  accent,
  index,
  globalDelay = 0,
}: {
  bg: string;
  accent: string;
  index: number;
  globalDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.55,
        delay: globalDelay + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl overflow-hidden cursor-default"
      style={{
        background: bg,
        border: `1.5px dashed ${accent}55`,
        minHeight: 96,
      }}
    >
      <div
        className="absolute inset-0 rounded-xl"
        style={{ background: "rgba(255,255,255,0.38)" }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.4,
        }}
      />
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 36,
          height: 36,
          background: `${accent}18`,
          border: `1.5px solid ${accent}44`,
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </motion.div>
      <p
        className="relative z-10 text-[9px] uppercase tracking-[0.3em]"
        style={{ fontFamily: "'DM Sans', sans-serif", color: accent }}
      >
        Soon
      </p>
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80,
          height: 80,
          border: `1px solid ${accent}33`,
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
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
        whileHover={{
          scale: 1.05,
          background: `${accent}10`,
          borderColor: `${accent}80`,
        }}
        whileTap={{ scale: 0.97 }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
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
        style={{
          background:
            "linear-gradient(90deg, transparent, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, transparent)",
        }}
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
          <circle
            cx="4"
            cy="4"
            r="3"
            fill="#CFE8FF"
            stroke="#5BA4E6"
            strokeWidth="1"
          />
          <circle
            cx="12"
            cy="4"
            r="3"
            fill="#FFE9A8"
            stroke="#C89A2A"
            strokeWidth="1"
          />
          <circle
            cx="4"
            cy="12"
            r="3"
            fill="#D7F5D0"
            stroke="#4CAF50"
            strokeWidth="1"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="#FFD6E8"
            stroke="#D85C8A"
            strokeWidth="1"
          />
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
        style={{
          background:
            "linear-gradient(90deg, transparent, #FFD6E8, #D7F5D0, #FFE9A8, #CFE8FF, transparent)",
        }}
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

  const sponsorBgs = [BLUE, YELLOW, GREEN, PINK, BLUE, GREEN];
  const sponsorAccents = [
    "#5BA4E6",
    "#C89A2A",
    "#4CAF50",
    "#D85C8A",
    "#5BA4E6",
    "#4CAF50",
  ];
  const partnerBgs = [PINK, GREEN, BLUE, YELLOW, PINK, BLUE];
  const partnerAccents = [
    "#D85C8A",
    "#4CAF50",
    "#5BA4E6",
    "#C89A2A",
    "#D85C8A",
    "#5BA4E6",
  ];

  return (
    <section
      id="sponsors"
      className="relative w-full py-24 px-4 overflow-hidden"
    >
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div
            key={i}
            className="flex-1 opacity-[0.07]"
            style={{ background: c }}
          />
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
          href="https://www.commudle.com/fill-form/4511"
          accent="#5BA4E6"
          delay={0.1}
        />

        {/* ════════ COMMUNITY PARTNERS ════════ */}
        <Separator label="Community Partners" />

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-9">
          {Array.from({ length: PARTNERS_LOCKED_COUNT }).map((_, i) => (
            <LockedCard
              key={i}
              bg={partnerBgs[i % partnerBgs.length]}
              accent={partnerAccents[i % partnerAccents.length]}
              index={i}
              globalDelay={0.1}
            />
          ))}
        </div>

        <SectionCTA
          label="Become a Community Partner"
          href="https://www.commudle.com/fill-form/4512"
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
          <p
            className="text-xs uppercase tracking-[0.35em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
          >
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
            whileHover={{
              scale: 1.05,
              boxShadow: "0 6px 28px rgba(91,164,230,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Get in Touch
          </motion.a>
        </motion.div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </section>
  );
}
