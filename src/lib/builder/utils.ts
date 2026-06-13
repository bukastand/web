/**
 * Convert hex color (e.g. "#22c55e") to rgba() string with given alpha.
 * Supports 6-digit (#RRGGBB) and 3-digit (#RGB) hex formats.
 * Returns null for invalid hex strings.
 */
export function hexToRgba(hex: string, alpha: number): string | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return null;
  let r: number, g: number, b: number;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Apply backgroundOpacity to a hex backgroundColor.
 * If backgroundOpacity is set and valid, returns rgba().
 * Otherwise returns the original backgroundColor.
 */
export function applyBgOpacity(backgroundColor: string | undefined, backgroundOpacity: string | undefined): string | undefined {
  if (!backgroundColor || backgroundColor === "transparent") return backgroundColor;
  if (backgroundOpacity) {
    const alpha = parseFloat(backgroundOpacity);
    if (alpha >= 0 && alpha <= 1) {
      const rgba = hexToRgba(backgroundColor, alpha);
      if (rgba) return rgba;
    }
  }
  return backgroundColor;
}
