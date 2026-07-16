"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useCursor } from "./CursorProvider";

const CYAN = "#29f0ff";
const CRIMSON = "#ff2d4e";
const TURNS = 6;
const POINTS_PER_TURN = 14;
const RADIUS = 0.85;
const HEIGHT = 5.2;

function useHelixPoints() {
  return useMemo(() => {
    const total = TURNS * POINTS_PER_TURN;
    const strandA: THREE.Vector3[] = [];
    const strandB: THREE.Vector3[] = [];
    for (let i = 0; i < total; i++) {
      const t = i / POINTS_PER_TURN;
      const angle = t * Math.PI * 2;
      const y = (i / total) * HEIGHT - HEIGHT / 2;
      strandA.push(
        new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS)
      );
      strandB.push(
        new THREE.Vector3(
          Math.cos(angle + Math.PI) * RADIUS,
          y,
          Math.sin(angle + Math.PI) * RADIUS
        )
      );
    }
    return { strandA, strandB };
  }, []);
}

function Strand({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useMemo(() => {
    if (!ref.current) return;
  }, []);

  return (
    <instancedMesh
      ref={(el) => {
        if (!el) return;
        const dummy = new THREE.Object3D();
        points.forEach((p, i) => {
          dummy.position.copy(p);
          dummy.updateMatrix();
          el.setMatrixAt(i, dummy.matrix);
        });
        el.instanceMatrix.needsUpdate = true;
      }}
      args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, points.length]}
    >
      <sphereGeometry args={[0.05, 10, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        transparent
        opacity={0.95}
      />
    </instancedMesh>
  );
}

function Rungs({
  a,
  b,
}: {
  a: THREE.Vector3[];
  b: THREE.Vector3[];
}) {
  const step = 2;
  const pairs = useMemo(() => {
    const arr: { mid: THREE.Vector3; quat: THREE.Quaternion; len: number }[] = [];
    for (let i = 0; i < a.length; i += step) {
      const start = a[i];
      const end = b[i];
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dir = end.clone().sub(start);
      const len = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      arr.push({ mid, quat, len });
    }
    return arr;
  }, [a, b]);

  return (
    <group>
      {pairs.map((p, i) => (
        <mesh key={i} position={p.mid} quaternion={p.quat}>
          <cylinderGeometry args={[0.012, 0.012, p.len, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? CYAN : CRIMSON}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function HelixRig() {
  const group = useRef<THREE.Group>(null);
  const cursor = useCursor();
  const { strandA, strandB } = useHelixPoints();

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    const targetX = cursor.current.y * 0.35;
    const targetZ = -cursor.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05;
  });

  return (
    <group ref={group}>
      <Strand points={strandA} color={CYAN} />
      <Strand points={strandB} color={CRIMSON} />
      <Rungs a={strandA} b={strandB} />
      <Sparkles
        count={60}
        scale={[2.4, HEIGHT, 2.4]}
        size={2.5}
        speed={0.4}
        color={CYAN}
        opacity={0.6}
      />
    </group>
  );
}

export default function DNAHelix() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 40 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#05070a"]} />
        <fog attach="fog" args={["#05070a", 5, 12]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 2, 4]} intensity={22} color={CYAN} />
        <pointLight position={[-3, -2, -2]} intensity={16} color={CRIMSON} />
        <Suspense fallback={null}>
          <HelixRig />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
