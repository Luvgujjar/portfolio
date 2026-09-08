"use client";

import { useMemo, useRef } from "react";
import { grid, project, rotate, torusKnot } from "@/lib/geometry";
import { useSceneCanvas } from "./useSceneCanvas";

const FOV = 640;
const SEGMENTS = 340;

/**
 * A scroll-driven counterpart to the ambient scene: a wireframe torus knot
 * over a receding lattice, whose rotation and camera distance are a pure
 * function of how far this block has travelled through the viewport. It is
 * still while the page is still, so the motion always reads as a response to
 * the reader rather than as ambient decoration.
 */
export default function ScrollScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const knot = useMemo(() => torusKnot(SEGMENTS, 300, 92), []);
  const lattice = useMemo(() => grid(760, 14, 260), []);
  const smoothed = useRef(0);

  const canvasRef = useSceneCanvas(({ ctx, w, h, t }) => {
    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const span = rect.height + window.innerHeight;
    const raw = span > 0 ? (window.innerHeight - rect.top) / span : 0;
    const p = Math.min(Math.max(raw, 0), 1);

    // Ease toward the scroll value so flicks and trackpad momentum land as a
    // glide instead of a jump.
    smoothed.current += (p - smoothed.current) * 0.09;
    const s = smoothed.current;

    const cx = w / 2;
    const cy = h / 2;
    const depth = 780 - s * 300;

    // --- Receding lattice --------------------------------------------------
    const gx = 1.06 - s * 0.24;
    const gy = s * 1.5;
    ctx.lineWidth = 1;
    for (const [a, b] of lattice) {
      const p1 = project(rotate(a, gx, gy), cx, cy, FOV, depth + 220);
      const p2 = project(rotate(b, gx, gy), cx, cy, FOV, depth + 220);
      if (p1.scale <= 0 || p2.scale <= 0) continue;
      const alpha = Math.max((p1.scale + p2.scale) / 2 - 0.24, 0) * 0.30;
      ctx.strokeStyle = `rgba(124,136,178,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // --- Torus knot --------------------------------------------------------
    const kx = -0.5 + s * 2.1;
    const ky = s * 3.4;
    const kz = s * 1.2;
    const pts = knot.map((v) => project(rotate(v, kx, ky, kz), cx, cy, FOV, depth));

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      if (a.scale <= 0 || b.scale <= 0) continue;
      const d = (a.scale + b.scale) / 2;
      ctx.strokeStyle = `rgba(109,124,255,${Math.max((d - 0.34) * 1.85, 0.03).toFixed(3)})`;
      ctx.lineWidth = d > 0.55 ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // A single highlight travelling the knot — the one continuously moving
    // element, so the scene never looks frozen when the page is at rest.
    const head = pts[Math.floor(((t * 0.09) % 1) * pts.length)];
    if (head && head.scale > 0) {
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 34);
      glow.addColorStop(0, "rgba(150,165,255,0.55)");
      glow.addColorStop(1, "rgba(150,165,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 34, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      <div
        className="sticky top-0 w-full overflow-hidden [transform:translateZ(0)]"
        style={{ height: "100lvh" }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  );
}
