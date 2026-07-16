"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import ECGPulse from "../ECGPulse";

const SkeletonHologram = dynamic(() => import("../SkeletonHologram"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="anatomy"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <SkeletonHologram />
      </div>
      <div className="absolute inset-0 noise-vignette pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <p className="eyebrow mb-5">
            Meridian-9 · Year 2091 · Continuum Accord Charter No. 12
          </p>
          <h1 className="font-display text-[clamp(2.1rem,5.2vw,4rem)] leading-[1.04] text-bone glow-cyan-text">
            EVERY HEARTBEAT,
            <br />
            MODELED LIVE.
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-md font-body normal-case tracking-normal">
            In the arcology of Meridian-9, no citizen&apos;s body goes
            unwatched. AEON VITAE renders the body as the Continuum Accord
            claims it actually behaves — bone, blood and genome streamed from
            a subdermal BioThread mesh, watched by an autonomous Vital
            Warden before the first symptom is ever felt.
          </p>
          <p className="mt-4 text-[11px] leading-relaxed text-muted/70 max-w-md font-data tracking-[0.08em] uppercase">
            A work of speculative fiction · no such implant exists
          </p>
          <div className="mt-9 flex items-center gap-4">
            <a
              href="#genome"
              className="font-data text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 rounded-full bg-cyan text-void font-bold hover:brightness-110 transition"
            >
              Enter the System
            </a>
            <a
              href="#console"
              className="font-data text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 rounded-full glass text-bone hover:text-cyan transition"
            >
              View Console
            </a>
          </div>
        </motion.div>
      </div>

      {/* floating vitals HUD chips */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden lg:flex flex-col gap-4 absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-64 z-10"
      >
        <div className="glass rounded-xl px-4 py-3 animate-drift">
          <div className="flex items-center justify-between mb-1">
            <span className="eyebrow text-[9px]!">Heart Rate</span>
            <span className="font-data text-cyan text-sm">72 BPM</span>
          </div>
          <ECGPulse />
        </div>
        <div
          className="glass rounded-xl px-4 py-3 animate-drift"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[9px]!">O2 Saturation</span>
            <span className="font-data text-cyan text-sm">98%</span>
          </div>
        </div>
        <div
          className="glass glass-crimson rounded-xl px-4 py-3 animate-drift"
          style={{ animationDelay: "2.4s" }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[9px]! text-crimson!">
              Drift Score
            </span>
            <span className="font-data text-crimson text-sm">12 / 100</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted">
        <span className="font-data text-[10px] tracking-[0.3em]">SCROLL</span>
        <span className="w-px h-8 bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}
