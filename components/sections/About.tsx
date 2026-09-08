import Reveal from "@/components/Reveal";
import Section from "./Section";
import PortraitCard from "@/components/PortraitCard";
import { alsoKnown, languages, profile } from "@/lib/data";

const monogram = profile.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2);

export default function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
        <Reveal
          from="left"
          className="mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:sticky lg:top-28 lg:max-w-none lg:self-start"
        >
          <PortraitCard
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            monogram={monogram}
          />
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-faint lg:text-left">
            {profile.location} · {profile.roles[1]}
          </p>
        </Reveal>

        <div>
          <Reveal from="right">
            <p className="text-balance text-lg leading-relaxed text-paper/90 sm:text-xl">
              {profile.summary}
            </p>
            <p className="mt-6 text-[15px] leading-relaxed text-muted">
              I like owning a feature all the way through — schema, endpoint,
              state, and the last few pixels — and I am at my best on teams that
              ship complete things rather than half-finished ones. Quick learner,
              dependable, and happiest when something I built is in front of real
              users.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {alsoKnown.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-ink-2/50 px-3 py-1.5 text-xs text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <dl className="mt-10 divide-y divide-line rounded-xl border border-line bg-ink/90 sm:bg-ink/50 sm:backdrop-blur-sm sm:grid sm:grid-cols-2 sm:divide-y-0">
              {[
                { k: "Based in", v: profile.location },
                { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
                {
                  k: "Phone",
                  v: profile.phone,
                  href: `tel:${profile.phone.replace(/\s/g, "")}`,
                },
                { k: "Languages", v: languages.join(" · ") },
              ].map((row, i) => (
                <div
                  key={row.k}
                  className={`flex flex-col gap-1 px-5 py-4 ${
                    i % 2 === 1 ? "sm:border-l sm:border-line" : ""
                  } ${i > 1 ? "sm:border-t sm:border-line" : ""}`}
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    {row.k}
                  </dt>
                  <dd className="text-sm text-paper">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="transition-colors hover:text-accent"
                      >
                        {row.v}
                      </a>
                    ) : (
                      row.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
