"use client";

import { motion } from "framer-motion";

export default function BackgroundCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* ── Quadrant colour wash ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Base solid quadrants — give each corner strong color identity */}
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
          <div style={{ background: "#FFBCC4" }} />
          <div style={{ background: "#CCE9D3" }} />
          <div style={{ background: "#BFE4FF" }} />
          <div style={{ background: "#FFF1B6" }} />
        </div>

        {/* Blend layer — large radial feathers that melt the quadrant edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 55% 55% at 50% 0%,   #E8F5EC 0%, transparent 60%),
              radial-gradient(ellipse 55% 55% at 50% 100%, #EFF8FF 0%, transparent 60%),
              radial-gradient(ellipse 55% 55% at 0%  50%,  #FFD6DB 0%, transparent 60%),
              radial-gradient(ellipse 55% 55% at 100% 50%, #F5FDEF 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 50% 50%,  rgba(255,255,255,0.55) 0%, transparent 70%)
            `,
          }}
        />
      </motion.div>

      {/* ── Grid lines ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(120,120,135,0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,120,135,0.10) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Subtle vignette to ground the edges ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 55%, rgba(200,195,210,0.22) 100%)",
        }}
      />
    </div>
  );
}