import { navLinks, profile } from "@/lib/data";

export default function Footer() {
  const links = profile.socials.filter((s) => s.href);

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-paper">{profile.name}</p>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-faint">
              {profile.roles[1]} · {profile.location}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-muted transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
            {links.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted transition-colors hover:text-paper"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-8 font-mono text-[10px] tracking-wide text-faint">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
