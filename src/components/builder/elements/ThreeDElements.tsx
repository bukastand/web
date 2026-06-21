"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { BuilderElement } from "@/lib/builder/types";

interface ElementComponentProps {
  el: BuilderElement;
  editing?: boolean;
  onEdit?: (content: Record<string, any>) => void;
  onBlurEditing?: () => void;
}

// ─── Three.js Scene Shape Component ───

interface ShapeProps {
  position: [number, number, number];
  rotationSpeed?: number;
  floatSpeed?: number;
  scale?: number;
  type?: "torus" | "octahedron" | "dodecahedron" | "icosahedron" | "sphere";
  color?: string;
  wireframe?: boolean;
}

function SceneShape({ position, rotationSpeed = 0.5, floatSpeed = 2, scale = 1, type = "torus", color = "#22c55e", wireframe = false }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
      meshRef.current.rotation.z += delta * rotationSpeed * 0.1;
    }
  });

  const geometry = useMemo(() => {
    switch (type) {
      case "torus": return new THREE.TorusGeometry(1, 0.4, 16, 32);
      case "octahedron": return new THREE.OctahedronGeometry(1);
      case "dodecahedron": return new THREE.DodecahedronGeometry(1);
      case "icosahedron": return new THREE.IcosahedronGeometry(1);
      case "sphere": return new THREE.SphereGeometry(1, 32, 32);
      default: return new THREE.TorusGeometry(1, 0.4, 16, 32);
    }
  }, [type]);

  if (wireframe) {
    return (
      <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    );
  }

  return (
    <Float speed={floatSpeed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.4}
          wireframe={false}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// ─── Scene Shapes Group ───

function SceneShapesGroup({ color = "#22c55e", shapeCount = 6 }: { color: string; shapeCount: number }) {
  const shapes = useMemo(() => {
    const types: Array<"torus" | "octahedron" | "dodecahedron" | "icosahedron" | "sphere"> = [
      "torus", "dodecahedron", "icosahedron", "octahedron", "sphere", "torus",
    ];
    const result = [];
    for (let i = 0; i < Math.min(shapeCount, 8); i++) {
      const angle = (i / Math.min(shapeCount, 8)) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 2;
      result.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 3,
          Math.sin(angle) * radius - 3,
        ] as [number, number, number],
        type: types[i % types.length],
        scale: 0.4 + Math.random() * 0.6,
        rotationSpeed: 0.3 + Math.random() * 0.4,
        floatSpeed: 1.5 + Math.random(),
        wireframe: i % 3 === 1,
      });
    }
    return result;
  }, [shapeCount]);

  return (
    <group>
      {shapes.map((s, i) => (
        <SceneShape key={i} {...s} color={color} />
      ))}
    </group>
  );
}

// ─── Particles Component ───

function ParticleField({ color = "#22c55e", count = 300, size = 2 }: { color: string; count: number; size: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseColor = new THREE.Color(color);
    const lighterColor = new THREE.Color(color).multiplyScalar(1.5);

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const c = baseColor.clone().lerp(lighterColor, Math.random());
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, color]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02 * (size / 2);
      meshRef.current.rotation.x += delta * 0.008 * (size / 2);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08 * (size / 2)}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Main ThreeScene Canvas ───

function ThreeSceneCanvas({ color = "#22c55e", shapes = 6, animationSpeed = 1, backgroundColor = "#0a0f1a" }: {
  color: string;
  shapes: number;
  animationSpeed: number;
  backgroundColor: string;
}) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundColor }}>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={60} near={0.1} far={100} />
        <ambientLight intensity={0.5 * animationSpeed} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={0.3} color={color} />
        <Suspense fallback={null}>
          <SceneShapesGroup color={color} shapeCount={shapes} />
          <ParticleField color={color} count={200} size={animationSpeed} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Particles Only Canvas ───

