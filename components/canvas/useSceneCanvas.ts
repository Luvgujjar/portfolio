"use client";

import { useEffect, useRef } from "react";

export type SceneFrame = {
  ctx: CanvasRenderingContext2D;
  /** CSS pixel dimensions (the context is already scaled for DPR). */
  w: number;
  h: number;
  /** Seconds since the scene mounted. Frozen when reduced motion is on. */
  t: number;
  /** Pointer position in the -1..1 range, eased. */
  px: number;
  py: number;
};

type Options = {
  /** Track the pointer for parallax. */
  pointer?: boolean;
  /** Render a single frame instead of animating, for reduced-motion users. */
  still?: boolean;
};

/**
 * Wires a canvas to a render callback: handles device-pixel-ratio sizing,
 * resize, eased pointer parallax, and pausing the loop whenever the canvas is
 * off-screen or the tab is hidden so the animation costs nothing when unseen.
 */
export function useSceneCanvas(
  draw: (frame: SceneFrame) => void,
  { pointer = false, still = false }: Options = {},
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);

  // Declared before the render loop below so the callback is refreshed first
  // on every commit; the loop itself only ever reads drawRef.current.
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced =
      still ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let start = 0;
    let onScreen = true;
    let target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const nextW = Math.max(rect.width, 1);
      const nextH = Math.max(rect.height, 1);

      // Mobile browsers grow and shrink the viewport as the URL bar hides,
      // firing a resize on almost every scroll frame. Reallocating the bitmap
      // blanks the canvas, so a run of those reads as a flicker. Width changes
      // are real layout changes; a height-only change under the size of a URL
      // bar is not, and the existing bitmap simply scales to cover it.
      const chromeShift = nextW === w && Math.abs(nextH - h) < 160;
      w = nextW;
      h = nextH;
      if (chromeShift) return;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) render(0);
    };

    const render = (time: number) => {
      if (!start) start = time;
      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      drawRef.current({
        ctx,
        w,
        h,
        t: reduced ? 0 : (time - start) / 1000,
        px: eased.x,
        py: eased.y,
      });
    };

    const loop = (time: number) => {
      render(time);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      // The next resumed frame would otherwise jump by the paused duration.
      start = 0;
    };
    const sync = () => {
      if (onScreen && !document.hidden) play();
      else pause();
    };

    const onPointer = (e: PointerEvent) => {
      target = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    document.addEventListener("visibilitychange", sync);
    if (pointer && !reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    sync();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [pointer, still]);

  return canvasRef;
}

/**
 * Progress of an element through the viewport, 0 as its top reaches the bottom
 * of the screen and 1 as its bottom leaves the top. Written to a ref rather
 * than state so scroll handling never triggers a React render.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const progress = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      const p = span > 0 ? (window.innerHeight - rect.top) / span : 0;
      progress.current = Math.min(Math.max(p, 0), 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}
