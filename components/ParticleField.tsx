"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "./CursorProvider";

type Particle = {
  x: number;
  y: number;
  z: number; // depth 0.2 - 1 -> controls size/speed/parallax
  vx: number;
  vy: number;
  r: number;
  kind: "cell" | "atom" | "spark";
  hue: "cyan" | "crimson";
  phase: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursor = useCursor();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let scrollY = 0;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      const count = Math.min(90, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }).map(() => {
        const kind: Particle["kind"] =
          Math.random() < 0.55 ? "cell" : Math.random() < 0.8 ? "atom" : "spark";
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.25 + Math.random() * 0.75,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: kind === "spark" ? 1 + Math.random() * 1.5 : 2 + Math.random() * 5,
          kind,
          hue: Math.random() < 0.78 ? "cyan" : "crimson",
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    function onScroll() {
      scrollY = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const cx = cursor.current.x * width * 0.5;
      const cy = cursor.current.y * height * 0.5;

      for (const p of particles) {
        // gentle drift
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // parallax with scroll (deeper = slower)
        const parallaxY = (scrollY * (1 - p.z) * 0.04) % height;

        // wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // cursor repel (subtle, depth-scaled)
        const dx = p.x - (width / 2 + cx);
        const dy = p.y - (height / 2 + cy);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.max(0, 1 - dist / 260) * 0.6 * p.z;
        const px = p.x + (dx / dist) * force * 18 - parallaxY * 0;
        const py = p.y + (dy / dist) * force * 18;

        const flicker = reduceMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(t * 0.001 + p.phase);
        const color = p.hue === "cyan" ? "41,240,255" : "255,45,78";
        const alpha = (0.12 + 0.18 * p.z) * flicker;

        ctx!.beginPath();
        const grad = ctx!.createRadialGradient(
          px,
          py,
          0,
          px,
          py,
          p.r * (p.kind === "spark" ? 4 : 3)
        );
        grad.addColorStop(0, `rgba(${color},${alpha})`);
        grad.addColorStop(1, `rgba(${color},0)`);
        ctx!.fillStyle = grad;
        ctx!.arc(px, py, p.r * (p.kind === "spark" ? 4 : 3), 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${color},${Math.min(1, alpha * 2.2)})`;
        ctx!.arc(px, py, p.r * 0.35, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", () => {
      resize();
      init();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [cursor]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden
    />
  );
}
