"use client";

import { useEffect, useMemo, useState } from "react";

type ProfileResponse = {
  user: {
    name: string | null;
    email: string;
    profileImage: string;
  };
  profile: {
    bio: string | null;
    location: string | null;
    website: string | null;
  } | null;
  steamProfile: {
    steamId: string;
    personaName: string;
    profileUrl: string;
    avatarUrl: string | null;
    country: string | null;
    onlineStatus: "ONLINE" | "OFFLINE" | "AWAY" | "BUSY" | "SNOOZE";
    totalHoursPlayed: number;
    totalBadges: number;
  } | null;
  friends: Array<{
    friendSteamId: string;
    friendPersonaName: string | null;
    friendProfileUrl: string | null;
    friendAvatarUrl: string | null;
  }>;
  gameStats: Array<{
    appId: number;
    gameName: string;
    hoursPlayed: number;
    lastPlayedAt: string | null;
  }>;
  badges: Array<{
    badgeCode: string;
    badgeName: string;
    level: number;
    earnedAt: string | null;
  }>;
  achievements: Array<{
    appId: number;
    achievementCode: string;
    achievementName: string;
    unlockedAt: string | null;
  }>;
  error?: string;
};

type FormState = {
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  website: string;
  steamId: string;
  personaName: string;
  profileUrl: string;
  avatarUrl: string;
  country: string;
  onlineStatus: "ONLINE" | "OFFLINE" | "AWAY" | "BUSY" | "SNOOZE";
  totalHoursPlayed: string;
  totalBadges: string;
  friendsJson: string;
  gameStatsJson: string;
  badgesJson: string;
  achievementsJson: string;
};

const initialForm: FormState = {
  name: "",
  profileImage: "",
  bio: "",
  location: "",
  website: "",
  steamId: "",
  personaName: "",
  profileUrl: "",
  avatarUrl: "",
  country: "",
  onlineStatus: "OFFLINE",
  totalHoursPlayed: "0",
  totalBadges: "0",
  friendsJson: "[]",
  gameStatsJson: "[]",
  badgesJson: "[]",
  achievementsJson: "[]",
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function UserProfileEditor() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/profile", { method: "GET" });
        const data = (await response.json()) as ProfileResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load profile");
        }

        if (!isMounted) {
          return;
        }

        setForm({
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
          friendsJson: prettyJson(data.friends ?? []),
          gameStatsJson: prettyJson(data.gameStats ?? []),
          badgesJson: prettyJson(data.badges ?? []),
          achievementsJson: prettyJson(data.achievements ?? []),
        });
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load profile");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasSteamCoreFields = useMemo(
    () => Boolean(form.steamId.trim() && form.personaName.trim() && form.profileUrl.trim()),
    [form.steamId, form.personaName, form.profileUrl],
  );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const friends = JSON.parse(form.friendsJson) as unknown[];
      const gameStats = JSON.parse(form.gameStatsJson) as unknown[];
      const badges = JSON.parse(form.badgesJson) as unknown[];
      const achievements = JSON.parse(form.achievementsJson) as unknown[];

      const payload: Record<string, unknown> = {
        name: form.name,
        profileImage: form.profileImage || undefined,
        profile: {
          bio: form.bio,
          location: form.location,
          website: form.website || undefined,
        },
      };

      if (hasSteamCoreFields) {
        payload.steamProfile = {
          steamId: form.steamId,
          personaName: form.personaName,
          profileUrl: form.profileUrl,
          avatarUrl: form.avatarUrl || undefined,
          country: form.country,
          onlineStatus: form.onlineStatus,
          totalHoursPlayed: Number(form.totalHoursPlayed || 0),
          totalBadges: Number(form.totalBadges || 0),
        };
        payload.friends = friends;
        payload.gameStats = gameStats;
        payload.badges = badges;
        payload.achievements = achievements;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update profile");
      }

      setSuccessMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-black/70">Loading profile...</p>;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Edit profile</h2>
        <p className="text-sm text-black/70">Update your account profile and Steam game profile data.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Display name</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("name", event.target.value)}
              type="text"
              value={form.name}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Profile image URL</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("profileImage", event.target.value)}
              placeholder="https://..."
              type="url"
              value={form.profileImage}
            />
          </label>

          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Bio</span>
            <textarea
              className="min-h-24 w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("bio", event.target.value)}
              value={form.bio}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Location</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("location", event.target.value)}
              type="text"
              value={form.location}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Website</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("website", event.target.value)}
              placeholder="https://..."
              type="url"
              value={form.website}
            />
          </label>
        </div>

        <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-2">
          <p className="sm:col-span-2 text-sm text-black/70">
            Steam profile fields are optional, but Steam ID, Persona Name, and Profile URL are required to save Steam data.
          </p>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Steam ID</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("steamId", event.target.value)}
              type="text"
              value={form.steamId}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Persona name</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("personaName", event.target.value)}
              type="text"
              value={form.personaName}
            />
          </label>

          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Steam profile URL</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("profileUrl", event.target.value)}
              type="url"
              value={form.profileUrl}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Avatar URL</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("avatarUrl", event.target.value)}
              type="url"
              value={form.avatarUrl}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Country</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("country", event.target.value)}
              type="text"
              value={form.country}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Online status</span>
            <select
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) =>
                updateField(
                  "onlineStatus",
                  event.target.value as FormState["onlineStatus"],
                )
              }
              value={form.onlineStatus}
            >
              <option value="OFFLINE">OFFLINE</option>
              <option value="ONLINE">ONLINE</option>
              <option value="AWAY">AWAY</option>
              <option value="BUSY">BUSY</option>
              <option value="SNOOZE">SNOOZE</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Total hours played</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              min={0}
              onChange={(event) => updateField("totalHoursPlayed", event.target.value)}
              step="0.1"
              type="number"
              value={form.totalHoursPlayed}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Total badges</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              min={0}
              onChange={(event) => updateField("totalBadges", event.target.value)}
              type="number"
              value={form.totalBadges}
            />
          </label>
        </div>

        <div className="grid gap-3 rounded border border-black/10 p-4">
          <p className="text-sm text-black/70">
            Collections are JSON arrays. Keep valid JSON format. Leave <strong>[]</strong> for empty lists.
          </p>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Friend list (JSON)</span>
            <textarea
              className="min-h-32 w-full rounded border border-black/15 px-3 py-2 font-mono text-xs"
              onChange={(event) => updateField("friendsJson", event.target.value)}
              value={form.friendsJson}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Game stats (JSON)</span>
            <textarea
              className="min-h-32 w-full rounded border border-black/15 px-3 py-2 font-mono text-xs"
              onChange={(event) => updateField("gameStatsJson", event.target.value)}
              value={form.gameStatsJson}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Badges (JSON)</span>
            <textarea
              className="min-h-32 w-full rounded border border-black/15 px-3 py-2 font-mono text-xs"
              onChange={(event) => updateField("badgesJson", event.target.value)}
              value={form.badgesJson}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Achievements (JSON)</span>
            <textarea
              className="min-h-32 w-full rounded border border-black/15 px-3 py-2 font-mono text-xs"
              onChange={(event) => updateField("achievementsJson", event.target.value)}
              value={form.achievementsJson}
            />
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

        <button className="rounded border border-black px-4 py-2 text-sm font-medium" disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
