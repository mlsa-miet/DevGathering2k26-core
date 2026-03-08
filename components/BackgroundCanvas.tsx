"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const CUBES = [
  { color: "#F4808E", size: 58, x: "2%",  y: "8%",  rotate: 18,  duration: 14, delay: 0.0, depth: 1.8 },
  { color: "#E8C83A", size: 40, x: "6%",  y: "38%", rotate: -14, duration: 19, delay: 1.4, depth: 1.2 },
  { color: "#5AB4E8", size: 26, x: "1%",  y: "62%", rotate: 30,  duration: 15, delay: 0.6, depth: 0.7 },
  { color: "#6BBF85", size: 48, x: "8%",  y: "78%", rotate: -22, duration: 21, delay: 2.2, depth: 1.5 },
  { color: "#6BBF85", size: 54, x: "84%", y: "6%",  rotate: -20, duration: 17, delay: 0.3, depth: 1.6 },
  { color: "#5AB4E8", size: 66, x: "88%", y: "40%", rotate: 14,  duration: 20, delay: 0.9, depth: 2.0 },
  { color: "#F4808E", size: 32, x: "80%", y: "68%", rotate: -35, duration: 13, delay: 1.8, depth: 0.9 },
  { color: "#E8C83A", size: 44, x: "87%", y: "82%", rotate: 25,  duration: 18, delay: 2.8, depth: 1.3 },
];

