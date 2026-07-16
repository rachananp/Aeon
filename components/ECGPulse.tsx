"use client";

const PATH =
  "M0,30 L40,30 L52,30 L58,8 L66,52 L74,18 L82,30 L100,30 L140,30 L152,30 L158,8 L166,52 L174,18 L182,30 L220,30 L260,30 L272,30 L278,8 L286,52 L294,18 L302,30 L340,30";

export default function ECGPulse({ color = "#29f0ff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 60" className="w-full h-14" preserveAspectRatio="none" aria-hidden>
      <path
        d={PATH}
        fill="none"
        stroke={color}
        strokeOpacity={0.18}
        strokeWidth={2}
      />
      <path
        d={PATH}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="90 550"
        strokeDashoffset="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="640"
          to="0"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
