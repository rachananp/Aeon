"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!ref.current) return;
      ref.current.style.setProperty("--gx", `${e.clientX}px`);
      ref.current.style.setProperty("--gy", `${e.clientY}px`);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-10 mix-blend-screen"
      style={
        {
          background:
            "radial-gradient(600px circle at var(--gx, 50%) var(--gy, 50%), rgba(41,240,255,0.06), transparent 65%)",
        } as React.CSSProperties
      }
      aria-hidden
    />
  );
}
