"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, Shuffle } from "lucide-react";

const TRACKS = [
  { num: "01", title: "INTRO.mp3",                  duration: "01:02" },
  { num: "02", title: "MOI_J_SUIS_SINGLE.mp3",      duration: "02:26" },
  { num: "03", title: "17_HEURES.mp3",              duration: "02:56" },
  { num: "04", title: "CHATCGT.mp3",                duration: "02:33" },
  { num: "05", title: "418_I_M_A_TEAPOT.mp3",       duration: "02:27" },
  { num: "06", title: "AMOUR_ARTIFICIEL.mp3",        duration: "02:38" },
  { num: "07", title: "PLUS_RAR_QUE_TON_ZIP.mp3",   duration: "02:56" },
  { num: "08", title: "OVER_OUTRO.mp3",             duration: "01:35" },
] as const;

/* Album ASCII art displayed on larger screens */
const ASCII_ART = ` ╔══════════╗
 ║ ▓▓▓▓▓▓▓▓ ║
 ║ ▓ >_  ▓ ║
 ║ ▓▓▓▓▓▓▓▓ ║
 ║ ░░░░░░░░ ║
 ╚══════════╝`;

/* Format seconds → "mm:ss" */
const fmtTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function LatestDropSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0); /* 0–100 */

  /* Simulate playback progress */
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          /* Auto-advance to next track */
          setActiveTrack((t) => (t + 1) % TRACKS.length);
          setProgress(0);
          return 0;
        }
        return p + 0.08;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* GSAP scroll-triggered entrance */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 70,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Derive current time from progress */
  const [min, sec] = TRACKS[activeTrack].duration.split(":").map(Number);
  const totalSecs   = min * 60 + sec;
  const currentSecs = (progress / 100) * totalSecs;

  const selectTrack = (i: number) => {
    setActiveTrack(i);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <section ref={sectionRef} id="releases" className="relative z-10 py-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Shell breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-10 text-[#555]">
          <span className="text-[#00ff00]">$</span>
          <span>ls -la ./releases/latest/</span>
        </div>

        {/* ── Terminal album box ── */}
        <div className="terminal-box">

          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] shadow-[0_0_8px_#00ff00] animate-pulse" />
              <span className="text-[#00ff00] text-xs font-bold tracking-[0.2em] glow-green-sm">
                DRING.EXE
              </span>
            </div>
            <span className="text-[#555] text-[10px]">EP · 2025 · 8 TRACKS</span>
          </div>

          {/* Album info row */}
          <div className="flex items-start gap-5 p-4 border-b border-[#111]">
            {/* ASCII art — hidden on mobile */}
            <pre
              className="text-[8px] leading-tight shrink-0 hidden sm:block select-none"
              style={{
                color: "#1a3a1a",
                textShadow: "0 0 12px rgba(0,255,0,0.25)",
                fontFamily: "inherit",
              }}
              aria-hidden="true"
            >
              {ASCII_ART}
            </pre>

            <div className="min-w-0">
              <div className="text-[#d4d4d4] font-bold text-2xl mb-1 tracking-tight">
                DRING.EXE
              </div>
              <div className="text-[#666] text-xs mb-3">
                Antonin Dring · Underground / Rap / Trap · 2025
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] text-[#555]">
                <span className="text-[#00ff00]">★★★★★</span>
                <span>8 TRACKS</span>
                <span>18:33 MIN</span>
                <span className="text-[#8a2be2]">#1 UNDERGROUND</span>
              </div>
            </div>
          </div>

          {/* Track list */}
          <div className="divide-y divide-[#0d0d0d]">
            {TRACKS.map((track, i) => {
              const active = activeTrack === i;
              return (
                <button
                  key={i}
                  onClick={() => selectTrack(i)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5
                    text-left transition-all duration-150 group
                    ${active
                      ? "bg-[#0b1a0b] text-[#00ff00]"
                      : "hover:bg-[#0a0a0a] text-[#555] hover:text-[#888]"}
                  `}
                >
                  {/* Track number / playing indicator */}
                  <span className="text-[10px] w-5 text-center shrink-0 font-bold">
                    {active && isPlaying ? "▶" : track.num}
                  </span>

                  <span className={`text-xs flex-1 truncate ${active ? "glow-green-sm" : ""}`}>
                    {track.title}
                  </span>

                  {/* Waveform bars when playing (CSS animation) */}
                  {active && isPlaying && (
                    <span className="flex items-end gap-0.5 h-4 shrink-0">
                      {[3, 5, 4, 6, 3, 5, 2].map((h, j) => (
                        <span
                          key={j}
                          className="w-0.5 bg-[#00ff00] rounded-sm"
                          style={{
                            height: `${h * 2}px`,
                            animation: `cursor-blink ${0.3 + j * 0.07}s step-start infinite`,
                            animationDelay: `${j * 0.06}s`,
                          }}
                        />
                      ))}
                    </span>
                  )}

                  <span className="text-[10px] text-[#555] shrink-0">{track.duration}</span>
                </button>
              );
            })}
          </div>

          {/* Player controls */}
          <div className="p-4 border-t border-[#1a1a1a] space-y-3 bg-[#070707]">
            {/* Progress bar */}
            <div className="flex items-center gap-3 text-[10px] text-[#666]">
              <span className="w-8 text-right shrink-0">{fmtTime(currentSecs)}</span>
              <div className="flex-1 h-0.75 bg-[#111] relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[#00ff00] transition-all duration-75"
                  style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 6px #00ff00, 0 0 12px rgba(0,255,0,0.4)",
                  }}
                />
              </div>
              <span className="w-8 shrink-0">
                {TRACKS[activeTrack].duration}
              </span>
            </div>

            {/* Buttons row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-5">
                <button
                  onClick={() => { setActiveTrack((t) => Math.max(0, t - 1)); setProgress(0); }}
                  className="text-[#555] hover:text-[#00ff00] transition-colors"
                  aria-label="Previous"
                >
                  <SkipBack size={15} />
                </button>

                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="
                    flex items-center justify-center w-9 h-9
                    border-2 border-[#00ff00] text-[#00ff00]
                    hover:bg-[#00ff00] hover:text-[#050505]
                    hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]
                    transition-all duration-150 active:scale-90
                  "
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <button
                  onClick={() => { setActiveTrack((t) => Math.min(TRACKS.length - 1, t + 1)); setProgress(0); }}
                  className="text-[#555] hover:text-[#00ff00] transition-colors"
                  aria-label="Next"
                >
                  <SkipForward size={15} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[#444]">
                <Shuffle size={13} className="hover:text-[#888] transition-colors cursor-pointer" />
                <Repeat  size={13} className="hover:text-[#888] transition-colors cursor-pointer" />
                <Volume2 size={13} className="hover:text-[#888] transition-colors cursor-pointer" />
                <span className="text-[10px] hidden sm:inline">
                  VOL: <span className="text-[#555]">████░</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File metadata line */}
        <div className="mt-2 text-[9px] sm:text-[10px] text-[#1a1a1a] font-mono">
          drwxr-xr-x&nbsp; 2 antonin dring&nbsp; 4096 Jan 01 2025&nbsp;
          <span className="text-[#2a2a2a]">DRING.EXE/</span>
        </div>
      </div>
    </section>
  );
}
