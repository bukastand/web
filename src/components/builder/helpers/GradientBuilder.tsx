"use client";

import { useState, useEffect } from "react";

interface GradientBuilderProps {
  value: string;
  onChange: (v: string) => void;
}

export function GradientBuilder({ value, onChange }: GradientBuilderProps) {
  const parseGradient = (val: string) => {
    const match = val?.match(/linear-gradient\(\s*([\d.]+deg|[\w-]+)?\s*,?\s*#?[\da-fA-F]*\s*\d*%?\s*,?\s*#?[\da-fA-F]*/);
    if (!val || !val.includes("linear-gradient")) {
      return { c1: "#22c55e", c2: "#16a34a", dir: "135deg" };
    }
    let dir = "135deg";
    const dirMatch = val.match(/linear-gradient\(\s*([^,]+)/);
    if (dirMatch) {
      const d = dirMatch[1].trim();
      if (d.includes("deg") || d.includes("to ") || d.includes("turn")) dir = d;
    }
    const colors = val.match(/#([\da-fA-F]{3,8})/g) || [];
    return {
      c1: colors[0] || "#22c55e",
      c2: colors[1] || "#16a34a",
      dir,
    };
  };

  const parsed = parseGradient(value);
  const [c1, setC1] = useState(parsed.c1);
  const [c2, setC2] = useState(parsed.c2);
  const [dir, setDir] = useState(parsed.dir);

  useEffect(() => {
    const p = parseGradient(value);
    setC1(p.c1);
    setC2(p.c2);
    setDir(p.dir);
  }, [value]);

  const buildGradient = (color1: string, color2: string, direction: string) => {
    return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
  };

  const applyGradient = (color1: string, color2: string, direction: string) => {
    onChange(buildGradient(color1, color2, direction));
  };

  const dirOptions = [
    { label: "↘", value: "135deg", title: "Diagonal" },
    { label: "↓", value: "180deg", title: "Ke Bawah" },
    { label: "→", value: "90deg", title: "Ke Kanan" },
    { label: "↗", value: "45deg", title: "Diagonal Kanan Atas" },
    { label: "←", value: "270deg", title: "Ke Kiri" },
    { label: "↑", value: "0deg", title: "Ke Atas" },
  ];

  const gradientPresets = [
    { label: "Sunset", c1: "#f093fb", c2: "#f5576c" },
    { label: "Ocean", c1: "#4facfe", c2: "#00f2fe" },
    { label: "Forest", c1: "#43e97b", c2: "#38f9d7" },
    { label: "Purple", c1: "#667eea", c2: "#764ba2" },
    { label: "Warm", c1: "#fa709a", c2: "#fee140" },
    { label: "Dark", c1: "#0f172a", c2: "#1e293b" },
    { label: "Hijau", c1: "#22c55e", c2: "#16a34a" },
    { label: "Biru", c1: "#3b82f6", c2: "#1d4ed8" },
  ];

  const previewStyle: React.CSSProperties = {
    background: buildGradient(c1, c2, dir),
    height: "36px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "background 0.3s ease",
  };

  return (
    <div className="mb-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-[9px] text-gray-600 mb-0.5">Warna 1</label>
          <input
            type="color"
            value={c1}
            onChange={(e) => { setC1(e.target.value); applyGradient(e.target.value, c2, dir); }}
            className="w-full h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
          />
        </div>
        <span className="text-gray-500 mt-4 text-xs">+</span>
        <div className="flex-1">
          <label className="block text-[9px] text-gray-600 mb-0.5">Warna 2</label>
          <input
            type="color"
            value={c2}
            onChange={(e) => { setC2(e.target.value); applyGradient(c1, e.target.value, dir); }}
            className="w-full h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-[9px] text-gray-600 mb-1">Arah Gradien</label>
        <div className="flex gap-1">
          {dirOptions.map((d) => (
            <button
              key={d.value}
              onClick={() => { setDir(d.value); applyGradient(c1, c2, d.value); }}
              className={`flex-1 py-1 text-xs rounded-md border transition-all ${
                dir === d.value
                  ? "bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
              title={d.title}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div style={previewStyle} />

      <div>
        <label className="block text-[9px] text-gray-600 mb-1">Presets</label>
        <div className="flex flex-wrap gap-1">
          {gradientPresets.map((g) => (
            <button
              key={g.label}
              onClick={() => { setC1(g.c1); setC2(g.c2); applyGradient(g.c1, g.c2, dir); }}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              <span
                className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                style={{ background: `linear-gradient(${dir}, ${g.c1}, ${g.c2})` }}
              />
              {g.label}
            </button>
          ))}
          <button
            onClick={() => { setC1("#000000"); setC2("#000000"); onChange(""); }}
            className="px-2 py-1 text-[10px] rounded-md border border-dashed border-red-400/30 text-red-400 hover:border-red-400/60 transition-all"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
