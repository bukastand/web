"use client";

import { useState, useRef, useEffect } from "react";
import type { BuilderElement } from "@/lib/builder/types";
import { applyBgOpacity } from "@/lib/builder/utils";
import { SocialIcon } from "@/lib/builder/social-platforms";
import Lottie from "lottie-react";
import { ThreeSceneElement, ThreeParticlesElement } from "./ThreeDElements";

interface ElementComponentProps {
  el: BuilderElement;
  editing?: boolean;
  onEdit?: (content: Record<string, any>) => void;
  onBlurEditing?: () => void;
}

function applyStyles(el: BuilderElement): React.CSSProperties {
  const s: React.CSSProperties = {
};

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
    fontSize: el.content.titleSize || "24px",
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
      {el.content.subtitle && <p className="text-center mb-6 md:mb-10" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${cols > 2 ? "280px" : "200px"}), 1fr))` }}>
        {items.map((item: any, i: number) => {
          const iconDef = FEATURE_ICONS[item.icon];
          return (
            <div
              key={i}
              className="p-4 md:p-6 rounded-2xl text-center"
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
      {el.content.subtitle && <p className="text-center mb-6 md:mb-10" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div
        className="mx-auto px-4 sm:px-0"
        style={{
          maxWidth: "1200px",
          display: "grid",
          gap: items.length <= 4 ? "1rem" : "0.75rem",
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${items.length <= 3 ? "300px" : "280px"}), 1fr))`,
        }}
      >
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className={`flex flex-col rounded-2xl ${item.highlighted ? "ring-2 ring-[#22c55e] scale-[1.01] md:scale-105 z-10" : ""}`}
            style={{
              padding: item.highlighted ? "1.25rem" : "1rem",
              border: item.highlighted ? "none" : `1px solid ${el.content.cardBorder || "rgba(255,255,255,0.1)"}`,
              backgroundColor: item.highlighted ? (el.content.highlightBg || el.content.cardBg || "rgba(34,197,94,0.08)") : (el.content.cardBg || "rgba(255,255,255,0.05)"),
            }}
          >
            <h3 className="text-lg md:text-xl font-bold mb-1.5" style={{ color: el.content.cardNameColor || "#ffffff" }}>{item.name}</h3>
            <p className="text-xs md:text-sm mb-3" style={{ color: el.content.cardDescColor || "#94a3b8" }}>{item.desc}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-4 md:mb-6" style={{ color: el.content.cardPriceColor || "#ffffff" }}>{item.price}</p>
            <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-8 flex-1">
              {(item.features || []).map((f: string, fi: number) => (
                <li key={fi} className="flex items-start gap-2 text-xs md:text-sm" style={{ color: el.content.cardFeatureColor || "#d1d5db" }}>
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: el.content.cardFeatureColor || "#22c55e" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-2 md:py-3 rounded-xl font-semibold text-xs md:text-sm hover:opacity-90 transition-all mt-auto" style={{ backgroundColor: el.content.cardButtonBg || "#22c55e", color: el.content.cardButtonTextColor || "#ffffff" }}>{item.cta || "Pilih Paket"}</button>
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
      {el.content.title && <h2 className="text-center mb-6 md:mb-10" style={titleStyle}>{el.content.title}</h2>}
      <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-2xl mx-auto">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-4 md:p-6 rounded-2xl"
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
    <div ref={containerRef} className="text-center py-10 md:py-16 px-4 md:px-6 rounded-2xl" style={elStyles}>
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
        className="mb-6 md:mb-8 max-w-xl mx-auto outline-none"
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
    <div className="grid gap-4 md:gap-8" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 150px), 1fr))`, ...elStyles }}>
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
        <input type="text" name="name" placeholder="Nama Lengkap" required className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus:outline-none" style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
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
          if (!abort.signal.aborted && data.url && !data.error) {
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
  } else if (urlToParse && (urlToParse.startsWith("http://") || urlToParse.startsWith("https://"))) {
    // Fallback: coba gunakan URL langsung — mencakup share.google dan format lain
    iframeSrc = urlToParse.includes("?") ? `${urlToParse}&output=embed` : `${urlToParse}?output=embed`;
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
      <nav className="flex items-center justify-between gap-4 py-3 md:py-4 px-4 md:px-6" style={navStyle}>
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
            className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl hover:opacity-90 transition-all"
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
              className="block w-full text-center px-4 py-3 rounded-xl hover:opacity-90 transition-all mt-2"
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
    <div className="py-8 md:py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
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
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all"
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
                <SocialIcon platform={s.platform || ""} className="w-5 h-5" />
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
  const carouselHeight = el.content.height || "clamp(250px, 50vw, 400px)";

  if (slides.length === 0) {
    return <div className="text-center text-gray-500 py-10">Tambah slide untuk memulai carousel</div>;
  }

  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-center mb-2" style={titleStyle}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-center mb-6" style={subtitleStyle}>{el.content.subtitle}</p>}
      <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-video md:aspect-[21/9]" style={{ minHeight: "180px", maxHeight: "70vh" }}>
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
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black/60 to-transparent">
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
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: el.content.arrowBg || "rgba(0,0,0,0.3)", color: el.content.arrowColor || "#ffffff" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo(activeIdx + 1)}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
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
      <div className="max-w-2xl mx-auto space-y-2 md:space-y-3">
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
              className="w-full flex items-center justify-between p-3 sm:p-5 text-left transition-colors"
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
      <div className="grid grid-cols-1 gap-4 md:gap-8 max-w-2xl mx-auto">
        {members.map((member: any, i: number) => (
          <div
            key={i}
            className="p-4 md:p-6 rounded-2xl text-center"
            style={{
              backgroundColor: el.content.cardBg || "rgba(255,255,255,0.05)",
              border: `1px solid ${el.content.cardBorder || "rgba(255,255,255,0.1)"}`,
            }}
          >
            <img
              src={member.image || "https://placehold.co/200x200/1e293b/64748b?text=Team"}
              alt={member.name}
              className="mx-auto rounded-full object-cover mb-4 max-w-[40vw] md:max-w-none"
              style={{ width: el.content.avatarSize || "120px", height: el.content.avatarSize || "120px" }}
            />
            <h3 style={{ color: el.content.nameColor || "#ffffff", fontSize: el.content.nameSize || "18px", fontWeight: el.content.nameWeight || "700" }}>
              {member.name}
            </h3>
            <p style={{ color: el.content.roleColor || "#94a3b8", fontSize: el.content.roleSize || "14px" }} className="mb-4">
              {member.role}
            </p>
            <div className="flex justify-center gap-3">
              {/* Backward compat: old format { instagram: url } -> array */}
              {(Array.isArray(member.socials) ? member.socials : 
                member.socials ? Object.entries(member.socials).map(([k, v]) => ({ platform: k, url: v })) : []
              ).filter((s: any) => s && s.url).map((s: any, si: number) => (
                <a key={si} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  style={{ color: el.content.socialIconColor || "#64748b" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = el.content.socialIconHoverColor || "#22c55e"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = el.content.socialIconColor || "#64748b"; }}
                >
                  <SocialIcon platform={s.platform || ""} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedHeadlineElement({ el }: ElementComponentProps) {
  const {
    beforeText = "",
    highlightedText = "",
    afterText = "",
    beforeTextColor, beforeTextSize, beforeTextWeight, beforeTextFont,
    highlightTextColor, highlightTextSize, highlightTextWeight, highlightTextFont,
    afterTextColor, afterTextSize, afterTextWeight, afterTextFont,
    style: headlineStyle = "highlight",
    animationType = "underline",
    tag = "h2",
    rotatingTexts = [],
  } = el.content;
  const styles = applyStyles(el);
  const [revealed, setRevealed] = useState(false);
  const [cyclingIdx, setCyclingIdx] = useState(0);
  const [animState, setAnimState] = useState<"visible" | "leaving">("visible");

  const texts = rotatingTexts.length > 0 ? rotatingTexts : highlightedText ? [highlightedText] : [""];

  // Trigger reveal animation on mount
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Cycle through rotating texts
  useEffect(() => {
    if (headlineStyle !== "rotating" || texts.length <= 1) return;

    const cycleTime = 3000; // ms per text
    const fadeDuration = 400; // ms for crossfade

    // Start first text visible
    setAnimState("visible");

    const interval = setInterval(() => {
      setAnimState("leaving");
      setTimeout(() => {
        setCyclingIdx((prev) => (prev + 1) % texts.length);
        setAnimState("visible");
      }, fadeDuration);
    }, cycleTime);

    return () => clearInterval(interval);
  }, [headlineStyle, texts.length]);

  // ── Style for each text part ──
  const beforeStyle: React.CSSProperties = {
    color: beforeTextColor || styles.color,
    fontSize: beforeTextSize || styles.fontSize,
    fontWeight: beforeTextWeight || styles.fontWeight,
    fontFamily: beforeTextFont || styles.fontFamily,
  };
  const highlightStyle: React.CSSProperties = {
    color: highlightTextColor || styles.color || "#22c55e",
    fontSize: highlightTextSize || styles.fontSize,
    fontWeight: highlightTextWeight || styles.fontWeight,
    fontFamily: highlightTextFont || styles.fontFamily,
  };
  const afterStyle: React.CSSProperties = {
    color: afterTextColor || styles.color,
    fontSize: afterTextSize || styles.fontSize,
    fontWeight: afterTextWeight || styles.fontWeight,
    fontFamily: afterTextFont || styles.fontFamily,
  };

  // ── Highlight style: animated background reveal ──
  const renderHighlight = () => (
    <span className="relative inline-block">
      <span className="relative z-10" style={highlightStyle}>{highlightedText}</span>
      {animationType === "curly" ? (
        <svg
          className="absolute -bottom-1 left-0 w-full pointer-events-none"
          viewBox="0 0 200 20"
          preserveAspectRatio="none"
          style={{ height: "0.5em" }}
        >
          <path
            d="M5 15 Q 50 0, 100 15 Q 150 30, 195 10"
            fill="none"
            stroke={highlightStyle.color || "#22c55e"}
            strokeWidth="3"
            strokeLinecap="round"
            className={`${revealed ? "animate-headline-curly" : ""}`}
          />
        </svg>
      ) : animationType === "circle" ? (
        <span
          className={`absolute left-1/2 -translate-x-1/2 opacity-30 rounded-full ${revealed ? "animate-headline-pop" : ""}`}
          style={{
            backgroundColor: highlightStyle.color || "#22c55e",
            width: "105%",
            height: "1.3em",
            bottom: "-0.15em",
          }}
        />
      ) : (
        /* underline */
        <span
          className={`absolute bottom-0 left-0 h-1 rounded-full ${revealed ? "animate-headline-reveal" : ""}`}
          style={{
            backgroundColor: highlightStyle.color || "#22c55e",
            width: revealed ? "100%" : "0%",
          }}
        />
      )}
    </span>
  );

  // ── Rotating style: crossfade cycle through texts ──
  const renderRotating = () => {
    if (texts.length === 0 || (texts.length === 1 && !texts[0])) {
      return <span style={highlightStyle}>{highlightedText}</span>;
    }

    const currentText = texts[cyclingIdx];

    return (
      <span className="relative inline-block" style={{ minWidth: "1em" }}>
        <span
          key={cyclingIdx}
          className="inline-block transition-all duration-500"
          style={{
            ...highlightStyle,
            opacity: animState === "leaving" ? 0 : 1,
            transform: animState === "leaving" ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          {currentText}
        </span>
      </span>
    );
  };

  const headlineContent = (
    <>
      {beforeText && <span className="mr-2" style={beforeStyle}>{beforeText}</span>}
      {headlineStyle === "highlight"
        ? renderHighlight()
        : renderRotating()
      }
      {afterText && <span className="ml-2" style={afterStyle}>{afterText}</span>}
    </>
  );

  const cls = "animated-headline leading-tight";

  switch (tag) {
    case "h1": return <h1 className={cls} style={styles}>{headlineContent}</h1>;
    case "h3": return <h3 className={cls} style={styles}>{headlineContent}</h3>;
    case "h4": return <h4 className={cls} style={styles}>{headlineContent}</h4>;
    case "h5": return <h5 className={cls} style={styles}>{headlineContent}</h5>;
    case "h6": return <h6 className={cls} style={styles}>{headlineContent}</h6>;
    case "p": return <p className={cls} style={styles}>{headlineContent}</p>;
    default: return <h2 className={cls} style={styles}>{headlineContent}</h2>;
  }
}

function BlockquoteElement({ el }: ElementComponentProps) {
  const { quoteText, authorName, skin = "border", tweetButton, tweetLabel,
    quoteTextColor, quoteTextSize, quoteFontStyle, quoteFontFamily, quoteTextWeight,
    authorNameColor, authorNameSize, authorNameWeight, authorNameFont,
  } = el.content;
  const styles = applyStyles(el);

  const skinClasses: Record<string, string> = {
    border: "border-l-4 pl-6",
    quotation: "relative pl-12",
    boxed: "p-6 rounded-2xl border",
    clean: "",
  };

  return (
    <blockquote className={skinClasses[skin] || skinClasses.border} style={styles}>
      {skin === "quotation" && (
        <span className="absolute left-0 top-0 text-2xl md:text-4xl leading-none opacity-30" style={{ color: authorNameColor || styles.color || "#22c55e" }}>
          &ldquo;
        </span>
      )}
      <p className="mb-3 leading-relaxed" style={{ color: quoteTextColor || styles.color, fontSize: quoteTextSize || styles.fontSize || "18px", fontStyle: quoteFontStyle || styles.fontStyle || "italic", fontFamily: quoteFontFamily || styles.fontFamily, fontWeight: quoteTextWeight }}>
        &ldquo;{quoteText}&rdquo;
      </p>
      {authorName && (
        <footer className="flex items-center gap-2 mt-3">
          <cite className="not-italic font-semibold" style={{ color: authorNameColor || styles.color || "#22c55e", fontSize: authorNameSize || "14px", fontWeight: authorNameWeight || "600", fontFamily: authorNameFont || styles.fontFamily }}>
            &mdash; {authorName}
          </cite>
          {tweetButton && (
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "#1d9bf0", color: "#ffffff" }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {tweetLabel || "Tweet"}
            </a>
          )}
        </footer>
      )}
    </blockquote>
  );
}

function CodeHighlightElement({ el }: ElementComponentProps) {
  const { language = "javascript", code = "", showLineNumbers, copyButton } = el.content;
  const styles = applyStyles(el);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="code-highlight-wrapper relative group" style={styles}>
      {copyButton && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2.5 py-1.5 text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}
          title="Copy code"
        >
          Salin
        </button>
      )}
      {language && (
        <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
          {language}
        </div>
      )}
      <pre className="overflow-x-auto">
        <code className="text-sm leading-relaxed" style={{ color: "#e2e8f0" }}>
          {showLineNumbers ? (
            lines.map((line: string, i: number) => (
              <div key={i} className="flex gap-4">
                <span className="select-none text-right min-w-[24px]" style={{ color: "#4b5563" }}>{i + 1}</span>
                <span>{line || " "}</span>
              </div>
            ))
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
}

const FLIP_ICONS: Record<string, React.ReactNode> = {
  star: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  heart: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  rocket: <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
  globe: <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  lightbulb: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  shield: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  chart: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  users: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  cog: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  check: <path d="M5 13l4 4L19 7" />,
};

function FlipBoxElement({ el }: ElementComponentProps) {
  const {
    frontGraphic = "icon",
    frontIcon = "star",
    frontImage = "",
    frontTitle,
    frontTitleColor, frontTitleSize, frontTitleWeight, frontTitleFont,
    frontDescription,
    frontDescColor, frontDescSize, frontDescFont, frontDescWeight,
    frontIconColor,
    frontBackground = "#1e293b",
    backImage = "",
    backTitle,
    backTitleColor, backTitleSize, backTitleWeight, backTitleFont,
    backDescription,
    backDescColor, backDescSize, backDescFont, backDescWeight,
    backBackground = "#22c55e",
    backButtonText, backButtonLink = "#",
    backButtonBg, backButtonTextColor, backButtonSize, backButtonWeight, backButtonFont,
  } = el.content;
  const styles = applyStyles(el);

  const backBgStyle: React.CSSProperties = {
    backgroundColor: backBackground,
    backgroundImage: backImage ? `url(${backImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="flip-box perspective-[1000px] group" style={{ height: styles.height || "300px" }}>
      <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180" style={{ transformStyle: "preserve-3d" }}>
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center backface-hidden"
          style={{
            background: frontImage
              ? `url(${frontImage}) center/cover no-repeat, ${frontBackground}`
              : frontBackground,
            borderRadius: styles.borderRadius || "12px",
            backfaceVisibility: "hidden",
          }}
        >
          {frontGraphic === "icon" && FLIP_ICONS[frontIcon] && (
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: frontIconColor || styles.color || "#22c55e" }}>
              {FLIP_ICONS[frontIcon]}
            </svg>
          )}
          <h3 className="font-bold mb-2" style={{ color: frontTitleColor || "#ffffff", fontSize: frontTitleSize || "20px", fontWeight: frontTitleWeight || "700", fontFamily: frontTitleFont }}>{frontTitle}</h3>
          {frontDescription && <p style={{ color: frontDescColor || "#94a3b8", fontSize: frontDescSize || "14px", fontFamily: frontDescFont, fontWeight: frontDescWeight }}>{frontDescription}</p>}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center backface-hidden rotate-y-180"
          style={{
            ...backBgStyle,
            borderRadius: styles.borderRadius || "12px",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="font-bold mb-2" style={{ color: backTitleColor || "#ffffff", fontSize: backTitleSize || "20px", fontWeight: backTitleWeight || "700", fontFamily: backTitleFont }}>{backTitle}</h3>
          {backDescription && <p className="mb-6" style={{ color: backDescColor || "rgba(255,255,255,0.8)", fontSize: backDescSize || "14px", fontFamily: backDescFont, fontWeight: backDescWeight }}>{backDescription}</p>}
          <a
            href={backButtonLink}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: backButtonBg || "#ffffff",
              color: backButtonTextColor || "#1e293b",
              fontSize: backButtonSize || "14px",
              fontWeight: backButtonWeight || "600",
              fontFamily: backButtonFont,
            }}
          >
            {backButtonText || "Pelajari"}
          </a>
        </div>
      </div>
    </div>
  );
}

