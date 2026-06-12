"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import FloatingShapes from "./FloatingShapes";
import Particles from "./Particles";

export default function ThreeBackground() {
  return (
    <div id="three-canvas-container" aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        dpr={[1, 1.5]}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 12]}
          fov={60}
          near={0.1}
          far={100}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={0.3} color="#22c55e" />
        <Suspense fallback={null}>
          <FloatingShapes />
          <Particles count={500} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
