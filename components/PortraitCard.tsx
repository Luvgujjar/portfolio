"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const MAX_TILT = 9; // degrees

type Props = {
  src: string;
  alt: string;
  /** Shown if the image file is missing. */
  monogram: string;
};

/**
 * The About portrait.
 *
 * Three layers of interaction, all driven straight to the DOM inside one rAF
 * loop so nothing here ever triggers a React render:
 *
 *  - it fades and un-blurs the first time it scrolls into view;
 *  - on a mouse it tilts toward the cursor and carries a spotlight that
 *    tracks the pointer;
 *  - on touch it tilts as it travels through the viewport, and responds
 *    directly to a finger dragged across it.
 *
 * The photo sits desaturated until it is "engaged" — hovered, touched, or
 * centred on screen — then resolves to full colour.
 */
export default function PortraitCard({ src, alt, monogram }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [broken, setBroken] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // A missing file often 404s before React has attached onError, so re-check
  // the element once on mount: a decoded image always reports a natural width.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setBroken(true);
  }, []);

  // Reveal on first entry, independent of the motion loop below.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const plate = plateRef.current;
    const glare = glareRef.current;
    if (!root || !plate || !glare || reduced) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Target values, chased by the loop.
    let tx = 0; // -1..1 horizontal
    let ty = 0; // -1..1 vertical
    let engage = 0; // 0..1 colour + lift
    let gx = 50; // spotlight %, x
    let gy = 50; // spotlight %, y

    const cur = { x: 0, y: 0, e: 0, gx: 50, gy: 50 };
    let raf = 0;
    let onScreen = true;

    const fromPoint = (clientX: number, clientY: number) => {
      const r = root.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width;
      const ny = (clientY - r.top) / r.height;
      tx = Math.min(Math.max(nx * 2 - 1, -1), 1);
      ty = Math.min(Math.max(ny * 2 - 1, -1), 1);
      gx = nx * 100;
      gy = ny * 100;
    };

    const onPointerMove = (e: PointerEvent) => {
      fromPoint(e.clientX, e.clientY);
      engage = 1;
    };
    const onPointerLeave = () => {
      tx = 0;
      ty = 0;
      gx = 50;
      gy = 50;
      engage = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      fromPoint(touch.clientX, touch.clientY);
      engage = 1;
    };
    const onTouchEnd = () => {
      engage = 0;
    };

    /**
     * Touch devices get motion without any input: the card leans according to
     * where it sits in the viewport, and lights up as it passes the middle.
     */
    const fromScroll = () => {
      const r = root.getBoundingClientRect();
      const centre = r.top + r.height / 2;
      const offset = (centre - window.innerHeight / 2) / (window.innerHeight / 2);
      ty = Math.min(Math.max(offset, -1), 1) * 0.65;
      tx = 0;
      engage = Math.max(0, 1 - Math.abs(offset) * 1.6);
      gx = 50;
      gy = 50 + offset * 22;
    };

    const frame = () => {
      cur.x += (tx - cur.x) * 0.09;
      cur.y += (ty - cur.y) * 0.09;
      cur.e += (engage - cur.e) * 0.07;
      cur.gx += (gx - cur.gx) * 0.12;
      cur.gy += (gy - cur.gy) * 0.12;

      plate.style.transform =
        `rotateX(${(-cur.y * MAX_TILT).toFixed(2)}deg) ` +
        `rotateY(${(cur.x * MAX_TILT).toFixed(2)}deg) ` +
        `translateZ(${(cur.e * 16).toFixed(2)}px)`;
      plate.style.filter = `saturate(${(0.28 + cur.e * 0.72).toFixed(3)}) contrast(${(1.06 - cur.e * 0.06).toFixed(3)})`;

      glare.style.opacity = (0.10 + cur.e * 0.34).toFixed(3);
      glare.style.background =
        `radial-gradient(38% 46% at ${cur.gx.toFixed(1)}% ${cur.gy.toFixed(1)}%, ` +
        `rgba(160,175,255,0.42), rgba(109,124,255,0.10) 45%, transparent 72%)`;

      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    if (fine) {
      root.addEventListener("pointermove", onPointerMove);
      root.addEventListener("pointerleave", onPointerLeave);
    } else {
      root.addEventListener("touchmove", onTouchMove, { passive: true });
      root.addEventListener("touchend", onTouchEnd);
      root.addEventListener("touchcancel", onTouchEnd);
      window.addEventListener("scroll", fromScroll, { passive: true });
      window.addEventListener("resize", fromScroll, { passive: true });
      fromScroll();
    }

    // Only animate while the card is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) play();
        else pause();
      },
      { rootMargin: "80px" },
    );
    io.observe(root);

    const onVisibility = () => {
      if (onScreen && !document.hidden) play();
      else pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", fromScroll);
      window.removeEventListener("resize", fromScroll);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="group relative select-none [perspective:1100px]"
      style={{
        opacity: revealed ? 1 : 0,
        filter: revealed ? "blur(0px)" : "blur(14px)",
        transform: revealed ? "none" : "translateY(24px) scale(0.97)",
        transition:
          "opacity 1s cubic-bezier(0.22,1,0.36,1), filter 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Soft bloom behind the card, brightest where the pointer is. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-accent/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />

      <div
        ref={plateRef}
        className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 [transform-style:preserve-3d] will-change-transform"
        style={{ aspectRatio: "2 / 3" }}
      >
        {broken ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_35%,#171b26,#0d0f13)]">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-line font-mono text-lg tracking-[0.2em] text-accent">
              {monogram}
            </span>
            <p className="px-6 text-center font-mono text-[10px] leading-relaxed tracking-wide text-faint">
              Add your photo at
              <br />
              public{src}
            </p>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- the file is
             user-supplied and may be absent, so we need the onError fallback
             that next/image does not expose. */
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onError={() => setBroken(true)}
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        )}

        {/* Pointer-tracked spotlight. */}
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ opacity: 0.1 }}
        />

        {/* Grounding gradient so the card sits on the dark page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent"
        />

        {/* Corner brackets, lifted off the photo in 3D. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 [transform:translateZ(30px)]"
        >
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ].map((pos) => (
            <span
              key={pos}
              className={`absolute h-5 w-5 border-accent/50 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-accent ${pos}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
