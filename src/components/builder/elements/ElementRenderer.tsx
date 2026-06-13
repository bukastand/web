"use client";

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
  const cls = `${sizeMap[level] || "text-3xl"} font-bold leading-tight outline-none`;
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

function ButtonElement({ el }: ElementComponentProps) {
  const variant = el.content.variant || "primary";
  const styles = applyStyles(el);
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300";
  const variants: Record<string, string> = {
    primary: "bg-[#22c55e] text-white hover:bg-[#16a34a]",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    outline: "border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white",
  };

  return (
    <div style={{ textAlign: (el.styles as any).textAlign || "center" }}>
      <a href={el.content.href || "#"} target={el.content.target || "_self"} className={`${base} ${variants[variant] || variants.primary}`} style={styles}>
        {el.content.text || "Tombol"}
      </a>
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
  const primaryColor = el.styles.color || "#22c55e";
  const titleStyles = getTitleStyles(el);
  const elStyles = applyStyles(el);
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-3xl font-bold text-center mb-2" style={titleStyles}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-gray-500 text-center mb-10" style={titleStyles}>{el.content.subtitle}</p>}
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${cols > 2 ? "280px" : "200px"}, 1fr))` }}>
        {items.map((item: any, i: number) => {
          const iconDef = FEATURE_ICONS[item.icon];
          return (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex items-center justify-center mb-3" style={{ color: primaryColor }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  {iconDef ? iconDef.icon : FEATURE_ICONS.star.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PricingElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const titleStyles = getTitleStyles(el);
  const elStyles = applyStyles(el);
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-3xl font-bold text-center mb-2" style={titleStyles}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-gray-500 text-center mb-10" style={titleStyles}>{el.content.subtitle}</p>}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item: any, i: number) => (
          <div key={i} className={`p-8 rounded-2xl border ${item.highlighted ? "border-[#22c55e] bg-[#22c55e]/5" : "border-white/10 bg-white/5"}`}>
            <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
            <p className="text-3xl font-extrabold text-white mb-6">{item.price}</p>
            <ul className="space-y-2 mb-8">
              {(item.features || []).map((f: string, fi: number) => (
                <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-semibold hover:bg-[#16a34a] transition-colors">{item.cta || "Pilih Paket"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialElement({ el }: ElementComponentProps) {
  const items = el.content.items || [];
  const titleStyles = getTitleStyles(el);
  const elStyles = applyStyles(el);
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-3xl font-bold text-center mb-10" style={titleStyles}>{el.content.title}</h2>}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item: any, i: number) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: item.rating || 5 }).map((_, ri) => (
                <svg key={ri} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-4">&ldquo;{item.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center text-sm font-bold text-[#22c55e]">{item.avatar || "U"}</div>
              <div>
                <p className="text-white font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTAElement({ el }: ElementComponentProps) {
  const titleStyles = getTitleStyles(el);
  const elStyles = applyStyles(el);
  if (!elStyles.backgroundColor) {
    elStyles.backgroundColor = "#22c55e";
  }
  return (
    <div className="text-center py-16 px-6 rounded-2xl" style={elStyles}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={titleStyles}>{el.content.title || "Siap Memulai?"}</h2>
      <p className="text-white/80 mb-8 max-w-xl mx-auto" style={titleStyles}>{el.content.subtitle || "Hubungi kami sekarang"}</p>
      <a
        href={el.content.buttonHref || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-white/90 transition-all"
      >
        {el.content.buttonText || "Konsultasi Gratis"}
      </a>
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
          <div className="text-3xl md:text-4xl font-extrabold text-[#22c55e] mb-1">{item.value}</div>
          <div className="text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function ContactFormElement({ el }: ElementComponentProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const text = encodeURIComponent(
      `Halo,\n\nNama: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\nPesan: ${data.get("message") || ""}`
    );
    window.open(`https://wa.me/${el.content.whatsappNumber || "6282210099969"}?text=${text}`, "_blank");
  };

  const titleStyles = getTitleStyles(el);
  const elStyles = applyStyles(el);
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-3xl font-bold text-center mb-2" style={titleStyles}>{el.content.title}</h2>}
      {el.content.subtitle && <p className="text-gray-500 text-center mb-8" style={titleStyles}>{el.content.subtitle}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input type="text" name="name" placeholder="Nama Lengkap" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50" />
        <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50" />
        <textarea name="message" placeholder="Pesan" required rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 resize-none" />
        <button type="submit" className="w-full py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors">Kirim Pesan</button>
      </form>
    </div>
  );
}

function MapsElement({ el }: ElementComponentProps) {
  const titleStyles = getTitleStyles(el);
  const elStyles = applyStyles(el);
  return (
    <div style={elStyles}>
      {el.content.title && <h2 className="text-3xl font-bold text-center mb-6" style={titleStyles}>{el.content.title}</h2>}
      <div className="rounded-2xl bg-white/5 border border-white/10 h-80 flex items-center justify-center" style={{ borderRadius: el.styles.borderRadius }}>
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-400 text-sm">{el.content.address || "Jakarta, Indonesia"}</p>
          <p className="text-xs text-gray-600 mt-1">Google Maps Terintegrasi</p>
        </div>
      </div>
    </div>
  );
}

function NavbarElement({ el }: ElementComponentProps) {
  const links = el.content.links || [];
  const logoImg = el.content.logoImage;
  const logoH = el.content.logoHeight || "32";
  return (
    <nav className="flex items-center justify-between py-4 px-6">
      {logoImg ? (
        <img src={logoImg} alt={el.content.logo || "Logo"} className="object-contain" style={{ height: `${logoH}px` }} />
      ) : (
        <span className="text-xl font-bold text-white">{el.content.logo || "Logo"}</span>
      )}
      <div className="hidden md:flex items-center gap-6">
        {links.map((link: any, i: number) => (
          <a key={i} href={link.href || "#"} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>
        ))}
      </div>
      <a href={el.content.ctaHref || "#"} target="_blank" rel="noopener noreferrer"
        className="px-5 py-2.5 bg-[#22c55e] text-white text-sm font-semibold rounded-xl hover:bg-[#16a34a] transition-all">
        {el.content.ctaText || "Hubungi"}
      </a>
    </nav>
  );
}

function FooterElement({ el }: ElementComponentProps) {
  const links = el.content.links || [];
  const logoImg = el.content.logoImage;
  const logoH = el.content.logoHeight || "40";
  return (
    <div className="py-12 px-6">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="md:col-span-1">
          {logoImg ? (
            <img src={logoImg} alt={el.content.logo || "Logo"} className="object-contain mb-2" style={{ height: `${logoH}px` }} />
          ) : (
            <span className="text-xl font-bold text-white">{el.content.logo || "Logo"}</span>
          )}
          <p className="text-sm text-gray-500 mt-2">{el.content.description || ""}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Links</h4>
          <div className="space-y-2">
            {links.map((link: any, i: number) => (
              <a key={i} href={link.href || "#"} className="block text-sm text-gray-500 hover:text-white transition-colors">{link.label}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Ikuti Kami</h4>
          <div className="flex gap-3">
            {[el.content.socials || []].flat().map((s: any, i: number) => (
              <a key={i} href={s.url || "#"} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#22c55e]/40 transition-all">
                <span className="text-sm">{s.platform?.charAt(0).toUpperCase() || "S"}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 max-w-5xl mx-auto" />
      <p className="text-center text-sm text-gray-600">{el.content.copyright || `© ${new Date().getFullYear()}. All rights reserved.`}</p>
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
