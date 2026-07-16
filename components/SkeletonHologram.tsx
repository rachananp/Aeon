"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useCursor } from "./CursorProvider";

const CYAN = "#29f0ff";
const CRIMSON = "#ff2d4e";

type Vec3 = [number, number, number];

// ---------------------------------------------------------------------------
// Joints: a full-body landmark set (spine segments, clavicles, wrists,
// fingers, ankles, heel/toe, jaw) instead of a coarse stick-figure skeleton.
// ---------------------------------------------------------------------------
const JOINTS: Record<string, Vec3> = {
  skull: [0, 3.32, 0],
  jaw: [0, 3.13, 0.08],
  neck: [0, 2.98, 0],

  clavicleL: [-0.3, 2.6, 0.04],
  clavicleR: [0.3, 2.6, 0.04],
  chest: [0, 2.55, 0],
  spineUpper: [0, 2.3, -0.01],
  spineMid: [0, 2.08, 0],
  spineLower: [0, 1.82, 0],
  pelvis: [0, 1.58, 0],

  shoulderL: [-0.56, 2.55, 0],
  shoulderR: [0.56, 2.55, 0],
  elbowL: [-0.78, 1.86, 0.12],
  elbowR: [0.78, 1.86, 0.12],
  wristL: [-0.83, 1.42, 0.16],
  wristR: [0.83, 1.42, 0.16],
  handL: [-0.86, 1.16, 0.18],
  handR: [0.86, 1.16, 0.18],

  fingerL1: [-0.95, 1.02, 0.19],
  fingerL2: [-0.87, 0.99, 0.23],
  fingerL3: [-0.78, 1.02, 0.2],
  fingerR1: [0.95, 1.02, 0.19],
  fingerR2: [0.87, 0.99, 0.23],
  fingerR3: [0.78, 1.02, 0.2],

  hipL: [-0.27, 1.52, 0],
  hipR: [0.27, 1.52, 0],
  kneeL: [-0.32, 0.78, 0.06],
  kneeR: [0.32, 0.78, 0.06],
  ankleL: [-0.335, 0.32, 0.14],
  ankleR: [0.335, 0.32, 0.14],
  heelL: [-0.34, 0.02, 0.04],
  heelR: [0.34, 0.02, 0.04],
  toeL: [-0.34, 0.01, 0.36],
  toeR: [0.34, 0.01, 0.36],
};

// [jointA, jointB, radius] — radius tapers by bone type so the rig reads as
// anatomy (thick femurs/spine, thin fingers/ribs) rather than uniform rods.
const BONES: [string, string, number][] = [
  ["skull", "jaw", 0.02],
  ["skull", "neck", 0.032],
  ["neck", "chest", 0.036],

  ["chest", "clavicleL", 0.024],
  ["chest", "clavicleR", 0.024],
  ["clavicleL", "shoulderL", 0.026],
  ["clavicleR", "shoulderR", 0.026],

  ["chest", "spineUpper", 0.04],
  ["spineUpper", "spineMid", 0.038],
  ["spineMid", "spineLower", 0.036],
  ["spineLower", "pelvis", 0.034],

  ["shoulderL", "elbowL", 0.03],
  ["shoulderR", "elbowR", 0.03],
  ["elbowL", "wristL", 0.026],
  ["elbowR", "wristR", 0.026],
  ["wristL", "handL", 0.02],
  ["wristR", "handR", 0.02],
  ["handL", "fingerL1", 0.011],
  ["handL", "fingerL2", 0.011],
  ["handL", "fingerL3", 0.011],
  ["handR", "fingerR1", 0.011],
  ["handR", "fingerR2", 0.011],
  ["handR", "fingerR3", 0.011],

  ["pelvis", "hipL", 0.042],
  ["pelvis", "hipR", 0.042],
  ["hipL", "kneeL", 0.05],
  ["hipR", "kneeR", 0.05],
  ["kneeL", "ankleL", 0.038],
  ["kneeR", "ankleR", 0.038],
  ["ankleL", "heelL", 0.022],
  ["ankleR", "heelR", 0.022],
  ["heelL", "toeL", 0.02],
  ["heelR", "toeR", 0.02],
];

const JOINT_SIZE: Record<string, number> = {
  skull: 0.26,
  jaw: 0.045,
  spineUpper: 0.05,
  spineMid: 0.05,
  spineLower: 0.05,
  pelvis: 0.075,
  hipL: 0.055,
  hipR: 0.055,
  fingerL1: 0.026,
  fingerL2: 0.026,
  fingerL3: 0.026,
  fingerR1: 0.026,
  fingerR2: 0.026,
  fingerR3: 0.026,
  toeL: 0.03,
  toeR: 0.03,
  heelL: 0.04,
  heelR: 0.04,
};

