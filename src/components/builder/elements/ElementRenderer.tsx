"use client";

import { useState, useRef, useEffect } from "react";
import type { BuilderElement } from "@/lib/builder/types";
import { applyBgOpacity } from "@/lib/builder/utils";

interface ElementComponentProps {
  el: BuilderElement;
  editing?: boolean;
  onEdit?: (content: Record<string, any>) => void;
  onBlurEditing?: () => void;
}

function applyStyles(el: BuilderElement): React.CSSProperties {
  const s: React.CSSProperties = {};
  const st = el.styles;
  if (st.color) s.color = st.color;
  // Background color with optional opacity
  if (st.backgroundColor && st.backgroundColor !== "transparent") {
    s.backgroundColor = applyBgOpacity(st.backgroundColor, st.backgroundOpacity) || st.backgroundColor;
  }
  if (st.fontSize) s.fontSize = st.fontSize;
  if (st.fontWeight) s.fontWeight = st.fontWeight;
  if (st.textAlign) s.textAlign = st.textAlign;
  if (st.width) s.width = st.width;
  if (st.height) s.height = st.height;
  if (st.maxWidth) s.maxWidth = st.maxWidth;
  if (st.fontFamily) s.fontFamily = st.fontFamily;
  if (st.opacity) s.opacity = st.opacity;
  if (st.objectFit) s.objectFit = st.objectFit as React.CSSProperties['objectFit'];
  if (st.backgroundImage) s.backgroundImage = st.backgroundImage as React.CSSProperties['backgroundImage'];
  if (st.backgroundSize) s.backgroundSize = st.backgroundSize as React.CSSProperties['backgroundSize'];
  if (st.backgroundPosition) s.backgroundPosition = st.backgroundPosition as React.CSSProperties['backgroundPosition'];
  
  // Individual padding fields take priority over shorthand
  if (st.paddingTop || st.paddingBottom || st.paddingLeft || st.paddingRight) {
    s.paddingTop = st.paddingTop || "0px";
    s.paddingBottom = st.paddingBottom || "0px";
    s.paddingLeft = st.paddingLeft || "0px";
    s.paddingRight = st.paddingRight || "0px";
  } else if (st.padding) {
    s.padding = st.padding;
  }
  
  // Individual margin fields take priority over shorthand
  if (st.marginTop || st.marginBottom || st.marginLeft || st.marginRight) {
    s.marginTop = st.marginTop || "0px";
    s.marginBottom = st.marginBottom || "0px";
    s.marginLeft = st.marginLeft || "0px";
    s.marginRight = st.marginRight || "0px";
  } else if (st.margin) {
    s.margin = st.margin;
  }
  
  // Individual border-radius fields take priority over shorthand
  if (st.borderTopLeftRadius || st.borderTopRightRadius || st.borderBottomLeftRadius || st.borderBottomRightRadius) {
    s.borderTopLeftRadius = st.borderTopLeftRadius || "0px";
    s.borderTopRightRadius = st.borderTopRightRadius || "0px";
    s.borderBottomLeftRadius = st.borderBottomLeftRadius || "0px";
    s.borderBottomRightRadius = st.borderBottomRightRadius || "0px";
    s.borderRadius = "0px"; // Reset shorthand when individual is used
  } else if (st.borderRadius) {
    s.borderRadius = st.borderRadius;
  }
  
  return s;
}

function HeadingElement({ el, editing, onEdit, onBlurEditing }: ElementComponentProps) {
  const { text, level = "h2", align } = el.content;
  const styles = applyStyles(el);
  // Font size from style panel overrides heading level default size
  // Style panel textAlign takes priority over content align
  if (!styles.textAlign && align) styles.textAlign = align;

  const sizeMap: Record<string, string> = { h1: "text-4xl md:text-5xl", h2: "text-3xl md:text-4xl", h3: "text-2xl md:text-3xl", h4: "text-xl md:text-2xl", h5: "text-lg md:text-xl", h6: "text-base md:text-lg" };
  // If custom fontSize is set, don't add the heading level Tailwind size class
  // so there's no conflict with the inline fontSize style
  const hasCustomFontSize = !!el.styles.fontSize;
  const cls = `${hasCustomFontSize ? "" : sizeMap[level] || "text-3xl"} font-bold leading-tight outline-none`.trim();
  const content = text || "Heading";

  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    onEdit?.({ text: e.currentTarget.textContent || "" });
    onBlurEditing?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
    }
  };

  const sharedProps = {
    className: cls,
    style: styles,
    contentEditable: editing || undefined,
    suppressContentEditableWarning: true as any,
    ...(editing ? {
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      spellCheck: false as any,
      "data-placeholder": "Ketik teks..." as any,
    } : {}),
  };

  switch (level) {
    case "h1": return <h1 {...sharedProps}>{content}</h1>;
    case "h3": return <h3 {...sharedProps}>{content}</h3>;
    case "h4": return <h4 {...sharedProps}>{content}</h4>;
    case "h5": return <h5 {...sharedProps}>{content}</h5>;
    case "h6": return <h6 {...sharedProps}>{content}</h6>;
    default: return <h2 {...sharedProps}>{content}</h2>;
  }
}

