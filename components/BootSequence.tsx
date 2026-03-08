"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BOOT_LINES = [
  { delay: 150,  text: "DRING_OS kernel 6.12.0-underground #1 SMP",        type: "info" },
  { delay: 420,  text: "[  OK  ] Loading audio_engine.so ............. done", type: "ok"   },
  { delay: 680,  text: "[  OK  ] Mounting /proc/beats ................. done", type: "ok"   },
  { delay: 920,  text: "[  OK  ] Initializing flow_state.module ....... done", type: "ok"   },
  { delay: 1120, text: "[  OK  ] Connecting to underground.net ........ done", type: "ok"   },
  { delay: 1340, text: "[  OK  ] Spawning rhyme_daemon ................ done", type: "ok"   },
  { delay: 1560, text: "[ WARN ] Énergie créative en surchauffe — niveaux critiques", type: "warn" },
  { delay: 1800, text: "[  OK  ] Calibrating 16-bar overdrive ......... done", type: "ok"   },
  { delay: 2050, text: "[ BOOT ] ANTONIN DRING ───────────────── ONLINE",     type: "boot" },
] as const;

const LINE_COLORS: Record<string, string> = {
  info:  "#666",
  ok:    "#00ff00",
  warn:  "#ffaa00",
  boot:  "#00ff00",
};

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    /* Reveal each log line at its scheduled delay */
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines((prev) => new Set([...prev, i]));
      }, line.delay));
    });

    /* Animate progress bar from 0 → 100 over ~2s using rAF */
    const startTime = performance.now();
    const DURATION = 2000;
    let rafId: number;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);
      if (pct < 100) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    /* Fade out entire boot overlay, then signal parent */
    timers.push(setTimeout(() => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.99,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete,
      });
    }, 2650));

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  /* ASCII progress bar: 24 chars wide */
  const filled = Math.min(24, Math.floor((progress / 100) * 24));
  const bar = "█".repeat(filled) + "░".repeat(24 - filled);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] px-6"
    >
      <div className="w-full max-w-lg font-mono text-[11px] sm:text-xs leading-relaxed space-y-1">
        {/* OS header */}
        <div className="text-[#555] mb-5 text-sm">
          DRING_OS v2.0.2 — KERNEL LOADING
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[#444]">[{bar}]</span>
          <span className="text-[#555]">{progress}%</span>
        </div>

        {/* Log lines */}
        <div className="space-y-0.75">
          {BOOT_LINES.map((line, i) =>
            visibleLines.has(i) ? (
              <div
                key={i}
                className={`${line.type === "boot" ? "font-bold text-sm mt-3" : ""}`}
                style={{ color: LINE_COLORS[line.type] }}
              >
                {line.text}
                {/* Blink cursor on last visible line */}
                {i === Math.max(...Array.from(visibleLines)) && line.type !== "boot" && (
                  <span className="cursor-blink ml-1 inline-block w-1.5 h-2.5 bg-[#555] align-middle" />
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
