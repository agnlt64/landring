"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";

const FULL_TITLE = "ANTONIN DRING";

/* Words that cycle below the main title */
const CYCLING_WORDS = ["RAPPEUR", "ARTISTE", "DEV_UNDERGROUND", "ROOT_USER", "DRING.EXE"];

/* Fake system stats for the status bar */
const STATS = [
  { label: "CPU",    value: "99%",     color: "#00ff00" },
  { label: "FLOW",   value: "MAXIMUM", color: "#00ff00" },
  { label: "ENERGY", value: "CRITICAL", color: "#ffaa00" },
  { label: "BARS",   value: "16/16",   color: "#00ff00" },
  { label: "STATUS", value: "ONLINE",  color: "#00ff00" },
];

export default function HeroSection() {
  const [typedTitle, setTypedTitle]       = useState("");
  const [titleDone, setTitleDone]         = useState(false);
  const [wordIndex, setWordIndex]         = useState(0);
  const [typedWord, setTypedWord]         = useState("");
  const [isErasing, setIsErasing]         = useState(false);

  const sectionRef  = useRef<HTMLElement>(null);
  const promptRef   = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLDivElement>(null);
  const tagsRef     = useRef<HTMLDivElement>(null);
  const btnRef      = useRef<HTMLButtonElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);

  /* ── Typewriter effect for main title ── */
  useEffect(() => {
    let i = 0;
    const typeNext = () => {
      if (i <= FULL_TITLE.length) {
        setTypedTitle(FULL_TITLE.slice(0, i));
        i++;
        /* Slight variation for organic feel */
        setTimeout(typeNext, 70 + Math.random() * 55);
      } else {
        setTitleDone(true);
      }
    };
    /* Small delay so GSAP entrance has time to register */
    const timer = setTimeout(typeNext, 500);
    return () => clearTimeout(timer);
  }, []);

  /* ── Cycling subtitle words (type + erase loop) ── */
  useEffect(() => {
    if (!titleDone) return;

    const currentWord = CYCLING_WORDS[wordIndex];
    let charIdx = isErasing ? currentWord.length : 0;

    const tick = () => {
      if (!isErasing) {
        if (charIdx <= currentWord.length) {
          setTypedWord(currentWord.slice(0, charIdx));
          charIdx++;
          timer = setTimeout(tick, 65);
        } else {
          /* Hold full word for 1.8s before erasing */
          timer = setTimeout(() => setIsErasing(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setTypedWord(currentWord.slice(0, charIdx));
          charIdx--;
          timer = setTimeout(tick, 35);
        } else {
          setIsErasing(false);
          setWordIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
        }
      }
    };

    let timer: ReturnType<typeof setTimeout> = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [titleDone, wordIndex, isErasing]);

  /* ── GSAP entrance animation (staggered) ── */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(promptRef.current, {
        opacity: 0, x: -24, duration: 0.45, ease: "power2.out",
      })
      .from(taglineRef.current, {
        opacity: 0, y: 24, duration: 0.55, ease: "power2.out",
      }, "+=0.85")
      .from(tagsRef.current, {
        opacity: 0, y: 16, duration: 0.45, ease: "power2.out",
      }, "-=0.2")
      .from(btnRef.current, {
        opacity: 0, y: 16, scale: 0.93, duration: 0.5, ease: "back.out(1.7)",
      }, "-=0.2")
      .from(statsRef.current, {
        opacity: 0, y: 10, duration: 0.4, ease: "power2.out",
      }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Random GSAP glitch on the title (fires every 3.5–6.5s after title is done) ──
     Pure horizontal shifts (steps easing = digital snap, not smooth wobble).
     .title-glitching adds a cyan/magenta text-shadow split for signal-corruption look. */
  useEffect(() => {
    if (!titleDone) return;

    const el = document.getElementById("hero-title");
    if (!el) return;

    const scheduleGlitch = () => {
      const delay = 3500 + Math.random() * 3000;
      return setTimeout(() => {
        el.classList.add("title-glitching");
        gsap.timeline()
          .to(el, { x: -5, duration: 0.04, ease: "steps(1)" })
          .to(el, { x:  6, duration: 0.04, ease: "steps(1)" })
          .to(el, { x: -3, duration: 0.03, ease: "steps(1)" })
          .to(el, { x:  4, duration: 0.04, ease: "steps(1)" })
          .to(el, { x:  0, duration: 0.03, ease: "steps(1)" })
          .to(el, { x: -3, opacity: 0.8, duration: 0.03, ease: "steps(1)" })
          .to(el, { x:  0, opacity: 1,   duration: 0.05, ease: "steps(1)",
            onComplete: () => {
              el.classList.remove("title-glitching");
              timer = scheduleGlitch();
            },
          });
      }, delay);
    };

    let timer = scheduleGlitch();
    return () => clearTimeout(timer);
  }, [titleDone]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen flex flex-col justify-center px-6 pb-24 pt-20 z-10"
    >
      {/* ── Terminal window chrome (top bar) ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 py-2 border-b border-[#111]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[#555] text-[11px] ml-2 hidden sm:block">
          dring@underground: ~ — DRING.EXE v2.0.2 [TERMINAL]
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
          <span className="text-[10px] text-[#555]">LIVE</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="w-full max-w-5xl mx-auto">

        {/* Shell prompt */}
        <div ref={promptRef} className="flex items-center gap-1 text-xs sm:text-sm mb-6">
          <span className="text-[#00ff00]">root@dring</span>
          <span className="text-[#555]">:</span>
          <span className="text-[#6688aa]">~$</span>
          <span className="text-[#4a4a4a] ml-2 hidden sm:inline">./run_artist.sh --mode=live --overdrive=max</span>
          <span className="cursor-blink ml-1 inline-block w-1.75 h-3.5 bg-[#555] align-middle" />
        </div>

        {/* Big title */}
        <div className="mb-6 overflow-hidden">
          <h1
            id="hero-title"
            className="font-black tracking-tighter leading-none select-none"
            style={{
              fontSize: "clamp(2.8rem, 10vw, 9rem)",
              color: "#d4d4d4",
              /* Subtle green glow behind the letters */
              textShadow:
                "0 0 30px rgba(0,255,0,0.12), 0 0 60px rgba(0,255,0,0.06)",
            }}
          >
            {typedTitle}
            {/* Blinking cursor at end of typing */}
            <span
              className="inline-block bg-[#00ff00] align-middle ml-0.75"
              style={{
                width: "clamp(3px, 0.55vw, 6px)",
                height: "0.88em",
                animation: "cursor-blink 1s step-start infinite",
                boxShadow: "0 0 12px #00ff00, 0 0 24px rgba(0,255,0,0.5)",
              }}
            />
          </h1>
        </div>

        {/* Rotating subtitle */}
        <div
          ref={taglineRef}
          className="flex items-center gap-2 mb-8 text-sm sm:text-base"
        >
          <span className="text-[#555]">//</span>
          <span
            className="min-w-[12ch]"
            style={{ color: "#8a2be2", textShadow: "0 0 12px rgba(138,43,226,0.5)" }}
          >
            {typedWord}
          </span>
          {/* Purple cursor for subtitle */}
          <span
            className="inline-block w-2 h-3.5 align-middle"
            style={{
              background: "#8a2be2",
              animation: "cursor-blink 0.75s step-start infinite",
            }}
          />
          <span className="text-[#555]">//</span>
        </div>

        {/* Tag pills */}
        <div
          ref={tagsRef}
          className="flex flex-wrap gap-2 mb-10"
        >
          {["#RAP", "#TRAP", "#UNDERGROUND", "#CODE", "#DRING_EXE"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-1 border border-[#2a2a2a] text-[#666]
                         hover:text-[#00ff00] hover:border-[#00ff00]
                         hover:shadow-[0_0_8px_rgba(0,255,0,0.25)]
                         transition-all duration-200 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button — glitch on hover via CSS pseudo-elements */}
        <div className="mb-16">
          <button
            ref={btnRef}
            data-text="[ STREAM_NOW.EXE ]"
            className="
              glitch-btn
              inline-flex items-center justify-center gap-3
              w-full sm:w-auto
              px-8 py-4
              border-2 border-[#00ff00] text-[#00ff00]
              font-bold text-base sm:text-lg tracking-[0.2em]
              uppercase
              hover:bg-[#00ff00] hover:text-[#050505]
              hover:shadow-[0_0_30px_rgba(0,255,0,0.4)]
              transition-colors duration-150
              active:scale-95
            "
          >
            <a href="https://open.spotify.com/intl-fr/album/1VwrwzRYxftxFH3bLyAuFn?si=wfcqx_idTNKKva0th4989A" target="_blank" className="relative z-10">[ STREAM_NOW.EXE ]</a>
          </button>
        </div>

        {/* System status bar */}
        <div
          ref={statsRef}
          className="flex flex-wrap gap-4 sm:gap-8 text-[10px] sm:text-xs text-[#555]
                     border-t border-[#111] pt-4"
        >
          {STATS.map((stat) => (
            <span key={stat.label}>
              {stat.label}:{" "}
              <span style={{ color: stat.color }}>{stat.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] text-[#444]">
        <span>scroll_down</span>
        <span className="text-[#00ff00] animate-bounce">▼</span>
      </div>
    </section>
  );
}
