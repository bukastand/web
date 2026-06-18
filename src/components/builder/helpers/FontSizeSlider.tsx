interface FontSizeSliderProps {
  value: string;
  onChange: (v: string) => void;
}

const presets = [
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "40px", value: "40px" },
  { label: "48px", value: "48px" },
  { label: "56px", value: "56px" },
  { label: "64px", value: "64px" },
  { label: "72px", value: "72px" },
];

export function FontSizeSlider({ value, onChange }: FontSizeSliderProps) {
  const match = value?.match(/^([\d.]+)(\s*)(\S*)$/) || [];
  const num = parseFloat(match[1]) || 16;
  const unit = match[3] || "px";

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10);
    onChange(`${newNum}${unit}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Font</label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="range"
          min={8}
          max={100}
          step={1}
          value={Math.min(100, Math.max(8, Math.round(num)))}
          onChange={handleSlider}
          className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer
            accent-[#22c55e]
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#22c55e]
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#22c55e]
            [&::-moz-range-thumb]:border-0"
        />
        <input
          type="text"
          value={value || ""}
          onChange={handleInputChange}
          className="w-16 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[#22c55e]/50 font-mono"
          placeholder="16px"
        />
      </div>
      <div className="flex gap-1 flex-wrap">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={`px-1.5 py-0.5 text-[10px] rounded-md border transition-all ${
              value === p.value
                ? "bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e]"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
