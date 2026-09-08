"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The spine: a smooth curve that snakes down the length of the page and draws
 * itself as you scroll, with a glowing head riding the leading edge.
 *
 * The path is generated in real pixel coordinates (rather than a stretched
 * viewBox) so the stroke keeps an even weight and the head marker can be
 * placed with getPointAtLength without any coordinate conversion.
 */
export default function ScrollPath() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [d, setD] = useState("");

  // Regenerate the curve whenever the content box changes size.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let lastW = 0;
    let lastH = 0;

    const build = () => {
      const rect = host.getBoundingClientRect();
      const w = Math.max(rect.width, 1);
      const h = Math.max(rect.height, 1);

      // A mobile URL bar sliding away changes the page height by a few dozen
      // pixels on almost every scroll frame; rebuilding the path for that
      // resets the dash animation and reads as a stutter.
      if (w === lastW && Math.abs(h - lastH) < 160) return;
      lastW = w;
      lastH = h;
      setBox({ w, h });

      // On a phone there is no room to snake through the middle of the text,
      // so the line becomes a rail hugging the left gutter. On wider screens
      // it runs down the centre behind the content.
      const narrow = w < 640;
      const cx = narrow ? 9 : w / 2;
      const amp = narrow ? 5 : Math.min(w * 0.26, 230);

      // The curve is laid out on a fixed wavelength rather than a fraction of
      // the page, so a long page snakes more times instead of stretching one
      // lazy diagonal over several thousand pixels.
      const wavelength = narrow ? 560 : 1150;
      const step = wavelength / 6;
      const bends = Math.max(6, Math.ceil(h / step));
      const anchors: [number, number][] = [];
      for (let i = 0; i <= bends; i++) {
        const y = (h * i) / bends;
        const wave = Math.sin((y / wavelength) * Math.PI * 2);
        // Pinch the ends in so the curve enters and leaves near the centre.
        const taper = Math.min(y / 420, (h - y) / 420, 1);
        anchors.push([cx + wave * amp * taper, y]);
      }

      // Catmull-Rom through the anchors, emitted as cubic beziers.
      let path = `M ${anchors[0][0].toFixed(2)} ${anchors[0][1].toFixed(2)}`;
      for (let i = 0; i < anchors.length - 1; i++) {
        const p0 = anchors[i === 0 ? 0 : i - 1];
        const p1 = anchors[i];
        const p2 = anchors[i + 1];
        const p3 = anchors[i + 2 >= anchors.length ? anchors.length - 1 : i + 2];
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
      }
      setD(path);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  // Drive the dash offset and the head marker from scroll position.
  useEffect(() => {
    const host = hostRef.current;
    const path = pathRef.current;
    if (!host || !path || !d) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;

    if (reduced) {
      path.style.strokeDashoffset = "0";
      if (headRef.current) headRef.current.style.opacity = "0";
      return;
    }

    let raf = 0;
    let eased = 0;
    let target = 0;
    let running = true;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      // Complete the draw a little before the section ends so the head has
      // somewhere to settle rather than vanishing at the very last pixel.
      const span = Math.max(rect.height - window.innerHeight * 0.35, 1);
      target = Math.min(Math.max((window.innerHeight * 0.65 - rect.top) / span, 0), 1);
    };

    const frame = () => {
      if (!running) return;
      eased += (target - eased) * 0.1;
      path.style.strokeDashoffset = `${total * (1 - eased)}`;

      const head = headRef.current;
      if (head) {
        if (eased > 0.004 && eased < 0.999) {
          const pt = path.getPointAtLength(total * eased);
          head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          head.style.opacity = "1";
        } else {
          head.style.opacity = "0";
        }
      }
      raf = requestAnimationFrame(frame);
    };

    measure();
    eased = target;
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [d]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[5]"
    >
      <svg
        width={box.w}
        height={box.h}
        viewBox={`0 0 ${box.w} ${box.h}`}
        fill="none"
        className="mask-fade-y absolute inset-0"
      >
        <defs>
          <linearGradient id="spine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d7cff" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#8f9bff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#6d7cff" stopOpacity="0.22" />
          </linearGradient>
          <filter id="spine-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The untravelled remainder of the route, permanently faint. */}
        <path d={d} stroke="#171b26" strokeWidth="1.25" strokeLinecap="round" />

        {/* The travelled portion, revealed by the dash offset. */}
        <path
          ref={pathRef}
          d={d}
          stroke="url(#spine)"
          strokeWidth="1.6"
          strokeLinecap="round"
          filter="url(#spine-glow)"
        />

        <g ref={headRef} style={{ opacity: 0, transition: "opacity 240ms" }}>
          <g transform={box.w < 640 ? "scale(0.72)" : undefined}>
            <circle r="16" fill="#6d7cff" opacity="0.10" />
            <circle r="7" fill="#6d7cff" opacity="0.22" />
            <circle r="3" fill="#c3caff" />
          </g>
        </g>
      </svg>
    </div>
  );
}
