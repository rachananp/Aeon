"use client";

import { createContext, useContext, useEffect, useRef } from "react";

type CursorState = { x: number; y: number };

const CursorContext = createContext<React.MutableRefObject<CursorState> | null>(
  null
);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const cursor = useRef<CursorState>({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    function onLeave() {
      cursor.current.x = 0;
      cursor.current.y = 0;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <CursorContext.Provider value={cursor}>{children}</CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}
