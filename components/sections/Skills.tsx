import Reveal from "@/components/Reveal";
import Section from "./Section";
import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      title="Skills & toolkit"
      lede="What I reach for, grouped by where it sits in the stack."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal
            key={group.title}
            from="scale"
            delay={i * 70}
            className="bg-ink/90 sm:bg-ink/70 sm:backdrop-blur-sm"
          >
            <div className="h-full p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-paper"
                  >
                    <span className="h-px w-3 bg-line transition-all duration-300 group-hover:w-5 group-hover:bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
