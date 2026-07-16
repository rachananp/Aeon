"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ECGPulse from "../ECGPulse";
import RadarSweep from "../RadarSweep";
import HUDPanel from "../HUDPanel";

const QUEUE = [
  { id: "04471", score: 92, tone: "crimson" as const },
  { id: "08823", score: 78, tone: "amber" as const },
  { id: "01192", score: 61, tone: "cyan" as const },
  { id: "07740", score: 44, tone: "cyan" as const },
];

const toneColor: Record<string, string> = {
  crimson: "#ff2d4e",
  amber: "#fbbf24",
  cyan: "#29f0ff",
};

type ActionKey = "confirm" | "adjust" | "reverse";

type CitizenDossier = {
  reasoning: string;
  confidence: number;
  biosignals: { label: string; weight: number; value: string }[];
  alternatives: { action: string; note: string }[];
  recommended: ActionKey;
  outcomes: Record<ActionKey, { risk: "Low" | "Moderate" | "High"; text: string }>;
};

const DOSSIER: Record<string, CitizenDossier> = {
  "04471": {
    reasoning:
      "Drift accelerated past threshold after three consecutive cortisol spikes coinciding with a sustained arrhythmic window. The Warden weights the arrhythmia over the cortisol reading, since rhythm irregularity has historically preceded cascade failure in this citizen's profile.",
    confidence: 94,
    biosignals: [
      { label: "Cardiac rhythm irregularity", weight: 88, value: "±14ms QT variance" },
      { label: "Cortisol slope", weight: 71, value: "+2.3σ / 6min" },
      { label: "Peripheral O2", weight: 42, value: "96.1%" },
      { label: "Sleep-debt index", weight: 35, value: "3.2 nights" },
    ],
    alternatives: [
      { action: "Hold and re-poll in 90s", note: "Rejected — arrhythmia window matched a known cascade precursor; latency risk too high." },
      { action: "Sedative micro-dose", note: "Rejected — would mask the rhythm signal needed to confirm cascade onset." },
    ],
    recommended: "confirm",
    outcomes: {
      confirm: { risk: "Low", text: "Synthetic adrenaline delivered within 4s; rhythm modeled to stabilize inside 2 cycles." },
      adjust: { risk: "Moderate", text: "Half-dose correction; stabilizes rhythm but leaves cortisol slope unaddressed for ~6min." },
      reverse: { risk: "High", text: "No intervention; model projects cascade threshold breach within 90s." },
    },
  },
  "08823": {
    reasoning:
      "Moderate drift driven by a slow metabolic dip rather than an acute event. The Warden flags it for review instead of auto-correcting because the pattern resembles a benign circadian trough seen in this citizen's last 11 cycles.",
    confidence: 77,
    biosignals: [
      { label: "Metabolic rate", weight: 66, value: "-8% baseline" },
      { label: "Core temperature", weight: 54, value: "36.4°C" },
      { label: "Glucose stability", weight: 48, value: "±0.4 mmol/L" },
      { label: "Circadian phase match", weight: 61, value: "Trough, cycle-consistent" },
    ],
    alternatives: [
      { action: "Auto-correct metabolic rate", note: "Rejected — high similarity to prior benign troughs made intervention low-value." },
      { action: "Escalate to human reviewer now", note: "Rejected — confidence in benign pattern was high enough to queue instead of interrupt." },
    ],
    recommended: "adjust",
    outcomes: {
      confirm: { risk: "Moderate", text: "Full correction risks overshooting a naturally recovering trough." },
      adjust: { risk: "Low", text: "Light glucose stabilization only; model expects natural recovery within 40min." },
      reverse: { risk: "Low", text: "No action; 82% of comparable troughs in this citizen resolved unassisted." },
    },
  },
  "01192": {
    reasoning:
      "Drift sits mid-band with no single dominant signal — a diffuse pattern the Warden associates with early-stage dehydration rather than a specific organ event.",
    confidence: 58,
    biosignals: [
      { label: "Hydration index", weight: 57, value: "-11% baseline" },
      { label: "Renal filtration rate", weight: 39, value: "Nominal" },
      { label: "Blood pressure trend", weight: 33, value: "Slight downward" },
      { label: "Electrolyte balance", weight: 28, value: "Within range" },
    ],
    alternatives: [
      { action: "Confirm active correction", note: "Rejected — no single signal crossed the confirm threshold; premature intervention flagged." },
      { action: "Dismiss, no action", note: "Rejected — diffuse pattern still warrants a lightweight nudge per charter guidance." },
    ],
    recommended: "adjust",
    outcomes: {
      confirm: { risk: "Moderate", text: "Would trigger fluid correction the model isn't confident is needed yet." },
      adjust: { risk: "Low", text: "Hydration reminder + electrolyte micro-dose; re-poll in 20min." },
      reverse: { risk: "Moderate", text: "No action; drift likely climbs into confirm-band within the hour." },
    },
  },
  "07740": {
    reasoning:
      "Low drift, isolated to a single transient signal that self-corrected before this poll completed. Logged for the audit trail rather than acted on.",
    confidence: 81,
    biosignals: [
      { label: "Respiratory variance", weight: 22, value: "Transient, resolved" },
      { label: "Cardiac rhythm irregularity", weight: 9, value: "Nominal" },
      { label: "Cortisol slope", weight: 6, value: "Flat" },
    ],
    alternatives: [
      { action: "Confirm active correction", note: "Rejected — signal resolved before threshold was reached." },
      { action: "Escalate to human reviewer", note: "Rejected — no persistent anomaly to justify interrupt." },
    ],
    recommended: "reverse",
    outcomes: {
      confirm: { risk: "Moderate", text: "Would intervene on a signal that already self-resolved." },
      adjust: { risk: "Low", text: "Unnecessary given resolution, but logged as a low-cost fallback." },
      reverse: { risk: "Low", text: "No action taken; entry kept open on the audit trail for 24h." },
    },
  },
};

