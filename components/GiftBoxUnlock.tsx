"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles, Gift } from "lucide-react";
import confetti from "canvas-confetti";
import { BirthdayStatus } from "@/lib/birthday";

interface GiftBoxUnlockProps {
  status: BirthdayStatus;
  recipientName: string;
  onUnlock: () => void;
}

export default function GiftBoxUnlock({
  status,
  recipientName,
  onUnlock,
}: GiftBoxUnlockProps) {
  const { isBirthdayToday, timeLeft, formattedTargetDate } = status;

  const handleOpenGift = () => {
    if (!isBirthdayToday) return;

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#38bdf8", "#fbbf24", "#ffffff", "#0284c7"],
    });

    setTimeout(() => {
      onUnlock();
    }, 650);
  };

  const timeUnits = [
    { label: "ရက်", value: timeLeft.days },
    { label: "နာရီ", value: timeLeft.hours },
    { label: "မိနစ်", value: timeLeft.minutes },
    { label: "စက္ကန့်", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center text-white"
    >
      {/* Top Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-medium tracking-wider uppercase backdrop-blur-md"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        <span>Special Birthday Edition</span>
      </motion.div>

      {/* Main Title - No Age Displayed Here */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="font-serif text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl"
      >
        Happy Birthday
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 max-w-md text-sm text-sky-100 sm:text-base"
      >
        {recipientName} အတွက် အမှတ်တရ မွေးနေ့လက်ဆောင်
      </motion.p>

      {/* Live Countdown Box (Shown until 00:00:00 of Birthday) */}
      {!isBirthdayToday ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-7 grid grid-cols-4 gap-2.5 sm:gap-4"
        >
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="flex w-16 flex-col items-center rounded-2xl border border-white/30 bg-white/15 px-2 py-3 shadow-lg backdrop-blur-md sm:w-20"
            >
              <span className="font-mono text-2xl font-bold text-white sm:text-3xl">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[11px] text-sky-100">{unit.label}</span>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 rounded-full border border-amber-300/60 bg-amber-400/20 px-5 py-2 text-sm font-medium text-amber-100 backdrop-blur-md"
        >
          မွေးနေ့အချိန် ရောက်ရှိပါပြီ — လက်ဆောင်ဘူးလေးကို နှိပ်၍ ဖွင့်ဖောက်ပါ
        </motion.p>
      )}

      {/* Interactive 3D-feel Sky Blue & Gold Gift Box */}
      <div className="relative mt-10 flex flex-col items-center">
        {/* Ambient Pulsing Aura */}
        <motion.div
          animate={{
            scale: isBirthdayToday ? [1, 1.25, 1] : [1, 1.08, 1],
            opacity: isBirthdayToday ? [0.45, 0.85, 0.45] : [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 -m-6 rounded-full bg-amber-300/30 blur-2xl"
        />

        <motion.button
          type="button"
          disabled={!isBirthdayToday}
          onClick={handleOpenGift}
          animate={
            isBirthdayToday
              ? {
                  y: [0, -10, 0],
                  rotate: [0, -2, 2, -2, 0],
                }
              : { y: [0, -5, 0] }
          }
          transition={{
            duration: isBirthdayToday ? 2.4 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={isBirthdayToday ? { scale: 1.06 } : {}}
          whileTap={isBirthdayToday ? { scale: 0.94 } : {}}
          className={`group relative flex flex-col items-center focus:outline-none ${
            isBirthdayToday ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          {/* Gift Box Lid */}
          <div className="relative z-10 h-10 w-52 rounded-xl border border-sky-200/70 bg-linear-to-r from-sky-400 via-sky-300 to-sky-400 shadow-lg sm:w-60">
            {/* Horizontal Gold Ribbon on Lid */}
            <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-linear-to-r from-amber-400 via-amber-200 to-amber-400 shadow-sm" />
            {/* Ribbon Bow */}
            <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-1">
              <span className="h-6 w-8 -rotate-12 rounded-full border-4 border-amber-300 bg-amber-200/40" />
              <span className="h-6 w-8 rotate-12 rounded-full border-4 border-amber-300 bg-amber-200/40" />
            </div>
          </div>

          {/* Gift Box Body */}
          <div className="relative -mt-1 flex h-40 w-48 items-center justify-center rounded-b-2xl border border-t-0 border-sky-200/60 bg-linear-to-b from-sky-500 to-sky-700 shadow-2xl sm:h-44 sm:w-56">
            {/* Vertical Gold Ribbon */}
            <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-linear-to-r from-amber-400 via-amber-200 to-amber-400" />
            {/* Horizontal Gold Ribbon */}
            <div className="absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 bg-linear-to-b from-amber-400 via-amber-200 to-amber-400" />

            {/* Center Medallion (Star/Gift Icon - No Age) */}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-100 bg-linear-to-br from-amber-300 via-amber-400 to-amber-600 text-sky-950 shadow-xl">
              {isBirthdayToday ? (
                <Gift className="h-7 w-7 animate-bounce" />
              ) : (
                <Lock className="h-6 w-6" />
              )}
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bottom Status Note */}
      <p className="mt-8 text-xs text-sky-100/90 sm:text-sm">
        {isBirthdayToday
          ? "လက်ဆောင်ဘူးပေါ် နှိပ်ပြီး အမှတ်တရများကို ဖွင့်ဖောက်လိုက်ပါ"
          : `${formattedTargetDate} (၀၀:၀၀) နာရီတွင် အလိုအလျောက် ပွင့်လာပါမည်`}
      </p>
    </motion.div>
  );
}