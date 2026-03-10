"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

const ACCENT_CYCLE = ["#5BA4E6", "#E8916E", "#4CAF50", "#D85C8A", "#C89A2A"];
const BG_CYCLE     = [BLUE, YELLOW, GREEN, PINK, YELLOW, BLUE, GREEN, PINK];

/* ── FAQ Data ── */
const FAQS = [
  {
    q: "How do I register, and what if I make a mistake in my application?",
    a: "Submit an application to participate. If you submit incorrect details, re-register using a new ID. For cancellations, email your request to mlsa.community@miet.ac.in with the reason for withdrawal.",
  },
  {
    q: "Who can participate and what are the team requirements?",
    a: "Participation is open to students from any college or university in India. Teams must have 2 to 4 members, and you must form your team before registration. Cross-college teams are allowed, and a college can have multiple teams.",
  },
  {
    q: "What is the event format, and how will projects be evaluated?",
    a: "You must select your own idea within the event's themes. The hackathon follows a structured format: mid-submission in PPT/PDF format and final presentation to judges. Evaluation is based on innovation, technical feasibility, impact, and presentation.",
  },
  {
    q: "What are the rules regarding coding, tech, and AI usage?",
    a: "There are no restrictions on programming languages, technology stacks, or pre-built libraries. AI tools can be used, but they must be explicitly mentioned in your submission and presentation.",
  },
  {
    q: "Do I need to be physically present at the venue?",
    a: "Yes, all participants must be on-site at MIET, Meerut, on the event day. The hackathon is free to join, and a high-speed internet connection will be provided. You can also bring your own internet device.",
  },
  {
    q: "Can I change my team or send a replacement if I can't attend?",
    a: "Yes, replacements are allowed if the new participant meets the eligibility criteria and you inform the organizers via email mlsa.community@miet.ac.in before the event.",
  },
  {
    q: "Who owns the Intellectual Property (IP) of the projects?",
    a: "The developers retain ownership of their work unless a problem statement specifies otherwise. However, all submitted code must be open-source for evaluation.",
  },
  {
    q: "Where can I find event details and contact for support?",
    a: "Event details are available on the official website devgathering2k25.xyz, and updates will be shared via email. For any queries, contact mlsa.community@miet.ac.in. Rest areas will be available for participants, but personal belongings are your responsibility.",
  },
];

/* ── Plus / X animated icon ── */
function PlusIcon({ open, accent }: { open: boolean; accent: string }) {
  return (
    <motion.div
      className="relative flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 30, height: 30,
        background: open ? accent : `${accent}18`,
        border: `1.5px solid ${accent}55`,
        boxShadow: open ? `0 0 0 4px ${accent}20` : "none",
      }}
      animate={{ background: open ? accent : `${accent}18` }}
      transition={{ duration: 0.25 }}
    >
      {/* Horizontal bar */}
      <motion.span
        className="absolute rounded-full"
        style={{ width: 12, height: 2, background: open ? "white" : accent }}
        animate={{ rotate: open ? 45 : 0, y: open ? 0 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Vertical bar */}
      <motion.span
        className="absolute rounded-full"
        style={{ width: 2, height: 12, background: open ? "white" : accent }}
        animate={{ rotate: open ? 45 : 0, scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

/* ── Single FAQ card ── */
function FAQCard({
  faq, index, accentIndex,
}: {
  faq: { q: string; a: string };
  index: number;
  accentIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const accent = ACCENT_CYCLE[accentIndex % ACCENT_CYCLE.length];
  const bg     = BG_CYCLE[accentIndex % BG_CYCLE.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: 18,
        background: open ? bg : "white",
        /* Asymmetric border — thick left accent bar */
        borderLeft: `3.5px solid ${accent}`,
        borderTop: `1px solid ${accent}30`,
        borderRight: `1px solid ${accent}20`,
        borderBottom: `1px solid ${accent}20`,
        boxShadow: open
          ? `0 0 0 3px ${accent}18, 0 8px 28px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.8)`
          : `0 2px 10px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)`,
        transition: "background 0.3s, box-shadow 0.3s",
      }}
      onClick={() => setOpen(o => !o)}
    >
      {/* Diagonal gloss — only when open */}
      {open && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)",
            borderRadius: "inherit",
          }}
        />
      )}

      {/* Dot texture — only when open */}
      {open && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${accent}22 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
            opacity: 0.5,
            borderRadius: "inherit",
          }}
        />
      )}

      {/* Question row */}
      <div className="relative z-10 flex items-center gap-3 px-5 py-4">
        {/* Index number */}
        <span
          className="text-[10px] font-bold shrink-0 w-5 text-center"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: open ? accent : "#ccc",
            transition: "color 0.25s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <p
          className="flex-1 text-sm font-semibold leading-snug"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: open ? "#1a1a1a" : "#2d2d2d",
          }}
        >
          {faq.q}
        </p>

        <PlusIcon open={open} accent={accent} />
      </div>

      {/* Divider line — animated */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mx-5"
            style={{ height: 1, background: `linear-gradient(90deg, ${accent}60, ${accent}20, transparent)` }}
            initial={{ scaleX: 0, opacity: 0, transformOrigin: "left" }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Answer — animated expand */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.28, delay: 0.08 } }}
            className="overflow-hidden"
          >
            <p
              className="relative z-10 px-5 pt-3 pb-5 text-sm leading-relaxed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#555",
              }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════ */
export default function FAQSection() {
  const titleRef    = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const half = Math.ceil(FAQS.length / 2);
  const col1 = FAQS.slice(0, half);
  const col2 = FAQS.slice(half);

  return (
    <section id="faq" className="relative w-full py-24 px-4 overflow-hidden">

      {/* 4-band pastel wash */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
          <div key={i} className="flex-1 opacity-[0.06]" style={{ background: c }} />
        ))}
      </div>

      {/* Grid */}
      {/* <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      /> */}

      {/* Large decorative "?" watermark */}
      <div
        className="absolute right-8 top-16 select-none pointer-events-none"
        style={{
          fontSize: 320,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          color: "rgba(91,164,230,0.05)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        ?
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
            Got Questions?
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 28 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#2d2d2d" }}>Frequently </span>
            <span style={{ color: "#5BA4E6" }}>Asked</span>
            <br />
            <span style={{ color: "#E8916E" }}>Questions</span>
          </motion.h2>


          <motion.p
            className="mt-5 text-sm max-w-xs mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#999" }}
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Everything you need to know before you build.
          </motion.p>
        </div>

        {/* ── Two-column FAQ grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            {col1.map((faq, i) => (
              <FAQCard key={i} faq={faq} index={i} accentIndex={i} />
            ))}
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            {col2.map((faq, i) => (
              <FAQCard key={i} faq={faq} index={half + i} accentIndex={half + i} />
            ))}
          </div>
        </div>

        {/* ── Contact CTA ── */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.38em]"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}>
            Still have questions?
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
            Reach Out to Us
          </motion.a>
        </motion.div>

      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </section>
  );
}