function HotspotElement({ el }: ElementComponentProps) {
  const { imageSrc, items = [],
    markerColor, markerSize,
    markerTextColor, markerTextSize, markerTextFont, markerTextWeight,
    popupBg, popupBorder, popupWidth, popupPadding, popupRadius,
    labelColor, labelSize, labelWeight, labelFont,
    descColor, descSize, descFont, descWeight,
  } = el.content;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="hotspot-container relative inline-block max-w-full overflow-visible" style={applyStyles(el)}>
      <img
        src={imageSrc || "https://placehold.co/800x500/1e293b/64748b?text=Hotspot"}
        alt="Hotspot"
        className="w-full rounded-2xl"
      />
      {items.map((item: any, i: number) => (
        <div
          key={i}
          className="absolute cursor-pointer"
          style={{ left: item.x || "50%", top: item.y || "50%", transform: "translate(-50%, -50%)" }}
        >
          <div
            className="rounded-full flex items-center justify-center font-bold transition-all hover:scale-110 relative"
            style={{
              width: markerSize || "32px",
              height: markerSize || "32px",
              backgroundColor: markerColor || "#22c55e",
              color: markerTextColor || "#ffffff",
              fontSize: markerTextSize || "14px",
              fontFamily: markerTextFont,
              fontWeight: markerTextWeight,
            }}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          >
            <span>+</span>
          </div>
          {activeIdx === i && (
            <div
              className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: popupWidth || "192px",
                padding: popupPadding || "12px",
                borderRadius: popupRadius || "12px",
                backgroundColor: popupBg || "#1e293b",
                border: `1px solid ${popupBorder || "rgba(255,255,255,0.1)"}`,
              }}
            >
              <p className="mb-1" style={{
                color: labelColor || "#22c55e",
                fontSize: labelSize || "12px",
                fontWeight: labelWeight || "600",
                fontFamily: labelFont,
              }}>{item.label}</p>
              {item.description && <p className="leading-relaxed" style={{
                color: descColor || "#94a3b8",
                fontSize: descSize || "10px",
                fontFamily: descFont,
                fontWeight: descWeight,
              }}>{item.description}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProgressTrackerElement({ el }: ElementComponentProps) {
  const { type = "horizontal", percentage, progress = 50, label,
    labelColor, labelSize, labelWeight, labelFont,
    percentageColor, percentageSize, percentageWeight, percentageFont,
    barColor, trackColor, barHeight, barRadius, circleSize, strokeWidth,
  } = el.content;
  const allStyles = applyStyles(el);
  const pct = Math.min(100, Math.max(0, progress));
  const accentColor = (el.styles as any).accentColor || "#22c55e";
  const _trackColor = trackColor || el.styles.backgroundColor || "#1e293b";

  // Extract only text-level styles for wrapper (NOT bar styles)
  const wrapperStyle: React.CSSProperties = {};
  if (allStyles.color) wrapperStyle.color = allStyles.color;
  if (allStyles.fontSize) wrapperStyle.fontSize = allStyles.fontSize;
  if (allStyles.fontWeight) wrapperStyle.fontWeight = allStyles.fontWeight;
  if (allStyles.fontFamily) wrapperStyle.fontFamily = allStyles.fontFamily;
  if (allStyles.textAlign) wrapperStyle.textAlign = allStyles.textAlign;
  if (allStyles.margin) wrapperStyle.margin = allStyles.margin;
  if (allStyles.marginTop) wrapperStyle.marginTop = allStyles.marginTop;
  if (allStyles.marginBottom) wrapperStyle.marginBottom = allStyles.marginBottom;
  if (allStyles.marginLeft) wrapperStyle.marginLeft = allStyles.marginLeft;
  if (allStyles.marginRight) wrapperStyle.marginRight = allStyles.marginRight;
  if (allStyles.padding) wrapperStyle.padding = allStyles.padding;
  if (allStyles.paddingTop) wrapperStyle.paddingTop = allStyles.paddingTop;
  if (allStyles.paddingBottom) wrapperStyle.paddingBottom = allStyles.paddingBottom;
  if (allStyles.paddingLeft) wrapperStyle.paddingLeft = allStyles.paddingLeft;
  if (allStyles.paddingRight) wrapperStyle.paddingRight = allStyles.paddingRight;

  if (type === "circular") {
    const r = 45;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const svgSize = circleSize || "120px";
    const sw = strokeWidth || "8";
    return (
      <div className="flex flex-col items-center" style={wrapperStyle}>
        <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke={_trackColor} strokeWidth={sw} />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={barColor || accentColor} strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        {percentage && (
          <span className="mt-2" style={{
            color: percentageColor || accentColor,
            fontSize: percentageSize || "18px",
            fontWeight: percentageWeight || "700",
            fontFamily: percentageFont,
          }}>{pct}%</span>
        )}
        {label && <span className="mt-1" style={{
          color: labelColor || "#94a3b8",
          fontSize: labelSize || "14px",
          fontWeight: labelWeight || "400",
          fontFamily: labelFont,
        }}>{label}</span>}
      </div>
    );
  }

  const _barHeight = barHeight || el.styles.height || "6px";
  const _barRadius = barRadius || "9999px";

  return (
    <div style={wrapperStyle}>
      {(percentage || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span style={{
            color: labelColor || "#94a3b8",
            fontSize: labelSize || "12px",
            fontWeight: labelWeight || "400",
            fontFamily: labelFont,
          }}>{label}</span>}
          {percentage && <span className="font-semibold" style={{
            color: percentageColor || accentColor,
            fontSize: percentageSize || "12px",
            fontWeight: percentageWeight || "600",
            fontFamily: percentageFont,
          }}>{pct}%</span>}
        </div>
      )}
      <div className="w-full overflow-hidden" style={{
        height: _barHeight,
        backgroundColor: _trackColor,
        borderRadius: _barRadius,
      }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor || accentColor,
            borderRadius: _barRadius,
          }}
        />
      </div>
    </div>
  );
}

function ShareButtonsElement({ el }: ElementComponentProps) {
  const { networks = [], view = "icon-text", skin = "gradient" } = el.content;
  const styles = applyStyles(el);

  const networkConfig: Record<string, { color: string; icon: React.ReactNode; shareUrl: (url: string, text: string) => string }> = {
    facebook: {
      color: "#1877F2",
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
      shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    twitter: {
      color: "#1DA1F2",
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
      shareUrl: (url, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    linkedin: {
      color: "#0A66C2",
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
      shareUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    whatsapp: {
      color: "#25D366",
      icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
      shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    },
    telegram: {
      color: "#26A5E4",
      icon: <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />,
      shareUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
  };

  const skinStyles: Record<string, string> = {
    gradient: "text-white",
    minimal: "bg-transparent border",
    framed: "border-2",
    "boxed-icon": "justify-center",
    flat: "",
  };

  // Current page URL and title for sharing
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = typeof document !== "undefined" ? document.title : "";

  return (
    <div className="flex flex-wrap" style={{ gap: styles.gap || "10px", justifyContent: (styles.textAlign as any) || "center" }}>
      {networks.map((net: any, i: number) => {
        const cfg = networkConfig[net.name];
        if (!cfg) return null;
        return (
          <a
            key={i}
            href={cfg.shareUrl(shareUrl, shareText)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-90 ${skinStyles[skin] || ""}`}
            style={{ backgroundColor: cfg.color, color: "#ffffff" }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{cfg.icon}</svg>
            {view !== "icon" && <span>{net.text || net.name}</span>}
          </a>
        );
      })}
    </div>
  );
}

function ChecklistElement({ el }: ElementComponentProps) {
  const { title, titleColor, titleSize, titleWeight, titleFont, items = [], checkedColor = "#22c55e", textColor = "#ffffff", textSize = "16px", textFont, textWeight, iconSize = "20px" } = el.content;
  const styles = applyStyles(el);

  return (
    <div style={styles}>
      {title && <h3 className="mb-4" style={{ color: titleColor || textColor, fontSize: titleSize || "18px", fontWeight: titleWeight || "700", fontFamily: titleFont }}>{title}</h3>}
      <ul className="space-y-3">
        {items.map((item: any, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <svg
              className="flex-shrink-0 mt-0.5"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={item.checked !== false ? checkedColor : "#64748b"}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {item.icon === "check" || item.checked !== false ? (
                <path d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
            </svg>
            <span style={{ color: textColor, fontSize: textSize, fontFamily: textFont, fontWeight: textWeight }}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GalleryElement({ el }: ElementComponentProps) {
  const { title, titleColor, titleSize, titleWeight, titleFont, images = [], columns = 3, lightbox, captionColor = "#ffffff", captionSize = "14px", captionWeight, captionFont } = el.content;
  const styles = applyStyles(el);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div style={styles}>
      {title && <h2 className="text-center mb-8" style={{ color: titleColor || captionColor, fontSize: titleSize || "24px", fontWeight: titleWeight || "700", fontFamily: titleFont }}>{title}</h2>}
      <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${columns > 2 ? "250px" : "200px"}), 1fr))` }}>
        {images.map((img: any, i: number) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-xl cursor-pointer"
            onClick={() => lightbox && setLightboxIdx(i)}
          >
            <img
              src={img.src || "https://placehold.co/600x400/1e293b/64748b?text=Image"}
              alt={img.alt || img.caption || ""}
              className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p style={{ color: captionColor, fontSize: captionSize, fontWeight: captionWeight || "400", fontFamily: captionFont }}>{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity"
            onClick={() => setLightboxIdx(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {lightboxIdx > 0 && (
            <button className="absolute left-4 text-white hover:opacity-70" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <img
            src={images[lightboxIdx]?.src}
            alt={images[lightboxIdx]?.alt || ""}
            className="max-h-[70vh] sm:max-h-[80vh] max-w-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxIdx < images.length - 1 && (
            <button className="absolute right-4 text-white hover:opacity-70" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LottieElement({ el }: ElementComponentProps) {
  const { src, loop = true, autoplay = true, speed = 1, width = "300px", height = "300px" } = el.content;
  const styles = applyStyles(el);
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setAnimationData(null);
      return;
    }

    setLoading(true);
    setError(false);

    const loadAnimation = async () => {
      try {
        let data;
        if (src.startsWith("data:")) {
          // Uploaded JSON file as data URL
          const base64 = src.split(",")[1];
          const jsonStr = atob(base64);
          data = JSON.parse(jsonStr);
        } else {
          // Remote URL
          const res = await fetch(src);
          data = await res.json();
        }
        setAnimationData(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadAnimation();
  }, [src]);

  // Empty state — no src set
  if (!src) {
    return (
      <div style={{ ...styles, width, height }} className="flex items-center justify-center">
        <div className="rounded-2xl flex flex-col items-center justify-center w-full h-full" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#64748b" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px]" style={{ color: "#64748b" }}>Lottie Animation</span>
          <span className="text-[9px] mt-1" style={{ color: "#4b5563" }}>Isi URL atau upload file .json</span>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ ...styles, width, height }} className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || !animationData) {
    return (
      <div style={{ ...styles, width, height }} className="flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ef4444" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-[10px]" style={{ color: "#ef4444" }}>Gagal memuat animasi</span>
        </div>
      </div>
    );
  }

  // Render actual Lottie animation
  return (
    <div style={{ ...styles, width, height }} className="flex items-center justify-center">
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

function StarRatingElement({ el }: ElementComponentProps) {
  const { title, rating = 5, scale = 5, starColor = "#f59e0b", emptyColor = "#374151", showValue, size = "24px", align = "center", titleColor = "#94a3b8", titleSize = "14px", titleWeight = "500", titleFont } = el.content;
  const styles = applyStyles(el);
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedRating = rating - fullStars >= 0.75 ? fullStars + 1 : hasHalf ? fullStars + 0.5 : fullStars;

  return (
    <div style={{ ...styles, textAlign: align as any }}>
      {title && <p className="mb-2" style={{ color: titleColor, fontSize: titleSize, fontWeight: titleWeight, fontFamily: titleFont }}>{title}</p>}
      <div className="inline-flex items-center gap-1">
        {Array.from({ length: scale }).map((_, i) => {
          const isFull = i < Math.floor(roundedRating);
          const isHalf = !isFull && i < roundedRating;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={isFull || isHalf ? starColor : emptyColor}>
              <defs>
                {isHalf && (
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor={starColor} />
                    <stop offset="50%" stopColor={emptyColor} />
                  </linearGradient>
                )}
              </defs>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
        {showValue && (
          <span className="ml-2 text-sm font-semibold" style={{ color: starColor }}>{rating}</span>
        )}
      </div>
    </div>
  );
}

function SearchElement({ el }: ElementComponentProps) {
  const { placeholder = "Cari...", buttonText = "Cari", buttonIcon, skin = "classic", backgroundColor, textColor, textFont, textSize, textWeight, borderColor, buttonColor, buttonTextColor, buttonFont, buttonTextSize, buttonWeight } = el.content;
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" style={applyStyles(el)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
        style={{
          backgroundColor: backgroundColor || "rgba(255,255,255,0.05)",
          color: textColor || "#ffffff",
          border: `1px solid ${borderColor || "rgba(255,255,255,0.1)"}`,
          fontFamily: textFont,
          fontSize: textSize,
          fontWeight: textWeight,
        }}
      />
      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 flex items-center gap-2"
        style={{ backgroundColor: buttonColor || "#22c55e", color: buttonTextColor || "#ffffff", fontFamily: buttonFont, fontSize: buttonTextSize, fontWeight: buttonWeight }}
      >
        {buttonIcon && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
        {buttonText || "Cari"}
      </button>
    </form>
  );
}

function FloatingButtonsElement({ el }: ElementComponentProps) {
  const { buttons = [], position = "bottom-right" } = el.content;
  const [expanded, setExpanded] = useState(false);

  const posClasses: Record<string, string> = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const iconMap: Record<string, React.ReactNode> = {
    chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    whatsapp: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
  };

  const mainIcon = buttons.length > 0 ? buttons[0].icon : "chat";
  const mainColor = buttons.length > 0 ? buttons[0].color : "#22c55e";

  return (
    <div className={`fixed ${posClasses[position] || "bottom-6 right-6"} z-50 flex flex-col items-end gap-3`}>
      {/* Sub buttons when expanded */}
      {expanded && buttons.slice(1).map((btn: any, i: number) => (
        <a
          key={i}
          href={btn.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 animate-fade-in"
          style={{ backgroundColor: btn.color || "#22c55e" }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconMap[btn.icon] || iconMap.chat}
          </svg>
        </a>
      ))}
      {/* Main FAB */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
        style={{ backgroundColor: mainColor }}
      >
        <svg className={`w-6 h-6 text-white transition-transform ${expanded ? "rotate-45" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {expanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            iconMap[mainIcon] || iconMap.chat
          )}
        </svg>
      </button>
    </div>
  );
}

function BreadcrumbsElement({ el }: ElementComponentProps) {
  const { items = [], separator = "/", textColor = "#94a3b8", activeColor = "#ffffff", separatorColor = "#4b5563", textSize = "14px", fontFamily, fontWeight } = el.content;
  const styles = applyStyles(el);

  return (
    <nav style={styles} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item: any, i: number) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-xs" style={{ color: separatorColor }}>{separator}</span>
            )}
            {item.href && i < items.length - 1 ? (
              <a href={item.href} className="transition-colors hover:opacity-80" style={{ color: textColor, fontSize: textSize, fontFamily, fontWeight }}>
                {item.label}
              </a>
            ) : (
              <span style={{ color: activeColor, fontSize: textSize, fontFamily, fontWeight: fontWeight || 500 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
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
      {/* Mobile: 2x2 grid | Desktop: single row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto">
        {boxes.map((box, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="flex flex-col items-center rounded-2xl w-full p-3 md:p-6"
              style={{
                backgroundColor: el.content.boxBg || "rgba(255,255,255,0.05)",
                border: `1px solid ${el.content.boxBorder || "rgba(255,255,255,0.1)"}`,
              }}
            >
              <span style={{ ...numStyle, fontSize: numStyle.fontSize || "clamp(20px, 10vw, 48px)" }}>{String(box.value).padStart(2, "0")}</span>
              <span style={labelStyle}>{box.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OffCanvasElement({ el }: ElementComponentProps) {
  const {
    title = "Menu",
    position = "right",
    width = "320px",
    overlay = true,
    overlayColor = "rgba(0,0,0,0.5)",
    closeButton = true,
    panelBg = "#0f172a",
    panelTextColor = "#ffffff",
    panelLinkColor = "#94a3b8",
    panelLinkHoverColor = "#22c55e",
    panelTextFont, panelTextSize, panelTextWeight,
    panelLinkFont, panelLinkSize, panelLinkWeight,
    items = [],
  } = el.content;
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const sideClasses = position === "left" ? "left-0" : "right-0";
  const translate = open ? "translate-x-0" : (position === "left" ? "-translate-x-full" : "translate-x-full");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:opacity-80"
        style={{ backgroundColor: "#22c55e", color: "#ffffff", fontSize: "14px", fontWeight: 500 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {title}
      </button>

      {/* Overlay */}
      {overlay && open && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ backgroundColor: overlayColor }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 ${sideClasses} z-50 h-full overflow-y-auto transition-transform duration-300 shadow-2xl`}
        style={{
          width,
          backgroundColor: panelBg,
          transform: open ? "translateX(0)" : (position === "left" ? "translateX(-100%)" : "translateX(100%)"),
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ color: panelTextColor, fontFamily: panelTextFont, fontSize: panelTextSize || "18px", fontWeight: panelTextWeight || 700 }}>{title}</h3>
            {closeButton && (
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors" style={{ color: panelTextColor }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            {items.map((item: any, i: number) => (
              <a
                key={i}
                href={item.href || "#"}
                className="block px-4 py-3 rounded-xl transition-all text-sm"
                style={{ color: panelLinkColor, fontFamily: panelLinkFont, fontSize: panelLinkSize, fontWeight: panelLinkWeight }}
                onMouseEnter={(e) => { e.currentTarget.style.color = panelLinkHoverColor; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = panelLinkColor; e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SlidesElement({ el }: ElementComponentProps) {
  const {
    slides = [],
    slideHeight = "clamp(300px, 60vw, 600px)",
    autoplay = true,
    interval = 5000,
    navigation = "arrows",
    pagination = true,
    kenBurns = true,
    arrowColor = "#ffffff",
    arrowBg = "rgba(0,0,0,0.3)",
    dotColor = "rgba(255,255,255,0.3)",
    dotActiveColor = "#22c55e",
    slideTitleColor = "#ffffff",
    slideTitleSize = "clamp(24px, 6vw, 48px)",
    slideTitleFont, slideTitleWeight,
    slideDescColor = "rgba(255,255,255,0.8)",
    slideDescSize = "clamp(14px, 3vw, 18px)",
    slideDescFont, slideDescWeight,
    buttonBg = "#22c55e",
    buttonColor = "#ffffff",
    buttonText = "Pelajari",
    buttonFont, buttonSize, buttonWeight,
  } = el.content;
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    const total = slides.length;
    if (total === 0) return;
    setActiveIdx(((idx % total) + total) % total);
  };

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    timerRef.current = setInterval(() => goTo(activeIdx + 1), interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoplay, interval, activeIdx, slides.length]);

  if (slides.length === 0) {
    return <div className="text-center text-gray-500 py-10">Tambah slide untuk slideshow</div>;
  }

  return (
    <div className="relative overflow-hidden w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]" style={{ maxHeight: "70vh", minHeight: "200px" }}>
      {slides.map((slide: any, i: number) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-1000"
          style={{
            opacity: i === activeIdx ? 1 : 0,
            transform: `scale(${kenBurns && i === activeIdx ? 1.05 : 1})`,
            transition: "opacity 1s ease-in-out, transform 8s ease-in-out",
            zIndex: i === activeIdx ? 1 : 0,
          }}
        >
          <img
            src={slide.image || "https://placehold.co/1400x600/1e293b/64748b?text=Slide"}
            alt={slide.title || ""}
            className="w-full h-full object-cover"
            style={{
              transform: kenBurns && i === activeIdx ? "scale(1.15)" : "scale(1)",
              transition: "transform 8s ease-in-out",
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div className="text-center max-w-2xl">
              {slide.title && (
                <h2 className="font-bold mb-2 md:mb-4" style={{ color: slideTitleColor, fontSize: slideTitleSize, fontFamily: slideTitleFont, fontWeight: slideTitleWeight }}>
                  {slide.title}
                </h2>
              )}
              {slide.description && (
                <p className="mb-4 md:mb-8" style={{ color: slideDescColor, fontSize: slideDescSize, fontFamily: slideDescFont, fontWeight: slideDescWeight }}>
                  {slide.description}
                </p>
              )}
              <a
                href={slide.buttonLink || "#"}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: buttonBg, color: buttonColor, fontFamily: buttonFont, fontSize: buttonSize, fontWeight: buttonWeight }}
              >
                {slide.buttonText || buttonText}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      {navigation !== "none" && slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(activeIdx - 1)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: arrowBg, color: arrowColor }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goTo(activeIdx + 1)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: arrowBg, color: arrowColor }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {pagination && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? "24px" : "10px",
                height: "10px",
                backgroundColor: i === activeIdx ? dotActiveColor : dotColor,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NestedCarouselElement({ el }: ElementComponentProps) {
  const {
    slides = [],
    slidesPerView = 3,
    autoplay = true,
    interval = 4000,
    loop = true,
    navigation = "arrows",
    pagination = true,
    gap = 20,
    arrowColor = "#ffffff",
    arrowBg = "rgba(0,0,0,0.3)",
    dotColor = "rgba(255,255,255,0.3)",
    dotActiveColor = "#22c55e",
    slideBg = "rgba(255,255,255,0.05)",
    slideBorder = "rgba(255,255,255,0.1)",
    slideBorderRadius = "12px",
    title, titleColor, titleSize, titleWeight,
    cardTitleColor, cardTitleSize, cardTitleWeight, cardTitleFont,
    cardDescColor, cardDescSize, cardDescFont, cardDescWeight,
  } = el.content;
  const [activeIdx, setActiveIdx] = useState(0);
  const elStyles = applyStyles(el);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive slidesPerView: 1 on mobile, 2 on tablet, user-configured on desktop
  const responsiveSlidesPerView = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : Math.min(slidesPerView, 4);

  const totalSlides = slides.length;
  const goTo = (idx: number) => {
    if (totalSlides === 0) return;
    if (loop) {
      setActiveIdx(((idx % totalSlides) + totalSlides) % totalSlides);
    } else {
      const maxIdx = Math.max(0, totalSlides - responsiveSlidesPerView);
      setActiveIdx(Math.max(0, Math.min(idx, maxIdx)));
    }
  };

  useEffect(() => {
    if (!autoplay || totalSlides <= responsiveSlidesPerView) return;
    timerRef.current = setInterval(() => goTo(activeIdx + 1), interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoplay, interval, activeIdx, totalSlides, responsiveSlidesPerView]);

  if (totalSlides === 0) {
    return <div className="text-center text-gray-500 py-10">Tambah slide untuk carousel</div>;
  }

  // When showing only 1 slide, gap pushes subsequent slides off-center
  // since translateX(%) is relative to the flex container (100% of parent),
  // not accounting for gap pixels between slides.
  const effectiveGap = responsiveSlidesPerView <= 1 ? 0 : gap;
  const slidePercent = 100 / responsiveSlidesPerView;
  const gapAdjust = gap * (1 - 1 / responsiveSlidesPerView);

  return (
    <div style={elStyles}>
      {title && <h2 className="text-center mb-4 md:mb-8" style={{ color: titleColor || "#ffffff", fontSize: titleSize || "30px", fontWeight: titleWeight || "700", fontFamily: cardTitleFont }}>{title}</h2>}
      <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIdx * slidePercent}%)`,
                        gap: `${effectiveGap}px`,

          }}
        >
          {slides.map((slide: any, i: number) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl flex flex-col"
              style={{
                flexBasis: `calc(${slidePercent}% - ${gapAdjust}px)`,
                backgroundColor: slideBg,
                border: `1px solid ${slideBorder}`,
                borderRadius: slideBorderRadius,
                padding: windowWidth < 640 ? "12px" : "16px",
              }}
            >
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.title || ""}
                  className="w-full object-cover rounded-xl mb-3"
                  style={{ height: windowWidth < 640 ? "180px" : windowWidth < 1024 ? "180px" : "200px" }}
                />
              )}
              {slide.title && (
                <h3 className="mb-1.5" style={{ color: cardTitleColor || "#ffffff", fontSize: windowWidth < 640 ? "14px" : (cardTitleSize || "16px"), fontWeight: cardTitleWeight || "700", fontFamily: cardTitleFont }}>{slide.title}</h3>
              )}
              {slide.description && (
                <p style={{ color: cardDescColor || "#94a3b8", fontSize: windowWidth < 640 ? "12px" : (cardDescSize || "14px"), fontFamily: cardDescFont, fontWeight: cardDescWeight }}>{slide.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {navigation !== "none" && totalSlides > responsiveSlidesPerView && (
        <>
          <button
            onClick={() => goTo(activeIdx - 1)}
            className="absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg hover:opacity-80 z-10"
            style={{ backgroundColor: arrowBg, color: arrowColor }}
            aria-label="Previous"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goTo(activeIdx + 1)}
            className="absolute -right-2 md:-right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg hover:opacity-80 z-10"
            style={{ backgroundColor: arrowBg, color: arrowColor }}
            aria-label="Next"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots - page-based for responsive */}
      {pagination && totalSlides > responsiveSlidesPerView && (
        <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-3 md:mt-4">
          {Array.from({ length: Math.ceil(totalSlides / responsiveSlidesPerView) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i * responsiveSlidesPerView)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === Math.floor(activeIdx / responsiveSlidesPerView) ? "16px" : "6px",
                height: "6px",
                backgroundColor: i === Math.floor(activeIdx / responsiveSlidesPerView) ? dotActiveColor : dotColor,
              }}
            />
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

function VideoPlaylistElement({ el }: ElementComponentProps) {
  const {
    title = "Video Playlist",
    titleColor = "#ffffff",
    titleSize = "20px",
    titleWeight,
    titleFont,
    playlistBg = "#0f172a",
    playlistItemBg = "rgba(255,255,255,0.03)",
    playlistItemHoverBg = "rgba(255,255,255,0.08)",
    playlistItemActiveBg = "rgba(34,197,94,0.1)",
    playlistTitleColor = "#ffffff",
    playlistTitleFont, playlistTitleSize, playlistTitleWeight,
    playlistDescColor = "#94a3b8",
    playlistDescFont, playlistDescSize, playlistDescWeight,
    thumbnailWidth = "120px",
    playerBg = "#000000",
    accentColor = "#22c55e",
    videos = [],
  } = el.content;
  const [activeVideo, setActiveVideo] = useState(0);

  const currentVideo = videos[activeVideo] || {};

  return (
    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden" style={{ backgroundColor: playlistBg }}>
      {/* Player */}
      <div className="md:flex-1 relative" style={{ backgroundColor: playerBg, minHeight: "300px" }}>
        {currentVideo.url ? (
          <iframe
            src={currentVideo.url}
            className="w-full h-full absolute inset-0"
            allowFullScreen
            title={currentVideo.title || "Video"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        {title && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#ffffff" }}>
              {currentVideo.title || title}
            </span>
          </div>
        )}
      </div>

      {/* Playlist sidebar */}
      <div className="w-full md:w-72 overflow-y-auto" style={{ maxHeight: "400px", backgroundColor: playlistBg }}>
        {title && (
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <h3 style={{ color: titleColor, fontSize: titleSize, fontFamily: titleFont, fontWeight: titleWeight || 700 }}>{title}</h3>
          </div>
        )}
        <div className="p-2 space-y-1">
          {videos.map((video: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveVideo(i)}
              className="w-full text-left flex gap-3 p-2 rounded-xl transition-all"
              style={{
                backgroundColor: i === activeVideo ? playlistItemActiveBg : playlistItemBg,
              }}
              onMouseEnter={(e) => {
                if (i !== activeVideo) e.currentTarget.style.backgroundColor = playlistItemHoverBg;
              }}
              onMouseLeave={(e) => {
                if (i !== activeVideo) e.currentTarget.style.backgroundColor = playlistItemBg;
              }}
            >
              {/* Thumbnail placeholder */}
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ width: thumbnailWidth, height: "68px", backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: playlistTitleColor, fontFamily: playlistTitleFont, fontSize: playlistTitleSize, fontWeight: playlistTitleWeight }}>{video.title || `Video ${i + 1}`}</p>
                {video.description && (
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: playlistDescColor, fontFamily: playlistDescFont, fontSize: playlistDescSize, fontWeight: playlistDescWeight }}>{video.description}</p>
                )}
                {video.duration && (
                  <p className="text-[10px] mt-1" style={{ color: accentColor }}>{video.duration}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TableOfContentsElement({ el }: ElementComponentProps) {
  const {
    title = "Daftar Isi",
    markers = "numbers",
    titleColor = "#ffffff",
    titleSize = "18px",
    titleFont, titleWeight,
    linkColor = "#94a3b8",
    linkHoverColor = "#22c55e",
    linkActiveColor = "#22c55e",
    linkSize = "14px",
    linkFont, linkWeight,
    markerColor = "#22c55e",
    backgroundColor = "rgba(255,255,255,0.03)",
    borderColor = "rgba(255,255,255,0.1)",
    borderRadius = "12px",
    padding = "20px",
    minimizeBox = true,
    items = [],
  } = el.content;
  const [minimized, setMinimized] = useState(false);
  const [activeHref, setActiveHref] = useState("");

  return (
    <div
      className="rounded-2xl"
      style={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer select-none"
        onClick={() => minimizeBox && setMinimized(!minimized)}
      >
        <h3 style={{ color: titleColor, fontSize: titleSize, fontFamily: titleFont, fontWeight: titleWeight || 700 }}>{title}</h3>
        {minimizeBox && (
          <svg
            className="w-4 h-4 transition-transform duration-200"
            style={{ color: markerColor, transform: minimized ? "rotate(-90deg)" : "rotate(0deg)" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {/* Items */}
      {!minimized && (
        <div className="px-5 pb-5 space-y-1">
          {items.length === 0 ? (
            <p className="text-xs" style={{ color: linkColor }}>Tidak ada heading ditemukan</p>
          ) : (
            items.map((item: any, i: number) => (
              <a
                key={i}
                href={item.href || "#"}
                className="flex items-center gap-3 py-1.5 rounded-lg transition-all text-sm"
                style={{
                  color: activeHref === item.href ? linkActiveColor : linkColor,
                  fontSize: linkSize,
                  fontFamily: linkFont,
                  fontWeight: linkWeight,
                  paddingLeft: `${(item.level || 2) * 12}px`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = linkHoverColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = activeHref === item.href ? linkActiveColor : linkColor; }}
                onClick={(e) => { e.preventDefault(); setActiveHref(item.href || "#"); }}
              >
                {markers === "numbers" && (
                  <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: markerColor }}>{i + 1}.</span>
                )}
                {markers === "bullets" && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: markerColor }} />
                )}
                {item.text}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SocialEmbedElement({ el }: ElementComponentProps) {
  const {
    type = "facebook-page",
    url = "https://www.facebook.com/facebook",
    layout = "timeline",
    smallHeader = false,
    hideCover = false,
    showFacepile = true,
    width = "340px",
    height = "500px",
    colorScheme = "light",
    title = "Facebook",
    titleColor = "#ffffff",
    titleSize = "18px",
    titleFont, titleWeight,
  } = el.content;
  const styles = applyStyles(el);

  // Build Facebook embed iframe URL based on type
  const getEmbedUrl = (): string => {
    const encodedUrl = encodeURIComponent(url);
    const w = parseInt(width) || 340;
    const h = parseInt(height) || 500;

    switch (type) {
      case "facebook-page":
        return `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=${layout}&width=${w}&height=${h}&small_header=${smallHeader ? 'true' : 'false'}&hide_cover=${hideCover ? 'true' : 'false'}&show_facepile=${showFacepile ? 'true' : 'false'}&adapt_container_width=true`;
      case "facebook-post":
        return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&width=${w}&show_text=true`;
      case "facebook-comments":
        return `https://www.facebook.com/plugins/comments.php?href=${encodedUrl}&width=${w}`;
      case "facebook-button":
        return `https://www.facebook.com/plugins/like.php?href=${encodedUrl}&layout=standard&size=small&share=false&width=${w}`;
      default:
        return `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=${layout}&width=${w}&height=${h}`;
    }
  };

  const embedUrl = url && url !== "#" ? getEmbedUrl() : "";

  // If no valid URL, show placeholder
  if (!embedUrl) {
    return (
      <div style={styles}>
        {title && (
          <h3 className="mb-4 font-bold" style={{ color: titleColor, fontSize: titleSize, fontFamily: titleFont, fontWeight: titleWeight }}>{title}</h3>
        )}
        <div
          className="mx-auto rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6"
          style={{
            width,
            minHeight: height,
            backgroundColor: colorScheme === "dark" ? "#1e293b" : "#ffffff",
            border: `1px solid ${colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
            borderRadius: "12px",
          }}
        >
          <div className="text-center mb-4">
            <svg className="w-12 h-12 mx-auto mb-3" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <p className="text-sm font-semibold mt-3" style={{ color: colorScheme === "dark" ? "#ffffff" : "#1e293b" }}>Social Embed</p>
            <p className="text-xs mt-1" style={{ color: colorScheme === "dark" ? "#94a3b8" : "#64748b" }}>Masukkan URL Facebook untuk menampilkan embed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles}>
      {title && (
        <h3 className="mb-4 font-bold" style={{ color: titleColor, fontSize: titleSize, fontFamily: titleFont, fontWeight: titleWeight }}>{title}</h3>
      )}
      <div
        className="mx-auto overflow-hidden rounded-2xl"
        style={{
          width,
          maxWidth: "100%",
          border: `1px solid ${colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          borderRadius: "12px",
        }}
      >
        <iframe
          src={embedUrl}
          width="100%"
          height={height}
          style={{ border: "none", overflow: "hidden", display: "block" }}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          scrolling="no"
          title={`Facebook ${type}`}
        />
      </div>
    </div>
  );
}



function HtmlElement({ el }: ElementComponentProps) {
  const htmlContent = el.content.html || "";
  const styles = applyStyles(el);

  return (
    <div
      className="custom-html-element"
      style={styles}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
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
  "three-scene": ThreeSceneElement,
  "three-particles": ThreeParticlesElement,
  carousel: CarouselElement,
  accordion: AccordionElement,
  team: TeamElement,
  countdown: CountdownElement,
  "animated-headline": AnimatedHeadlineElement,
  blockquote: BlockquoteElement,
  "code-highlight": CodeHighlightElement,
  "flip-box": FlipBoxElement,
  hotspot: HotspotElement,
  "progress-tracker": ProgressTrackerElement,
  "share-buttons": ShareButtonsElement,
  checklist: ChecklistElement,
  gallery: GalleryElement,
  lottie: LottieElement,
  "star-rating": StarRatingElement,
  search: SearchElement,
  "floating-buttons": FloatingButtonsElement,
  breadcrumbs: BreadcrumbsElement,
  "off-canvas": OffCanvasElement,
  slides: SlidesElement,
  "nested-carousel": NestedCarouselElement,
  "video-playlist": VideoPlaylistElement,
  "table-of-contents": TableOfContentsElement,
  "social-embed": SocialEmbedElement,
  "custom-html": HtmlElement,

};

/** Build responsive visibility classes from element settings */
function getResponsiveClasses(el: BuilderElement): string {
  const r = el.responsive;
  if (!r) return "";
  const classes: string[] = [];
  if (r.hideOnMobile) classes.push("hidden sm:block");
  if (r.hideOnTablet) classes.push("sm:hidden lg:block");
  if (r.hideOnDesktop) classes.push("lg:hidden");
  return classes.join(" ");
}

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
  const respClass = getResponsiveClasses(element);
  if (!Component) {
    return <div className={`text-gray-500 text-sm${respClass ? " " + respClass : ""}`}>Unknown element: {element.type}</div>;
  }
  return (
    <div className={respClass || undefined}>
      <Component el={element} editing={editing} onEdit={onEdit} onBlurEditing={onBlurEditing} />
    </div>
  );
}