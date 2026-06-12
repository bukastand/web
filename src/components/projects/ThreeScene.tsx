"use client";

import { useEffect, useRef } from "react";

export default function ThreeScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const orbs = Array.from({ length: 10 }, () => {
      const orb = document.createElement("div");
      orb.className = "absolute rounded-full pointer-events-none";
      const size = 50 + Math.random() * 160;
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.background = `radial-gradient(circle at 30% 30%, rgba(34,197,94,0.15), rgba(34,197,94,0.03) 60%, transparent)`;
      orb.style.left = `${Math.random() * 100}%`;
      orb.style.top = `${Math.random() * 100}%`;
      orb.style.animation = `float ${10 + Math.random() * 15}s ease-in-out infinite`;
      orb.style.animationDelay = `${Math.random() * 6}s`;
      return orb;
    });
    orbs.forEach((o) => canvas.appendChild(o));
    return () => orbs.forEach((o) => o.remove());
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
}
