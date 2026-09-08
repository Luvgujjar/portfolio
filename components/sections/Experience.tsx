import Reveal from "@/components/Reveal";
import Section from "./Section";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      title="Experience"
      lede="Three industry roles across ERP tooling, travel-tech, and real-time systems — each one shipped to people who depended on it."
    >
      <ol className="relative max-w-3xl border-l border-line pl-6 sm:pl-10">
        {experience.map((job, i) => (
          <li key={job.company} className="relative pb-14 last:pb-0">
            {/* Node on the rail */}
            <span className="absolute -left-[25px] top-1.5 grid h-3 w-3 place-items-center sm:-left-[41px]">
              <span className="absolute h-3 w-3 rounded-full bg-ink" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>

            <Reveal from="left" delay={i * 80}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium tracking-tight text-paper sm:text-xl">
                  {job.role}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  {job.period}
                </span>
              </div>
              <p className="mt-1 text-sm text-accent">{job.company}</p>

              <ul className="mt-4 space-y-2.5">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-5 text-[14px] leading-relaxed text-muted"
                  >
                    <span className="absolute left-0 top-[0.62em] h-px w-2.5 bg-faint" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-faint"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
