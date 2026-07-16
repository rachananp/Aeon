"use client";

const LINKS = [
  { href: "#anatomy", label: "Anatomy" },
  { href: "#genome", label: "Genome" },
  { href: "#circulatory", label: "Circulatory" },
  { href: "#console", label: "Console" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-10 py-5">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan" />
        </span>
        <span className="font-data text-[13px] tracking-[0.35em] text-bone">
          AEON&nbsp;VITAE
        </span>
        <span className="hidden sm:inline font-data text-[9px] tracking-[0.2em] text-muted/60 uppercase ml-1">
          Meridian-9 · 2091 · Fiction
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="font-data text-[11px] tracking-[0.2em] text-muted hover:text-cyan transition-colors uppercase"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <a
        href="#console"
        className="font-data text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded-full glass glow-cyan-ring text-cyan hover:text-bone transition-colors"
      >
        Enter Console
      </a>
    </header>
  );
}
