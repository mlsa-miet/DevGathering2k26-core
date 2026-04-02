"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Brand palette ── */
const BLUE = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN = "#D7F5D0";
const PINK = "#FFD6E8";
const BLUE_ACCENT = "#5BA4E6";
const PINK_ACCENT = "#D85C8A";
const GREEN_ACCENT = "#4CAF50";
const YELLOW_ACCENT = "#C89A2A";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Reused Separator ── */
function Separator({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="flex items-center gap-3 my-10">
      <motion.div className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease }} />
      <motion.div className="flex items-center gap-2 px-4 py-1.5 rounded-full shrink-0"
        style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="4" r="3" fill="#CFE8FF" stroke="#5BA4E6" strokeWidth="1" />
          <circle cx="12" cy="4" r="3" fill="#FFE9A8" stroke="#C89A2A" strokeWidth="1" />
          <circle cx="4" cy="12" r="3" fill="#D7F5D0" stroke="#4CAF50" strokeWidth="1" />
          <circle cx="12" cy="12" r="3" fill="#FFD6E8" stroke="#D85C8A" strokeWidth="1" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}>{label}</span>
      </motion.div>
      <motion.div className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FFD6E8, #D7F5D0, #FFE9A8, #CFE8FF, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease }} />
    </div>
  );
}

/* ── Compact info chip ── */
function InfoChip({ icon, text, bg, accent, delay }: {
  icon: React.ReactNode; text: string; bg: string; accent: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <motion.div ref={ref}
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl overflow-hidden"
      style={{ background: bg, border: `1.5px solid ${accent}28`, boxShadow: `0 2px 8px ${accent}14` }}
      initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease }}
      whileHover={{ y: -2, scale: 1.03 }}>
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: `radial-gradient(${accent}22 1px, transparent 1px)`, backgroundSize: "9px 9px" }} />
      <motion.div className="absolute top-0 left-2 right-2 h-[1.5px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.12 }} />
      <div className="relative z-10 flex-shrink-0">{icon}</div>
      <span className="relative z-10 text-[11px] font-bold whitespace-nowrap"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>{text}</span>
    </motion.div>
  );
}

