"use client";

import { builderTemplates } from "@/lib/builder/templates";
import { useBuilder } from "@/lib/builder/store";

export default function TemplatePicker({
  onClose,
  compact = false,
}: {
  onClose?: () => void;
  compact?: boolean;
}) {
  const { currentPage, dispatch } = useBuilder();

  const handleAddTemplate = (templateId: string) => {
    if (!currentPage) return;
    const tpl = builderTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    const section = tpl.create();
    dispatch({ type: "ADD_TEMPLATE_SECTION", pageId: currentPage.id, section });
    onClose?.();
  };

  if (!currentPage) return null;

  const categories = [...new Set(builderTemplates.map((t) => t.category))];

  return (
    <div>
      {categories.map((cat) => (
        <div key={cat} className={compact ? "mb-3" : "mb-4"}>
          <h4 className={`font-semibold text-gray-500 uppercase tracking-wider ${compact ? "text-[10px] mb-2 px-1" : "text-xs mb-3 px-1"}`}>
            {cat}
          </h4>
          <div className={compact ? "space-y-1.5" : "grid grid-cols-2 gap-2"}>
            {builderTemplates
              .filter((t) => t.category === cat)
              .map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleAddTemplate(tpl.id)}
                  className={`text-left transition-all active:scale-[0.98] ${
                    compact
                      ? "flex items-center gap-2 p-2 rounded-lg border border-white/10 bg-white/5 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 w-full"
                      : "p-3 rounded-xl border border-white/10 bg-white/5 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5"
                  }`}
                >
                  <span className={`flex-shrink-0 ${compact ? "text-base" : "text-xl"}`}>{tpl.icon}</span>
                  <div className="min-w-0">
                    <div className={`font-medium text-white ${compact ? "text-xs" : "text-sm"}`}>{tpl.name}</div>
                    {!compact && (
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">{tpl.description}</div>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
