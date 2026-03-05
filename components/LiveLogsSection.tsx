"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Event {
  date:     string;
  venue:    string;
  city:     string;
  country:  string;
  capacity: string;
  status:   "success" | "pending" | "scheduled";
  ticket:   string;
}

const EVENTS: Event[] = [
  { date: "2026.11.12", venue: "MONTCUQ_SALLE_DES_FETES",   city: "MONTCUQ",    country: "FR", capacity: "247",    status: "success",   ticket: "SOLDOUT"       },
  { date: "2026.11.15", venue: "BITCHE_STADE_MUNICIPAL",    city: "BITCHE",     country: "FR", capacity: "1 200",  status: "success",   ticket: "SOLDOUT"       },
  { date: "2026.11.20", venue: "CONDOM_PALAIS_DES_ARTS",    city: "CONDOM",     country: "FR", capacity: "800",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.11.27", venue: "BEZONS_ESPACE_CULTUREL",    city: "BEZONS",     country: "FR", capacity: "650",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.12.04", venue: "ANUSSE_OPEN_AIR",           city: "ANUSSE",     country: "FR", capacity: "420",    status: "scheduled", ticket: "SOON"          },
  { date: "2026.12.11", venue: "MONTETON_MAIRIE",           city: "LONGUEFUYE", country: "FR", capacity: "300",    status: "scheduled", ticket: "SOON"          },
  { date: "2026.12.18", venue: "SUCE_SUR_ERDRE_AUTOROUTE",  city: "PRISSÉ",     country: "FR", capacity: "500",    status: "scheduled", ticket: "SOON"          },
];

const STATUS_LABEL: Record<Event["status"], string> = {
  success:   "SUCCESS",
  pending:   "PENDING",
  scheduled: "SCHEDULED",
};

const STATUS_COLOR: Record<Event["status"], string> = {
  success:   "#00ff00",
  pending:   "#ffaa00",
  scheduled: "#6688aa",
};

export default function LiveLogsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [inView,       setInView]       = useState(false);
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null);

  /* Stagger log lines in one-by-one once section enters viewport */
  useEffect(() => {
    if (!inView) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= EVENTS.length) clearInterval(interval);
    }, 140);
    return () => clearInterval(interval);
  }, [inView]);

  /* GSAP scroll-triggered section reveal */
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
          onEnter: () => setInView(true),
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="live" className="relative z-10 py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Shell breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-2 text-[#555]">
          <span className="text-[#00ff00]">$</span>
          <span>tail -f /var/log/live_events.log</span>
        </div>
        <div className="text-[#3a3a3a] text-[10px] mb-10">
          [INFO] Monitoring live events stream... Press Ctrl+C to exit.
        </div>

        {/* ── Terminal log box ── */}
        <div className="terminal-box">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a1a] bg-[#080808]">
            <span className="text-[#00ff00] text-xs font-bold tracking-[0.2em] glow-green-sm">
              LIVE_EVENTS.LOG
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_6px_#00ff00]" />
              <span className="text-[10px] text-[#444]">STREAMING</span>
            </div>
          </div>

          {/* Log lines */}
          <div className="divide-y divide-[#0d0d0d]">
            {EVENTS.map((event, i) => {
              const visible = i < visibleCount;
              const hovered = hoveredIdx === i;
              const color   = STATUS_COLOR[event.status];

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="px-4 py-3 cursor-pointer transition-all duration-200"
                  style={{
                    opacity:    visible ? 1 : 0,
                    transform:  visible ? "translateX(0)" : "translateX(-12px)",
                    transition: `opacity 0.3s ease ${i * 0.04}s, transform 0.3s ease ${i * 0.04}s, background-color 0.15s ease`,
                    backgroundColor: hovered ? "rgba(0,255,0,0.03)" : "transparent",
                  }}
                >
                  {/* Main log line */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] sm:text-xs">

                    {/* Timestamp */}
                    <span className="text-[#555] shrink-0">[{event.date}]</span>

                    {/* Status badge */}
                    <span
                      className="text-[9px] sm:text-[10px] px-1.5 py-0 border font-bold shrink-0"
                      style={{
                        color,
                        borderColor: color + "55",
                        boxShadow:   hovered ? `0 0 8px ${color}33` : "none",
                      }}
                    >
                      {STATUS_LABEL[event.status]}
                    </span>

                    {/* Venue name */}
                    <span
                      className="text-[#888] font-bold flex-1 min-w-0 truncate sm:text-[#a0a0a0]"
                    >
                      {event.venue}
                    </span>

                    {/* Ticket status */}
                    <span
                      className="text-[10px] shrink-0 ml-auto"
                      style={{ color }}
                    >
                      {event.ticket}
                    </span>
                  </div>

                  {/* Expanded detail row on hover */}
                  <div
                    className="font-mono text-[9px] sm:text-[10px] text-[#444] flex flex-wrap gap-x-4 gap-y-0.5 overflow-hidden"
                    style={{
                      maxHeight: hovered ? "40px" : "0px",
                      marginTop: hovered ? "5px"  : "0px",
                      transition: "max-height 0.2s ease, margin-top 0.2s ease",
                    }}
                  >
                    <span>city: <span className="text-[#666]">{event.city}</span></span>
                    <span>country: <span className="text-[#666]">{event.country}</span></span>
                    <span>capacity: <span className="text-[#666]">{event.capacity}</span></span>
                    <span>pid: <span className="text-[#444]">{1000 + i * 137}</span></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[#1a1a1a] bg-[#080808]">
            <span className="text-[9px] sm:text-[10px] text-[#3a3a3a] font-mono">
              {EVENTS.length} events loaded ·&nbsp;
              <span className="text-[#444]">
                {EVENTS.filter((e) => e.status === "success").length} SOLD_OUT
              </span>
              &nbsp;·&nbsp;
              <span className="text-[#444]">
                {EVENTS.filter((e) => e.status !== "success").length} UPCOMING
              </span>
              &nbsp;· ^C to exit
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
