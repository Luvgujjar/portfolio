import Reveal from "@/components/Reveal";
import Section from "./Section";
import ProjectPreview from "@/components/ProjectPreview";
import ScrollScene from "@/components/canvas/ScrollScene";
import { projects } from "@/lib/data";

function hostname(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "preview";
  }
}

export default function Projects() {
  return (
    <div className="relative">
      {/* Scroll-driven wireframe, anchored to this block only. */}
      <ScrollScene className="opacity-70" />

      <Section
        id="projects"
        index="03"
        title="Selected projects"
        lede="Four builds that between them cover the whole surface I work on — realtime sync, REST APIs and data modelling, commerce state, and dashboards people run a business on."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => {
            const live = Boolean(project.href);
            const Card = live ? "a" : "div";

            return (
              <Reveal key={project.slug} from="scale" delay={i * 90}>
                <Card
                  {...(live
                    ? {
                        href: project.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className={`group flex h-full flex-col rounded-2xl border border-line bg-ink/95 p-4 sm:bg-ink/80 sm:backdrop-blur-sm transition-all duration-500 sm:p-5 ${
                    live
                      ? "hover:-translate-y-1 hover:border-accent/40 hover:bg-ink-2/90"
                      : ""
                  }`}
                >
                  <ProjectPreview
                    variant={project.preview}
                    label={live ? hostname(project.href) : "localhost:3000"}
                    href={live ? project.href : undefined}
                    title={project.title}
                    poster={`/previews/${project.slug}.jpg`}
                  />

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium tracking-tight text-paper">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                        {project.subtitle} · {project.year}
                      </p>
                    </div>
                    <span
                      className={`mt-1 shrink-0 text-sm transition-transform duration-300 ${
                        live
                          ? "text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          : "text-faint"
                      }`}
                    >
                      {live ? "↗" : "—"}
                    </span>
                  </div>

                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">
                    {project.blurb}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-line pt-4">
                    {live ? (
                      <span className="inline-flex items-center gap-2 text-xs text-accent">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        Open live demo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs text-faint">
                        <span className="h-1 w-1 rounded-full bg-faint" />
                        Live link coming soon
                      </span>
                    )}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
