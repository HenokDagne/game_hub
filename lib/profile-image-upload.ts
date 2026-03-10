import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export const DEFAULT_PROFILE_IMAGE = "/profile.png";
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export class ProfileImageValidationError extends Error {}

export async function saveProfileImage(file: File | null) {
  if (!file || file.size === 0) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new ProfileImageValidationError("Profile image must be JPEG, PNG, WEBP, or GIF");
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    throw new ProfileImageValidationError("Profile image size must be 5MB or less");
  }

  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const extension = extensionMap[file.type] ?? "png";
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDirectory = join(process.cwd(), "public", "uploads", "profiles");
  const outputPath = join(uploadDirectory, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(outputPath, fileBuffer);

  return `/uploads/profiles/${fileName}`;
}
