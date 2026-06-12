"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingShapeProps {
  position: [number, number, number];
  rotationSpeed?: number;
  floatSpeed?: number;
  floatIntensity?: number;
  scale?: number;
  type?: "torus" | "octahedron" | "dodecahedron" | "icosahedron" | "sphere";
  color?: string;
}

function Shape({
  position,
  rotationSpeed = 0.5,
  floatSpeed = 2,
  floatIntensity = 1,
  scale = 1,
  type = "torus",
  color = "#22c55e",
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
    }
  });

  const geometry = useMemo(() => {
    switch (type) {
      case "torus":
        return new THREE.TorusGeometry(1, 0.4, 16, 32);
      case "octahedron":
        return new THREE.OctahedronGeometry(1);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1);
      case "icosahedron":
        return new THREE.IcosahedronGeometry(1);
      case "sphere":
        return new THREE.SphereGeometry(1, 32, 32);
      default:
        return new THREE.TorusGeometry(1, 0.4, 16, 32);
    }
  }, [type]);

  return (
    <Float speed={floatSpeed} rotationIntensity={floatIntensity} floatIntensity={1.5}>
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        geometry={geometry}
      >
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
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

function WireframeShape({
  position,
  rotationSpeed = 0.3,
  scale = 1,
  type = "icosahedron",
  color = "#4ade80",
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.2;
      meshRef.current.rotation.y -= delta * rotationSpeed * 0.4;
      meshRef.current.rotation.z += delta * rotationSpeed * 0.15;
    }
  });

  const geometry = useMemo(() => {
    switch (type) {
      case "torus":
        return new THREE.TorusGeometry(1, 0.4, 16, 32);
      case "octahedron":
        return new THREE.OctahedronGeometry(1);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1);
      case "icosahedron":
        return new THREE.IcosahedronGeometry(1);
      case "sphere":
        return new THREE.SphereGeometry(1, 32, 32);
      default:
        return new THREE.IcosahedronGeometry(1);
    }
  }, [type]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.15}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export default function FloatingShapes() {
  const shapes = useMemo(
    () => [
      {
        position: [-6, 2, -5] as [number, number, number],
        type: "torus" as const,
        scale: 1.2,
        color: "#22c55e",
        floatSpeed: 2.5,
      },
      {
        position: [7, -3, -8] as [number, number, number],
        type: "dodecahedron" as const,
        scale: 0.9,
        color: "#4ade80",
        floatSpeed: 3,
      },
      {
        position: [5, 3, -12] as [number, number, number],
        type: "icosahedron" as const,
        scale: 0.7,
        color: "#22c55e",
        floatSpeed: 2,
      },
      {
        position: [-5, -2, -10] as [number, number, number],
        type: "octahedron" as const,
        scale: 0.8,
        color: "#86efac",
        floatSpeed: 2.8,
      },
      {
        position: [-3, 4, -15] as [number, number, number],
        type: "sphere" as const,
        scale: 0.5,
        color: "#22c55e",
        floatSpeed: 3.5,
      },
      {
        position: [4, -4, -18] as [number, number, number],
        type: "torus" as const,
        scale: 0.6,
        color: "#4ade80",
        floatSpeed: 2.2,
      },
      {
        position: [0, 5, -20] as [number, number, number],
        type: "icosahedron" as const,
        scale: 1.5,
        color: "#22c55e",
        floatSpeed: 1.8,
      },
    ],
    []
  );

  const wireframes = useMemo(
    () => [
      {
        position: [8, 4, -10] as [number, number, number],
        type: "icosahedron" as const,
        scale: 1.3,
        color: "#22c55e",
      },
      {
        position: [-7, -3, -14] as [number, number, number],
        type: "octahedron" as const,
        scale: 1.1,
        color: "#4ade80",
      },
      {
        position: [-8, 5, -18] as [number, number, number],
        type: "dodecahedron" as const,
        scale: 0.8,
        color: "#86efac",
      },
      {
        position: [6, -5, -22] as [number, number, number],
        type: "torus" as const,
        scale: 0.9,
        color: "#22c55e",
      },
    ],
    []
  );

  return (
    <group>
      {shapes.map((props, i) => (
        <Shape key={`shape-${i}`} {...props} />
      ))}
      {wireframes.map((props, i) => (
        <WireframeShape key={`wire-${i}`} {...props} />
      ))}
    </group>
  );
}
