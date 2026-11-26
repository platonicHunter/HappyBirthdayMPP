"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, Download, Flame } from "lucide-react";
import confetti from "canvas-confetti";

interface LuxuryBirthdayCardProps {
  recipientName: string;
  age: number;
  photoSrc: string;
  letterParagraphs: string[];
  formattedDate: string;
}

/** SVG Botanical Gold Corner Flourish (Top-Right & Bottom-Left) */
function BotanicalCornerSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b47b16" />
          <stop offset="45%" stopColor="#e8c86b" />
          <stop offset="100%" stopColor="#9a640e" />
        </linearGradient>
      </defs>
      {/* Main Graceful Vine */}
      <path
        d="M210 12 C165 30, 125 68, 95 120 C75 155, 50 185, 16 205"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M198 6 C145 14, 95 42, 58 84"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
      {/* Botanical Leaves along the Vine */}
      <path
        d="M168 34 C150 22, 134 26, 132 42 C148 46, 162 42, 168 34 Z"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.5"
        fill="rgba(232, 200, 107, 0.14)"
      />
      <path
        d="M174 38 C184 56, 178 72, 162 72 C158 56, 164 44, 174 38 Z"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.5"
        fill="rgba(232, 200, 107, 0.14)"
      />
      <path
        d="M132 72 C112 62, 96 68, 96 84 C112 88, 126 82, 132 72 Z"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.5"
        fill="rgba(232, 200, 107, 0.14)"
      />
      <path
        d="M136 78 C148 96, 142 114, 126 114 C122 98, 128 84, 136 78 Z"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.5"
        fill="rgba(232, 200, 107, 0.14)"
      />
      <path
        d="M96 120 C76 112, 62 118, 62 134 C78 136, 90 130, 96 120 Z"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.5"
        fill="rgba(232, 200, 107, 0.14)"
      />
      <path
        d="M98 126 C108 144, 102 160, 86 160 C82 144, 88 132, 98 126 Z"
        stroke="url(#goldFoilGrad)"
        strokeWidth="1.5"
        fill="rgba(232, 200, 107, 0.14)"
      />
      {/* Delicate Line-Art Blossom */}
      <g transform="translate(184, 24)">
        <circle cx="0" cy="0" r="4" fill="url(#goldFoilGrad)" />
        <ellipse
          cx="0"
          cy="-13"
          rx="6"
          ry="11"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.4"
          fill="rgba(255,255,255,0.45)"
        />
        <ellipse
          cx="12"
          cy="-4"
          rx="11"
          ry="6"
          transform="rotate(-18 12 -4)"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.4"
          fill="rgba(255,255,255,0.45)"
        />
        <ellipse
          cx="8"
          cy="11"
          rx="6"
          ry="11"
          transform="rotate(-35 8 11)"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.4"
          fill="rgba(255,255,255,0.45)"
        />
        <ellipse
          cx="-8"
          cy="11"
          rx="6"
          ry="11"
          transform="rotate(35 -8 11)"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.4"
          fill="rgba(255,255,255,0.45)"
        />
        <ellipse
          cx="-12"
          cy="-4"
          rx="11"
          ry="6"
          transform="rotate(18 -12 -4)"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.4"
          fill="rgba(255,255,255,0.45)"
        />
      </g>
      {/* Delicate Gold Butterfly */}
      <g transform="translate(116, 36) rotate(-22)">
        <path
          d="M0 0 C-10 -14, -24 -10, -18 2 C-14 8, -4 6, 0 0 Z"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.3"
          fill="rgba(232, 200, 107, 0.25)"
        />
        <path
          d="M0 0 C10 -14, 24 -10, 18 2 C14 8, 4 6, 0 0 Z"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.3"
          fill="rgba(232, 200, 107, 0.25)"
        />
        <path
          d="M0 2 C-8 6, -14 16, -6 18 C-1 18, 0 8, 0 2 Z"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.2"
          fill="rgba(232, 200, 107, 0.2)"
        />
        <path
          d="M0 2 C8 6, 14 16, 6 18 C1 18, 0 8, 0 2 Z"
          stroke="url(#goldFoilGrad)"
          strokeWidth="1.2"
          fill="rgba(232, 200, 107, 0.2)"
        />
      </g>
    </svg>
  );
}

