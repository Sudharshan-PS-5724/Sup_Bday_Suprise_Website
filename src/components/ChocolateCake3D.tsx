import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const SLICE_COUNT = 5;
const SLICE_ANGLE = (Math.PI * 2) / SLICE_COUNT;

function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + position[0] * 2;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 14) * 0.18;
      flameRef.current.scale.x = 1 + Math.cos(t * 11) * 0.12;
      flameRef.current.rotation.z = Math.sin(t * 8) * 0.08;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.4 + Math.sin(t * 16) * 0.35;
    }
  });

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh castShadow position-y={0.28}>
        <cylinderGeometry args={[0.045, 0.045, 0.56, 16]} />
        <meshStandardMaterial color="#fff8e7" roughness={0.25} />
      </mesh>
      {/* Spiral Stripes on Candle */}
      <mesh position-y={0.28} rotation-y={Math.PI / 4}>
        <cylinderGeometry args={[0.046, 0.046, 0.52, 16]} />
        <meshStandardMaterial color="#e63946" roughness={0.3} transparent opacity={0.4} />
      </mesh>
      {/* Candle wick */}
      <mesh position-y={0.58}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Flame Outer */}
      <mesh ref={flameRef} position-y={0.68}>
        <coneGeometry args={[0.05, 0.15, 14]} />
        <meshBasicMaterial color="#ff9e00" />
      </mesh>
      {/* Flame Inner Core */}
      <mesh position-y={0.65}>
        <coneGeometry args={[0.025, 0.08, 12]} />
        <meshBasicMaterial color="#ffea00" />
      </mesh>
      <pointLight ref={lightRef} position-y={0.7} color="#ffaa00" intensity={1.8} distance={2} />
    </group>
  );
}

function Cake({ selected, onSelect }: { selected: number | null; onSelect: (index: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const slices = useMemo(() => Array.from({ length: SLICE_COUNT }, (_, index) => index), []);

  useFrame((_, rawDelta) => {
    if (!group.current || selected !== null) return;
    const delta = Math.min(rawDelta, 0.05);
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group} rotation={[-0.08, -0.32, 0]}>
      {slices.map((index) => {
        const middle = index * SLICE_ANGLE + SLICE_ANGLE / 2;
        const chosen = selected === index;
        const hidden = selected !== null && !chosen;
        const distance = chosen ? 0.75 : 0.08;
        const x = Math.sin(middle) * distance;
        const z = Math.cos(middle) * distance;
        return (
          <group
            key={index}
            position={[x, chosen ? 0.18 : 0, z]}
            rotation-y={index * SLICE_ANGLE}
            visible={!hidden}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(index);
            }}
            onPointerEnter={(event) => {
              event.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              document.body.style.cursor = "default";
            }}
          >
            {/* Dark Chocolate Bottom Layer */}
            <mesh castShadow receiveShadow position-y={0.05}>
              <cylinderGeometry args={[2.4, 2.4, 1.4, 32, 1, false, 0, SLICE_ANGLE - 0.025]} />
              <meshStandardMaterial color="#32140e" roughness={0.6} metalness={0.05} />
            </mesh>

            {/* Middle Cream Filling Layer */}
            <mesh position-y={0.05}>
              <cylinderGeometry args={[2.405, 2.405, 0.12, 32, 1, false, 0, SLICE_ANGLE - 0.025]} />
              <meshStandardMaterial color="#fffbf5" roughness={0.3} />
            </mesh>

            {/* Rich Chocolate Glaze Top Layer */}
            <mesh castShadow position-y={0.80}>
              <cylinderGeometry args={[2.41, 2.41, 0.18, 32, 1, false, 0, SLICE_ANGLE - 0.025]} />
              <meshStandardMaterial color="#4a1c14" roughness={0.25} metalness={0.15} />
            </mesh>

            {/* Frosting Dollop at Outer Rim */}
            <mesh castShadow position={[Math.sin(SLICE_ANGLE / 2) * 2.15, 0.92, Math.cos(SLICE_ANGLE / 2) * 2.15]}>
              <sphereGeometry args={[0.2, 16, 14]} />
              <meshStandardMaterial color="#fff0f3" roughness={0.25} />
            </mesh>

            {/* Glossy Red Cherry on Top */}
            <mesh castShadow position={[Math.sin(SLICE_ANGLE / 2) * 1.55, 1.1, Math.cos(SLICE_ANGLE / 2) * 1.55]}>
              <sphereGeometry args={[0.24, 20, 16]} />
              <meshStandardMaterial color="#a80d2a" roughness={0.15} metalness={0.25} />
            </mesh>

            {/* Golden Decorative Chocolate Scroll */}
            <mesh castShadow position={[Math.sin(SLICE_ANGLE / 2) * 0.85, 0.96, Math.cos(SLICE_ANGLE / 2) * 0.85]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.38, 0.06, 12, 28]} />
              <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.5} />
            </mesh>

            {/* Candle on each slice */}
            <Candle position={[Math.sin(SLICE_ANGLE / 2) * 1.15, 0.9, Math.cos(SLICE_ANGLE / 2) * 1.15]} />
          </group>
        );
      })}

      {/* Gold Metallic Plate Base */}
      <mesh receiveShadow position-y={-0.78}>
        <cylinderGeometry args={[2.85, 2.85, 0.16, 48]} />
        <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Plate Pedestal Stem */}
      <mesh position-y={-0.95}>
        <cylinderGeometry args={[1.2, 1.6, 0.2, 32]} />
        <meshStandardMaterial color="#b8932b" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

export function ChocolateCake3D({ selected, onSelect }: { selected: number | null; onSelect: (index: number) => void }) {
  return (
    <div className="cake-canvas h-[24rem] w-full" aria-hidden="true">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 5.6, 7.5], fov: 38 }} gl={{ antialias: true }}>
        <color attach="background" args={["#f7ece5"]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 9, 5]} intensity={2.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-4, 3, 3]} intensity={18} color="#f5b8b5" distance={12} />
        <pointLight position={[3, 2, -3]} intensity={12} color="#ffd166" distance={10} />
        <Suspense fallback={null}>
          <Cake selected={selected} onSelect={onSelect} />
          <Environment>
            <Lightformer intensity={2.4} position={[0, 6, 1]} scale={[8, 8, 1]} />
            <Lightformer intensity={1.4} color="#d7a5a0" position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}