"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const SPOTIFY_URL =
  "https://open.spotify.com/intl-fr/album/63zM7qNEK1jzui49ZEIlhq?si=GC6_zkWURmG4-jSmELVAsw";

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
  { date: "2026.11.12", venue: "MONTCUQ_SALLE_DES_FETES",   city: "MONTCUQ",       country: "FR", capacity: "247",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.11.15", venue: "BITCHE_STADE_MUNICIPAL",    city: "BITCHE",        country: "FR", capacity: "1 200",  status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.11.20", venue: "CONDOM_PALAIS_DES_ARTS",    city: "CONDOM",        country: "FR", capacity: "800",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.11.27", venue: "BEZONS_ESPACE_CULTUREL",    city: "BEZONS",        country: "FR", capacity: "650",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.12.04", venue: "ANUSSE_OPEN_AIR",           city: "ANUSSE",        country: "FR", capacity: "420",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.12.11", venue: "MONTETON_MAIRIE",           city: "MONTETON",      country: "FR", capacity: "300",    status: "pending",   ticket: "BILLETS_DISPO" },
  { date: "2026.12.18", venue: "SUCE_SUR_ERDRE_AUTOROUTE",  city: "SUCE_SUR_ERDRE",country: "FR", capacity: "500",    status: "pending",   ticket: "BILLETS_DISPO" },
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

/* ── Ticket dialog ── */
interface TicketDialogProps {
  event: Event;
  onClose: () => void;
}

function TicketDialog({ event, onClose }: TicketDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [loading,   setLoading]   = useState(false);

  async function handleDownload() {
    if (!firstName.trim() || !lastName.trim()) return;
    setLoading(true);

    try {
      /* Generate QR code as data URL */
      const qrDataUrl = await QRCode.toDataURL(SPOTIFY_URL, {
        margin: 1,
        width: 200,
        color: { dark: "#00ff00", light: "#050505" },
      });

      /* Build PDF */
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();

      /* Background */
      doc.setFillColor(5, 5, 5);
      doc.rect(0, 0, W, 297, "F");

      /* Top green bar */
      doc.setFillColor(0, 255, 0);
      doc.rect(0, 0, W, 2, "F");

      /* Artist name */
      doc.setFont("courier", "bold");
      doc.setTextColor(0, 255, 0);
      doc.setFontSize(32);
      doc.text("DRING", W / 2, 24, { align: "center" });

      /* Tour label */
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("[ LIVE_EVENTS.TOUR — 2026 ]", W / 2, 32, { align: "center" });

      /* Divider */
      doc.setDrawColor(30, 30, 30);
      doc.setLineWidth(0.3);
      doc.line(14, 38, W - 14, 38);

      /* Attendee */
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text("TITULAIRE DU BILLET", 14, 48);
      doc.setFontSize(18);
      doc.setTextColor(212, 212, 212);
      doc.setFont("courier", "bold");
      doc.text(`${firstName.toUpperCase()} ${lastName.toUpperCase()}`, 14, 57);

      /* Divider */
      doc.setDrawColor(30, 30, 30);
      doc.line(14, 62, W - 14, 62);

      /* Event details */
      const details: [string, string][] = [
        ["DATE",     event.date.replace(/\./g, " / ")],
        ["LIEU",     event.venue.replace(/_/g, " ")],
        ["VILLE",    event.city.replace(/_/g, " ")],
        ["PAYS",     event.country],
        ["CAPACITE", event.capacity + " places"],
        ["STATUT",   STATUS_LABEL[event.status]],
      ];

      let y = 74;
      details.forEach(([label, value]) => {
        doc.setFontSize(7);
        doc.setTextColor(130, 130, 130);
        doc.setFont("courier", "normal");
        doc.text(label, 14, y);
        doc.setFontSize(11);
        doc.setTextColor(200, 200, 200);
        doc.setFont("courier", "bold");
        doc.text(value, 14, y + 6);
        y += 16;
      });

      /* Divider before QR */
      doc.setDrawColor(30, 30, 30);
      doc.line(14, y + 2, W - 14, y + 2);

      /* QR code section */
      const qrY = y + 10;
      doc.addImage(qrDataUrl, "PNG", W / 2 - 22, qrY, 44, 44);

      doc.setFontSize(7);
      doc.setTextColor(130, 130, 130);
      doc.setFont("courier", "normal");
      doc.text("SCANNER POUR ECOUTER LE DERNIER ALBUM", W / 2, qrY + 50, { align: "center" });

      /* Bottom bar */
      doc.setFillColor(0, 255, 0);
      doc.rect(0, 295, W, 2, "F");

      /* Ticket ID */
      const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(ticketId, W / 2, 290, { align: "center" });

      doc.save(`DRING_TICKET_${event.city}_${firstName.toUpperCase()}_${lastName.toUpperCase()}.pdf`);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm font-mono"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          boxShadow: "0 0 40px rgba(0,255,0,0.08)",
        }}
      >
        {/* Dialog header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#080808]">
          <span className="text-[#00ff00] text-xs font-bold tracking-widest glow-green-sm">
            GEN_TICKET.sh
          </span>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#aaa] text-xs transition-colors cursor-pointer"
          >
            [✕]
          </button>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* Event recap */}
          <div className="text-[10px] space-y-0.5">
            <div><span className="text-[#777]">venue:</span> <span className="text-[#999]">{event.venue.replace(/_/g, " ")}</span></div>
            <div><span className="text-[#777]">date:</span>  <span className="text-[#999]">{event.date}</span></div>
            <div><span className="text-[#777]">city:</span>  <span className="text-[#999]">{event.city.replace(/_/g, " ")}</span></div>
          </div>

          <div className="border-t border-[#111]" />

          {/* Prompt label */}
          <div className="text-[10px] text-[#777]">
            <span className="text-[#00ff00]">$</span> enter attendee info:
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] text-[#666] mb-1 tracking-widest">PRÉNOM</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                className="w-full bg-[#050505] border border-[#2a2a2a] text-[#a0a0a0] text-xs px-3 py-2 outline-none focus:border-[#00ff00] transition-colors placeholder-[#444]"
                style={{ fontFamily: "inherit" }}
              />
            </div>
            <div>
              <label className="block text-[9px] text-[#666] mb-1 tracking-widest">NOM</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                className="w-full bg-[#050505] border border-[#2a2a2a] text-[#a0a0a0] text-xs px-3 py-2 outline-none focus:border-[#00ff00] transition-colors placeholder-[#444]"
                style={{ fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 text-[10px] py-2 border border-[#2a2a2a] text-[#666] hover:text-[#999] transition-colors cursor-pointer"
            >
              ANNULER
            </button>
            <button
              onClick={handleDownload}
              disabled={!firstName.trim() || !lastName.trim() || loading}
              className="flex-1 text-[10px] py-2 border border-[#00ff00] text-[#00ff00] font-bold tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              style={{
                boxShadow: firstName.trim() && lastName.trim() ? "0 0 12px rgba(0,255,0,0.15)" : "none",
              }}
            >
              {loading ? "GEN..." : "↓ DOWNLOAD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ── */
export default function LiveLogsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [inView,       setInView]       = useState(false);
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null);
  const [dialogEvent,  setDialogEvent]  = useState<Event | null>(null);

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
    <>
      {dialogEvent && (
        <TicketDialog
          event={dialogEvent}
          onClose={() => setDialogEvent(null)}
        />
      )}

      <section ref={sectionRef} id="live" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Shell breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-2 text-[#777]">
            <span className="text-[#00ff00]">$</span>
            <span>tail -f /var/log/live_events.log</span>
          </div>
          <div className="text-[#555] text-[10px] mb-10">
            [INFO] Monitoring live events stream... Press Ctrl+C to exit.
          </div>

          {/* Terminal log box */}
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
                    className="px-4 py-3 transition-all duration-200"
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
                      <span className="text-[#666] shrink-0">[{event.date}]</span>

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
                      <span className="text-[#888] font-bold flex-1 min-w-0 truncate sm:text-[#a0a0a0]">
                        {event.venue}
                      </span>

                      {/* Ticket status */}
                      <span className="text-[10px] shrink-0" style={{ color }}>
                        {event.ticket}
                      </span>

                      {/* Download button */}
                      <button
                        onClick={() => setDialogEvent(event)}
                        className="shrink-0 text-[9px] px-2 py-0.5 border border-[#2a2a2a] text-[#777] hover:text-[#00ff00] hover:border-[#00ff0033] transition-all duration-150 font-mono cursor-pointer"
                        title="Télécharger le billet PDF"
                      >
                        ↓ BILLET
                      </button>
                    </div>

                    {/* Expanded detail row on hover — height always reserved, no layout shift */}
                    <div
                      className="font-mono text-[9px] sm:text-[10px] flex flex-wrap gap-x-4 gap-y-0.5 mt-[5px]"
                      style={{
                        opacity:    hovered ? 1 : 0,
                        transition: "opacity 0.18s ease",
                        pointerEvents: hovered ? "auto" : "none",
                      }}
                    >
                      <span className="text-[#666]">city: <span className="text-[#888]">{event.city}</span></span>
                      <span className="text-[#666]">country: <span className="text-[#888]">{event.country}</span></span>
                      <span className="text-[#666]">capacity: <span className="text-[#888]">{event.capacity}</span></span>
                      <span className="text-[#555]">pid: <span className="text-[#666]">{1000 + i * 137}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-[#1a1a1a] bg-[#080808]">
              <span className="text-[9px] sm:text-[10px] text-[#666] font-mono">
                {EVENTS.length} events loaded ·&nbsp;
                <span className="text-[#777]">
                  {EVENTS.filter((e) => e.status === "success").length} SOLD_OUT
                </span>
                &nbsp;·&nbsp;
                <span className="text-[#777]">
                  {EVENTS.filter((e) => e.status !== "success").length} UPCOMING
                </span>
                &nbsp;· ^C to exit
              </span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