function ParticlesOnlyCanvas({ color = "#22c55e", count = 300, speed = 0.5, backgroundColor = "#0a0f1a" }: {
  color: string;
  count: number;
  speed: number;
  backgroundColor: string;
}) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundColor }}>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} near={0.1} far={100} />
        <Suspense fallback={null}>
          <ParticleField color={color} count={count} size={speed} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Text Overlay Helper ───

const TEXT_POSITIONS: Record<string, { justify: string; items: string }> = {
  center: { justify: "center", items: "center" },
  left: { justify: "center", items: "start" },
  right: { justify: "center", items: "end" },
  "top-left": { justify: "start", items: "start" },
  "top-center": { justify: "start", items: "center" },
  "top-right": { justify: "start", items: "end" },
  "bottom-left": { justify: "end", items: "start" },
  "bottom-center": { justify: "end", items: "center" },
  "bottom-right": { justify: "end", items: "end" },
};

function TextOverlay({ el }: { el: BuilderElement }) {
  const c = el.content;
  const hasContent = c.title || c.subtitle || c.buttonText;
  if (!hasContent) return null;

  const pos = TEXT_POSITIONS[c.textPosition || "center"] || TEXT_POSITIONS.center;

  return (
    <div
      className="absolute inset-0 flex pointer-events-none"
      style={{
        justifyContent: pos.justify as any,
        alignItems: pos.items as any,
        padding: "32px",
        background: c.overlayBg || "rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="max-w-2xl pointer-events-auto"
        style={{
          textAlign: c.textPosition === "left" || c.textPosition?.includes("left") ? "left" as any :
                     c.textPosition === "right" || c.textPosition?.includes("right") ? "right" as any : "center" as any,
        }}
      >
        {c.title && (
          <h2
            className="font-bold leading-tight mb-2"
            style={{
              color: c.titleColor || "#ffffff",
              fontSize: c.titleSize || "36px",
              fontWeight: c.titleWeight || "800",
            }}
          >
            {c.title}
          </h2>
        )}
        {c.subtitle && (
          <p
            className="mb-4"
            style={{
              color: c.subtitleColor || "#94a3b8",
              fontSize: c.subtitleSize || "16px",
            }}
          >
            {c.subtitle}
          </p>
        )}
        {c.buttonText && (
          <a
            href={c.buttonHref || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: c.buttonBg || "#22c55e",
              color: c.buttonColor || "#ffffff",
              fontSize: c.buttonSize || "14px",
              fontWeight: c.buttonWeight || "600",
            }}
          >
            {c.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Exported Builder Element Components ───

export function ThreeSceneElement({ el }: ElementComponentProps) {
  const color = el.content.color || "#22c55e";
  const shapes = el.content.shapes || 6;
  const animationSpeed = el.content.rotateSpeed || 0.5;
  const backgroundColor = el.styles.backgroundColor || "#0a0f1a";

  return (
    <div
      style={{
        width: el.styles.width || "100%",
        height: el.styles.height || "400px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <div className="absolute inset-0">
        <ThreeSceneCanvas
          color={color}
          shapes={shapes}
          animationSpeed={animationSpeed}
          backgroundColor={backgroundColor}
        />
      </div>
      <TextOverlay el={el} />
      {/* Label overlay */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="text-[10px] bg-black/40 text-white/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
          ✦ 3D Scene
        </span>
      </div>
    </div>
  );
}

export function ThreeParticlesElement({ el }: ElementComponentProps) {
  const color = el.content.color || "#22c55e";
  const count = el.content.particleCount || 300;
  const speed = el.content.speed || 0.5;
  const backgroundColor = el.styles.backgroundColor || "#0a0f1a";

  return (
    <div
      style={{
        width: el.styles.width || "100%",
        height: el.styles.height || "300px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <ParticlesOnlyCanvas
        color={color}
        count={count}
        speed={speed}
        backgroundColor={backgroundColor}
      />
      {/* Label overlay */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="text-[10px] bg-black/40 text-white/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
          ✦ Particles
        </span>
      </div>
    </div>
  );
}
