import Reveal from "@/components/Reveal";
import { profile } from "@/lib/data";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-6xl px-5 py-28 sm:px-8 sm:py-40"
    >
      <Reveal className="text-center">
        <span className="font-mono text-xs tracking-[0.2em] text-accent">06</span>
        <h2 className="mt-6 text-balance text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-paper">
          Let&rsquo;s build something
          <br />
          <span className="text-faint">worth shipping.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-balance text-[15px] leading-relaxed text-muted">
          Open to full-stack and frontend roles. The fastest way to reach me is
          email — I answer everything.
        </p>
      </Reveal>

      <Reveal delay={140} className="mt-12">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            {profile.email}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
            className="inline-flex w-full items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm text-paper transition-colors hover:border-accent/60 hover:bg-accent/10 sm:w-auto"
          >
            {profile.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
