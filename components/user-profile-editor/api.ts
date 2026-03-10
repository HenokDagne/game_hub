import type { ProfileImageUploadResponse, ProfileResponse, ProfileUpdateResponse } from "./types";

export async function fetchProfile(): Promise<ProfileResponse> {
  const response = await fetch("/api/profile", { method: "GET" });
  const data = (await response.json()) as ProfileResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load profile");
  }

  return data;
}

export async function updateProfile(payload: Record<string, unknown>): Promise<void> {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ProfileUpdateResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update profile");
  }
}

export async function uploadProfileImage(file: File): Promise<string> {
  const payload = new FormData();
  payload.append("profileImage", file);

  const response = await fetch("/api/profile/image", {
    method: "POST",
    body: payload,
  });

  const data = (await response.json()) as ProfileImageUploadResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to upload profile image");
  }

  return data.profileImage;
}
