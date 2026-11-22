const configuredLimit = Number(import.meta.env.VITE_MAX_UPLOAD_MB ?? 5);
// Provisional frontend limit. Phase 3 must enforce the same limit server-side.
export const MAX_UPLOAD_MB = Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 5;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Choose a JPEG, PNG, or WebP image.';
  if (!file.size) return 'This file is empty. Choose another image.';
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `Your image is too large. Choose a file under ${MAX_UPLOAD_MB} MB.`;
  return null;
}
