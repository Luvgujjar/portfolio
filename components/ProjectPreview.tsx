import type { Project } from "@/lib/data";

const bar = "rounded-full bg-line";

/**
 * An abstract, hand-drawn-in-CSS impression of each project's interface.
 * Purely decorative — it gives every card a distinct silhouette at a glance
 * without shipping screenshots that would go stale the moment a project ships
 * its next release.
 */
function Chat() {
  return (
    <div className="flex h-full gap-2 p-3">
      <div className="hidden w-1/3 flex-col gap-2 border-r border-line pr-2 sm:flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="h-4 w-4 shrink-0 rounded-full bg-ink-3" />
            <span className={`h-1.5 flex-1 ${bar}`} style={{ width: `${70 - i * 12}%` }} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5">
        <div className="h-2 w-1/2 rounded-full bg-ink-3" />
        <div className="h-2 w-2/3 rounded-full bg-ink-3" />
        <div className="ml-auto h-2 w-3/5 rounded-full bg-accent/45" />
        <div className="h-2 w-2/5 rounded-full bg-ink-3" />
        <div className="ml-auto h-2 w-1/2 rounded-full bg-accent/45" />
        <div className="mt-1.5 h-4 rounded-full border border-line" />
      </div>
    </div>
  );
}

function Dashboard() {
  const bars = [40, 66, 30, 84, 52, 72, 46];
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded border border-line p-1.5">
            <span className="block h-1 w-2/3 rounded-full bg-line" />
            <span className="mt-1.5 block h-2 w-1/2 rounded-full bg-paper/25" />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded border border-line p-2">
        {bars.map((v, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm ${i === 3 ? "bg-accent/70" : "bg-ink-3"}`}
            style={{ height: `${v}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Storefront() {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center justify-between">
        <span className="h-1.5 w-12 rounded-full bg-paper/30" />
        <span className="h-3 w-3 rounded-full border border-accent/50" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div
              className={`flex-1 rounded ${i === 1 ? "bg-accent/20" : "bg-ink-3"}`}
            />
            <span className={`h-1 w-full ${bar}`} />
            <span className={`h-1 w-2/3 ${bar}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Console() {
  return (
    <div className="flex h-full gap-2 p-3">
      <div className="flex w-8 shrink-0 flex-col gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-3 rounded ${i === 1 ? "bg-accent/45" : "bg-ink-3"}`}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between rounded border border-line px-2 py-1.5">
          <span className={`h-1 w-10 ${bar}`} />
          <span className="h-1 w-6 rounded-full bg-accent/50" />
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded border border-line px-2 py-1.5"
          >
            <span className={`h-1 ${bar}`} style={{ width: `${52 - i * 10}%` }} />
            <span className="h-1 w-4 rounded-full bg-ink-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

const VARIANTS = {
  chat: Chat,
  dashboard: Dashboard,
  storefront: Storefront,
  console: Console,
} as const;

export default function ProjectPreview({
  variant,
  label,
}: {
  variant: Project["preview"];
  label: string;
}) {
  const Body = VARIANTS[variant];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-lg border border-line bg-ink-2/70"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="ml-2 truncate font-mono text-[9px] tracking-wide text-faint">
          {label}
        </span>
      </div>
      <div className="h-36 sm:h-40">
        <Body />
      </div>
      {/* Sheen that sweeps across on card hover. */}
      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent,rgba(109,124,255,0.10)_45%,transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-[120%]" />
    </div>
  );
}
