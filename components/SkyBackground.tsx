"use client";

import { motion } from "framer-motion";

const STARS = [
  { top: "8%", left: "12%", size: 4, delay: 0 },
  { top: "14%", left: "82%", size: 5, delay: 0.7 },
  { top: "24%", left: "26%", size: 3, delay: 1.4 },
  { top: "30%", left: "72%", size: 4, delay: 0.3 },
  { top: "48%", left: "10%", size: 5, delay: 1.1 },
  { top: "55%", left: "88%", size: 4, delay: 1.9 },
  { top: "70%", left: "20%", size: 3, delay: 0.5 },
  { top: "78%", left: "78%", size: 5, delay: 1.2 },
];

export default function SkyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-linear-to-b from-[#0c4a6e] via-[#0284c7] to-[#bae6fd]">
      {/* Soft radial sunlight glow */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl"
      />

      {/* Drifting Clouds */}
      <motion.div
        animate={{ x: ["-15%", "115%"] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        className="absolute top-[12%] left-0 h-24 w-72 rounded-full bg-white/15 blur-2xl"
      />
      <motion.div
        animate={{ x: ["110%", "-20%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-[36%] left-0 h-32 w-96 rounded-full bg-sky-100/20 blur-3xl"
      />

      {/* Twinkling Gold & White Stars */}
      {STARS.map((star, idx) => (
        <motion.span
          key={idx}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{
            duration: 3.2,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a]"
        />
      ))}

      {/* Subtle Floating Lantern Particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ y: "105vh", x: `${15 + i * 18}vw`, opacity: 0 }}
          animate={{
            y: "-15vh",
            x: [`${15 + i * 18}vw`, `${18 + i * 18}vw`, `${13 + i * 18}vw`],
            opacity: [0, 0.65, 0.65, 0],
          }}
          transition={{
            duration: 18 + i * 3,
            delay: i * 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-5 w-4 rounded-t-full rounded-b-sm bg-linear-to-t from-amber-300/70 to-amber-100/90 shadow-[0_0_16px_rgba(251,191,36,0.6)]"
        />
      ))}
    </div>
  );
}