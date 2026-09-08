"use client";

import { useMemo } from "react";
import {
  icosahedron,
  project,
  rotate,
  seeded,
  type Vec3,
} from "@/lib/geometry";
import { useSceneCanvas } from "./useSceneCanvas";

const FOV = 620;
const DEPTH = 700;
const COUNT = 130;
const LINK_DISTANCE = 132;

/**
 * The always-on backdrop: a slowly tumbling constellation of points with a
 * wireframe icosahedron suspended inside it. Fixed to the viewport so it sits
 * behind the whole page, and nudged by the pointer for a little parallax.
 */
export default function AmbientScene() {
  const { field, solid } = useMemo(() => {
    const rand = seeded(20260908);
    const pts: (Vec3 & { seed: number })[] = [];
    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x: (rand() - 0.5) * 1500,
        y: (rand() - 0.5) * 1000,
        z: (rand() - 0.5) * 1100,
        seed: rand() * Math.PI * 2,
      });
    }
    return { field: pts, solid: icosahedron(230) };
  }, []);

  const ref = useSceneCanvas(
    ({ ctx, w, h, t, px, py }) => {
      const cx = w / 2 + px * 42;
      const cy = h / 2 + py * 30;

      // --- Point field -----------------------------------------------------
      const ry = t * 0.045;
      const rx = Math.sin(t * 0.09) * 0.16 + py * 0.1;

      const flat = field.map((p) => {
        const bob = Math.sin(t * 0.5 + p.seed) * 16;
        const r = rotate({ x: p.x, y: p.y + bob, z: p.z }, rx, ry);
        return project(r, cx, cy, FOV, DEPTH);
      });

      // Link nearby points into a constellation. O(n²) at n=130 is trivial and
      // keeps the mesh coherent as the field turns.
      ctx.lineWidth = 1;
      for (let i = 0; i < flat.length; i++) {
        const a = flat[i];
        if (a.scale <= 0) continue;
        for (let j = i + 1; j < flat.length; j++) {
          const b = flat[j];
          if (b.scale <= 0) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DISTANCE) continue;
          const fade = (1 - d / LINK_DISTANCE) * 0.16 * Math.min(a.scale, b.scale);
          ctx.strokeStyle = `rgba(140,152,196,${fade.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of flat) {
        if (p.scale <= 0) continue;
        const r = Math.max(p.scale * 1.7, 0.4);
        ctx.fillStyle = `rgba(196,205,235,${(p.scale * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Wireframe icosahedron ------------------------------------------
      const sx = t * 0.13 + py * 0.25;
      const sy = t * 0.17 + px * 0.35;
      const verts = solid.points.map((p) =>
        project(rotate(p, sx, sy, t * 0.05), cx, cy, FOV, DEPTH * 0.62),
      );

      for (const [a, b] of solid.edges) {
        const p1 = verts[a];
        const p2 = verts[b];
        // Edges facing away from the camera fade out, which is what sells the
        // wireframe as a solid rather than a flat tangle of lines.
        const depth = (p1.scale + p2.scale) / 2;
        const alpha = Math.max((depth - 0.55) * 0.85, 0.03);
        ctx.strokeStyle = `rgba(109,124,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = depth > 0.78 ? 1.15 : 0.7;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      for (const v of verts) {
        ctx.fillStyle = `rgba(160,175,255,${Math.max((v.scale - 0.6) * 1.1, 0.05).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(v.x, v.y, Math.max(v.scale * 2.1, 0.7), 0, Math.PI * 2);
        ctx.fill();
      }
    },
    { pointer: true },
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [transform:translateZ(0)]"
    >
      {/* 100lvh is the viewport at its largest, so the canvas keeps one size
          while a mobile URL bar slides in and out. */}
      <canvas
        ref={ref}
        className="w-full opacity-[0.85] [will-change:transform]"
        style={{ height: "100lvh" }}
      />
      {/* Soft vignette + a warm-cool wash keeps the wireframes from reading as
          a screensaver and pushes contrast back onto the text. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(109,124,255,0.10),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(8,9,11,0.72)_100%)]" />
    </div>
  );
}