function GlassyCube({ color, size, uid }: { color: string; size: number; uid: string }) {
  const s   = size;
  const cx  = s;
  const h   = s * 0.5;
  const fh  = s * 0.62;

  const n  = parseInt(color.slice(1), 16);
  const cr = (n >> 16) & 0xff;
  const cg = (n >>  8) & 0xff;
  const cb =  n        & 0xff;

  const rgba  = (a: number) => `rgba(${cr},${cg},${cb},${a})`;
  const light = (f: number, a: number) => {
    const r = Math.min(255, Math.round(cr + (255 - cr) * f));
    const g = Math.min(255, Math.round(cg + (255 - cg) * f));
    const b = Math.min(255, Math.round(cb + (255 - cb) * f));
    return `rgba(${r},${g},${b},${a})`;
  };
  const dark = (f: number, a: number) =>
    `rgba(${Math.round(cr * f)},${Math.round(cg * f)},${Math.round(cb * f)},${a})`;

  // Outer face vertices
  const T  = { x: cx,   y: 0       };
  const R  = { x: cx*2, y: h       };
  const M  = { x: cx,   y: h*2     };
  const L  = { x: 0,    y: h       };
  const BR = { x: cx*2, y: h+fh    };
  const BM = { x: cx,   y: h*2+fh  };
  const BL = { x: 0,    y: h+fh    };

  // Bevel inset
  const bi  = s * 0.16;
  const IT  = { x: cx,        y: bi            };
  const IR  = { x: cx*2-bi,   y: h             };
  const IM  = { x: cx,        y: h*2-bi        };
  const IL  = { x: bi,        y: h             };
  const IBR = { x: cx*2-bi,   y: h+fh-bi       };
  const IBM = { x: cx,        y: h*2+fh-bi*1.4 };
  const IBL = { x: bi,        y: h+fh-bi       };

  const pts = (arr: { x: number; y: number }[]) =>
    arr.map(p => `${p.x},${p.y}`).join(" ");

  const W = cx * 2;
  const H = h * 2 + fh + 12;

  // Rim highlight path along top-left edge of cube
  const rimPath = `M ${T.x} ${T.y} L ${L.x} ${L.y} L ${BL.x} ${BL.y}`;

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        {/* ── FILTERS ── */}

        {/* Rich multi-layer drop shadow */}
        <filter id={`shadow-${uid}`} x="-50%" y="-30%" width="200%" height="220%">
          {/* Ambient spread shadow */}
          <feGaussianBlur in="SourceAlpha" stdDeviation={s * 0.35} result="blur1" />
          <feOffset dx="0" dy={s * 0.22} in="blur1" result="offset1" />
          <feColorMatrix in="offset1" type="matrix"
            values={`0 0 0 0 ${cr/255*0.15}  0 0 0 0 ${cg/255*0.15}  0 0 0 0 ${cb/255*0.15}  0 0 0 0.45 0`}
            result="color1" />

          {/* Sharp contact shadow */}
          <feGaussianBlur in="SourceAlpha" stdDeviation={s * 0.10} result="blur2" />
          <feOffset dx="0" dy={s * 0.10} in="blur2" result="offset2" />
          <feColorMatrix in="offset2" type="matrix"
            values={`0 0 0 0 ${cr/255*0.2}  0 0 0 0 ${cg/255*0.2}  0 0 0 0 ${cb/255*0.2}  0 0 0 0.30 0`}
            result="color2" />

          <feMerge>
            <feMergeNode in="color1" />
            <feMergeNode in="color2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft inner glow filter for faces */}
        <filter id={`inner-glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={s * 0.06} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Frosted glass noise */}
        <filter id={`frost-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"
            seed="2" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="screen" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>

        {/* ── GRADIENTS ── */}

        {/* Top face — glassy refraction, bright center */}
        <linearGradient id={`top-${uid}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor={light(0.80, 0.72)} />
          <stop offset="28%"  stopColor={light(0.55, 0.58)} />
          <stop offset="60%"  stopColor={rgba(0.42)} />
          <stop offset="100%" stopColor={dark(0.65, 0.68)} />
        </linearGradient>

        {/* Inner top face — deep refractive core */}
        <radialGradient id={`inner-top-${uid}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%"   stopColor={light(0.30, 0.60)} />
          <stop offset="45%"  stopColor={rgba(0.38)} />
          <stop offset="100%" stopColor={dark(0.55, 0.72)} />
        </radialGradient>

        {/* Right face — darker cool tint */}
        <linearGradient id={`right-${uid}`} x1="5%" y1="0%" x2="95%" y2="100%">
          <stop offset="0%"   stopColor={dark(0.72, 0.65)} />
          <stop offset="35%"  stopColor={dark(0.55, 0.55)} />
          <stop offset="80%"  stopColor={dark(0.38, 0.48)} />
          <stop offset="100%" stopColor={dark(0.25, 0.38)} />
        </linearGradient>

        {/* Inner right face */}
        <linearGradient id={`inner-right-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={dark(0.60, 0.62)} />
          <stop offset="100%" stopColor={dark(0.22, 0.42)} />
        </linearGradient>

        {/* Left face — slightly warmer dark */}
        <linearGradient id={`left-${uid}`} x1="95%" y1="0%" x2="5%" y2="100%">
          <stop offset="0%"   stopColor={dark(0.85, 0.60)} />
          <stop offset="40%"  stopColor={dark(0.62, 0.55)} />
          <stop offset="80%"  stopColor={dark(0.42, 0.45)} />
          <stop offset="100%" stopColor={dark(0.28, 0.35)} />
        </linearGradient>

        {/* Inner left face */}
        <linearGradient id={`inner-left-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={dark(0.72, 0.58)} />
          <stop offset="100%" stopColor={dark(0.32, 0.42)} />
        </linearGradient>

        {/* Bevel top-left strip — bright lit face */}
        <linearGradient id={`bevel-tl-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={light(0.90, 0.80)} />
          <stop offset="100%" stopColor={light(0.50, 0.50)} />
        </linearGradient>

        {/* Bevel top-right strip */}
        <linearGradient id={`bevel-tr-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={light(0.70, 0.68)} />
          <stop offset="100%" stopColor={light(0.30, 0.42)} />
        </linearGradient>

        {/* Caustic light scatter on top face */}
        <radialGradient id={`caustic-${uid}`} cx="30%" cy="25%" r="60%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.38)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </radialGradient>

        {/* Secondary caustic bottom-right */}
        <radialGradient id={`caustic2-${uid}`} cx="75%" cy="72%" r="40%">
          <stop offset="0%"   stopColor={light(0.40, 0.18)} />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </radialGradient>

        {/* Primary specular streak */}
        <linearGradient id={`spec-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.98)" />
          <stop offset="45%"  stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        {/* Rim light gradient along left edge */}
        <linearGradient id={`rim-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.72)" />
          <stop offset="40%"  stopColor="rgba(255,255,255,0.30)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        {/* Fresnel glow — bright edge fringe on top face */}
        <linearGradient id={`fresnel-top-${uid}`} x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.00)" />
          <stop offset="80%"  stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>

        {/* Environment reflection on right face */}
        <linearGradient id={`env-right-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
          <stop offset="30%"  stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        {/* Transmission glow inside */}
        <radialGradient id={`transmission-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={light(0.60, 0.22)} />
          <stop offset="100%" stopColor={rgba(0.00)} />
        </radialGradient>

        {/* Glint clip */}
        <clipPath id={`clip-top-${uid}`}>
          <polygon points={pts([T, R, M, L])} />
        </clipPath>
        <clipPath id={`clip-right-${uid}`}>
          <polygon points={pts([R, BR, BM, M])} />
        </clipPath>
        <clipPath id={`clip-left-${uid}`}>
          <polygon points={pts([L, M, BM, BL])} />
        </clipPath>
      </defs>

      <g filter={`url(#shadow-${uid})`}>

        {/* ── BASE FACES ── */}
        <polygon points={pts([T, R, M, L])}      fill={`url(#top-${uid})`} />
        <polygon points={pts([R, BR, BM, M])}    fill={`url(#right-${uid})`} />
        <polygon points={pts([L, M, BM, BL])}    fill={`url(#left-${uid})`} />

        {/* ── BEVEL STRIPS ── */}
        {/* Top face bevels */}
        <polygon points={pts([T, IT, IL, L])}    fill={`url(#bevel-tl-${uid})`} />
        <polygon points={pts([T, R, IR, IT])}    fill={`url(#bevel-tr-${uid})`} />
        <polygon points={pts([IR, R, M, IM])}    fill={light(0.20, 0.42)} />
        <polygon points={pts([IL, IM, M, L])}    fill={light(0.32, 0.40)} />

        {/* Right face bevels */}
        <polygon points={pts([IR, IBR, BM, IM])} fill={dark(0.60, 0.58)} />
        <polygon points={pts([R, BR, IBR, IR])}  fill={dark(0.42, 0.50)} />
        <polygon points={pts([IBR, BR, BM, IBM])}fill={dark(0.28, 0.42)} />

        {/* Left face bevels */}
        <polygon points={pts([IL, IM, IBM, IBL])} fill={dark(0.78, 0.55)} />
        <polygon points={pts([L, IL, IBL, BL])}   fill={dark(0.62, 0.50)} />
        <polygon points={pts([IBL, IBM, BM, BL])} fill={dark(0.44, 0.40)} />

        {/* ── INNER CORE FACES ── */}
        <polygon points={pts([IT, IR, IM, IL])}   fill={`url(#inner-top-${uid})`} />
        <polygon points={pts([IR, IBR, IBM, IM])} fill={`url(#inner-right-${uid})`} />
        <polygon points={pts([IL, IM, IBM, IBL])} fill={`url(#inner-left-${uid})`} />

        {/* ── TRANSMISSION GLOW (light passing through glass) ── */}
        <polygon points={pts([IT, IR, IM, IL])}   fill={`url(#transmission-${uid})`} opacity="0.6" />

        {/* ── CAUSTICS ── */}
        <polygon points={pts([IT, IR, IM, IL])}   fill={`url(#caustic-${uid})`} />
        <polygon points={pts([IT, IR, IM, IL])}   fill={`url(#caustic2-${uid})`} />

        {/* ── ENVIRONMENT REFLECTION on right face ── */}
        <polygon points={pts([R, BR, BM, M])}     fill={`url(#env-right-${uid})`} />

        {/* ── FRESNEL EDGE GLOW on top face ── */}
        <polygon points={pts([T, R, M, L])}       fill={`url(#fresnel-top-${uid})`} />

        {/* ── FROSTED GLASS TEXTURE on inner top ── */}
        <polygon points={pts([IT, IR, IM, IL])}
          fill="rgba(255,255,255,0.06)"
          filter={`url(#frost-${uid})`} />

        {/* ── GLASS REFRACTION SHIMMER LINES ── */}
        {/* Thin diagonal glint across top */}
        <line
          x1={T.x + s * 0.08} y1={T.y + s * 0.04}
          x2={M.x - s * 0.08} y2={M.y - s * 0.04}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={s * 0.025}
          strokeLinecap="round"
          clipPath={`url(#clip-top-${uid})`}
        />

        {/* ── SPECULAR HIGHLIGHTS ── */}

        {/* Main sharp streak — top-left edge */}
        <line
          x1={T.x}     y1={T.y + 1.5}
          x2={L.x + 3} y2={L.y + 0.5}
          stroke={`url(#spec-${uid})`}
          strokeWidth={s * 0.07}
          strokeLinecap="round"
        />

        {/* Secondary inner streak IL→IT */}
        <line
          x1={IL.x + 1} y1={IL.y}
          x2={IT.x}     y2={IT.y + 1}
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={s * 0.038}
          strokeLinecap="round"
        />

        {/* Tertiary faint streak bottom of top face */}
        <line
          x1={IM.x - s * 0.05} y1={IM.y}
          x2={IR.x - s * 0.04} y2={IR.y + s * 0.08}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={s * 0.022}
          strokeLinecap="round"
          clipPath={`url(#clip-top-${uid})`}
        />

        {/* ── RIM LIGHT along left + top-left edge ── */}
        <path
          d={rimPath}
          fill="none"
          stroke={`url(#rim-${uid})`}
          strokeWidth={s * 0.045}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-right edge thin bright rim */}
        <line
          x1={T.x} y1={T.y}
          x2={R.x} y2={R.y}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={s * 0.022}
          strokeLinecap="round"
        />

        {/* ── APEX HOTSPOT ── */}
        {/* Outer glow */}
        <circle
          cx={T.x} cy={T.y + 1.5}
          r={s * 0.12}
          fill="rgba(255,255,255,0.18)"
        />
        {/* Sharp bright dot */}
        <circle
          cx={T.x} cy={T.y + 1.5}
          r={s * 0.055}
          fill="rgba(255,255,255,0.95)"
        />

        {/* ── OUTLINE (gossamer glass edges) ── */}
        <polygon points={pts([T, R, M, L])}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.9"
        />
        <polygon points={pts([R, BR, BM, M])}
          fill="none"
          stroke={rgba(0.12)}
          strokeWidth="0.6"
        />
        <polygon points={pts([L, M, BM, BL])}
          fill="none"
          stroke={rgba(0.10)}
          strokeWidth="0.6"
        />

        {/* Hairline inner bevel outline */}
        <polygon points={pts([IT, IR, IM, IL])}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />

      </g>
    </svg>
  );
}

function IsoCube({
  color, size, x, y, rotate, duration, delay, depth,
  mouseX, mouseY, uid,
}: {
  color: string; size: number; x: string; y: string;
  rotate: number; duration: number; delay: number; depth: number;
  mouseX: any; mouseY: any; uid: string;
}) {
  const px = useTransform(mouseX, [-1, 1], [-60 * depth, 60 * depth]);
  const py = useTransform(mouseY, [-1, 1], [-40 * depth, 40 * depth]);

  return (
    <motion.div
      style={{
        position: "absolute", left: x, top: y,
        width: size * 2, height: size * 1.7,
        willChange: "transform",
        x: px, y: py,
      }}
      initial={{ opacity: 0, scale: 0.2, rotate: rotate - 20 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{
        opacity: { duration: 1.1, delay, ease: "easeOut" },
        scale:   { duration: 1.1, delay, ease: [0.34, 1.56, 0.64, 1] },
        rotate:  { duration: 1.1, delay, ease: "easeOut" },
      }}
    >
      <motion.div
        animate={{ y: [0, -14, 4, -9, 0], x: [0, 5, -3, 7, 0] }}
        transition={{
          y: { duration, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          x: { duration: duration * 1.25, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
        }}
      >
        <GlassyCube color={color} size={size} uid={uid} />
      </motion.div>
    </motion.div>
  );
}

export default function BackgroundCanvas() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 55, damping: 22, mass: 1 });
  const mouseY = useSpring(rawY, { stiffness: 55, damping: 22, mass: 1 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth)  * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [rawX, rawY]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        overflow: "hidden", pointerEvents: "none",
        backgroundColor: "#fafafa",
      }}
      aria-hidden="true"
    >
      {/* Pastel corner wash */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 65% 65% at   0%   0%, rgba(255,188,196,0.15) 0%, transparent 70%),
          radial-gradient(ellipse 65% 65% at 100%   0%, rgba(204,233,211,0.15) 0%, transparent 70%),
          radial-gradient(ellipse 65% 65% at   0% 100%, rgba(191,228,255,0.15) 0%, transparent 70%),
          radial-gradient(ellipse 65% 65% at 100% 100%, rgba(255,241,182,0.15) 0%, transparent 70%)
        `,
      }} />

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(100,105,120,0.09) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,105,120,0.09) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }} />

      {/* Glassy cubes — hidden on mobile */}
      <div className="hidden sm:block">
        {CUBES.map((cube, i) => (
          <IsoCube
            key={i}
            {...cube}
            mouseX={mouseX}
            mouseY={mouseY}
            uid={`cube-${i}`}
          />
        ))}
      </div>
    </div>
  );
}