function TextElement({ el, editing, onEdit, onBlurEditing }: ElementComponentProps) {
  const styles = { ...applyStyles(el), whiteSpace: "pre-line" as const };
  const content = el.content.text || "Teks paragraf";

  const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    onEdit?.({ text: e.currentTarget.textContent || "" });
    onBlurEditing?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <p
      className="leading-relaxed outline-none"
      style={styles}
      contentEditable={editing || undefined}
      suppressContentEditableWarning={true}
      onBlur={editing ? handleBlur : undefined}
      onKeyDown={editing ? handleKeyDown : undefined}
    >
      {content}
    </p>
  );
}

function getAlign(align?: string): "flex-start" | "center" | "flex-end" {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
}

function ImageElement({ el }: ElementComponentProps) {
  const imgStyles = applyStyles(el);
  // Remove textAlign from img itself, apply to container instead
  const { textAlign: _ta, ...imgOnlyStyles } = imgStyles;
  
  // When alignment is set, convert width:100% to maxWidth so alignment has visible effect
  // This handles old saved data that still has width: "100%"
  if (el.styles.textAlign && imgOnlyStyles.width === "100%") {
    delete imgOnlyStyles.width;
    if (!imgOnlyStyles.maxWidth) imgOnlyStyles.maxWidth = "100%";
  }
  
  // Default to cover if no objectFit explicitly set
  if (imgOnlyStyles.objectFit === undefined) {
    imgOnlyStyles.objectFit = "cover";
  }
  
  const justifyContent = getAlign(el.styles.textAlign || el.content.align);
  return (
    <div style={{ display: "flex", justifyContent, flexWrap: "wrap" }}>
      <img
        src={el.content.src || "https://placehold.co/800x500/1e293b/64748b?text=Gambar"}
        alt={el.content.alt || ""}
        style={imgOnlyStyles}
      />
      {el.content.caption && <p className="text-sm text-gray-500 mt-2 w-full">{el.content.caption}</p>}
    </div>
  );
}

