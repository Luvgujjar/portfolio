import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type Props = {
  id: string;
  index: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/** Shared section chrome: numbered label, heading, rule, then content. */
export default function Section({
  id,
  index,
  title,
  lede,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32 ${className}`}
    >
      <Reveal className="mb-12 sm:mb-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.2em] text-accent">
            {index}
          </span>
          <span className="hairline h-px flex-1" />
        </div>
        <h2 className="mt-5 text-3xl font-medium tracking-tight text-paper sm:text-4xl">
          {title}
        </h2>
        {lede && (
          <p className="mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-muted">
            {lede}
          </p>
        )}
      </Reveal>
      {children}
    </section>
  );
}