export default function PreMeetupSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="pre-meetup" className="relative w-full py-16 px-4 overflow-hidden">
      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.07]" style={{ background: c }} />
        ))}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 600, height: 200, background: `radial-gradient(ellipse at center top, ${BLUE_ACCENT}16 0%, transparent 70%)` }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <Separator label="Pre Meetup" />

        {/* ═══ MAIN CARD ═══ */}
        <motion.div ref={ref}
          className="relative rounded-3xl overflow-hidden"
          style={{
            border: "1.5px solid rgba(91,164,230,0.18)",
            boxShadow: "0 12px 50px rgba(91,164,230,0.12), 0 2px 12px rgba(0,0,0,0.05)",
            background: "white",
          }}
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}>

          {/* Rainbow top bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] flex z-20">
            {[BLUE_ACCENT, YELLOW_ACCENT, GREEN_ACCENT, PINK_ACCENT].map((c, i) => (
              <motion.div key={i} className="flex-1" style={{ background: c, opacity: 0.75 }}
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.07, ease }} />
            ))}
          </div>

          {/* faint dot bg */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.15]"
            style={{ backgroundImage: `radial-gradient(${BLUE_ACCENT}20 1px, transparent 1px)`, backgroundSize: "18px 18px" }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">

            {/* ── LEFT PANEL ── */}
            <div className="flex flex-col p-6 md:p-8 gap-5 md:border-r border-[rgba(91,164,230,0.1)]">

              {/* Label */}
              <motion.p className="text-[9px] uppercase tracking-[0.55em]"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa" }}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.18 }}>
                Before the Hackathon
              </motion.p>

              {/* Title */}
              <motion.h2 className="font-bold tracking-tight leading-none"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)", color: "#1a1a1a" }}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.22, ease }}>
                Pre&#8209;<span style={{ color: BLUE_ACCENT }}>Hackathon</span>{" "}
                <span style={{ color: "#E8916E" }}>Meetup</span>
              </motion.h2>

              {/* Description */}
              <motion.p className="text-xs leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", maxWidth: 310 }}
                initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.3, ease }}>
                Meet your future teammates, hear from builders, and kick off the hacking journey — before it officially begins.
              </motion.p>

              {/* ★ REGISTER NOW — right here, prominent ★ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.38, ease }}>
                <motion.a
                  href="https://www.commudle.com/fill-form/4511"
                  target="_blank" rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold text-white overflow-hidden"
                  style={{
                    background: "linear-gradient(130deg, #5BA4E6 0%, #E8916E 100%)",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 6px 24px rgba(91,164,230,0.38)",
                    textDecoration: "none",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 32px rgba(91,164,230,0.5)" }}
                  whileTap={{ scale: 0.97 }}>
                  {/* shimmer */}
                  <motion.span className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.32) 50%, transparent 70%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }} />
                  {/* pulse ring */}
                  <motion.span className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ border: "2px solid rgba(91,164,230,0.55)" }}
                    animate={{ scale: [1, 1.12], opacity: [0.7, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: "easeOut" }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span className="relative z-10">Register Now</span>
                  <motion.span className="relative z-10 text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide"
                    style={{ background: "rgba(255,255,255,0.22)" }}
                    animate={{ opacity: [1, 0.55, 1] }} transition={{ duration: 2.1, repeat: Infinity }}>
                    FREE
                  </motion.span>
                </motion.a>
              </motion.div>

              {/* 2×2 Info chips */}
              <div className="grid grid-cols-2 gap-2">
                <InfoChip delay={0.44} bg={BLUE} accent={BLUE_ACCENT} text="10 April 2026"
                  icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE_ACCENT} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
                <InfoChip delay={0.49} bg={GREEN} accent={GREEN_ACCENT} text="10 AM – 4 PM"
                  icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GREEN_ACCENT} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} />
                <InfoChip delay={0.54} bg={PINK} accent={PINK_ACCENT} text="IPEC, Ghaziabad"
                  icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK_ACCENT} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>} />
                <InfoChip delay={0.59} bg={YELLOW} accent={YELLOW_ACCENT} text="200+ Hackers"
                  icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={YELLOW_ACCENT} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>} />
              </div>

              {/* Highlight pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { e: "🧠", l: "Ideation", bg: BLUE, a: BLUE_ACCENT },
                  { e: "🤝", l: "Team Up", bg: PINK, a: PINK_ACCENT },
                  { e: "🎤", l: "Speakers", bg: GREEN, a: GREEN_ACCENT },
                  { e: "🍕", l: "Free Lunch", bg: YELLOW, a: YELLOW_ACCENT },
                ].map(({ e, l, bg, a }, i) => (
                  <motion.span key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: bg, border: `1px solid ${a}28`, fontFamily: "'DM Sans', sans-serif", color: "#333" }}
                    initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.65 + i * 0.05, ease }}
                    whileHover={{ scale: 1.07 }}>
                    {e} {l}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* ── RIGHT PANEL: Venue image ── */}
            <motion.div className="relative overflow-hidden md:rounded-r-3xl"
              style={{ minHeight: 320 }}
              initial={{ opacity: 0, x: 18 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.22, ease }}>

              {/* User's actual image */}
              <img src="/ipec.webp" alt="IPEC Ghaziabad"
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />

              {/* Illustrated fallback */}
              {/* <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 -z-0"
                style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${GREEN} 55%, ${YELLOW} 100%)` }}>
                <svg width="100" height="72" viewBox="0 0 120 80" fill="none">
                  <rect x="10" y="30" width="100" height="50" rx="4" fill="white" fillOpacity="0.5" />
                  <rect x="25" y="15" width="70" height="65" rx="4" fill="white" fillOpacity="0.75" />
                  <rect x="45" y="5" width="30" height="75" rx="4" fill="white" fillOpacity="0.9" />
                  <rect x="52" y="50" width="16" height="30" fill={BLUE_ACCENT} fillOpacity="0.55" />
                  <rect x="30" y="35" width="10" height="12" rx="1" fill={BLUE_ACCENT} fillOpacity="0.3" />
                  <rect x="80" y="35" width="10" height="12" rx="1" fill={BLUE_ACCENT} fillOpacity="0.3" />
                  <rect x="55" y="25" width="10" height="12" rx="1" fill={BLUE_ACCENT} fillOpacity="0.4" />
                </svg>
                <p className="text-[11px] font-bold uppercase tracking-widest text-center"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#4a4a4a" }}>IPEC, Ghaziabad</p>
                <p className="text-[9px] text-center opacity-45"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#333" }}>Add image → /venue/ipec.jpg</p>
              </div> */}

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: 110, background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%)" }} />

              {/* Floating overlays */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/55 mb-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Venue</p>
                  <p className="text-sm font-bold text-white leading-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}>Inderprastha<br />Engineering College</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-white"
                    style={{ background: `${BLUE_ACCENT}aa`, backdropFilter: "blur(8px)", fontFamily: "'DM Sans', sans-serif" }}>
                    📅 Apr 10, 2026
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold text-white"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}>
                    <motion.span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }} />
                    Open
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </section>
  );
}