"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Vascular from "../Vascular";

const STATS = [
  { label: "Heart Rate", value: "72", unit: "BPM" },
  { label: "O2 Saturation", value: "98", unit: "%" },
  { label: "Flow Rate", value: "5.1", unit: "L/MIN" },
  { label: "Active Capillaries", value: "1,204", unit: "" },
];

export default function CirculatorySection() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!wrapRef.current || !svgWrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        svgWrapRef.current,
        { x: -60, scale: 0.96, opacity: 0.4 },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="circulatory"
      ref={wrapRef}
      className="relative py-28 md:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-4"
        >
          <p className="eyebrow mb-5 text-crimson!">
            Circulatory · Live Perfusion (Fictional Readout)
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-bone glow-crimson-text">
            BLOOD, TRACED
            <br />
            VESSEL TO VESSEL.
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-muted max-w-md font-body normal-case tracking-normal">
            No real sensor produced these numbers. In the world of Meridian-9,
            this is what a citizen&apos;s vascular telemetry would look like
            to the Vital Warden watching it.
          </p>
        </motion.div>
      </div>

      <div ref={svgWrapRef} className="relative z-10 -mt-6 md:-mt-10">
        <Vascular />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass glass-crimson rounded-xl px-5 py-4"
            >
              <p className="eyebrow text-[9px]! text-crimson! mb-2">
                {s.label}
              </p>
              <p className="font-data text-2xl text-bone">
                {s.value}
                <span className="text-xs text-muted ml-1">{s.unit}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
