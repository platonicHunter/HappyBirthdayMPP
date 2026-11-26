"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/birthdayConfig";
import { BirthdayStatus, getDynamicBirthdayStatus } from "@/lib/birthday";
import SkyBackground from "@/components/SkyBackground";
import GiftBoxUnlock from "@/components/GiftBoxUnlock";
import LuxuryBirthdayCard from "@/components/LuxuryBirthdayCard";
import ScratchBlessingCard from "@/components/ScratchBlessingCard";

export default function BirthdayGiftPage() {
  const [status, setStatus] = useState<BirthdayStatus | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Photo Gallery & Lightbox State
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Audio & Music Box BGM State
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [bgmMuted, setBgmMuted] = useState(false);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Tap-to-Open Wish Lanterns State
  const [openedLanterns, setOpenedLanterns] = useState<number[]>([]);

  // 1. Live Dynamic Birthday & Age Ticker + Auto-Relock After Birthday Ends
  useEffect(() => {
    const updateStatus = () => {
      const nextStatus = getDynamicBirthdayStatus(BIRTHDAY_CONFIG.birthDate);
      setStatus(nextStatus);

      // မွေးနေ့တစ်ရက် (၂၄ နာရီ) ပြည့်သွားပါက အလိုအလျောက် ပြန်ပိတ်ပြီး နောက်နှစ် Countdown ပြန်စမည်
      if (!nextStatus.isBirthdayToday) {
        setIsUnlocked((prevUnlocked) => {
          if (prevUnlocked) {
            voiceAudioRef.current?.pause();
            setPlayingVoiceId(null);
            setLightboxOpen(false);
            setOpenedLanterns([]);
          }
          return false;
        });
      }
    };

    updateStatus();
    const timer = setInterval(updateStatus, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Auto-advance Photo Slideshow every 4.5s
  useEffect(() => {
    if (!isUnlocked || lightboxOpen) return;
    const slideTimer = setInterval(() => {
      setPhotoIdx((prev) => (prev + 1) % BIRTHDAY_CONFIG.photos.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [isUnlocked, lightboxOpen]);

  // 3. Soft Synthesized Music Box BGM (Auto-ducks when voice note plays)
  useEffect(() => {
    if (!isUnlocked || bgmMuted) {
      if (bgmTimerRef.current) clearInterval(bgmTimerRef.current);
      return;
    }

    const notes = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
      261.63, 261.63, 293.66, 261.63, 392.0, 349.23,
      261.63, 261.63, 523.25, 440.0, 349.23, 329.63, 293.66,
      466.16, 466.16, 440.0, 349.23, 392.0, 349.23,
    ];
    let step = 0;

    const playNote = () => {
      try {
        if (!audioCtxRef.current) {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = notes[step % notes.length];

        // Auto-duck volume when a colleague's voice note is playing
        const peakGain = playingVoiceId ? 0.008 : 0.04;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(peakGain, ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
        step += 1;
      } catch {
        // Ignore if browser blocks audio before interaction
      }
    };

    bgmTimerRef.current = setInterval(playNote, 620);
    return () => {
      if (bgmTimerRef.current) clearInterval(bgmTimerRef.current);
    };
  }, [isUnlocked, bgmMuted, playingVoiceId]);

  const handleToggleVoice = (id: string, src: string) => {
    if (playingVoiceId === id) {
      voiceAudioRef.current?.pause();
      setPlayingVoiceId(null);
      return;
    }

    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }

    const audio = new Audio(src);
    voiceAudioRef.current = audio;
    setPlayingVoiceId(id);
    audio.play().catch(() => setPlayingVoiceId(null));
    audio.onended = () => setPlayingVoiceId(null);
  };

  const handleToggleLantern = (index: number) => {
    setOpenedLanterns((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  if (!status) return null;

  return (
    <main className="relative min-h-screen selection:bg-sky-300 selection:text-sky-950">
      <SkyBackground />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <GiftBoxUnlock
            key="locked"
            status={status}
            recipientName={BIRTHDAY_CONFIG.recipientName}
            onUnlock={() => setIsUnlocked(true)}
          />
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="mx-auto max-w-2xl space-y-8 px-4 pt-8 pb-24 sm:px-6"
          >
            {/* Floating Music Mute/Unmute Bar */}
            <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/25 px-4 py-2 text-white backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Happy {status.age}th Birthday Celebration</span>
              </div>
              <button
                type="button"
                onClick={() => setBgmMuted((m) => !m)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-medium transition hover:bg-white/40"
              >
                {bgmMuted ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-amber-200" />
                    <span>Music Box</span>
                  </>
                )}
              </button>
            </div>

            {/* 1. Ken Burns 10+ Photo Memory Slideshow */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-white/50 bg-white/85 p-4 shadow-xl backdrop-blur-md sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-sky-950 sm:text-base">
                  အမှတ်တရ ဓာတ်ပုံများ
                </h2>
                <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-semibold text-sky-700">
                  {photoIdx + 1} / {BIRTHDAY_CONFIG.photos.length}
                </span>
              </div>

              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-sky-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIdx}
                    src={BIRTHDAY_CONFIG.photos[photoIdx].src}
                    alt={BIRTHDAY_CONFIG.photos[photoIdx].caption}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.85, ease: "easeOut" }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>

                {/* Expand Lightbox Button */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Expand photo"
                  className="absolute top-3 right-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <Expand className="h-4 w-4" />
                </button>

                {/* Prev / Next Controls */}
                <button
                  type="button"
                  onClick={() =>
                    setPhotoIdx(
                      (prev) =>
                        (prev - 1 + BIRTHDAY_CONFIG.photos.length) %
                        BIRTHDAY_CONFIG.photos.length
                    )
                  }
                  className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-sky-900 shadow backdrop-blur-sm transition hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPhotoIdx(
                      (prev) => (prev + 1) % BIRTHDAY_CONFIG.photos.length
                    )
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-sky-900 shadow backdrop-blur-sm transition hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-center text-sm font-medium text-sky-900">
                {BIRTHDAY_CONFIG.photos[photoIdx].caption}
              </p>

              {/* Dot Indicators */}
              <div className="mt-3 flex justify-center gap-1.5">
                {BIRTHDAY_CONFIG.photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === photoIdx ? "w-6 bg-sky-600" : "w-1.5 bg-sky-300"
                    }`}
                  />
                ))}
              </div>
            </motion.section>

            {/* 2. Office Team Voice Wishes with Animated Equalizer */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/50 bg-white/85 p-5 shadow-xl backdrop-blur-md"
            >
              <h2 className="text-base font-bold text-sky-950">
                ရုံးသားများ၏ မွေးနေ့ဆုတောင်း အသံမက်ဆေ့ချ်များ
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Play ခလုတ်ကို နှိပ်၍ နားဆင်နိုင်ပါသည်
              </p>

              <div className="mt-4 space-y-3">
                {BIRTHDAY_CONFIG.voiceWishes.map((voice) => {
                  const isPlaying = playingVoiceId === voice.id;
                  return (
                    <div
                      key={voice.id}
                      className={`rounded-2xl border p-4 transition ${
                        isPlaying
                          ? "border-sky-400 bg-sky-50/90 shadow-md"
                          : "border-sky-100 bg-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-sky-950">
                            {voice.sender}
                          </p>
                          <p className="text-xs text-sky-600">{voice.role}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Animated Audio Waveform */}
                          <div className="flex h-6 items-end gap-1">
                            {[0.4, 0.9, 0.6, 1, 0.5].map((bar, bIdx) => (
                              <motion.span
                                key={bIdx}
                                animate={
                                  isPlaying
                                    ? {
                                        height: [
                                          "6px",
                                          `${Math.round(bar * 22)}px`,
                                          "8px",
                                        ],
                                      }
                                    : { height: "6px" }
                                }
                                transition={{
                                  duration: 0.55,
                                  delay: bIdx * 0.1,
                                  repeat: Infinity,
                                }}
                                className="w-1 rounded-full bg-sky-500"
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleVoice(voice.id, voice.audioSrc)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-sky-700 text-white shadow transition hover:scale-105"
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="ml-0.5 h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-600 italic">
                        “{voice.quote}”
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* 3. Tap-to-Open Wish Lanterns (4 Lanterns) */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/50 bg-white/85 p-5 shadow-xl backdrop-blur-md"
            >
              <div className="text-center">
                <h2 className="text-base font-bold text-sky-950">
                  ဆုတောင်းမီးပုံးလေးများ (Tap to Open)
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  မီးပုံးလေး တစ်လုံးချင်းစီကို နှိပ်ပြီး ဆုမွန်ကောင်းများ ဖွင့်ဖတ်ပါ
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3.5">
                {BIRTHDAY_CONFIG.wishLanterns.map((lantern, idx) => {
                  const isOpen = openedLanterns.includes(idx);
                  return (
                    <motion.button
                      key={lantern.title}
                      type="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleToggleLantern(idx)}
                      className={`relative flex min-h-38.75 flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                        isOpen
                          ? "border-amber-300 bg-linear-to-b from-amber-50 to-sky-50 shadow-md"
                          : "border-sky-200 bg-linear-to-b from-sky-500 to-sky-700 text-white shadow-lg"
                      }`}
                    >
                      {!isOpen ? (
                        <>
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 2.5,
                              delay: idx * 0.3,
                              repeat: Infinity,
                            }}
                            className="mb-2 flex h-12 w-10 items-center justify-center rounded-t-full rounded-b-md bg-linear-to-t from-amber-400 to-amber-100 text-sky-950 shadow-[0_0_18px_rgba(251,191,36,0.75)]"
                          >
                            <Heart className="h-4 w-4 fill-amber-600 text-amber-600" />
                          </motion.div>
                          <span className="text-sm font-bold">
                            {lantern.title}
                          </span>
                          <span className="mt-0.5 text-[11px] text-sky-100">
                            နှိပ်၍ ဖွင့်ရန်
                          </span>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-1.5"
                        >
                          <span className="inline-block rounded-full bg-amber-200/70 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                            {lantern.title}
                          </span>
                          <p className="text-xs leading-relaxed text-slate-700">
                            {lantern.wish}
                          </p>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>

            {/* 4. Upgraded 3D Luxury Birthday Card + Sparkler Cake + PNG Save */}
            <LuxuryBirthdayCard
              recipientName={BIRTHDAY_CONFIG.recipientName}
              age={status.age}
              photoSrc={BIRTHDAY_CONFIG.cardCoverPhoto}
              letterParagraphs={BIRTHDAY_CONFIG.letterParagraphs}
              formattedDate={status.formattedTargetDate}
            />

            {/* 5. Scratch-to-Reveal Birthday Blessing */}
            <ScratchBlessingCard
              title={BIRTHDAY_CONFIG.scratchBlessingTitle}
              blessingText={BIRTHDAY_CONFIG.scratchBlessingText}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/90 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] max-w-lg overflow-hidden rounded-3xl border border-white/30 bg-white p-3 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-5 right-5 z-10 rounded-full bg-black/50 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={BIRTHDAY_CONFIG.photos[photoIdx].src}
                alt={BIRTHDAY_CONFIG.photos[photoIdx].caption}
                className="max-h-[72vh] w-full rounded-2xl object-contain"
              />
              <p className="py-3 text-center text-sm font-semibold text-sky-950">
                {BIRTHDAY_CONFIG.photos[photoIdx].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}