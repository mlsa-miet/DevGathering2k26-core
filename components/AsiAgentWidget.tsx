"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Brand palette (matching existing design) ── */
const BLUE = "#CFE8FF";
const BLUE_ACCENT = "#5BA4E6";
const PINK_ACCENT = "#D85C8A";
const GREEN_ACCENT = "#4CAF50";
const YELLOW_ACCENT = "#C89A2A";

const ease = [0.22, 1, 0.36, 1] as const;

const ASI_LINK =
  "https://asi1.ai/chat?skip_onboarding=true&action=login&isPlanner=true&search=%40devgathering2k26+how+can+you+help+me%3F&utm_source=devgathering2026&utm_medium=aff&utm_campaign=india2026";

export default function ASIAgentWidget() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasAutoPinged, setHasAutoPinged] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-show "How can I help you?" bubble after 2.5s on first load */
  useEffect(() => {
    if (!hasAutoPinged) {
      const t = setTimeout(() => {
        setShowTooltip(true);
        setHasAutoPinged(true);
        tooltipTimer.current = setTimeout(() => setShowTooltip(false), 7000);
      }, 4500);
      return () => clearTimeout(t);
    }
  }, [hasAutoPinged]);

  /* Close tooltip when chat opens */
  const handleOpen = () => {
    setShowTooltip(false);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setOpen(true);
  };

  return (
    <>
      {/* ── Fixed container ── */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Popup card ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 24, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.9 }}
              transition={{ duration: 0.45, ease }}
              style={{
                width: 288,
                borderRadius: 20,
                background: "white",
                border: "1.5px solid rgba(91,164,230,0.18)",
                boxShadow:
                  "0 20px 60px rgba(91,164,230,0.18), 0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Rainbow top bar */}
              <div style={{ display: "flex", height: 3 }}>
                {[BLUE_ACCENT, YELLOW_ACCENT, GREEN_ACCENT, PINK_ACCENT].map(
                  (c, i) => (
                    <motion.div
                      key={i}
                      style={{ flex: 1, background: c, opacity: 0.85 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease }}
                    />
                  )
                )}
              </div>

              {/* Dot bg */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `radial-gradient(${BLUE_ACCENT}18 1px, transparent 1px)`,
                  backgroundSize: "14px 14px",
                  pointerEvents: "none",
                  opacity: 0.6,
                }}
              />

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 16px 10px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${BLUE} 0%, #e0f0ff 100%)`,
                    border: `2px solid ${BLUE_ACCENT}40`,
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${BLUE_ACCENT}30`,
                  }}
                >
                  <img
                    src="/asiagent.jpeg"
                    alt="ASI Agent"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      if (img.parentElement) {
                        img.parentElement.innerHTML = `<span style="font-size:18px">🤖</span>`;
                      }
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      letterSpacing: "0.01em",
                    }}
                  >
                    ASI One Agent
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}
                  >
                    <motion.span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: GREEN_ACCENT,
                        display: "inline-block",
                      }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    <span
                      style={{ fontSize: 10, color: "#888", fontWeight: 500 }}
                    >
                      Online · devgathering2k26
                    </span>
                  </div>
                </div>

                {/* Close */}
                <motion.button
                  onClick={() => setOpen(false)}
                  whileHover={{ scale: 1.12, background: "#f5f5f5" }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: "1.5px solid #e8e8e8",
                    background: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 2l8 8M10 2l-8 8"
                      stroke="#aaa"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Message bubble */}
              <motion.div
                style={{
                  margin: "0 14px 14px",
                  padding: "10px 13px",
                  borderRadius: 14,
                  background: BLUE,
                  border: `1px solid ${BLUE_ACCENT}22`,
                  position: "relative",
                  zIndex: 1,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#2a2a2a",
                    fontWeight: 500,
                  }}
                >
                  👋 Hey there! I'm your{" "}
                  <strong style={{ color: BLUE_ACCENT }}>DevGathering 2K26</strong>{" "}
                  AI assistant. Ask me anything about the hackathon, teams, or
                  schedule!
                </p>
              </motion.div>

              {/* CTA button */}
              <motion.div
                style={{ padding: "0 14px 16px", position: "relative", zIndex: 1 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease }}
              >
                <motion.a
                  href={ASI_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: `0 10px 32px ${BLUE_ACCENT}55`,
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: 13,
                    background: `linear-gradient(130deg, ${BLUE_ACCENT} 0%, #E8916E 100%)`,
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: `0 6px 20px ${BLUE_ACCENT}44`,
                    position: "relative",
                    overflow: "hidden",
                    letterSpacing: "0.02em",
                  }}
                >
                  {/* shimmer */}
                  <motion.span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 1.8,
                      ease: "easeInOut",
                    }}
                  />
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span style={{ position: "relative", zIndex: 1 }}>
                    Chat with ASI One →
                  </span>
                </motion.a>

                <p
                  style={{
                    margin: "7px 0 0",
                    textAlign: "center",
                    fontSize: 9,
                    color: "#bbb",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Powered by ASI One · Opens in new tab
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── "How can I help you?" auto tooltip ── */}
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, x: 20, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 14, scale: 0.9 }}
              transition={{ duration: 0.38, ease }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 13px 9px 10px",
                borderRadius: 16,
                background: "white",
                border: "1.5px solid rgba(91,164,230,0.2)",
                boxShadow: "0 8px 30px rgba(91,164,230,0.18), 0 2px 10px rgba(0,0,0,0.07)",
                cursor: "pointer",
                maxWidth: 220,
              }}
              onClick={handleOpen}
            >
              {/* Tiny avatar */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${BLUE}, #e0f0ff)`,
                  border: `1.5px solid ${BLUE_ACCENT}40`,
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/asiagent.jpeg"
                  alt="ASI"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                  }}
                >
                  How can I help you? 👋
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 9,
                    color: BLUE_ACCENT,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  ASI One Agent · devgathering2k26
                </p>
              </div>

              {/* Arrow tail pointing right */}
              <div
                style={{
                  position: "absolute",
                  right: -7,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "7px solid white",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -9,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: `8px solid rgba(91,164,230,0.22)`,
                  zIndex: -1,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAB Circle Button ── */}
        <motion.button
          onClick={() => (open ? setOpen(false) : handleOpen())}
          whileHover={{ scale: 1.09 }}
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "none",
            padding: 0,
            cursor: "pointer",
            position: "relative",
            background: "transparent",
            flexShrink: 0,
          }}
        >
          {/* Pulse rings */}
          {!open && (
            <>
              <motion.span
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `2px solid ${BLUE_ACCENT}55`,
                  pointerEvents: "none",
                }}
                animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `2px solid ${BLUE_ACCENT}33`,
                  pointerEvents: "none",
                }}
                animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />
            </>
          )}

          {/* Circle face */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${BLUE_ACCENT} 0%, #E8916E 100%)`,
              boxShadow: `0 8px 28px ${BLUE_ACCENT}55, 0 2px 8px rgba(0,0,0,0.12)`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2.5px solid white",
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="agent"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ width: "100%", height: "100%", position: "relative" }}
                >
                  <img
                    src="/asiagent.jpeg"
                    alt="ASI Agent"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      if (img.parentElement) {
                        img.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:26px">🤖</div>`;
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inner rainbow rim */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                boxShadow: "inset 0 -2px 8px rgba(0,0,0,0.18)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Online dot */}
          {!open && (
            <motion.div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: GREEN_ACCENT,
                border: "2px solid white",
                boxShadow: `0 2px 6px ${GREEN_ACCENT}66`,
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </>
  );
}