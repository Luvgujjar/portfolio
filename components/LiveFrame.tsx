"use client";

import { useEffect, useRef, useState } from "react";

/** Width the site is rendered at before being scaled into the card. */
const RENDER_W = 1280;
const RENDER_H = 800;
/** If the site has not loaded by now, keep showing the mock underneath. */
const LOAD_TIMEOUT = 9000;

/**
 * Embeds the real deployed site into a project card.
 *
 * The page is rendered at a desktop width and scaled down, so the preview
 * shows the layout visitors actually see rather than a squeezed mobile view.
 * It mounts only once the card reaches the viewport, never takes pointer
 * events, and fades in over the mock thumbnail — so a slow, dead, or
 * frame-blocking URL simply leaves the mock in place.
 */
export default function LiveFrame({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0);

  // Mount the iframe only when the card comes into view.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMounted(true);
        io.disconnect();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fit the fixed-size render into whatever width the card ended up.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / RENDER_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Give up waiting after a while and leave the mock showing.
  useEffect(() => {
    if (!mounted || loaded) return;
    const timer = setTimeout(() => setLoaded(false), LOAD_TIMEOUT);
    return () => clearTimeout(timer);
  }, [mounted, loaded]);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {mounted && scale > 0 && (
        <iframe
          src={href}
          title={`Live preview of ${title}`}
          loading="lazy"
          tabIndex={-1}
          referrerPolicy="no-referrer"
          // Cross-origin, so allow-same-origin here grants the embedded site
          // its own storage rather than access to this page. Withholding
          // allow-top-navigation stops it from navigating the portfolio away.
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setLoaded(true)}
          style={{
            width: RENDER_W,
            height: RENDER_H,
            transform: `scale(${scale}) translateZ(0)`,
            transformOrigin: "top left",
            opacity: loaded ? 1 : 0,
          }}
          // Held back at rest so a bright site does not fight the dark page,
          // then resolved to full colour when the card is hovered — the same
          // treatment the About portrait gets. Touch screens have no hover to
          // resolve it, so they get the site at full strength from the start.
          className="absolute left-0 top-0 border-0 transition-[opacity,filter] duration-700 sm:brightness-[0.72] sm:saturate-[0.8] sm:group-hover:brightness-100 sm:group-hover:saturate-100"
        />
      )}
    </div>
  );
}
