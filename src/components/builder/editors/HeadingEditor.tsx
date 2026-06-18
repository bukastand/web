"use client";

export function HeadingEditor({ element, updateContent, renderField, updateStyle }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  updateStyle: (key: string, value: string) => void;
}) {
  return (
    <>
      {renderField("Teks Heading", "text", "text")}
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Level Heading</label>
        <select
          value={element.content.level || "h2"}
          onChange={(e) => {
            updateContent("level", e.target.value);
            if (element.styles.fontSize) {
              updateStyle("fontSize", "");
            }
          }}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
          style={{ colorScheme: 'dark' }}
        >
          <option value="h1" className="bg-[#1e293b] text-white">H1 - Paling Besar</option>
          <option value="h2" className="bg-[#1e293b] text-white">H2 - Besar</option>
          <option value="h3" className="bg-[#1e293b] text-white">H3 - Sedang</option>
          <option value="h4" className="bg-[#1e293b] text-white">H4 - Kecil</option>
          <option value="h5" className="bg-[#1e293b] text-white">H5 - Lebih Kecil</option>
          <option value="h6" className="bg-[#1e293b] text-white">H6 - Terkecil</option>
        </select>
      </div>
    </>
  );
}
