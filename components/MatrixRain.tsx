"use client";

import { useEffect, useRef } from "react";

/* Mix of half-width katakana + Latin + digits for authentic matrix feel */
const CHARS =
  "ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ" +
  "0123456789ABCDEF>_</>{}[]()#$%&@!?";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    let drops: number[] = [];
    let rafId: number;

    /* Resize canvas and reinitialize drop positions */
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      /* Start drops at random negative positions so they stagger on entry */
      drops = Array.from(
        { length: cols },
        () => Math.random() * -(canvas.height / FONT_SIZE) * 1.5
      );
    };

    setup();

    const draw = () => {
      /* Fade previous frame — creates the "digital trail" effect */
      ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * FONT_SIZE;
        if (y < 0) {
          drops[i]++;
          continue;
        }

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        /* Head of column is near-white, body varies in green brightness */
        const isHead = Math.random() > 0.93;

        if (isHead) {
          ctx.fillStyle = "rgba(210, 255, 210, 0.95)";
        } else {
          const brightness = Math.floor(160 + Math.random() * 95);
          const alpha = 0.15 + Math.random() * 0.6;
          ctx.fillStyle = `rgba(0, ${brightness}, 0, ${alpha})`;
        }

        ctx.fillText(char, i * FONT_SIZE, y);

        drops[i]++;

        /* Randomly reset column to top for continuous rain */
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.974) {
          drops[i] = Math.random() * -50;
        }
      }
    };

    /* Throttle to ~15 fps — keeps it subtle and performant */
    let lastTime = 0;
    const INTERVAL = 1000 / 15;

    const loop = (ts: number) => {
      rafId = requestAnimationFrame(loop);
      if (ts - lastTime >= INTERVAL) {
        draw();
        lastTime = ts;
      }
    };

    rafId = requestAnimationFrame(loop);

    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.13 }}
      aria-hidden="true"
    />
  );
}
