"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const DNAHelix = dynamic(() => import("../DNAHelix"), { ssr: false });

const FEATURES = [
  {
    t: "Sequence-aware dosing",
    d: "In the story, interventions are weighted against a citizen's own genome before they ever reach the fictional bloodstream.",
  },
  {
    t: "Bioelectric feedback",
    d: "The helix reacts to live signal — every imagined correction leaves a trace in the strand.",
  },
  {
    t: "Continuous resequencing",
    d: "Drift patterns are re-checked against baseline genetics on every triage pass, per Continuum Accord protocol.",
  },
];

export default function GenomeSection() {
  return (
    <section
      id="genome"
      className="relative min-h-[100svh] flex items-center py-24 overflow-hidden"
    >
      <div className="absolute inset-0 lg:left-1/2 lg:w-1/2 opacity-90">
        <DNAHelix />
      </div>
      <div className="absolute inset-0 noise-vignette pointer-events-none opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow mb-5">Genome · Sequence Layer, Meridian-9 Registry</p>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-bone glow-cyan-text mb-6">
            THE HELIX
            <br />
            REACTS TO YOU.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted max-w-md font-body normal-case tracking-normal mb-10">
            Beneath every Drift Score sits a genome the fictional implant
            already knows. In this imagined 2091, the Continuum Accord keeps
            every citizen&apos;s strand live on the console — rotating,
            listening, adjusting its glow as your cursor stands in for the
            body it represents.
          </p>
          <div className="space-y-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex gap-4 border-l border-cyan/20 pl-4"
              >
                <div>
                  <h3 className="font-data text-[12px] tracking-[0.15em] uppercase text-cyan mb-1">
                    {f.t}
                  </h3>
                  <p className="text-[13.5px] text-muted leading-relaxed font-body normal-case tracking-normal">
                    {f.d}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}
