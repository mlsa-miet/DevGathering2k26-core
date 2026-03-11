"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

/* ── Palette ── */
const BLUE   = "#CFE8FF";
const YELLOW = "#FFE9A8";
const GREEN  = "#D7F5D0";
const PINK   = "#FFD6E8";

const NAV_LINKS = [
  { label: "About",      href: "#about",       accent: "#5BA4E6", bg: BLUE   },
  { label: "Events",     href: "#past-events",  accent: "#E8916E", bg: YELLOW },
  { label: "Timeline",   href: "#timeline",     accent: "#4CAF50", bg: GREEN  },
  { label: "Themes",     href: "#themes",       accent: "#D85C8A", bg: PINK   },
  { label: "Prizes",     href: "#prizes",       accent: "#C89A2A", bg: YELLOW },
  { label: "Sponsors",   href: "#sponsors",     accent: "#5BA4E6", bg: BLUE   },
  { label: "FAQs",       href: "#faq",          accent: "#4CAF50", bg: GREEN  },
];

/* ── Active section detection ── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/* ══════════════════════════════════════════════════════
   DESKTOP NAV LINK
══════════════════════════════════════════════════════ */
function NavLink({
  link, isActive,
}: {
  link: (typeof NAV_LINKS)[0];
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={link.href}
      className="relative flex flex-col items-center gap-0.5 outline-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none" }}
    >
      {/* Pill bg on hover / active */}
      <AnimatePresence>
        {(hovered || isActive) && (
          <motion.div
            className="absolute inset-x-0 inset-y-[-4px] rounded-full"
            style={{ background: link.bg, border: `1px solid ${link.accent}35` }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <motion.span
        className="relative z-10 text-[11.5px] font-semibold whitespace-nowrap px-3 py-1"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: isActive ? link.accent : hovered ? link.accent : "#666",
          transition: "color 0.18s",
        }}
        animate={{ y: hovered ? -1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        {link.label}
      </motion.span>

      {/* Active underline dot */}
      <motion.div
        className="absolute -bottom-2 w-1 h-1 rounded-full"
        style={{ background: link.accent }}
        initial={{ scale: 0, opacity: 0 }}
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </a>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE MENU LINK
══════════════════════════════════════════════════════ */
function MobileLink({
  link, index, onClose,
}: {
  link: (typeof NAV_LINKS)[0];
  index: number;
  onClose: () => void;
}) {
  return (
    <motion.a
      href={link.href}
      onClick={onClose}
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
      style={{ textDecoration: "none", background: "transparent" }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ x: 4 }}
    >
      {/* Background pill */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{ background: link.bg }}
      />
      {/* Accent dot */}
      <div className="relative z-10 w-2 h-2 rounded-full shrink-0" style={{ background: link.accent }} />
      <span
        className="relative z-10 text-sm font-semibold"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#2d2d2d" }}
      >
        {link.label}
      </span>
      {/* Arrow */}
      <svg className="relative z-10 ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={link.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </motion.a>
  );
}

/* ══════════════════════════════════════════════════════
   HEADER — default export
══════════════════════════════════════════════════════ */
export default function Header() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  /* Detect scroll to add backdrop */
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
  const active     = useActiveSection(sectionIds);

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
          backdropFilter:        scrolled ? "blur(18px) saturate(160%)" : "none",
        }}
        animate={{
          background: scrolled
            ? "rgba(250,250,250,0.55)"
            : "rgba(250,250,250,0)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(255,255,255,0.6), 0 1px 0 rgba(0,0,0,0.05) inset, 0 6px 28px rgba(0,0,0,0.05)"
            : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Rainbow top border — appears on scroll */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2.5px]"
          style={{ background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8, #CFE8FF)" }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center justify-between gap-4">

          {/* ── LOGO ── */}
          <motion.a
            href="#"
            className="flex items-center gap-2.5 shrink-0"
            style={{ textDecoration: "none" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Real event logo */}
            {/* <img
              src="./devgatheringlogo.png"
              alt="DevGathering 2K26"
              style={{ height: 34, width: "auto", objectFit: "contain" }}
            /> */}

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span
                className="font-black tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#1a1a1a", letterSpacing: "-0.02em" }}
              >
                Dev<span style={{ color: "#5BA4E6" }}>Gathering</span>
              </span>
              <span
                className="text-[8px] uppercase tracking-[0.38em] font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#bbb" }}
              >
                2K26 · MLSA MIET
              </span>
            </div>
          </motion.a>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                link={link}
                isActive={active === link.href.replace("#", "")}
              />
            ))}
          </nav>

          {/* ── DESKTOP CTA + mobile toggle ── */}
          <div className="flex items-center gap-2.5">
            {/* Register CTA */}
            <motion.a
              href="https://unstop.com/hackathons/devgathering-2k26-devgathering-2k26-meerut-institute-of-engineering-and-technology-miet-1657272"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #5BA4E6, #3f8fd4)",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 3px 14px rgba(91,164,230,0.38)",
                textDecoration: "none",
              }}
              whileHover={{ scale: 1.06, boxShadow: "0 5px 20px rgba(91,164,230,0.5)" }}
              whileTap={{ scale: 0.96 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Register
            </motion.a>

            {/* Mobile hamburger */}
            <motion.button
              className="lg:hidden flex flex-col items-center justify-center rounded-xl"
              style={{
                width: 38, height: 38,
                background: mobileOpen ? PINK : BLUE,
                border: `1.5px solid ${mobileOpen ? "rgba(216,92,138,0.35)" : "rgba(91,164,230,0.35)"}`,
                cursor: "pointer",
                gap: 0,
                transition: "background 0.25s, border 0.25s",
              }}
              onClick={() => setMobileOpen((v) => !v)}
              whileTap={{ scale: 0.93 }}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col items-center justify-center gap-[5px]" style={{ width: 18, height: 14 }}>
                <motion.span
                  className="block rounded-full"
                  style={{ width: 18, height: 2, background: mobileOpen ? "#D85C8A" : "#5BA4E6", transformOrigin: "center" }}
                  animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="block rounded-full"
                  style={{ width: 12, height: 2, background: mobileOpen ? "#D85C8A" : "#5BA4E6" }}
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block rounded-full"
                  style={{ width: 18, height: 2, background: mobileOpen ? "#D85C8A" : "#5BA4E6", transformOrigin: "center" }}
                  animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════════════
          MOBILE MENU DRAWER
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[98]"
              style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(3px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-[60px] left-0 right-0 z-[99] mx-3"
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  background: "rgba(250,250,250,0.96)",
                  backdropFilter: "blur(20px)",
                  border: "1.5px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
                }}
              >
                {/* Rainbow top bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: "linear-gradient(90deg, #CFE8FF, #FFE9A8, #D7F5D0, #FFD6E8)" }} />

                {/* Dot grid texture */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }} />

                <div className="relative z-10 p-3 pt-4">
                  {/* Section label */}
                  <p className="text-[8px] uppercase tracking-[0.5em] font-semibold px-4 mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}>
                    Navigation
                  </p>

                  {/* Links */}
                  <div className="flex flex-col gap-0.5">
                    {NAV_LINKS.map((link, i) => (
                      <MobileLink
                        key={link.href}
                        link={link}
                        index={i}
                        onClose={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mx-4 my-3 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent)" }} />

                  {/* Mobile CTA */}
                  <div className="px-3 pb-1">
                    <motion.a
                      href="https://unstop.com/hackathons/devgathering-2k26-devgathering-2k26-meerut-institute-of-engineering-and-technology-miet-1657272"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #5BA4E6, #3f8fd4)",
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: "0 4px 16px rgba(91,164,230,0.38)",
                        textDecoration: "none",
                      }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: NAV_LINKS.length * 0.05 + 0.05 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      Register for DevGathering 2K26
                    </motion.a>
                  </div>

                  {/* Footer strip */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <div className="flex gap-1">
                      {[BLUE, YELLOW, GREEN, PINK].map((c, i) => (
                        <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
                      ))}
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.3em]"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "#ccc" }}>
                      MLSA MIET · 2K26
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </>
  );
}