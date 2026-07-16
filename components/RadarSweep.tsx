"use client";

export default function RadarSweep({ color = "#29f0ff" }: { color?: string }) {
  return (
    <div className="relative w-28 h-28 rounded-full shrink-0">
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: `${color}33` }}
      />
      <div
        className="absolute inset-3 rounded-full border"
        style={{ borderColor: `${color}22` }}
      />
      <div
        className="absolute inset-[22px] rounded-full border"
        style={{ borderColor: `${color}22` }}
      />
      <div
        className="absolute inset-0 rounded-full animate-spin-slow"
        style={{
          background: `conic-gradient(from 0deg, ${color}00 0deg, ${color}00 300deg, ${color}55 340deg, ${color}aa 360deg)`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
    </div>
  );
}
