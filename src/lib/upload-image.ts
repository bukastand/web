import { supabase } from "./supabase";
import { compressImage } from "./compress-image";

/**
 * Compress an image (WebP format) and upload it to Supabase Storage.
 * Falls back to compressed base64 data URL if upload fails or user is anonymous.
 *
 * @param file - The raw image file from input
 * @param userId - Current user ID, null if anonymous
 * @param options - Optional compression settings
 * @returns Public URL of uploaded image, or base64 data URL as fallback
 */
export async function compressAndUploadImage(
  file: File,
  userId: string | null,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<string> {
  // Step 1: Compress to WebP
  const dataUrl = await compressImage(file, {
    ...options,
    format: "image/webp",
    quality: options?.quality ?? 0.8,
  });

  // If no user (anonymous), fall back to compressed base64
  if (!userId) return dataUrl;

  // Step 2: Upload to Supabase Storage
  try {
    const blob = dataUrlToBlob(dataUrl);
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.webp`;
    const filePath = `${userId}/${filename}`;

    const { error } = await supabase.storage
      .from("page-images")
      .upload(filePath, blob, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      console.warn("Supabase Storage upload failed:", error.message);
      return dataUrl; // Fall back to base64
    }

    // Step 3: Get public URL
    const { data: urlData } = supabase.storage
      .from("page-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (err) {
    console.warn("Image upload exception:", err);
    return dataUrl; // Fall back to base64
  }
}

/**
 * Convert a data URL string to a Blob object suitable for upload.
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch?.[1] || "image/webp";
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

/**
 * Extract filename from a Supabase Storage public URL.
 * Useful for cleaning up old images when replaced.
 */
export function getStoragePathFromUrl(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/page-images\/(.+)/);
  return match ? match[1] : null;
}

/**
 * Delete an image from Supabase Storage by its public URL.
 * Performs silent failure on error (non-critical).
 */
export async function deleteStorageImage(url: string): Promise<void> {
  const path = getStoragePathFromUrl(url);
  if (!path) return;
  try {
    await supabase.storage.from("page-images").remove([path]);
  } catch {
    // Silently fail — old images are non-critical
  }
}