export default function LuxuryBirthdayCard({
  recipientName,
  age,
  photoSrc,
  letterParagraphs,
  formattedDate,
}: LuxuryBirthdayCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [candleLit, setCandleLit] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // 3D Tilt & Specular Shimmer Motion Values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.min(1, Math.max(0, x)));
    mouseY.set(Math.min(1, Math.max(0, y)));
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleToggleCandle = () => {
    setCandleLit((prev) => {
      const next = !prev;
      if (!next) {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
          colors: ["#38bdf8", "#fbbf24", "#ffffff"],
        });
      }
      return next;
    });
  };

  // Option 2: High-Resolution "Elegant Botanical Bloom" PNG Card Generator
  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const width = 1080;
      const height = 1520;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Soft Watercolor Sky-Blue Cloud Base
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, "#e0f2fe");
      baseGrad.addColorStop(0.35, "#f0f9ff");
      baseGrad.addColorStop(0.7, "#bae6fd");
      baseGrad.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft Watercolor Cloud Puffs
      const clouds = [
        { x: 220, y: 200, r: 340, color: "rgba(255, 255, 255, 0.82)" },
        { x: 860, y: 280, r: 360, color: "rgba(186, 230, 253, 0.65)" },
        { x: 540, y: 520, r: 420, color: "rgba(255, 255, 255, 0.78)" },
        { x: 180, y: 980, r: 380, color: "rgba(186, 230, 253, 0.58)" },
        { x: 880, y: 1220, r: 390, color: "rgba(255, 255, 255, 0.8)" },
      ];
      for (const c of clouds) {
        const rad = ctx.createRadialGradient(c.x, c.y, 20, c.x, c.y, c.r);
        rad.addColorStop(0, c.color);
        rad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, width, height);
      }

      // Metallic Gold Gradient Helper
      const goldGrad = ctx.createLinearGradient(0, 0, width, height);
      goldGrad.addColorStop(0, "#a67014");
      goldGrad.addColorStop(0.35, "#dfc068");
      goldGrad.addColorStop(0.65, "#9e6810");
      goldGrad.addColorStop(1, "#d8b454");

      // 2. Double Botanical Gold Frame
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 4;
      ctx.strokeRect(46, 46, width - 92, height - 92);

      ctx.strokeStyle = "rgba(180, 123, 22, 0.55)";
      ctx.lineWidth = 2;
      ctx.strokeRect(64, 64, width - 128, height - 128);

      // 3. Draw Botanical Gold Foliage, Blossoms & Butterflies on Corners
      const drawBotanicalCluster = (
        originX: number,
        originY: number,
        rotationRad: number
      ) => {
        ctx.save();
        ctx.translate(originX, originY);
        ctx.rotate(rotationRad);
        ctx.strokeStyle = goldGrad;
        ctx.fillStyle = "rgba(223, 192, 104, 0.22)";

        // Graceful curved stem
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-90, 35, -170, 115, -230, 235);
        ctx.stroke();

        // Leaves along stem
        const leaves = [
          { x: -55, y: 26, angle: -0.6, scale: 1.0 },
          { x: -45, y: 34, angle: 1.1, scale: 0.95 },
          { x: -115, y: 76, angle: -0.5, scale: 1.1 },
          { x: -105, y: 86, angle: 1.15, scale: 1.05 },
          { x: -175, y: 145, angle: -0.45, scale: 1.0 },
          { x: -165, y: 155, angle: 1.2, scale: 0.9 },
        ];
        for (const lf of leaves) {
          ctx.save();
          ctx.translate(lf.x, lf.y);
          ctx.rotate(lf.angle);
          ctx.scale(lf.scale, lf.scale);
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-24, -18, -54, -12, -64, 4);
          ctx.bezierCurveTo(-48, 18, -18, 14, 0, 0);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Line-art Gold Blossom at corner
        ctx.save();
        ctx.translate(-34, 34);
        ctx.lineWidth = 2.4;
        for (let p = 0; p < 5; p++) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, -24, 12, 22, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          ctx.fill();
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#b47b16";
        ctx.fill();
        ctx.restore();

        // Gold Butterfly near cluster
        ctx.save();
        ctx.translate(-155, 42);
        ctx.rotate(-0.35);
        ctx.lineWidth = 2.2;
        ctx.fillStyle = "rgba(223, 192, 104, 0.3)";
        // Upper wings
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-20, -28, -46, -18, -34, 6);
        ctx.bezierCurveTo(-24, 16, -8, 10, 0, 0);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(20, -28, 46, -18, 34, 6);
        ctx.bezierCurveTo(24, 16, 8, 10, 0, 0);
        ctx.fill();
        ctx.stroke();

        // Lower wings
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(-16, 12, -26, 30, -10, 34);
        ctx.bezierCurveTo(-2, 34, 0, 16, 0, 4);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(16, 12, 26, 30, 10, 34);
        ctx.bezierCurveTo(2, 34, 0, 16, 0, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      };

      // Top-Right & Bottom-Left Botanical Flourishes
      drawBotanicalCluster(width - 66, 66, 0);
      drawBotanicalCluster(66, height - 66, Math.PI);

      // 4. Header Typography
      ctx.fillStyle = "#9a640e";
      ctx.font = "bold 28px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(`✦  HAPPY ${age}TH BIRTHDAY  ✦`, width / 2, 155);

      // 5. Circular Framed Portrait Photo with Botanical Gold Wreath
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = photoSrc;
      });

      const cx = width / 2;
      const cy = 395;
      const radius = 165;

      // Soft White Halo Behind Photo
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 24, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
      ctx.fill();

      // Double Gold Ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180, 123, 22, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Botanical Wreath Leaves around the Ring
      for (let i = 0; i < 16; i++) {
        const theta = (i / 16) * Math.PI * 2;
        const lx = cx + Math.cos(theta) * (radius + 22);
        const ly = cy + Math.sin(theta) * (radius + 22);
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(theta + Math.PI / 2);
        ctx.fillStyle = "rgba(216, 180, 84, 0.55)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 14, 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const aspect = img.naturalWidth / img.naturalHeight;
        let drawW = radius * 2;
        let drawH = radius * 2;
        if (aspect > 1) {
          drawW = drawH * aspect;
        } else {
          drawH = drawW / aspect;
        }
        ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // 6. Recipient Name in Metallic Gold Typography
      const nameGrad = ctx.createLinearGradient(width * 0.25, 0, width * 0.75, 0);
      nameGrad.addColorStop(0, "#8c580c");
      nameGrad.addColorStop(0.5, "#c59226");
      nameGrad.addColorStop(1, "#8c580c");
      ctx.fillStyle = nameGrad;
      ctx.font = "bold 46px sans-serif";
      ctx.fillText(recipientName, width / 2, 655);

      // Ornamental Divider Line
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 140, 688);
      ctx.lineTo(width / 2 + 140, 688);
      ctx.stroke();

      // 7. Frosted Ivory Message Panel for Clear Readability
      ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
      ctx.beginPath();
      ctx.roundRect(110, 725, width - 220, 610, 32);
      ctx.fill();
      ctx.strokeStyle = "rgba(180, 123, 22, 0.32)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wrap Burmese Text Safely
      ctx.fillStyle = "#0c4a6e";
      ctx.font = "27px sans-serif";
      ctx.textAlign = "center";

      let y = 795;
      const maxWidth = width - 300;
      const lineHeight = 48;

      for (const paragraph of letterParagraphs) {
        const words = paragraph.split(" ");
        let line = "";
        for (const word of words) {
          const testLine = line + word + " ";
          if (ctx.measureText(testLine).width > maxWidth && line !== "") {
            ctx.fillText(line.trim(), width / 2, y);
            line = word + " ";
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line.trim()) {
          ctx.fillText(line.trim(), width / 2, y);
          y += lineHeight + 18;
        }
      }

      // 8. Footer Date Stamp
      ctx.fillStyle = "#9a640e";
      ctx.font = "bold 24px Georgia, serif";
      ctx.fillText(`—  ${formattedDate}  —`, width / 2, 1395);

      // Export & Share / Download
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const fileName = `Happy-${age}th-Birthday-Botanical-Card.png`;
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Happy ${age}th Birthday`,
            });
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
            return;
          } catch {
            // Fallback to direct download if share dismissed
          }
        }

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = fileName;
        link.href = blobUrl;
        link.click();
        URL.revokeObjectURL(blobUrl);

        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
      }, "image/png");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Interactive Mini Sky-Blue Birthday Cake */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center rounded-3xl border border-white/40 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md"
      >
        <p className="text-xs font-semibold tracking-wider text-sky-600 uppercase">
          Make A Wish
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {candleLit
            ? "ဆုတောင်းပြီးရင် ဖယောင်းတိုင်မီးလေးကို နှိပ်ပြီး ငြှိမ်းလိုက်ပါ"
            : "ဆုတောင်းတိုင်း ပြည့်ဝပါစေ အမ ✨ (ပြန်ထွန်းရန် ထပ်နှိပ်ပါ)"}
        </p>

        <button
          type="button"
          onClick={handleToggleCandle}
          className="group relative mt-5 flex flex-col items-center focus:outline-none"
        >
          <div className="flex h-9 items-end justify-center">
            {candleLit ? (
              <motion.div
                animate={{
                  scale: [1, 1.18, 0.95, 1.12, 1],
                  rotate: [-3, 4, -2, 3, -3],
                }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300/40"
              >
                <Flame className="h-6 w-6 fill-amber-400 text-orange-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
              </motion.div>
            ) : (
              <motion.span
                initial={{ opacity: 0.8, y: 0 }}
                animate={{ opacity: 0, y: -18 }}
                transition={{ duration: 1.2 }}
                className="text-xs text-slate-400"
              >
                ~ 💨 ~
              </motion.span>
            )}
          </div>

          <div className="h-9 w-2.5 rounded-t-sm bg-gradient-to-b from-amber-200 to-amber-400 shadow-sm" />
          <div className="h-7 w-28 rounded-t-xl border-b-2 border-sky-300 bg-gradient-to-r from-sky-100 via-white to-sky-100 shadow-inner" />
          <div className="relative h-10 w-40 rounded-t-xl rounded-b-lg bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 shadow-md">
            <div className="absolute inset-x-2 top-2 flex justify-around">
              {[0, 1, 2, 3, 4].map((dot) => (
                <span
                  key={dot}
                  className="h-2 w-2 rounded-full bg-amber-200 shadow-sm"
                />
              ))}
            </div>
          </div>
          <div className="h-2 w-48 rounded-full bg-amber-300/80 shadow" />
        </button>
      </motion.div>

      {/* Option 2: 3D "Elegant Botanical Bloom" Keepsake Card */}
      <div style={{ perspective: 1100 }}>
        <motion.div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border-2 border-[#d4af37]/80 bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#bae6fd] p-2.5 shadow-2xl"
        >
          {/* Watercolor Cloud Glow Layers */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/80 blur-2xl" />
          <div className="pointer-events-none absolute top-1/3 -right-12 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/4 h-64 w-64 rounded-full bg-white/75 blur-2xl" />

          {/* Moving Specular Shimmer Sheen */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.45), transparent 60%)`,
            }}
            className="pointer-events-none absolute inset-0 z-20"
          />

          {/* Inner Botanical Gold Double Frame */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#b47b16]/55 bg-white/45 px-6 py-9 text-center backdrop-blur-sm sm:px-10">
            {/* Top-Right & Bottom-Left Gold Botanical Line-Art Vines */}
            <BotanicalCornerSvg className="pointer-events-none absolute top-0 right-0 h-44 w-44 opacity-95 sm:h-52 sm:w-52" />
            <BotanicalCornerSvg className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rotate-180 opacity-95 sm:h-52 sm:w-52" />

            {/* Header Pill */}
            <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/70 bg-white/85 px-4 py-1 text-xs font-bold tracking-widest text-[#9a640e] uppercase shadow-sm">
              <span>✦ Happy {age}th Birthday ✦</span>
            </div>

            {/* Framed Portrait Photo with Gold Botanical Wreath */}
            <div className="relative z-10 mx-auto mt-6 h-32 w-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-[#c59226]"
              />
              <div className="absolute -inset-1 rounded-full border border-[#b47b16]/60" />
              <img
                src={photoSrc}
                alt={recipientName}
                className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>

            {/* Metallic Gold Name */}
            <h3 className="relative z-10 mt-5 bg-gradient-to-r from-[#8c580c] via-[#c59226] to-[#8c580c] bg-clip-text text-2xl font-extrabold text-transparent drop-shadow-sm sm:text-3xl">
              {recipientName}
            </h3>

            <div className="relative z-10 mx-auto my-4 h-px w-28 bg-gradient-to-r from-transparent via-[#c59226] to-transparent" />

            {/* Frosted Ivory Message Panel */}
            <div className="relative z-10 space-y-3.5 rounded-2xl border border-[#d4af37]/30 bg-white/75 px-5 py-5 text-sm leading-relaxed text-sky-950 shadow-sm sm:text-base">
              {letterParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <p className="relative z-10 mt-4 font-serif text-xs font-semibold tracking-wider text-[#9a640e]">
              — {formattedDate} —
            </p>

            {/* Save Botanical Card PNG Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#9a640e] via-[#c59226] to-[#0284c7] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>အမှတ်တရကတ် သိမ်းဆည်းပြီးပါပြီ</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>
                    {isDownloading
                      ? "ပန်းနွယ်ကတ်ပြား ပြင်ဆင်နေပါသည်..."
                      : "အမှတ်တရကတ် သိမ်းဆည်းရန် (Save Card)"}
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}