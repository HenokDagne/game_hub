import type { FormState, ProfileResponse } from "./types";

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoOrUndefined(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Please provide valid date/time values for collection date fields");
  }

  return date.toISOString();
}

export function mapProfileResponseToForm(data: ProfileResponse): FormState {
  return {
    name: data.user.name ?? "",
    profileImage: data.user.profileImage ?? "",
    bio: data.profile?.bio ?? "",
    location: data.profile?.location ?? "",
    website: data.profile?.website ?? "",
    steamId: data.steamProfile?.steamId ?? "",
    personaName: data.steamProfile?.personaName ?? "",
    profileUrl: data.steamProfile?.profileUrl ?? "",
    avatarUrl: data.steamProfile?.avatarUrl ?? "",
    country: data.steamProfile?.country ?? "",
    onlineStatus: data.steamProfile?.onlineStatus ?? "OFFLINE",
    totalHoursPlayed: String(data.steamProfile?.totalHoursPlayed ?? 0),
    totalBadges: String(data.steamProfile?.totalBadges ?? 0),
    friends: (data.friends ?? []).map((friend) => ({
      friendSteamId: friend.friendSteamId ?? "",
      friendPersonaName: friend.friendPersonaName ?? "",
      friendProfileUrl: friend.friendProfileUrl ?? "",
      friendAvatarUrl: friend.friendAvatarUrl ?? "",
    })),
    gameStats: (data.gameStats ?? []).map((stat) => ({
      appId: String(stat.appId ?? ""),
      gameName: stat.gameName ?? "",
      hoursPlayed: String(stat.hoursPlayed ?? 0),
      lastPlayedAt: toDateTimeLocal(stat.lastPlayedAt),
    })),
    badges: (data.badges ?? []).map((badge) => ({
      badgeCode: badge.badgeCode ?? "",
      badgeName: badge.badgeName ?? "",
      level: String(badge.level ?? 1),
      earnedAt: toDateTimeLocal(badge.earnedAt),
    })),
    achievements: (data.achievements ?? []).map((achievement) => ({
      appId: String(achievement.appId ?? ""),
      achievementCode: achievement.achievementCode ?? "",
      achievementName: achievement.achievementName ?? "",
      unlockedAt: toDateTimeLocal(achievement.unlockedAt),
    })),
  };
}

export function buildUpdatePayload(form: FormState, hasSteamDataToSubmit: boolean) {
  const friends = form.friends
    .filter((item) => item.friendSteamId.trim())
    .map((item) => ({
      friendSteamId: item.friendSteamId.trim(),
      friendPersonaName: item.friendPersonaName.trim() || undefined,
      friendProfileUrl: item.friendProfileUrl.trim() || undefined,
      friendAvatarUrl: item.friendAvatarUrl.trim() || undefined,
    }));

  const gameStats = form.gameStats
    .filter((item) => item.appId.trim() && item.gameName.trim())
    .map((item) => ({
      appId: Number(item.appId),
      gameName: item.gameName.trim(),
      hoursPlayed: Number(item.hoursPlayed || 0),
      lastPlayedAt: toIsoOrUndefined(item.lastPlayedAt),
    }));

  const badges = form.badges
    .filter((item) => item.badgeCode.trim() && item.badgeName.trim())
    .map((item) => ({
      badgeCode: item.badgeCode.trim(),
      badgeName: item.badgeName.trim(),
      level: Number(item.level || 1),
      earnedAt: toIsoOrUndefined(item.earnedAt),
    }));

  const achievements = form.achievements
    .filter((item) => item.appId.trim() && item.achievementCode.trim() && item.achievementName.trim())
    .map((item) => ({
      appId: Number(item.appId),
      achievementCode: item.achievementCode.trim(),
      achievementName: item.achievementName.trim(),
      unlockedAt: toIsoOrUndefined(item.unlockedAt),
    }));

  const payload: Record<string, unknown> = {
    name: form.name,
    profileImage: form.profileImage || undefined,
    profile: {
      bio: form.bio,
      location: form.location,
      website: form.website || undefined,
    },
    friends,
    gameStats,
    badges,
    achievements,
  };

  if (!hasSteamDataToSubmit) {
    return payload;
  }

  const steamProfilePayload: Record<string, unknown> = {};

  if (form.steamId.trim()) {
    steamProfilePayload.steamId = form.steamId.trim();
  }

  if (form.personaName.trim()) {
    steamProfilePayload.personaName = form.personaName.trim();
  }

  if (form.profileUrl.trim()) {
    steamProfilePayload.profileUrl = form.profileUrl.trim();
  }

  if (form.avatarUrl.trim()) {
    steamProfilePayload.avatarUrl = form.avatarUrl.trim();
  }

  if (form.country.trim()) {
    steamProfilePayload.country = form.country.trim();
  }

  if (form.onlineStatus !== "OFFLINE") {
    steamProfilePayload.onlineStatus = form.onlineStatus;
  }

  if (Number(form.totalHoursPlayed || 0) > 0) {
    steamProfilePayload.totalHoursPlayed = Number(form.totalHoursPlayed || 0);
  }

  if (Number(form.totalBadges || 0) > 0) {
    steamProfilePayload.totalBadges = Number(form.totalBadges || 0);
  }

  if (Object.keys(steamProfilePayload).length > 0) {
    payload.steamProfile = steamProfilePayload;
  }

  return payload;
}