const actionLabel: Record<ActionKey, string> = {
  confirm: "Confirm",
  adjust: "Adjust",
  reverse: "Reverse",
};

const riskColor: Record<string, string> = {
  Low: "#29f0ff",
  Moderate: "#fbbf24",
  High: "#ff2d4e",
};

export default function ConsoleSection() {
  const [selected, setSelected] = useState(QUEUE[0].id);
  const active = QUEUE.find((q) => q.id === selected) ?? QUEUE[0];
  const dossier = DOSSIER[active.id];

  return (
    <section
      id="console"
      className="relative py-28 md:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 noise-vignette pointer-events-none opacity-70" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-14"
        >
          <p className="eyebrow mb-5">
            Meridian-9 · Continuum Accord Command Console
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-bone glow-cyan-text">
            THE WARDEN&apos;S
            <br />
            VIEW.
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-muted max-w-md font-body normal-case tracking-normal">
            This is the console the story&apos;s Vital Warden watches
            around the clock — every citizen in the arcology reduced to a
            Drift Score, ranked, and queued for review.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <HUDPanel className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow text-[10px]!">Triage Queue · Auto-Ranked</p>
              <span className="flex items-center gap-1.5 font-data text-[10px] text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="space-y-2.5">
              {QUEUE.map((q) => {
                const isSelected = q.id === selected;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelected(q.id)}
                    aria-pressed={isSelected}
                    className={`w-full flex items-center gap-4 rounded-lg bg-white/[0.02] border px-4 py-3 text-left transition-colors cursor-pointer hover:bg-white/[0.05] ${
                      isSelected
                        ? "border-white/[0.18]"
                        : "border-white/[0.05]"
                    }`}
                    style={
                      isSelected
                        ? { boxShadow: `0 0 0 1px ${toneColor[q.tone]}55, 0 0 24px -6px ${toneColor[q.tone]}66` }
                        : undefined
                    }
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{
                        background: toneColor[q.tone],
                        boxShadow: `0 0 8px ${toneColor[q.tone]}`,
                      }}
                    />
                    <span className="font-data text-[13px] text-bone w-24">
                      Citizen {q.id}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${q.score}%`,
                          background: toneColor[q.tone],
                        }}
                      />
                    </div>
                    <span
                      className="font-data text-[12px] w-16 text-right"
                      style={{ color: toneColor[q.tone] }}
                    >
                      Drift {q.score}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-muted font-body normal-case tracking-normal">
              Select a citizen to open the Warden&apos;s reasoning trace below.
            </p>
          </HUDPanel>

          <HUDPanel delay={0.1}>
            <p className="eyebrow text-[10px]! mb-3">Cardiac Trace</p>
            <ECGPulse />
            <p className="font-data text-3xl text-bone mt-2">
              72<span className="text-xs text-muted ml-1">BPM</span>
            </p>
          </HUDPanel>

          <HUDPanel variant="crimson" delay={0.15}>
            <p className="eyebrow text-[10px]! text-crimson! mb-3">
              Anomaly Scan
            </p>
            <div className="flex items-center gap-5">
              <RadarSweep color="#ff2d4e" />
              <div>
                <p className="font-data text-3xl text-bone">3</p>
                <p className="text-[11px] text-muted font-body normal-case tracking-normal">
                  active anomalies flagged for review
                </p>
              </div>
            </div>
          </HUDPanel>

          <HUDPanel delay={0.2}>
            <p className="eyebrow text-[10px]! mb-3">System Explainability</p>
            <p className="text-[13.5px] text-muted leading-relaxed font-body normal-case tracking-normal">
              In-world, every autonomous correction ships with the raw
              signal that triggered it — the Continuum Accord&apos;s charter
              claims no black-box intervention reaches a citizen&apos;s body
              without a reviewable trace. Whether the Warden is telling the
              truth is a question the story leaves open.
            </p>
          </HUDPanel>

          <HUDPanel delay={0.25} className="lg:col-span-2">
            <p className="eyebrow text-[10px]! mb-4">Intervention Log</p>
            <div className="grid grid-cols-3 gap-4 font-data text-[12px]">
              {[
                ["02:14:08", "Synthetic adrenaline", "Confirmed"],
                ["02:11:52", "Cardiac rhythm correction", "Confirmed"],
                ["02:09:37", "Organ regulation hold", "Reversed"],
              ].map((row, i) => (
                <div key={i} className="contents">
                  <span className="text-muted">{row[0]}</span>
                  <span className="text-bone">{row[1]}</span>
                  <span
                    className={
                      row[2] === "Reversed" ? "text-crimson" : "text-cyan"
                    }
                  >
                    {row[2]}
                  </span>
                </div>
              ))}
            </div>
          </HUDPanel>

          <HUDPanel delay={0.3} className="lg:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <p className="eyebrow text-[10px]!">
                Citizen Deep-Dive · Explainable AI
              </p>
              <span className="flex items-center gap-1.5 font-data text-[10px] text-muted">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: toneColor[active.tone],
                    boxShadow: `0 0 8px ${toneColor[active.tone]}`,
                  }}
                />
                Citizen {active.id} · Drift {active.score}
              </span>
            </div>
            <p className="text-[12px] text-muted mb-6 font-body normal-case tracking-normal">
              A fictional readout of the Warden&apos;s reasoning trace — the
              charter&apos;s promise that no correction reaches a citizen
              without a reviewable explanation.
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="eyebrow text-[9px]!">Decision Reasoning</p>
                    <span className="font-data text-[11px] text-bone">
                      {dossier.confidence}
                      <span className="text-muted">% confidence</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${dossier.confidence}%`,
                        background: toneColor[active.tone],
                      }}
                    />
                  </div>
                  <p className="text-[13px] leading-relaxed text-bone/90 font-body normal-case tracking-normal mb-6">
                    {dossier.reasoning}
                  </p>

                  <p className="eyebrow text-[9px]! mb-3">
                    Contributing Biosignals
                  </p>
                  <div className="space-y-2.5 mb-6">
                    {dossier.biosignals.map((b) => (
                      <div key={b.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] text-bone/90 font-body normal-case tracking-normal">
                            {b.label}
                          </span>
                          <span className="font-data text-[10px] text-muted shrink-0 ml-3">
                            {b.value}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${b.weight}%`,
                              background: toneColor[active.tone],
                              opacity: 0.5 + b.weight / 200,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="eyebrow text-[9px]! mb-3">
                    Alternative Actions Considered
                  </p>
                  <div className="space-y-2">
                    {dossier.alternatives.map((a) => (
                      <div
                        key={a.action}
                        className="rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2.5"
                      >
                        <p className="font-data text-[11px] text-bone/80 mb-0.5">
                          {a.action}
                        </p>
                        <p className="text-[11.5px] text-muted font-body normal-case tracking-normal">
                          {a.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-[9px]! mb-3">
                    Predicted Outcomes
                  </p>
                  <div className="space-y-3">
                    {(Object.keys(dossier.outcomes) as ActionKey[]).map(
                      (key) => {
                        const outcome = dossier.outcomes[key];
                        const isRecommended = key === dossier.recommended;
                        return (
                          <div
                            key={key}
                            className={`rounded-lg border px-4 py-3 ${
                              isRecommended
                                ? "bg-white/[0.04]"
                                : "bg-white/[0.02] border-white/[0.05]"
                            }`}
                            style={
                              isRecommended
                                ? {
                                    borderColor: `${toneColor[active.tone]}55`,
                                    boxShadow: `0 0 20px -8px ${toneColor[active.tone]}66`,
                                  }
                                : undefined
                            }
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="flex items-center gap-2">
                                <span className="font-data text-[12px] text-bone">
                                  {actionLabel[key]}
                                </span>
                                {isRecommended && (
                                  <span
                                    className="font-data text-[9px] px-1.5 py-0.5 rounded"
                                    style={{
                                      color: toneColor[active.tone],
                                      background: `${toneColor[active.tone]}18`,
                                    }}
                                  >
                                    WARDEN&apos;S PICK
                                  </span>
                                )}
                              </span>
                              <span
                                className="font-data text-[10px]"
                                style={{ color: riskColor[outcome.risk] }}
                              >
                                {outcome.risk} risk
                              </span>
                            </div>
                            <p className="text-[12px] leading-relaxed text-muted font-body normal-case tracking-normal">
                              {outcome.text}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </HUDPanel>
        </div>
      </div>
    </section>
  );
}
