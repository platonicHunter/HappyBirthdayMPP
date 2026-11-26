"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ScratchBlessingCardProps {
  title: string;
  blessingText: string;
}

export default function ScratchBlessingCard({
  title,
  blessingText,
}: ScratchBlessingCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Canvas စတင်ပေါ်လာသည်နှင့် မိုးပြာရောင် ခဲခြစ်အလွှာကို ဆွဲသားခြင်း
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.globalCompositeOperation = "source-over";

    // Sky Blue Metallic Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#38bdf8");
    grad.addColorStop(0.5, "#0284c7");
    grad.addColorStop(1, "#0369a1");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Diagonal Foil Shimmer Stripes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 10;
    for (let i = -h; i < w + h; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    // Gold Sparkle Dots
    ctx.fillStyle = "rgba(253, 230, 138, 0.55)";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * w,
        Math.random() * h,
        Math.random() * 2.5 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Center Prompt Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ ဤနေရာကို လက်ဖြင့် ခဲခြစ်၍ ဖတ်ရှုပါ ✨", w / 2, h / 2);
  }, []);

  const scratchAtPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // ၅၀% ကျော် ခြစ်ပြီးပါက အကုန်လင်းသွားစေရန် စစ်ဆေးခြင်း
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    const totalSamples = imgData.length / 32;
    for (let i = 3; i < imgData.length; i += 32) {
      if (imgData[i] === 0) cleared++;
    }

    if (cleared / totalSamples > 0.5) {
      setIsRevealed(true);
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.75 },
        colors: ["#38bdf8", "#fbbf24", "#ffffff"],
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/50 bg-white/85 p-5 text-center shadow-xl backdrop-blur-md"
    >
      <h2 className="text-base font-bold text-sky-950">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">
        အောက်ပါ မိုးပြာရောင်အလွှာလေးကို လက်ဖြင့်ပွတ်ခြစ်ကြည့်ပါ
      </p>

      <div className="relative mx-auto mt-4 flex h-44 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border-2 border-amber-300/80 bg-linear-to-br from-amber-50 via-white to-sky-50 p-5 shadow-inner">
        <p className="select-none text-sm font-medium leading-relaxed text-sky-950">
          “{blessingText}”
        </p>

        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={460}
            height={176}
            onPointerDown={(e) => {
              setIsScratching(true);
              scratchAtPoint(e.clientX, e.clientY);
            }}
            onPointerUp={() => setIsScratching(false)}
            onPointerLeave={() => setIsScratching(false)}
            onPointerMove={(e) => {
              if (isScratching) {
                scratchAtPoint(e.clientX, e.clientY);
              }
            }}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer touch-none"
          />
        )}
      </div>
    </motion.section>
  );
}