function Bone({ a, b, radius = 0.028 }: { a: Vec3; b: Vec3; radius?: number }) {
  const [hover, setHover] = useState(false);
  const { mid, quat, len } = useMemo(() => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const dir = end.clone().sub(start);
    return {
      mid: start.clone().add(end).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      ),
      len: dir.length(),
    };
  }, [a, b]);

  return (
    <group position={mid} quaternion={quat}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        {/* slight taper toward the ends, like real long bones */}
        <cylinderGeometry args={[radius * 0.82, radius, len, 8]} />
        <meshStandardMaterial
          color={hover ? CRIMSON : CYAN}
          emissive={hover ? CRIMSON : CYAN}
          emissiveIntensity={hover ? 3.2 : 1.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh scale={[1.9, 1, 1.9]}>
        <cylinderGeometry args={[radius, radius, len, 6, 1, true]} />
        <meshBasicMaterial
          color={hover ? CRIMSON : CYAN}
          wireframe
          transparent
          opacity={0.32}
        />
      </mesh>
    </group>
  );
}

function Joint({ pos, size = 0.055 }: { pos: Vec3; size?: number }) {
  return (
    <mesh position={pos}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={CYAN}
        emissive={CYAN}
        emissiveIntensity={1.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Ribcage: individual curved rib pairs (spine -> side -> near-sternum) built
// as tube geometry along a Catmull-Rom curve, plus a sternum bar — replaces
// the old flat torus rings with something that actually reads as ribs.
// ---------------------------------------------------------------------------
type RibLevel = { y: number; out: number; front: number };

const RIB_LEVELS: RibLevel[] = [
  { y: 2.5, out: 0.32, front: 0.3 },
  { y: 2.41, out: 0.36, front: 0.34 },
  { y: 2.32, out: 0.38, front: 0.35 },
  { y: 2.23, out: 0.37, front: 0.33 },
  { y: 2.14, out: 0.33, front: 0.29 },
  { y: 2.05, out: 0.27, front: 0.23 },
];

function Rib({ side, level, index }: { side: 1 | -1; level: RibLevel; index: number }) {
  const [hover, setHover] = useState(false);
  const geometry = useMemo(() => {
    const drop = index * 0.006;
    const points = [
      new THREE.Vector3(0, level.y + 0.03, -0.03),
      new THREE.Vector3(side * level.out * 0.65, level.y - drop, level.front * 0.5),
      new THREE.Vector3(side * level.out, level.y - drop * 1.6, level.front * 0.88),
      new THREE.Vector3(side * level.front * 0.5, level.y - drop * 2, level.front),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 20, 0.014, 6, false);
  }, [side, level, index]);

  return (
    <mesh
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial
        color={hover ? CRIMSON : CYAN}
        emissive={hover ? CRIMSON : CYAN}
        emissiveIntensity={hover ? 2.6 : 1.0}
        transparent
        opacity={0.62}
      />
    </mesh>
  );
}

function RibCage() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const breathe = Math.sin(clock.getElapsedTime() * ((Math.PI * 2) / 4.2));
    const s = 1 + breathe * 0.035;
    ref.current.scale.set(s, 1, s * 0.85);
  });

  const sternumTop: Vec3 = [0, RIB_LEVELS[0].y + 0.02, RIB_LEVELS[0].front * 0.98];
  const sternumBottom: Vec3 = [
    0,
    RIB_LEVELS[RIB_LEVELS.length - 1].y - 0.05,
    RIB_LEVELS[RIB_LEVELS.length - 1].front * 0.94,
  ];

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {RIB_LEVELS.map((level, i) => (
        <group key={i}>
          <Rib side={-1} level={level} index={i} />
          <Rib side={1} level={level} index={i} />
        </group>
      ))}
      <Bone a={sternumTop} b={sternumBottom} radius={0.022} />
    </group>
  );
}

function ScanSweep() {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 8;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "rgba(41,240,255,0)");
    g.addColorStop(0.5, "rgba(41,240,255,0.9)");
    g.addColorStop(1, "rgba(41,240,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 8, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const cycle = 5; // seconds, "bone scan passes every 5 seconds"
    const t = (clock.getElapsedTime() % cycle) / cycle;
    ref.current.position.y = -0.3 + t * 4.0;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.85 * Math.sin(t * Math.PI);
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <planeGeometry args={[2.2, 0.22]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const cursor = useCursor();

  useFrame(() => {
    if (!group.current) return;
    const targetY = cursor.current.x * 0.6;
    const targetX = -cursor.current.y * 0.22;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} position={[0, -1.9, 0]}>
      {BONES.map(([a, b, radius], i) => (
        <Bone key={i} a={JOINTS[a]} b={JOINTS[b]} radius={radius} />
      ))}
      {Object.entries(JOINTS).map(([key, pos]) => (
        <Joint key={key} pos={pos} size={JOINT_SIZE[key] ?? 0.055} />
      ))}
      <RibCage />
      <ScanSweep />
    </group>
  );
}

export default function SkeletonHologram() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.2, 5.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#05070a"]} />
        <fog attach="fog" args={["#05070a", 4, 11]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[3, 3, 3]} intensity={40} color={CYAN} />
        <pointLight position={[-3, -1, 2]} intensity={18} color={CRIMSON} />
        <Suspense fallback={null}>
          <Rig />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
