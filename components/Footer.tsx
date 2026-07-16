export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-data text-[11px] tracking-[0.25em] text-muted uppercase">
          Aeon Vitae — Codewarta · Stellar Hack
        </p>
        <p className="font-data text-[11px] tracking-[0.2em] text-muted uppercase">
          Kavana P · Rachana N P · A Gourav
        </p>
      </div>
      <p className="max-w-7xl mx-auto px-6 md:px-10 mt-4 font-data text-[10px] tracking-[0.15em] text-muted/50 uppercase">
        Aeon Vitae, Meridian-9, the Continuum Accord and the Vital Warden
        are fictional — a speculative concept for Stellar Hack, not a real
        implant, medical device, or health claim.
      </p>
    </footer>
  );
}