function ButtonElement({ el, editing, onEdit, onBlurEditing }: ElementComponentProps) {
  const variant = el.content.variant || "primary";
  const styles = applyStyles(el);
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300";
  const variants: Record<string, string> = {
    primary: "bg-[#22c55e] text-white hover:bg-[#16a34a]",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    outline: "border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white",
  };

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    onEdit?.({ text: e.currentTarget.textContent || "" });
    onBlurEditing?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div style={{ textAlign: (el.styles as any).textAlign || "center" }}>
      {editing ? (
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${base} ${variants[variant] || variants.primary}`}
          style={styles}
        >
          {el.content.text || "Tombol"}
        </span>
      ) : (
        <a href={el.content.href || "#"} target={el.content.target || "_self"} className={`${base} ${variants[variant] || variants.primary}`} style={styles}>
          {el.content.text || "Tombol"}
        </a>
      )}
    </div>
  );
}

function VideoElement({ el }: ElementComponentProps) {
  const videoContainerStyles = applyStyles(el);
  const { textAlign: _ta, ...videoOnlyStyles } = videoContainerStyles;
  
  const hasAlign = !!el.styles.textAlign;
  const justifyContent = getAlign(el.styles.textAlign);
  
  // When alignment is set, convert width:100% to maxWidth and add minWidth so flex alignment works
  if (hasAlign) {
    if (videoOnlyStyles.width === "100%") {
      delete videoOnlyStyles.width;
    }
    if (!videoOnlyStyles.maxWidth) {
      videoOnlyStyles.maxWidth = "100%";
    }
    if (!videoOnlyStyles.minWidth) {
      videoOnlyStyles.minWidth = "320px";
    }
  }
  
  return (
    <div style={{ display: "flex", justifyContent, flexWrap: "wrap" }}>
      <div 
        className={`relative overflow-hidden${!hasAlign ? " w-full" : ""}`}
        style={{ aspectRatio: "16 / 9", ...videoOnlyStyles }}
      >
        <iframe src={el.content.url || ""} className="absolute inset-0 w-full h-full" allowFullScreen title="video" />
      </div>
      {el.content.caption && <p className="text-sm text-gray-500 mt-2 w-full">{el.content.caption}</p>}
    </div>
  );
}

function SpacerElement({ el }: ElementComponentProps) {
  const height = el.content.height || "40px";
  return <div style={{ height, width: "100%" }} />;
}

function DividerElement({ el }: ElementComponentProps) {
  const borderStyle = el.content.style || "solid";
  const color = el.content.color || "#e2e8f0";
  return <hr style={{ border: "none", borderTop: `1px ${borderStyle} ${color}`, ...applyStyles(el) }} />;
}

export const FEATURE_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
  star: { icon: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />, label: "Star" },
  heart: { icon: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />, label: "Heart" },
  rocket: { icon: <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />, label: "Rocket" },
  globe: { icon: <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />, label: "Globe" },
  lightbulb: { icon: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />, label: "Lightbulb" },
  shield: { icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, label: "Shield" },
  chart: { icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, label: "Chart" },
  users: { icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />, label: "Users" },
  cog: { icon: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />, label: "Cog" },
  check: { icon: <path d="M5 13l4 4L19 7" />, label: "Check" },
};

function IconElement({ el }: ElementComponentProps) {
  const size = el.content.size || "48px";
  const color = el.content.color || "#22c55e";
  const icons: Record<string, React.ReactNode> = Object.fromEntries(
    Object.entries(FEATURE_ICONS).map(([k, v]) => [k, v.icon])
  );

  const justifyContent = getAlign(el.styles.textAlign);
  return (
    <div style={{ display: "flex", justifyContent }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {icons[el.content.icon] || icons.star}
      </svg>
    </div>
  );
}

// Apply element styles to internal titles/subtitles in complex elements
function getTitleStyles(el: BuilderElement): React.CSSProperties {
  const st = el.styles;
  const s: React.CSSProperties = {};
  if (st.color) s.color = st.color;
  if (st.fontSize) s.fontSize = st.fontSize;
  if (st.fontWeight) s.fontWeight = st.fontWeight;
  if (st.fontFamily) s.fontFamily = st.fontFamily;
  if (st.textAlign) s.textAlign = st.textAlign;
  return s;
}

function FeaturesElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const cols = el.content.columns || 3;
  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-10" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${cols > 2 ? "280px" : "200px"}, 1fr))` }}>
        {items.map((item: any, i: number) => {
          const iconDef = FEATURE_ICONS[item.icon];
          return (
            <div
              key={i}
              className="p-6 rounded-2xl text-center"
              style={{
                backgroundColor: el.content.itemBg || "rgba(255,255,255,0.05)",
                borderColor: el.content.itemBorder || "rgba(255,255,255,0.1)",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <div className="flex items-center justify-center mb-3" style={{ color: el.styles.color || "#22c55e" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  {iconDef ? iconDef.icon : FEATURE_ICONS.star.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: el.content.itemTitleColor || "#ffffff" }}>{item.title}</h3>
              <p className="text-sm" style={{ color: el.content.itemTextColor || "#94a3b8" }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PricingElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-10" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-8 rounded-2xl"
            style={{
              border: `1px solid ${item.highlighted ? (el.content.highlightBorder || el.content.cardBorder || "#22c55e") : (el.content.cardBorder || "rgba(255,255,255,0.1)")}`,
              backgroundColor: item.highlighted ? (el.content.highlightBg || el.content.cardBg || "rgba(34,197,94,0.05)") : (el.content.cardBg || "rgba(255,255,255,0.05)"),
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: el.content.cardNameColor || "#ffffff" }}>{item.name}</h3>
            <p className="text-sm mb-4" style={{ color: el.content.cardDescColor || "#94a3b8" }}>{item.desc}</p>
            <p className="text-3xl font-extrabold mb-6" style={{ color: el.content.cardPriceColor || "#ffffff" }}>{item.price}</p>
            <ul className="space-y-2 mb-8">
              {(item.features || []).map((f: string, fi: number) => (
                <li key={fi} className="flex items-center gap-2 text-sm" style={{ color: el.content.cardFeatureColor || "#d1d5db" }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: el.content.cardFeatureColor || "#22c55e" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: "#22c55e", color: "#ffffff" }}>{item.cta || "Pilih Paket"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-10" style={titleStyle}>{el.content.title}</h2>}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: el.content.cardBg || "rgba(255,255,255,0.05)",
              border: `1px solid ${el.content.cardBorder || "rgba(255,255,255,0.1)"}`,
            }}
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: item.rating || 5 }).map((_, ri) => (
                <svg key={ri} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-4" style={{ color: el.content.cardTextColor || "#d1d5db" }}>&ldquo;{item.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: el.content.avatarBg || "rgba(34,197,94,0.2)", color: el.content.avatarColor || "#22c55e" }}>{item.avatar || "U"}</div>
              <div>
                <p style={{ color: el.content.authorNameColor || "#ffffff", fontSize: el.content.authorNameSize || "14px", fontWeight: el.content.authorNameWeight || "600" }}>{item.name}</p>
                <p style={{ color: el.content.authorRoleColor || "#6b7280", fontSize: el.content.authorRoleSize || "12px" }}>{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTAElement({ el, editing, onEdit, onBlurEditing }: ElementComponentProps) {
  const elStyles = applyStyles(el);
  if (!elStyles.backgroundColor) {
    elStyles.backgroundColor = "#22c55e";
  }

  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "36px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "rgba(255,255,255,0.8)",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to exit editing
  useEffect(() => {
    if (!editing) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onBlurEditing?.();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editing, onBlurEditing]);

  const handleFieldBlur = (field: string, e: React.FocusEvent<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>) => {
    onEdit?.({ [field]: e.currentTarget.textContent || "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
      onBlurEditing?.();
    }
  };

  return (
    <div ref={containerRef} className="text-center py-16 px-6 rounded-2xl" style={elStyles}>
      <h2
        className="mb-4 outline-none"
        style={titleStyle}
        contentEditable={editing || undefined}
        suppressContentEditableWarning
        onBlur={editing ? (e) => handleFieldBlur("title", e) : undefined}
        onKeyDown={editing ? handleKeyDown : undefined}
      >
        {el.content.title || "Siap Memulai?"}
      </h2>
      <p
        className="mb-8 max-w-xl mx-auto outline-none"
        style={subtitleStyle}
        contentEditable={editing || undefined}
        suppressContentEditableWarning
        onBlur={editing ? (e) => handleFieldBlur("subtitle", e) : undefined}
        onKeyDown={editing ? handleKeyDown : undefined}
      >
        {el.content.subtitle || "Hubungi kami sekarang"}
      </p>
      <span
        className="inline-flex items-center gap-2 font-bold rounded-xl outline-none"
        style={{
          backgroundColor: el.content.buttonBg || "#ffffff",
          color: el.content.buttonTextColor || "#1e293b",
          paddingLeft: el.content.buttonPaddingX || "32px",
          paddingRight: el.content.buttonPaddingX || "32px",
          paddingTop: el.content.buttonPaddingY || "16px",
          paddingBottom: el.content.buttonPaddingY || "16px",
        }}
        contentEditable={editing || undefined}
        suppressContentEditableWarning
        onBlur={editing ? (e) => handleFieldBlur("buttonText", e) : undefined}
        onKeyDown={editing ? handleKeyDown : undefined}
      >
        {el.content.buttonText || "Konsultasi Gratis"}
      </span>
    </div>
  );
}

function StatsElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const cols = el.content.columns || 4;
  const elStyles = applyStyles(el);
  return (
    <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, ...elStyles }}>
      {items.map((item: any, i: number) => (
        <div key={i} className="text-center">
          <div className="font-extrabold mb-1" style={{ color: el.content.valueColor || "#22c55e", fontSize: el.content.valueSize || "36px", fontWeight: el.content.valueWeight || "800" }}>{item.value}</div>
          <div style={{ color: el.content.labelColor || "#94a3b8", fontSize: el.content.labelSize || "14px" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function ContactFormElement({ el }: ElementComponentProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = (data.get("name") || "") as string;
    const email = (data.get("email") || "") as string;
    const phone = (data.get("phone") || "") as string;
    const message = (data.get("message") || "") as string;

    // Also open WhatsApp as fallback
    const waText = encodeURIComponent(
      `Halo,\n\nNama: ${name}\nEmail: ${email}\nPesan: ${message}`
    );
    window.open(`https://wa.me/${el.content.whatsappNumber || "6282210099969"}?text=${waText}`, "_blank");

    // Send email via API if recipient email is configured
    const recipientEmail = el.content.recipientEmail;
    if (recipientEmail) {
      setSending(true);
      setError("");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
            recipientEmail,
            siteName: el.content.siteName || "",
          }),
        });
        const result = await res.json();
        if (result.success) {
          setSent(true);
          setTimeout(() => setSent(false), 5000);
        } else {
          setError(result.error || "Gagal mengirim email");
        }
      } catch (err) {
        setError("Gagal mengirim email. Coba lagi.");
      } finally {
        setSending(false);
      }
    }

    form.reset();
  };

  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const inputBg = el.content.inputBg || "rgba(255,255,255,0.05)";
  const inputBorder = el.content.inputBorder || "rgba(255,255,255,0.1)";
  const inputText = el.content.inputText || "#ffffff";
  const buttonBg = el.content.buttonBg || "#22c55e";
  const buttonTextColor = el.content.buttonTextColor || "#ffffff";
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-8" style={subtitleStyle}>{el.content.subtitle}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input type="text" name="name" placeholder="Nama Lengkap" required className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        <textarea name="message" placeholder="Pesan" required rows={4} className="w-full px-4 py-3 rounded-xl focus:outline-none resize-none" style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        <button type="submit" disabled={sending} className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50" style={{ backgroundColor: buttonBg, color: buttonTextColor }}>
          {sending ? "Mengirim..." : sent ? "✓ Pesan Terkirim!" : error ? "Coba Lagi" : "Kirim Pesan"}
        </button>
        {error && <p className="text-xs text-red-400 text-center mt-2">{error}</p>}
        {sent && <p className="text-xs text-green-400 text-center mt-2">Pesan berhasil dikirim via email & WhatsApp!</p>}
      </form>
    </div>
  );
}

function MapsElement({ el }: ElementComponentProps) {
  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };

  // Parse embedUrl to extract coordinates for iframe
  const embedUrl = el.content.embedUrl || "";
  const [resolvedUrl, setResolvedUrl] = useState(embedUrl);
  const [resolving, setResolving] = useState(false);

  // Resolve share.google links client-side via API
  useEffect(() => {
    const abort = new AbortController();
    if (embedUrl.includes("share.google")) {
      setResolving(true);
      fetch(`/api/resolve-url?url=${encodeURIComponent(embedUrl)}`, { signal: abort.signal })
        .then((r) => r.json())
        .then((data) => {
          if (!abort.signal.aborted && data.url) {
            setResolvedUrl(data.url);
          }
        })
        .catch(() => {
          if (!abort.signal.aborted) setResolvedUrl(embedUrl);
        })
        .finally(() => {
          if (!abort.signal.aborted) setResolving(false);
        });
    } else {
      setResolvedUrl(embedUrl);
    }
    return () => abort.abort();
  }, [embedUrl]);

  let iframeSrc = "";
  const urlToParse = resolvedUrl;
  if (urlToParse.includes("@")) {
    // Format: https://www.google.com/maps/place/.../@-6.2088,106.8456,13z
    const coordsMatch = urlToParse.match(/@([\d.\-]+),([\d.\-]+)/);
    if (coordsMatch) {
      const lat = coordsMatch[1];
      const lng = coordsMatch[2];
      const zoomMatch = urlToParse.match(/@[\d.\-]+,[\d.\-]+,([\d.]+)/);
      const zoom = zoomMatch ? zoomMatch[1] : "13";
      iframeSrc = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=${zoom}`;
    }
  } else if (urlToParse.includes("?q=")) {
    // Format: https://maps.google.com/maps?q=-6.2088,106.8456
    const qMatch = urlToParse.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      iframeSrc = `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(qMatch[1]))}&output=embed`;
    }
  } else if (urlToParse.includes("/embed")) {
    // Already an embed URL, use directly
    iframeSrc = urlToParse;
  } else if (urlToParse.includes("google.com/maps") || urlToParse.includes("maps.google")) {
    // Other google maps URL, try to use with output=embed
    const baseUrl = urlToParse.split("?")[0];
    iframeSrc = `${baseUrl}?output=embed`;
  }

  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-6" style={titleStyle}>{el.content.title}</h2>}
      <div className="rounded-2xl overflow-hidden" style={{ borderRadius: el.styles.borderRadius, height: "320px" }}>
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: el.content.cardBg || "rgba(255,255,255,0.05)", border: `1px solid ${el.content.cardBorder || "rgba(255,255,255,0.1)"}` }}>
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: el.content.addressColor || "#64748b" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm" style={{ color: el.content.addressColor || "#94a3b8" }}>{el.content.address || "Jakarta, Indonesia"}</p>
              <p className="text-xs mt-1" style={{ color: "#4b5563" }}>Masukkan link Google Maps</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavbarElement({ el, editing, onEdit, onBlurEditing }: ElementComponentProps) {
  const links = el.content.links || [];
  const logoImg = el.content.logoImage;
  const logoH = el.content.logoHeight || "32";
  const elStyles = applyStyles(el);
  // Use textAlign from styles as fallback for individual alignment fields
  const ta = el.styles.textAlign;
  const defaultLogoAlign = ta === "center" ? "center" : ta === "right" ? "end" : "start";
  const defaultMenuAlign = ta === "center" ? "center" : ta === "right" ? "end" : "center";
  const defaultCtaAlign = ta === "center" ? "center" : ta === "right" ? "end" : "end";
  const logoAlign = el.content.logoAlign || defaultLogoAlign;
  const menuAlign = el.content.menuAlign || defaultMenuAlign;
  const ctaAlign = el.content.ctaAlign || defaultCtaAlign;
  const [menuOpen, setMenuOpen] = useState(false);
  // Remove textAlign & padding from nav style since Tailwind handles them
  const navStyle = { ...elStyles };
  delete navStyle.textAlign;
  delete navStyle.padding;
  delete navStyle.paddingTop;
  delete navStyle.paddingBottom;
  delete navStyle.paddingLeft;
  delete navStyle.paddingRight;

  const mapAlign = (align: string): "flex-start" | "center" | "flex-end" => {
    if (align === "start") return "flex-start";
    if (align === "end") return "flex-end";
    return "center";
  };

  // ── Per-component styles ──
  const logoStyle: React.CSSProperties = {
    color: el.content.logoColor || "#ffffff",
    fontWeight: el.content.logoFontWeight || "700",
    fontSize: el.content.logoFontSize || undefined,
    fontFamily: el.styles.fontFamily || undefined,
  };

  const menuStyle: React.CSSProperties = {
    color: el.content.menuColor || "#94a3b8",
    fontWeight: el.content.menuFontWeight || "500",
    fontSize: el.content.menuFontSize || "14px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const menuHoverColor = el.content.menuHoverColor || "#22c55e";

  const ctaStyle: React.CSSProperties = {
    backgroundColor: el.content.ctaBgColor || "#22c55e",
    color: el.content.ctaColor || "#ffffff",
    fontWeight: el.content.ctaFontWeight || "600",
    fontSize: el.content.ctaFontSize || "14px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="flex items-center justify-between gap-4 py-4 px-6" style={navStyle}>
        {/* Logo - natural width */}
        <div className="flex items-center flex-shrink-0" style={{ justifyContent: mapAlign(logoAlign) }}>
          {logoImg ? (
            <img src={logoImg} alt={el.content.logo || "Logo"} className="object-contain" style={{ height: `${logoH}px` }} />
          ) : editing ? (
            <input
              autoFocus
              defaultValue={el.content.logo || "Logo"}
              onBlur={(e) => {
                onEdit?.({ logo: e.target.value });
                onBlurEditing?.();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") onBlurEditing?.();
              }}
              className="bg-transparent border-b border-white/30 outline-none"
              style={{ ...logoStyle, fontSize: logoStyle.fontSize || "1.25rem" }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span style={logoStyle}>
              {el.content.logo || "Logo"}
            </span>
          )}
        </div>
        {/* Menu Links - Desktop - fills remaining space */}
        <div className="hidden md:flex items-center gap-6 flex-1" style={{ justifyContent: mapAlign(menuAlign) }}>
          {links.map((link: any, i: number) => (
            <a
              key={i}
              href={link.href || "#"}
              className="relative transition-colors duration-200"
              style={menuStyle}
              onMouseEnter={(e) => { e.currentTarget.style.color = menuHoverColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = menuStyle.color || '#94a3b8'; }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: menuHoverColor, width: '0' }}
                onMouseEnter={(e) => { e.currentTarget.style.width = '100%'; }}
                onMouseLeave={(e) => { e.currentTarget.style.width = '0'; }}
              />
            </a>
          ))}
        </div>
        {/* CTA - Desktop - natural width */}
        <div className="hidden md:flex items-center flex-shrink-0" style={{ justifyContent: mapAlign(ctaAlign) }}>
          <a href={el.content.ctaHref || "#"} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={ctaStyle}>
            {el.content.ctaText || "Hubungi"}
          </a>
        </div>
        {/* Hamburger Button - Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          style={{ color: el.content.menuColor || "#94a3b8" }}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>
      {/* Mobile Menu Overlay - with z-index so it shows above other content */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 relative z-50 w-full" style={{ backgroundColor: navStyle.backgroundColor || "#0f172a" }}>
          <div className="px-6 py-4 space-y-3">
            {links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href || "#"}
                onClick={closeMenu}
                className="block py-2 transition-colors duration-200"
                style={menuStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = menuHoverColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = menuStyle.color || '#94a3b8'; }}
              >
                {link.label}
              </a>
            ))}
            <a
              href={el.content.ctaHref || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="block w-full text-center px-5 py-3 rounded-xl hover:opacity-90 transition-all mt-2"
              style={ctaStyle}
            >
              {el.content.ctaText || "Hubungi"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function FooterElement({ el }: ElementComponentProps) {
  const links = el.content.links || [];
  const logoImg = el.content.logoImage;
  const logoH = el.content.logoHeight || "40";

  // ── Per-component styles ──
  const logoStyle: React.CSSProperties = {
    color: el.content.logoColor || "#ffffff",
    fontSize: el.content.logoFontSize || "20px",
    fontWeight: el.content.logoFontWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const descStyle: React.CSSProperties = {
    color: el.content.descColor || "#6b7280",
    fontSize: el.content.descSize || "14px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const linkHeadingStyle: React.CSSProperties = {
    color: el.content.linkHeadingColor || "#9ca3af",
    fontSize: el.content.linkHeadingSize || "12px",
    fontWeight: "600",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const linkHoverColor = el.content.linkHoverColor || "#ffffff";
  const linkColor = el.content.linkColor || "#6b7280";
  const linkSize = el.content.linkSize || "14px";

  const socialIconStyle: React.CSSProperties = {
    backgroundColor: el.content.socialIconBg || "rgba(255,255,255,0.05)",
    borderColor: el.content.socialIconBorder || "rgba(255,255,255,0.1)",
    color: el.content.socialIconColor || "#9ca3af",
  };
  const socialHoverBorder = el.content.socialIconHoverBorder || "rgba(34,197,94,0.4)";
  const socialHoverColor = el.content.socialIconHoverColor || "#22c55e";

  const copyrightStyle: React.CSSProperties = {
    color: el.content.copyrightColor || "#4b5563",
    fontSize: el.content.copyrightSize || "14px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  return (
    <div className="py-12 px-6">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="md:col-span-1">
          {logoImg ? (
            <img src={logoImg} alt={el.content.logo || "Logo"} className="object-contain mb-2" style={{ height: `${logoH}px` }} />
          ) : (
            <span style={logoStyle}>
              {el.content.logo || "Logo"}
            </span>
          )}
          <p className="mt-2" style={descStyle}>{el.content.description || ""}</p>
        </div>
        <div>
          <h4 className="uppercase tracking-wider mb-4" style={linkHeadingStyle}>{el.content.linksHeading || "Links"}</h4>
          <div className="space-y-2">
            {links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href || "#"}
                className="block transition-colors"
                style={{ color: linkColor, fontSize: linkSize }}
                onMouseEnter={(e) => { e.currentTarget.style.color = linkHoverColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="uppercase tracking-wider mb-4" style={linkHeadingStyle}>Ikuti Kami</h4>
          <div className="flex gap-3">
            {[el.content.socials || []].flat().map((s: any, i: number) => (
              <a
                key={i}
                href={s.url || "#"}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={socialIconStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = socialHoverColor + "20";
                  e.currentTarget.style.borderColor = socialHoverBorder;
                  e.currentTarget.style.color = socialHoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = socialIconStyle.backgroundColor || "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = socialIconStyle.borderColor || "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = socialIconStyle.color || "#9ca3af";
                }}
              >
                <span className="text-sm">{s.platform?.charAt(0).toUpperCase() || "S"}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 max-w-5xl mx-auto" />
      <p className="text-center" style={copyrightStyle}>{el.content.copyright || `© ${new Date().getFullYear()}. All rights reserved.`}</p>
    </div>
  );
}

function ThreeBackgroundElement({ el }: ElementComponentProps) {
  const intensity = el.content.intensity || 0.5;
  const color = el.content.color || "#22c55e";
  const shapes = [
    { top: "25%", left: "25%", w: "32", h: "32", rounded: true, duration: "4s" },
    { top: "33%", right: "25%", w: "24", h: "24", rounded: false, rotate: true, duration: "5s" },
    { bottom: "25%", right: "33%", w: "40", h: "40", rounded: true, duration: "6s" },
    { bottom: "33%", left: "33%", w: "20", h: "20", rounded: false, rotate: true, duration: "3.5s" },
  ];

  return (
    <div className="relative h-0 overflow-visible" style={{ zIndex: 0 }}>
      {/* Radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: intensity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              `radial-gradient(circle at 20% 50%, ${color}15 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, ${color}0a 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 80%, ${color}0a 0%, transparent 50%)`,
            ].join(","),
          }}
        />
        {/* Floating geometric shapes */}
        {shapes.map((s, i) => (
          <div
            key={i}
            className={`absolute animate-pulse pointer-events-none ${s.rounded ? "rounded-full" : ""}`}
            style={{
              top: "top" in s ? s.top : undefined,
              bottom: "bottom" in s ? s.bottom : undefined,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: `${parseInt(s.w) * 4}px`,
              height: `${parseInt(s.h) * 4}px`,
              border: `1px solid ${color}30`,
              transform: s.rotate ? "rotate(45deg)" : undefined,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselElement({ el }: ElementComponentProps) {
  const slides = el.content.slides || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlay = el.content.autoPlay !== false;
  const interval = el.content.interval || 4000;

  const goTo = (idx: number) => {
    const total = slides.length;
    if (total === 0) return;
    setActiveIdx(((idx % total) + total) % total);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    timerRef.current = setInterval(() => goTo(activeIdx + 1), interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, interval, activeIdx, slides.length]);

  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const carouselHeight = el.content.height || "400px";

  if (slides.length === 0) {
    return <div className="text-center text-gray-500 py-10">Tambah slide untuk memulai carousel</div>;
  }

  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-6" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="relative overflow-hidden rounded-2xl" style={{ height: carouselHeight }}>
        {/* Slides */}
        {slides.map((slide: any, i: number) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              opacity: i === activeIdx ? 1 : 0,
              transform: `translateX(${(i - activeIdx) * 100}%)`,
              transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out",
              zIndex: i === activeIdx ? 1 : 0,
            }}
          >
            <img
              src={slide.image || "https://placehold.co/800x500/1e293b/64748b?text=Slide"}
              alt={slide.caption || ""}
              className="w-full h-full object-cover"
            />
            {slide.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p style={{ color: el.content.captionColor || "#ffffff", fontSize: el.content.captionSize || "14px" }}>
                  {slide.caption}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIdx - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: el.content.arrowBg || "rgba(0,0,0,0.3)", color: el.content.arrowColor || "#ffffff" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo(activeIdx + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: el.content.arrowBg || "rgba(0,0,0,0.3)", color: el.content.arrowColor || "#ffffff" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === activeIdx ? (el.content.dotActiveColor || "#22c55e") : (el.content.dotColor || "rgba(255,255,255,0.3)"),
                  transform: i === activeIdx ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AccordionElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-6" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="max-w-2xl mx-auto space-y-3">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: el.content.itemBg || "rgba(255,255,255,0.05)",
              border: `1px solid ${el.content.itemBorder || "rgba(255,255,255,0.1)"}`,
            }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors"
              style={{ color: el.content.questionColor || "#ffffff", fontSize: el.content.questionSize || "16px", fontWeight: el.content.questionWeight || "600" }}
            >
              <span>{item.question}</span>
              <svg
                className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                style={{
                  transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)",
                  color: el.content.iconColor || "#22c55e",
                }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: openIdx === i ? "500px" : "0px",
                opacity: openIdx === i ? 1 : 0,
              }}
            >
              <div className="px-5 pb-5" style={{ color: el.content.answerColor || "#94a3b8", fontSize: el.content.answerSize || "14px" }}>
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamElement({ el }: ElementComponentProps) {
  const members = el.content.members || [];
  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-10" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {members.map((member: any, i: number) => (
          <div
            key={i}
            className="p-6 rounded-2xl text-center"
            style={{
              backgroundColor: el.content.cardBg || "rgba(255,255,255,0.05)",
              border: `1px solid ${el.content.cardBorder || "rgba(255,255,255,0.1)"}`,
            }}
          >
            <img
              src={member.image || "https://placehold.co/200x200/1e293b/64748b?text=Team"}
              alt={member.name}
              className="mx-auto rounded-full object-cover mb-4"
              style={{ width: el.content.avatarSize || "120px", height: el.content.avatarSize || "120px" }}
            />
            <h3 style={{ color: el.content.nameColor || "#ffffff", fontSize: el.content.nameSize || "18px", fontWeight: el.content.nameWeight || "700" }}>
              {member.name}
            </h3>
            <p style={{ color: el.content.roleColor || "#94a3b8", fontSize: el.content.roleSize || "14px" }} className="mb-4">
              {member.role}
            </p>
            <div className="flex justify-center gap-3">
              {member.socials?.instagram && (
                <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  style={{ color: el.content.socialIconColor || "#64748b" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = el.content.socialIconHoverColor || "#22c55e"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = el.content.socialIconColor || "#64748b"; }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {member.socials?.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  style={{ color: el.content.socialIconColor || "#64748b" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = el.content.socialIconHoverColor || "#22c55e"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = el.content.socialIconColor || "#64748b"; }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountdownElement({ el }: ElementComponentProps) {
  const targetDate = el.content.targetDate ? new Date(el.content.targetDate).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const elStyles = applyStyles(el);
  const titleStyle: React.CSSProperties = {
    color: el.content.titleColor || "#ffffff",
    fontSize: el.content.titleSize || "30px",
    fontWeight: el.content.titleWeight || "700",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: el.content.subtitleColor || "#94a3b8",
    fontSize: el.content.subtitleSize || "16px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const numStyle: React.CSSProperties = {
    color: el.content.numberColor || "#22c55e",
    fontSize: el.content.numberSize || "48px",
    fontWeight: el.content.numberWeight || "800",
    fontFamily: el.styles.fontFamily || undefined,
  };
  const labelStyle: React.CSSProperties = {
    color: el.content.labelColor || "#94a3b8",
    fontSize: el.content.labelSize || "14px",
    fontFamily: el.styles.fontFamily || undefined,
  };

  const boxes = [
    { value: timeLeft.days, label: el.content.labelDays || "Hari" },
    { value: timeLeft.hours, label: el.content.labelHours || "Jam" },
    { value: timeLeft.minutes, label: el.content.labelMinutes || "Menit" },
    { value: timeLeft.seconds, label: el.content.labelSeconds || "Detik" },
  ];

  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-10" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {boxes.map((box, i) => (
          <div key={i} className="flex items-center gap-4 md:gap-6">
            <div
              className="flex flex-col items-center rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]"
              style={{
                backgroundColor: el.content.boxBg || "rgba(255,255,255,0.05)",
                border: `1px solid ${el.content.boxBorder || "rgba(255,255,255,0.1)"}`,
              }}
            >
              <span style={numStyle}>{String(box.value).padStart(2, "0")}</span>
              <span style={labelStyle}>{box.label}</span>
            </div>
            {i < boxes.length - 1 && (
              <span className="text-2xl md:text-3xl font-bold self-start pt-4 md:pt-6" style={{ color: el.content.separatorColor || "rgba(255,255,255,0.1)" }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const elementComponents: Record<string, React.FC<ElementComponentProps>> = {
  heading: HeadingElement,
  text: TextElement,
  image: ImageElement,
  button: ButtonElement,
  video: VideoElement,
  spacer: SpacerElement,
  divider: DividerElement,
  icon: IconElement,
  features: FeaturesElement,
  pricing: PricingElement,
  testimonial: TestimonialElement,
  cta: CTAElement,
  stats: StatsElement,
  contactForm: ContactFormElement,
  maps: MapsElement,
  navbar: NavbarElement,
  footer: FooterElement,
  "three-background": ThreeBackgroundElement,
  carousel: CarouselElement,
  accordion: AccordionElement,
  team: TeamElement,
  countdown: CountdownElement,
};

export function ElementRenderer({
  element,
  editing,
  onEdit,
  onBlurEditing,
}: {
  element: BuilderElement;
  editing?: boolean;
  onEdit?: (content: Record<string, any>) => void;
  onBlurEditing?: () => void;
}) {
  const Component = elementComponents[element.type];
  if (!Component) {
    return <div className="text-gray-500 text-sm">Unknown element: {element.type}</div>;
  }
  return <Component el={element} editing={editing} onEdit={onEdit} onBlurEditing={onBlurEditing} />;
}
