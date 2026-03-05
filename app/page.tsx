"use client";

import { useState } from "react";
import MatrixRain         from "@/components/MatrixRain";
import BootSequence       from "@/components/BootSequence";
import HeroSection        from "@/components/HeroSection";
import LatestDropSection  from "@/components/LatestDropSection";
import LiveLogsSection    from "@/components/LiveLogsSection";
import NetworkFooter      from "@/components/NetworkFooter";

/* ─── Section divider — pure terminal aesthetics ─── */
function SectionDivider({ label }: { label: string }) {
  const dashes = 4;
  const padded = `${"─".repeat(dashes)} ${label} ${"─".repeat(dashes)}`;
  return (
    <div className="px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-[10px] text-[#151515] font-mono py-1 overflow-hidden">
          {padded}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  /* Controls whether the boot sequence overlay is shown */
  const [booted, setBooted] = useState(false);

  return (
    <>
      {/* ── Fixed ambient layers (always present) ── */}
      <MatrixRain />
      <div className="scanlines"      aria-hidden="true" />
      <div className="crt-vignette"   aria-hidden="true" />
      <div className="noise-overlay"  aria-hidden="true" />

      {/* ── Boot sequence overlay ──
          Renders on top of everything, then fades out and unmounts.
          onComplete is fired after the GSAP fade-out completes. */}
      {!booted && (
        <BootSequence onComplete={() => setBooted(true)} />
      )}

      {/* ── Fixed minimal nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2
                   bg-[rgba(5,5,5,0.92)] border-b border-[#0e0e0e] backdrop-blur-sm"
        style={{ display: booted ? "flex" : "none" }}
      >
        <span
          className="text-xs font-bold tracking-[0.25em] glow-green-sm"
          style={{ color: "#00ff00" }}
        >
          DRING.EXE
        </span>

        <div className="hidden sm:flex items-center gap-6 text-[10px] text-[#444]">
          {[
            { label: "/releases", href: "#releases" },
            { label: "/live",     href: "#live"     },
            { label: "/network",  href: "#network"  },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="hover:text-[#00ff00] transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>

        <span className="text-[10px] text-[#2a2a2a]">v2.0.2</span>
      </nav>

      {/* ── Main content — fades in once boot sequence completes ── */}
      <main
        className="relative"
        style={{
          opacity:       booted ? 1 : 0,
          transition:    "opacity 0.8s ease-in-out",
          pointerEvents: booted ? "auto" : "none",
        }}
      >
        <HeroSection />

        <SectionDivider label="LATEST_RELEASE" />
        <LatestDropSection />

        <SectionDivider label="LIVE_EVENTS" />
        <LiveLogsSection />

        <NetworkFooter />
      </main>
    </>
  );
}
