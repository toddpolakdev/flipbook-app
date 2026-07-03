// lib/uploadImage.ts
import axios from "axios";

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dshhe6ovi";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "flipbook_unsigned";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Throws an Error with a user-friendly message if the file isn't an acceptable image. */
export function validateImageFile(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image file.`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`"${file.name}" is larger than 10 MB.`);
  }
}

export async function uploadImage(file: File): Promise<string> {
  validateImageFile(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
  );

  return res.data.secure_url as string;
}

/**
 * Extracts the Cloudinary public_id from a secure_url so it can be destroyed
 * server-side. Returns null for non-Cloudinary URLs (e.g. external image links),
 * which the caller should simply drop from the flipbook without a remote delete.
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith("res.cloudinary.com")) return null;

    const parts = pathname.split("/").filter(Boolean);
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;

    let rest = parts.slice(uploadIdx + 1);
    // Drop the optional version segment (e.g. "v1712345678").
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
    if (rest.length === 0) return null;

    // public_id may contain folder segments; strip only the file extension.
    return rest.join("/").replace(/\.[^./]+$/, "");
  } catch {
    return null;
  }
}
