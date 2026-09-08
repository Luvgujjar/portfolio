import Reveal from "@/components/Reveal";
import RoleCycler from "@/components/RoleCycler";
import { profile, stats } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[92svh] w-full max-w-6xl flex-col justify-center px-5 pb-24 pt-36 sm:px-8 sm:pb-32 sm:pt-44"
    >
      <Reveal delay={40}>
        <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-ink-2/90 px-3.5 py-1.5 sm:bg-ink-2/60 sm:backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent [animation:pulse-ring_2.6s_ease-out_infinite]" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted">
            {profile.location.toUpperCase()} · OPEN TO WORK
          </span>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <h1 className="mt-8 text-balance text-[clamp(2.6rem,8vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.03em] text-paper">
          {profile.name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span className="text-faint">{profile.name.split(" ").slice(2).join(" ")}</span>
        </h1>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-7 flex items-center gap-3">
          <span className="h-px w-8 bg-accent/60" />
          <RoleCycler roles={profile.roles} />
        </div>
      </Reveal>

      <Reveal delay={280}>
        <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
          {profile.tagline}
        </p>
      </Reveal>

      <Reveal delay={360}>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            View selected work
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-paper transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            {profile.email}
          </a>
        </div>
      </Reveal>

      <Reveal delay={460} className="mt-20 sm:mt-28">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink/90 px-5 py-6 sm:bg-ink/70 sm:backdrop-blur-sm">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                {s.label}
              </dt>
              <dd className="mt-2 text-2xl font-medium tracking-tight text-paper sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
