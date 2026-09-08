import Reveal from "@/components/Reveal";
import Section from "./Section";
import { certifications, education, highlights } from "@/lib/data";

export default function Education() {
  return (
    <Section
      id="education"
      index="05"
      title="Education & credentials"
      lede="A CS degree with an AI minor, plus the courses and competitions that filled in the gaps."
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Education
            </h3>
          </Reveal>
          <div className="mt-6 space-y-px overflow-hidden rounded-xl border border-line bg-line">
            {education.map((edu, i) => (
              <Reveal key={edu.degree} delay={i * 70} className="bg-ink/90 sm:bg-ink/70">
                <div className="p-5 sm:backdrop-blur-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-[15px] font-medium text-paper">
                      {edu.degree}
                    </h4>
                    <span className="font-mono text-[11px] tracking-wide text-faint">
                      {edu.period}
                    </span>
                  </div>
                  {edu.detail && (
                    <p className="mt-1 text-xs text-accent">{edu.detail}</p>
                  )}
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {edu.school}
                  </p>
                  {edu.note && (
                    <p className="mt-2 font-mono text-[11px] text-faint">
                      {edu.note}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Certifications
            </h3>
          </Reveal>
          <ul className="mt-6 space-y-3">
            {certifications.map((cert, i) => (
              <Reveal key={cert} from="right" delay={i * 60} as="li">
                <span className="flex gap-3 text-[14px] leading-relaxed text-muted">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  {cert}
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-12">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Highlights
            </h3>
          </Reveal>
          <div className="mt-6 space-y-4">
            {highlights.map((h, i) => (
              <Reveal key={h.title} from="right" delay={i * 70}>
                <div className="rounded-lg border border-line bg-ink/90 p-4 sm:bg-ink/60 sm:backdrop-blur-sm">
                  <p className="text-[14px] font-medium text-paper">{h.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    {h.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
