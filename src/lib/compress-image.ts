/**
 * Compress an image file using Canvas API.
 * Resizes to max dimensions (default 1920px longest side)
 * and converts to WebP with configurable quality (default 0.8).
 *
 * Returns a compressed base64 data URL string.
 */
export function compressImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: "image/jpeg" | "image/webp";
  }
): Promise<string> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format = "image/webp",
  } = options || {};

  // WebP support check
  const supportsWebP =
    typeof document !== "undefined" &&
    document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp");

  const effectiveFormat =
    format === "image/webp" && !supportsWebP ? "image/jpeg" : format;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }

        // Draw resized image on canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Fill white background for JPEG fallback (to avoid black from transparency)
        if (effectiveFormat === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed format
        const dataUrl = canvas.toDataURL(effectiveFormat, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };

      img.src = ev.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}
