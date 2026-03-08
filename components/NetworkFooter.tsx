"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Music, Instagram, Youtube, Twitter, ExternalLink } from "lucide-react";

interface Social {
  platform:  string;
  handle:    string;
  followers: string;
  cmd:       string;
  color:     string;
  icon:      React.ReactNode;
}

const SOCIALS: Social[] = [
  {
    platform:  "spotify",
    handle:    "antonin-dring",
    followers: "847K streams",
    cmd:       "connect --platform spotify",
    color:     "#1db954",
    icon:      <Music size={14} />,
  },
  {
    platform:  "instagram",
    handle:    "@antonindring",
    followers: "234K followers",
    cmd:       "connect --platform instagram",
    color:     "#e1306c",
    icon:      <Instagram size={14} />,
  },
  {
    platform:  "youtube",
    handle:    "AntoninDring",
    followers: "1.2M abonnés",
    cmd:       "connect --platform youtube",
    color:     "#ff0000",
    icon:      <Youtube size={14} />,
  },
  {
    platform:  "tiktok",
    handle:    "@antonindring",
    followers: "3.1M fans",
    cmd:       "connect --platform tiktok",
    color:     "#69c9d0",
    /* Lucide doesn't have TikTok — using a styled letter */
    icon:      <span className="text-[14px] leading-none font-bold">♪</span>,
  },
  {
    platform:  "twitter",
    handle:    "@AntoninDring",
    followers: "156K abonnés",
    cmd:       "connect --platform twitter",
    color:     "#1da1f2",
    icon:      <Twitter size={14} />,
  },
];

export default function NetworkFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCmd, setActiveCmd] = useState<number | null>(null);

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
          start: "top 90%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="network"
      className="relative z-10 py-24 px-6 border-t border-[#111]"
    >
      <div className="max-w-3xl mx-auto space-y-16">

        {/* ── Network section ── */}
        <div>
          {/* Shell header */}
          <div className="flex items-center gap-2 text-xs mb-2 text-[#555]">
            <span className="text-[#00ff00]">$</span>
            <span>ssh antonin@network.dring.underground</span>
          </div>
          <div className="text-[#3a3a3a] text-[10px] mb-10 font-mono">
            Connected · underground_net v2.0 · type &apos;exit&apos; to disconnect
          </div>

          {/* Social commands */}
          <div className="space-y-0.5">
            {SOCIALS.map((social, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveCmd(i)}
                onMouseLeave={() => setActiveCmd(null)}
                className="bash-cmd group flex items-center gap-3 py-3 px-3 cursor-pointer rounded-sm"
              >
                {/* Prompt glyph */}
                <span className="text-[#00ff00] text-xs shrink-0 font-bold">~$</span>

                {/* Icon */}
                <span
                  className="shrink-0 transition-colors duration-200"
                  style={{ color: activeCmd === i ? social.color : "#444" }}
                >
                  {social.icon}
                </span>

                {/* Command text */}
                <span
                  className="bash-platform text-xs font-mono flex-1 min-w-0 transition-colors duration-150"
                  style={{ color: activeCmd === i ? "#a0a0a0" : "#666" }}
                >
                  {social.cmd}
                </span>

                {/* Handle (comment style) — hidden on very small screens */}
                <span
                  className="text-[10px] hidden sm:block transition-colors duration-150"
                  style={{ color: activeCmd === i ? social.color + "cc" : "#444" }}
                >
                  # {social.handle}
                </span>

                {/* Follower count */}
                <span
                  className="text-[10px] shrink-0 hidden md:block transition-colors duration-150"
                  style={{ color: activeCmd === i ? "#666" : "#3a3a3a" }}
                >
                  {social.followers}
                </span>

                {/* Arrow indicator */}
                <span
                  className="shrink-0 transition-all duration-200 text-[#00ff00] text-xs"
                  style={{
                    opacity:   activeCmd === i ? 1 : 0,
                    transform: activeCmd === i ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  <ExternalLink size={11} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Separator ── */}
        <div className="text-[#111] font-mono text-[10px] overflow-hidden whitespace-nowrap">
          {"─".repeat(80)}
        </div>

        {/* ── Bottom: branding + system info ── */}
        <div className="flex flex-wrap items-end justify-between gap-6">

          {/* Left: branding */}
          <div className="font-mono space-y-1">
            <div
              className="text-lg font-bold tracking-widest glow-green-sm"
              style={{ color: "#00ff00" }}
            >
              ANTONIN DRING
            </div>
            <div className="text-[10px] text-[#444]">
              © 2025 · TOUS DROITS RÉSERVÉS
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-[#333]">under</span>
              <span
                className="font-bold tracking-widest"
                style={{ color: "#8a2be2", textShadow: "0 0 8px rgba(138,43,226,0.4)" }}
              >
                MONGOLITÉ RECORDS
              </span>
            </div>
            <div className="text-[10px] text-[#333]">
              Made with &lt;/code&gt; &amp; flow in the underground
            </div>
          </div>

          {/* Right: fake sys info */}
          <div className="font-mono text-[9px] sm:text-[10px] text-[#3a3a3a] space-y-0.5 text-right">
            <div>[SYS] kernel: 6.12.0-underground</div>
            <div>[SYS] uptime: depuis le début</div>
            <div>
              [SYS] process: DRING.EXE&nbsp;
              <span style={{ color: "#00ff00" }}>RUNNING</span>
            </div>
            <div>[SYS] mem: 0KB free (all used for flow)</div>
          </div>
        </div>

        {/* Last shell prompt — suggests the page is still "live" */}
        <div className="flex items-center gap-1 text-xs text-[#333] pb-4">
          <span className="text-[#00ff00]">root@dring</span>
          <span className="text-[#444]">:~$</span>
          <span
            className="ml-1 inline-block w-2 h-3.5 bg-[#444] align-middle"
            style={{ animation: "cursor-blink 1s step-start infinite" }}
          />
        </div>

      </div>
    </footer>
  );
}
