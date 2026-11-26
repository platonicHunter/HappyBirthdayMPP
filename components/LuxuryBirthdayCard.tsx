"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Download, Flame, Sparkles, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface LuxuryBirthdayCardProps {
  recipientName: string;
  age: number;
  photoSrc: string;
  letterParagraphs: string[];
  formattedDate: string;
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

  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);
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

  // High-DPI PNG Keepsake Card Generator
  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const width = 1080;
      const height = 1440;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Sky Blue Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#0c4a6e");
      bgGrad.addColorStop(0.45, "#0284c7");
      bgGrad.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Soft Luminous Circle Glow
      const glow = ctx.createRadialGradient(540, 420, 40, 540, 420, 460);
      glow.addColorStop(0, "rgba(255, 255, 255, 0.38)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // 3. Double Gold Ornate Frame
      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 4;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      ctx.strokeStyle = "rgba(253, 230, 138, 0.55)";
      ctx.lineWidth = 2;
      ctx.strokeRect(66, 66, width - 132, height - 132);

      // 4. Header Title
      ctx.fillStyle = "#fef3c7";
      ctx.font = "600 28px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(`HAPPY ${age}TH BIRTHDAY`, width / 2, 145);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 46px sans-serif";
      ctx.fillText(recipientName, width / 2, 215);

      // 5. Circular Framed Portrait Photo
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = photoSrc;
      });

      const cx = width / 2;
      const cy = 435;
      const radius = 165;

      // Gold Halo Ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 12, 0, Math.PI * 2);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 6;
      ctx.stroke();

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

      // 6. Glass Card Panel for Message
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.beginPath();
      ctx.roundRect(110, 660, width - 220, 610, 32);
      ctx.fill();

      // Wrap Burmese text cleanly
      ctx.fillStyle = "#0c4a6e";
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";

      const fullText = letterParagraphs.join(" ");
      const words = fullText.split(" ");
      let line = "";
      let y = 745;
      const maxWidth = width - 310;

      for (const word of words) {
        const testLine = line + word + " ";
        if (ctx.measureText(testLine).width > maxWidth && line !== "") {
          ctx.fillText(line.trim(), width / 2, y);
          line = word + " ";
          y += 48;
        } else {
          line = testLine;
        }
      }
      if (line) {
        ctx.fillText(line.trim(), width / 2, y);
      }

      // Footer Stamp
      ctx.fillStyle = "#0284c7";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`အမှတ်တရ မွေးနေ့လက်ဆောင် • ${formattedDate}`, width / 2, 1215);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Happy-${age}th-Birthday-Card.png`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
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
          {/* Animated Flame */}
          <div className="h-9 flex items-end justify-center">
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

          {/* Candle Stick */}
          <div className="h-9 w-2.5 rounded-t-sm bg-linear-to-b from-amber-200 to-amber-400 shadow-sm" />

          {/* Cake Top Tier */}
          <div className="h-7 w-28 rounded-t-xl border-b-2 border-sky-300 bg-linear-to-r from-sky-100 via-white to-sky-100 shadow-inner" />

          {/* Cake Base Tier */}
          <div className="relative h-10 w-40 rounded-t-xl rounded-b-lg bg-linear-to-r from-sky-500 via-sky-400 to-sky-500 shadow-md">
            <div className="absolute inset-x-2 top-2 flex justify-around">
              {[0, 1, 2, 3, 4].map((dot) => (
                <span
                  key={dot}
                  className="h-2 w-2 rounded-full bg-amber-200 shadow-sm"
                />
              ))}
            </div>
          </div>
          {/* Cake Plate */}
          <div className="h-2 w-48 rounded-full bg-amber-300/80 shadow" />
        </button>
      </motion.div>

      {/* 3D Interactive Luxury Greeting Card */}
      <div style={{ perspective: 1100 }}>
        <motion.div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-4xl border-2 border-amber-200/80 bg-linear-to-br from-[#0c4a6e] via-[#0369a1] to-[#38bdf8] p-1.5 shadow-2xl"
        >
          {/* Moving Specular Shimmer Sheen */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.28), transparent 60%)`,
            }}
            className="pointer-events-none absolute inset-0 z-20"
          />

          {/* Inner Ornamental Frame */}
          <div className="relative rounded-[1.65rem] border border-amber-200/50 bg-white/90 px-6 py-8 text-center backdrop-blur-xl sm:px-9">
            {/* Corner Sparkle Accents */}
            <Sparkles className="absolute top-5 left-5 h-5 w-5 text-amber-400" />
            <Sparkles className="absolute top-5 right-5 h-5 w-5 text-amber-400" />

            {/* Dynamic Age Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-linear-to-r from-amber-50 to-sky-50 px-4 py-1 text-xs font-bold tracking-wider text-sky-900 uppercase shadow-sm">
              <span>Happy {age}th Birthday</span>
            </div>

            {/* Framed Portrait Photo */}
            <div className="relative mx-auto mt-5 h-28 w-28">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1.5 rounded-full border-2 border-dashed border-amber-400"
              />
              <img
                src={photoSrc}
                alt={recipientName}
                className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>

            <h3 className="mt-4 text-xl font-bold text-sky-950 sm:text-2xl">
              {recipientName}
            </h3>
            <p className="mt-1 text-xs font-medium text-sky-600">
              {formattedDate}
            </p>

            <div className="mx-auto my-5 h-px w-24 bg-linear-to-r from-transparent via-amber-400 to-transparent" />

            {/* Heartfelt Message */}
            <div className="space-y-3.5 text-sm leading-relaxed text-slate-700 sm:text-base">
              {letterParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Download High-Res PNG Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-600 via-sky-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>ဖုန်းထဲသို့ သိမ်းဆည်းပြီးပါပြီ</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>
                    {isDownloading
                      ? "ကတ်ပြား ပြင်ဆင်နေပါသည်..."
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