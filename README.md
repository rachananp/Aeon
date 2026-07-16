# AEON VITAE — Continuum Health

A cinematic biomedical interface for **Stellar Hack Round 2** (Team Codewarta).
Built with Next.js (App Router), Tailwind CSS v4, React Three Fiber / Three.js,
Framer Motion, GSAP + ScrollTrigger, and Lenis smooth scroll.

## What's actually in here

This is a real, working, deployable site — not a mockup. Four sections:

1. **Anatomy (Hero)** — a procedural holographic skeleton (Three.js, built from
   primitives, not a downloaded model) with idle breathing motion on the
   ribcage, cursor-controlled rotation, glowing bones that highlight on hover,
   and a scan sweep that passes every 5 seconds. Bloom post-processing for the
   glow.
2. **Genome** — a rotating double-helix DNA structure that tilts toward the
   cursor and emits ambient neon particles (drei `Sparkles`).
3. **Circulatory** — an animated SVG vascular system: a main artery with
   branching capillaries, blood cells and oxygen particles continuously
   flowing left to right, heartbeat-synced pulse rings, and a GSAP
   ScrollTrigger-driven parallax reveal as you scroll into the section.
4. **Console** — a glassmorphic HUD dashboard (triage queue, ECG trace, radar
   anomaly scan, intervention log) that mirrors your Round 1 Universe/Mission
   Card content, so the whole submission reads as one continuous story.

Plus: a cursor-reactive ambient particle field (cells/atoms) behind
everything, a cursor-follow spotlight glow, Lenis smooth scrolling wired to
GSAP's ticker, and full keyboard/reduced-motion support.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Deploy (what Round 2 needs: public repo + live link)

Push this folder to a public GitHub repo, then import it at
[vercel.com/new](https://vercel.com/new) — zero config needed, it's a
standard Next.js app. That gives you both submission requirements in about
two minutes.

## Where to customize fast

- **Copy & stats**: `components/sections/*.tsx` — every headline, stat, and
  queue entry is plain text/props, easy to swap.
- **Palette**: `app/globals.css` — the `:root` block (`--cyan`, `--crimson`,
  `--void`) drives the entire theme.
- **Skeleton pose / bone list**: `components/SkeletonHologram.tsx` — the
  `JOINTS` and `BONES` objects at the top.
- **DNA helix density/speed**: `components/DNAHelix.tsx` — `TURNS`,
  `POINTS_PER_TURN`, rotation speed in `HelixRig`'s `useFrame`.
- **Vessel paths**: `components/Vascular.tsx` — `MAIN_PATH` and `BRANCHES`
  are plain SVG path strings.

## Notes for the judges' interview

- Fonts are system/monospace stacks on purpose — no external font requests,
  so it never flashes unstyled text or breaks on a flaky venue wifi.
- The two Three.js canvases (skeleton + DNA) are lazy-loaded client-side only
  (`next/dynamic`, `ssr: false`) so the initial page load stays fast.
- `prefers-reduced-motion` is respected globally in `globals.css`.
