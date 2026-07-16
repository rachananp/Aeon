"use client";

const MAIN_PATH =
  "M-20,210 C180,150 260,270 440,210 C620,150 700,270 880,210 C1060,150 1140,270 1320,210 C1460,170 1540,230 1640,205";

const BRANCHES = [
  { d: "M240,220 C220,120 180,80 120,40", dur: "3.2s", delay: "0s" },
  { d: "M420,215 C440,300 500,340 560,380", dur: "3.6s", delay: "0.4s" },
  { d: "M620,213 C600,120 640,70 700,30", dur: "3s", delay: "0.9s" },
  { d: "M860,215 C880,300 940,330 1010,370", dur: "3.4s", delay: "0.2s" },
  { d: "M1080,212 C1060,120 1100,75 1170,35", dur: "3.1s", delay: "0.6s" },
  { d: "M1280,214 C1300,300 1360,330 1420,365", dur: "3.5s", delay: "1.1s" },
];

const NODES = [240, 620, 1080];

export default function Vascular() {
  return (
    <div className="relative w-full h-[420px]">
      <svg
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
        className="w-full h-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="bloodFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff2d4e" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#ff2d4e" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ff5470" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff2d4e" stopOpacity="0.15" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="capillaryFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#29f0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#29f0ff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* main artery */}
        <path
          d={MAIN_PATH}
          fill="none"
          stroke="url(#bloodFlow)"
          strokeWidth={4}
          strokeLinecap="round"
          className="animate-vessel-pulse"
        />
        <path
          d={MAIN_PATH}
          fill="none"
          stroke="#ff2d4e"
          strokeOpacity={0.12}
          strokeWidth={14}
        />

        {/* branching capillaries */}
        {BRANCHES.map((b, i) => (
          <g key={i}>
            <path
              d={b.d}
              fill="none"
              stroke="#29f0ff"
              strokeOpacity={0.35}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle r={3.2} fill="#29f0ff">
              <animateMotion
                dur={b.dur}
                begin={b.delay}
                repeatCount="indefinite"
                path={b.d}
              />
            </circle>
          </g>
        ))}

        {/* red blood cells flowing along the main artery */}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={i} r={5} fill="#ff5470">
            <animateMotion
              dur="4.5s"
              begin={`${i * 0.65}s`}
              repeatCount="indefinite"
              path={MAIN_PATH}
            />
          </circle>
        ))}

        {/* oxygen particles (smaller, cyan, slightly offset timing) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={`o-${i}`} r={2.4} fill="#c9fbff">
            <animateMotion
              dur="4.5s"
              begin={`${i * 0.9 + 0.3}s`}
              repeatCount="indefinite"
              path={MAIN_PATH}
            />
          </circle>
        ))}

        {/* heartbeat pulse-wave rings at key nodes */}
        {NODES.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={212}
            r={10}
            fill="none"
            stroke="#ff2d4e"
            strokeWidth={2}
            opacity={0}
          >
            <animate
              attributeName="r"
              values="8;46"
              dur="1.15s"
              begin={`${i * 0.38}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0"
              dur="1.15s"
              begin={`${i * 0.38}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}
